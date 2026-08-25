<?php

namespace App\Services;

use App\Models\Cita;
use App\Models\CitaBloqueo;
use App\Models\Medico;
use App\Models\MedicoHorario;
use App\Models\TipoAtencion;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CitaService
{
    /**
     * Obtener turnos/slots disponibles para un médico en una fecha específica.
     */
    public function obtenerSlotsDisponibles(
        int $medicoId,
        string $fechaStr,
        int $duracionMinutos = 30,
        int $bufferMinutos = 10
    ): array {
        $fecha = Carbon::parse($fechaStr)->startOfDay();
        $diaSemana = $fecha->dayOfWeek; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

        // 1. Obtener horario del médico
        $horario = MedicoHorario::where('medico_id', $medicoId)
            ->where('dia_semana', $diaSemana)
            ->where('activo', true)
            ->first();

        if (!$horario) {
            // Horario por defecto si no ha configurado uno personalizado
            $horaInicioStr = '08:00:00';
            $horaFinStr = '17:00:00';
            $almuerzoInicioStr = '13:00:00';
            $almuerzoFinStr = '14:00:00';
        } else {
            $horaInicioStr = $horario->hora_inicio;
            $horaFinStr = $horario->hora_fin;
            $almuerzoInicioStr = $horario->hora_inicio_almuerzo;
            $almuerzoFinStr = $horario->hora_fin_almuerzo;
            $bufferMinutos = $horario->buffer_minutos ?? $bufferMinutos;
        }

        $inicioJornada = Carbon::parse($fechaStr . ' ' . $horaInicioStr);
        $finJornada = Carbon::parse($fechaStr . ' ' . $horaFinStr);

        $almuerzoInicio = $almuerzoInicioStr ? Carbon::parse($fechaStr . ' ' . $almuerzoInicioStr) : null;
        $almuerzoFin = $almuerzoFinStr ? Carbon::parse($fechaStr . ' ' . $almuerzoFinStr) : null;

        // 2. Cargar citas existentes del médico en ese día
        $citasExistentes = Cita::where('medico_id', $medicoId)
            ->whereDate('fecha_hora_inicio', $fechaStr)
            ->where('estado', '!=', 'cancelada')
            ->get();

        // 3. Cargar bloqueos de agenda (reuniones, vacaciones)
        $bloqueosExistentes = CitaBloqueo::where(function ($q) use ($medicoId) {
            $q->where('medico_id', $medicoId)->orWhereNull('medico_id');
        })
        ->whereDate('fecha_hora_inicio', '<=', $fechaStr)
        ->whereDate('fecha_hora_fin', '>=', $fechaStr)
        ->get();

        $slots = [];
        $slotActual = $inicioJornada->copy();
        $ahora = Carbon::now();

        while ($slotActual->copy()->addMinutes($duracionMinutos)->lte($finJornada)) {
            $slotFin = $slotActual->copy()->addMinutes($duracionMinutos);
            $slotFinConBuffer = $slotFin->copy()->addMinutes($bufferMinutos);

            // Filtrar únicamente horarios que ya hayan pasado respecto a la hora actual
            if ($slotActual->lt($ahora)) {
                $slotActual = $slotFinConBuffer;
                continue;
            }

            // Regla B: Solapamiento con hora de almuerzo
            if ($almuerzoInicio && $almuerzoFin) {
                if ($slotActual->lt($almuerzoFin) && $slotFin->gt($almuerzoInicio)) {
                    $slotActual = $slotFinConBuffer;
                    continue;
                }
            }

            // Regla C: Solapamiento con citas existentes
            $ocupadoPorCita = $citasExistentes->first(function ($cita) use ($slotActual, $slotFin) {
                return $slotActual->lt($cita->fecha_hora_fin) && $slotFin->gt($cita->fecha_hora_inicio);
            });

            if ($ocupadoPorCita) {
                $slotActual = $slotFinConBuffer;
                continue;
            }

            // Regla D: Solapamiento con bloqueos
            $ocupadoPorBloqueo = $bloqueosExistentes->first(function ($bloqueo) use ($slotActual, $slotFin) {
                return $slotActual->lt($bloqueo->fecha_hora_fin) && $slotFin->gt($bloqueo->fecha_hora_inicio);
            });

            if ($ocupadoPorBloqueo) {
                $slotActual = $slotFinConBuffer;
                continue;
            }

            // Slot disponible válido
            $slots[] = [
                'inicio' => $slotActual->toIso8601String(),
                'fin' => $slotFin->toIso8601String(),
                'hora_inicio_formateada' => $slotActual->format('h:i A'),
                'hora_fin_formateada' => $slotFin->format('h:i A'),
                'label' => $slotActual->format('h:i A') . ' - ' . $slotFin->format('h:i A'),
            ];

            $slotActual = $slotFinConBuffer;
        }

        return $slots;
    }

    /**
     * Validar sobre-reserva u overbooking.
     */
    public function validarOverbooking(
        int $medicoId,
        Carbon $fechaHoraInicio,
        Carbon $fechaHoraFin,
        ?int $citaIdAExcluir = null
    ): void {
        $overlapCita = Cita::where('medico_id', $medicoId)
            ->where('estado', '!=', 'cancelada')
            ->when($citaIdAExcluir, fn ($q) => $q->where('id', '!=', $citaIdAExcluir))
            ->where(function ($query) use ($fechaHoraInicio, $fechaHoraFin) {
                $query->where('fecha_hora_inicio', '<', $fechaHoraFin)
                    ->where('fecha_hora_fin', '>', $fechaHoraInicio);
            })
            ->exists();

        if ($overlapCita) {
            throw ValidationException::withMessages([
                'fecha_hora_inicio' => 'El médico ya tiene una cita agendada en ese horario. Por favor selecciona otro turno.',
            ]);
        }

        $overlapBloqueo = CitaBloqueo::where(function ($q) use ($medicoId) {
            $q->where('medico_id', $medicoId)->orWhereNull('medico_id');
        })
        ->where('fecha_hora_inicio', '<', $fechaHoraFin)
        ->where('fecha_hora_fin', '>', $fechaHoraInicio)
        ->exists();

        if ($overlapBloqueo) {
            throw ValidationException::withMessages([
                'fecha_hora_inicio' => 'El horario seleccionado coincide con un tiempo de descanso, reunión o vacaciones del médico.',
            ]);
        }
    }

    /**
     * Validar margen de anticipación mínima (regla 2 horas removida para permitir citas inmediatas).
     */
    public function validarAnticipacionMinima(Carbon $fechaHoraInicio): void
    {
        // Sin restricción de 2 horas previas
    }

    /**
     * Validar límite de cancelación o modificación (restricción de 24 horas eliminada para permitir reagendamientos y cancelaciones en cualquier momento).
     */
    public function validarLimiteCancelacion(Cita $cita): void
    {
        // Sin restricción de 24 horas
    }

    /**
     * Generar enlace de telemedicina si el tipo de atención lo requiere.
     */
    public function generarLinkVirtual(TipoAtencion $tipoAtencion): ?string
    {
        if ($tipoAtencion->requiere_link_virtual) {
            return 'https://meet.jit.si/sismed-telemedicina-' . Str::uuid();
        }
        return null;
    }
}
