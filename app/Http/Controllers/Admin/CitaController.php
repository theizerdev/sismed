<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CatalogoEstudio;
use App\Models\Cita;
use App\Models\CitaArchivoResultado;
use App\Models\Especialidad;
use App\Models\Medico;
use App\Models\Paciente;
use App\Models\Sucursal;
use App\Models\TipoAtencion;
use App\Services\CitaService;
use App\Services\WhatsAppService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CitaController extends Controller
{
    protected CitaService $citaService;
    protected WhatsAppService $whatsAppService;

    public function __construct(CitaService $citaService, WhatsAppService $whatsAppService)
    {
        $this->citaService = $citaService;
        $this->whatsAppService = $whatsAppService;
    }

    public function index(Request $request)
    {
        $query = Cita::with(['paciente', 'medico', 'especialidad', 'tipoAtencion', 'sucursal', 'catalogoEstudio', 'archivosResultados.subidoPor']);

        // Filtros de fecha para calendario y tabla
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('fecha_hora_inicio', [
                Carbon::parse($request->start_date)->startOfDay(),
                Carbon::parse($request->end_date)->endOfDay(),
            ]);
        } elseif ($request->filled('fecha')) {
            $query->whereDate('fecha_hora_inicio', $request->fecha);
        }

        if ($request->filled('medico_id') && $request->medico_id !== 'all') {
            $query->where('medico_id', $request->medico_id);
        }

        if ($request->filled('especialidad_id') && $request->especialidad_id !== 'all') {
            $query->where('especialidad_id', $request->especialidad_id);
        }

        if ($request->filled('tipo_atencion_id') && $request->tipo_atencion_id !== 'all') {
            $query->where('tipo_atencion_id', $request->tipo_atencion_id);
        }

        if ($request->filled('estado') && $request->estado !== 'all') {
            $query->where('estado', $request->estado);
        }


        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('codigo_cita', 'like', "%{$search}%")
                  ->orWhereHas('paciente', function ($qp) use ($search) {
                      $qp->where('nombres', 'like', "%{$search}%")
                         ->orWhere('apellidos', 'like', "%{$search}%")
                         ->orWhere('documento_identidad', 'like', "%{$search}%")
                         ->orWhere('nombre_mascota', 'like', "%{$search}%");
                  })
                  ->orWhereHas('medico', function ($qm) use ($search) {
                      $qm->where('nombres', 'like', "%{$search}%")
                         ->orWhere('apellidos', 'like', "%{$search}%");
                  })
                  ->orWhereHas('catalogoEstudio', function ($qe) use ($search) {
                      $qe->where('nombre_estudio', 'like', "%{$search}%")
                         ->orWhere('codigo', 'like', "%{$search}%");
                  });
            });
        }

        $citas = $query->orderBy('fecha_hora_inicio', 'asc')->get();

        // Formatear eventos de calendario para FullCalendar
        $eventosCalendario = $citas->map(function ($cita) {
            $nombrePaciente = $cita->paciente
                ? ($cita->paciente->tipo_paciente === 'animal'
                    ? "🐾 {$cita->paciente->nombre_mascota} ({$cita->paciente->tutor_nombre})"
                    : "👤 {$cita->paciente->nombres} {$cita->paciente->apellidos}")
                : 'Paciente N/A';

            $nombreMedico = $cita->medico
                ? "Dr(a). {$cita->medico->nombres} {$cita->medico->apellidos}"
                : ($cita->categoria_cita === 'servicio' ? '🧪 ' . ($cita->catalogoEstudio->nombre_estudio ?? 'Servicio / Lab') : 'Médico N/A');

            return [
                'id' => (string) $cita->id,
                'title' => "{$nombrePaciente} - {$nombreMedico}",
                'start' => $cita->fecha_hora_inicio->toIso8601String(),
                'end' => $cita->fecha_hora_fin->toIso8601String(),
                'backgroundColor' => $cita->categoria_cita === 'servicio' ? '#0284c7' : $cita->color_estado,
                'borderColor' => $cita->categoria_cita === 'servicio' ? '#0369a1' : $cita->color_estado,
                'textColor' => '#ffffff',
                'editable' => $cita->estado === 'pendiente' || $cita->estado === 'confirmada_pagada',
                'extendedProps' => [
                    'cita' => $cita,
                    'codigo_cita' => $cita->codigo_cita,
                    'estado' => $cita->estado,
                    'estado_formateado' => $cita->estado_formateado,
                    'categoria_cita' => $cita->categoria_cita ?? 'medica',
                    'catalogo_estudio' => $cita->catalogoEstudio,
                    'estado_servicio' => $cita->estado_servicio,
                    'paciente_id' => $cita->paciente_id,
                    'paciente_nombre' => $nombrePaciente,
                    'paciente_tipo' => $cita->paciente->tipo_paciente ?? 'humano',
                    'paciente_telefono' => $cita->paciente->telefono ?? $cita->paciente->tutor_telefono ?? '',
                    'medico_id' => $cita->medico_id,
                    'medico_nombre' => $nombreMedico,
                    'especialidad_id' => $cita->especialidad_id,
                    'especialidad' => $cita->especialidad->nombre ?? '',
                    'tipo_atencion_id' => $cita->tipo_atencion_id,
                    'tipo_atencion' => $cita->tipoAtencion->nombre ?? '',
                    'modalidad' => $cita->tipoAtencion->modalidad ?? 'presencial',
                    'duracion_minutos' => $cita->duracion_minutos,
                    'link_virtual' => $cita->link_virtual,
                    'motivo_consulta' => $cita->motivo_consulta,
                    'monto_estimado' => $cita->monto_estimado,
                    'recordatorio_enviado' => $cita->recordatorio_whatsapp_enviado,
                ],
            ];
        });

        // Estadísticas rápidas del día
        $hoy = Carbon::today();
        $estadisticas = [
            'citas_hoy' => Cita::whereDate('fecha_hora_inicio', $hoy)->count(),
            'confirmadas' => Cita::whereDate('fecha_hora_inicio', $hoy)->whereIn('estado', ['confirmada', 'confirmada_pagada'])->count(),
            'en_sala_espera' => Cita::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'en_sala_espera')->count(),
            'en_consulta' => Cita::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'en_consulta')->count(),
            'atendidas' => Cita::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'atendida')->count(),
            'canceladas' => Cita::whereDate('fecha_hora_inicio', $hoy)->where('estado', 'cancelada')->count(),
        ];

        return Inertia::render('admin/Citas/Index', [
            'citas' => $citas,
            'eventosCalendario' => $eventosCalendario,
            'medicos' => Medico::select('id', 'nombres', 'apellidos', 'codigo_medico', 'color_agenda', 'especialidad_principal_id')->where('status', true)->get(),
            'pacientes' => Paciente::select('id', 'codigo_paciente', 'nombres', 'apellidos', 'tipo_paciente', 'nombre_mascota', 'tutor_nombre', 'telefono', 'tutor_telefono', 'fecha_nacimiento')->where('status', true)->get(),
            'especialidades' => Especialidad::select('id', 'nombre')->where('status', true)->get(),
            'tiposAtencion' => TipoAtencion::select('id', 'nombre', 'categoria', 'duracion_estimada_minutos', 'requiere_link_virtual', 'costo_adicional_sugerido', 'modalidad')->where('status', true)->get(),
            'catalogoServicios' => CatalogoEstudio::where('status', true)->orderBy('categoria')->orderBy('nombre_estudio')->get(),
            'sucursales' => Sucursal::select('id', 'nombre')->get(),
            'paises' => \App\Models\Pais::where('activo', true)->get(['id', 'nombre', 'codigo_iso2', 'codigo_telefonico']),
            'estadisticas' => $estadisticas,
            'filters' => $request->only(['search', 'fecha', 'medico_id', 'especialidad_id', 'tipo_atencion_id', 'estado']),
        ]);
    }

    public function getSlots(Request $request)
    {
        $request->validate([
            'medico_id' => 'required|exists:medicos,id',
            'fecha' => 'required|date_format:Y-m-d',
            'duracion_minutos' => 'nullable|integer|min:5|max:240',
        ]);

        $duracion = (int) ($request->duracion_minutos ?? 30);
        $slots = $this->citaService->obtenerSlotsDisponibles(
            (int) $request->medico_id,
            $request->fecha,
            $duracion
        );

        return response()->json(['slots' => $slots]);
    }

    public function store(Request $request)
    {
        $categoriaCita = $request->input('categoria_cita', 'medica');

        $validated = $request->validate([
            'categoria_cita' => 'nullable|in:medica,servicio',
            'catalogo_estudio_id' => 'nullable|exists:catalogo_estudios,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => $categoriaCita === 'medica' ? 'required|exists:medicos,id' : 'nullable|exists:medicos,id',
            'especialidad_id' => 'nullable|exists:especialidades,id',
            'tipo_atencion_id' => 'nullable|exists:tipos_atencion,id',
            'sucursal_id' => 'nullable|exists:sucursales,id',
            'fecha_hora_inicio' => 'required|date',
            'fecha_hora_fin' => 'nullable|date|after:fecha_hora_inicio',
            'duracion_minutos' => 'nullable|integer|min:5',
            'motivo_consulta' => 'nullable|string|max:1000',
            'notas_recepcion' => 'nullable|string|max:1000',
            'monto_estimado' => 'nullable|numeric|min:0',
        ]);

        $tipoAtencion = !empty($validated['tipo_atencion_id']) ? TipoAtencion::find($validated['tipo_atencion_id']) : null;
        $estudio = !empty($validated['catalogo_estudio_id']) ? CatalogoEstudio::find($validated['catalogo_estudio_id']) : null;

        $inicio = Carbon::parse($validated['fecha_hora_inicio']);
        if (!empty($validated['fecha_hora_fin'])) {
            $fin = Carbon::parse($validated['fecha_hora_fin']);
            $duracion = (int) max(5, $inicio->diffInMinutes($fin));
        } else {
            $duracion = $validated['duracion_minutos']
                ?? $tipoAtencion->duracion_estimada_minutos
                ?? $estudio->duracion_minutos
                ?? 30;
            $fin = $inicio->copy()->addMinutes($duracion);
        }

        // 1. Validar Anticipación Mínima
        $this->citaService->validarAnticipacionMinima($inicio);

        // 2. Validar Overbooking solo si hay un médico asignado
        if (!empty($validated['medico_id'])) {
            $this->citaService->validarOverbooking((int) $validated['medico_id'], $inicio, $fin);
        }

        // 3. Generar enlace virtual si corresponde
        $linkVirtual = $tipoAtencion ? $this->citaService->generarLinkVirtual($tipoAtencion) : null;

        $montoEstimado = $validated['monto_estimado']
            ?? $estudio->precio
            ?? $tipoAtencion->costo_adicional_sugerido
            ?? 0.00;

        $cita = Cita::create([
            'categoria_cita' => $categoriaCita,
            'catalogo_estudio_id' => $validated['catalogo_estudio_id'] ?? null,
            'paciente_id' => $validated['paciente_id'],
            'medico_id' => $validated['medico_id'] ?? null,
            'especialidad_id' => $validated['especialidad_id'] ?? null,
            'tipo_atencion_id' => $validated['tipo_atencion_id'] ?? null,
            'sucursal_id' => $validated['sucursal_id'] ?? null,
            'fecha_hora_inicio' => $inicio,
            'fecha_hora_fin' => $fin,
            'duracion_minutos' => $duracion,
            'buffer_descanso_minutos' => 10,
            'estado' => 'pendiente',
            'estado_servicio' => 'pendiente_muestra',
            'motivo_consulta' => $validated['motivo_consulta'] ?? ($estudio ? $estudio->nombre_estudio : null),
            'notas_recepcion' => $validated['notas_recepcion'] ?? null,
            'link_virtual' => $linkVirtual,
            'monto_estimado' => $montoEstimado,
            'created_by' => Auth::id(),
        ]);

        // Enviar notificaciones WhatsApp automáticas al Paciente y al Doctor
        $this->enviarNotificacionesWhatsAppNuevaCita($cita);

        $mensajeExito = $categoriaCita === 'servicio'
            ? 'Cita de servicio agendada con éxito. Código: ' . $cita->codigo_cita
            : 'Cita médica registrada con éxito. Código: ' . $cita->codigo_cita;

        return back()->with('success', $mensajeExito);
    }

    public function update(Request $request, Cita $cita)
    {
        $categoriaCita = $request->input('categoria_cita', $cita->categoria_cita ?? 'medica');

        $validated = $request->validate([
            'categoria_cita' => 'nullable|in:medica,servicio',
            'catalogo_estudio_id' => 'nullable|exists:catalogo_estudios,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => $categoriaCita === 'medica' ? 'required|exists:medicos,id' : 'nullable|exists:medicos,id',
            'especialidad_id' => 'nullable|exists:especialidades,id',
            'tipo_atencion_id' => 'nullable|exists:tipos_atencion,id',
            'sucursal_id' => 'nullable|exists:sucursales,id',
            'fecha_hora_inicio' => 'required|date',
            'fecha_hora_fin' => 'nullable|date|after:fecha_hora_inicio',
            'duracion_minutos' => 'nullable|integer|min:5',
            'motivo_consulta' => 'nullable|string|max:1000',
            'notas_recepcion' => 'nullable|string|max:1000',
            'monto_estimado' => 'nullable|numeric|min:0',
        ]);

        $inicioNuevo = Carbon::parse($validated['fecha_hora_inicio']);
        if (!empty($validated['fecha_hora_fin'])) {
            $finNuevo = Carbon::parse($validated['fecha_hora_fin']);
            $duracion = (int) max(5, $inicioNuevo->diffInMinutes($finNuevo));
        } else {
            $duracion = $validated['duracion_minutos'] ?? $cita->duracion_minutos;
            $finNuevo = $inicioNuevo->copy()->addMinutes($duracion);
        }

        // Si se cambia la fecha u hora, verificar regla de cancelación/reagendamiento <24h y overbooking
        if (!$cita->fecha_hora_inicio->eq($inicioNuevo) || !$cita->fecha_hora_fin->eq($finNuevo)) {
            $this->citaService->validarLimiteCancelacion($cita);
            if (!empty($validated['medico_id'])) {
                $this->citaService->validarOverbooking((int) $validated['medico_id'], $inicioNuevo, $finNuevo, $cita->id);
            }
        }

        $cita->update([
            'categoria_cita' => $categoriaCita,
            'catalogo_estudio_id' => $validated['catalogo_estudio_id'] ?? $cita->catalogo_estudio_id,
            'paciente_id' => $validated['paciente_id'],
            'medico_id' => $validated['medico_id'] ?? null,
            'especialidad_id' => $validated['especialidad_id'] ?? null,
            'tipo_atencion_id' => $validated['tipo_atencion_id'] ?? $cita->tipo_atencion_id,
            'sucursal_id' => $validated['sucursal_id'] ?? null,
            'fecha_hora_inicio' => $inicioNuevo,
            'fecha_hora_fin' => $finNuevo,
            'duracion_minutos' => $duracion,
            'motivo_consulta' => $validated['motivo_consulta'] ?? null,
            'notas_recepcion' => $validated['notas_recepcion'] ?? null,
            'monto_estimado' => $validated['monto_estimado'] ?? $cita->monto_estimado,
        ]);

        return back()->with('success', 'Cita actualizada correctamente.');
    }

    public function move(Request $request, Cita $cita)
    {
        $validated = $request->validate([
            'fecha_hora_inicio' => 'required|date',
            'fecha_hora_fin' => 'required|date|after:fecha_hora_inicio',
        ]);

        $inicioNuevo = Carbon::parse($validated['fecha_hora_inicio']);
        $finNuevo = Carbon::parse($validated['fecha_hora_fin']);
        $duracion = (int) $inicioNuevo->diffInMinutes($finNuevo);

        if ($duracion < 5) {
            $duracion = 5;
            $finNuevo = $inicioNuevo->copy()->addMinutes(5);
        }

        // Si cambia la hora de inicio, verificar límite de cancelación y overbooking
        if (!$cita->fecha_hora_inicio->eq($inicioNuevo)) {
            $this->citaService->validarAnticipacionMinima($inicioNuevo);
            $this->citaService->validarLimiteCancelacion($cita);
            $this->citaService->validarOverbooking((int) $cita->medico_id, $inicioNuevo, $finNuevo, $cita->id);
        }

        $cita->update([
            'fecha_hora_inicio' => $inicioNuevo,
            'fecha_hora_fin' => $finNuevo,
            'duracion_minutos' => $duracion,
        ]);

        return back()->with('success', 'Horario de cita reprogramado exitosamente.');
    }

    public function updateEstado(Request $request, Cita $cita)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,confirmada,confirmada_pagada,en_sala_espera,en_consulta,atendida,cancelada,no_asistio',
            'motivo_cancelacion' => 'required_if:estado,cancelada|nullable|string|max:500',
        ]);

        $nuevoEstado = $validated['estado'];
        if ($nuevoEstado === 'confirmada') {
            $nuevoEstado = 'confirmada_pagada';
        }

        // Si se intenta cancelar, verificar límite de 24h
        if ($nuevoEstado === 'cancelada' && $cita->estado !== 'cancelada') {
            $this->citaService->validarLimiteCancelacion($cita);
            $cita->motivo_cancelacion = $validated['motivo_cancelacion'] ?? 'Cancelada por el usuario';
            $cita->cancelado_por_user_id = Auth::id();
        }

        // Trazabilidad de tiempos clínicos de confirmación
        if (in_array($nuevoEstado, ['confirmada', 'confirmada_pagada'])) {
            if (!$cita->fecha_confirmacion) {
                $cita->fecha_confirmacion = now();
            }
            // Generar o vincular enlace de preconsulta para la cita
            try {
                $preconsultaService = app(\App\Services\PreconsultaService::class);
                $preconsultaService->obtenerOGenerarPreconsulta($cita);
            } catch (\Exception $e) {
                // Log exception silently
            }
        }

        if ($nuevoEstado === 'en_sala_espera') {
            if (!$cita->fecha_llegada_sala_espera) {
                $cita->fecha_llegada_sala_espera = now();
            }
            // Iniciar ciclo de vida de la Consulta Médica en 'sala_de_espera'
            \App\Models\ConsultaMedica::firstOrCreate(
                ['cita_id' => $cita->id],
                [
                    'empresa_id' => $cita->empresa_id,
                    'paciente_id' => $cita->paciente_id,
                    'medico_id' => $cita->medico_id,
                    'especialidad_id' => $cita->especialidad_id,
                    'motivo_consulta' => $cita->motivo_consulta,
                    'estado' => 'sala_de_espera',
                ]
            );
        }

        if ($nuevoEstado === 'en_consulta') {
            if (!$cita->fecha_inicio_consulta) {
                $cita->fecha_inicio_consulta = now();
            }
            $consulta = \App\Models\ConsultaMedica::firstOrCreate(
                ['cita_id' => $cita->id],
                [
                    'empresa_id' => $cita->empresa_id,
                    'paciente_id' => $cita->paciente_id,
                    'medico_id' => $cita->medico_id,
                    'especialidad_id' => $cita->especialidad_id,
                    'motivo_consulta' => $cita->motivo_consulta,
                    'estado' => 'en_consultorio',
                ]
            );
            $consulta->update(['estado' => 'en_consultorio']);
        }

        if ($nuevoEstado === 'atendida') {
            if (!$cita->fecha_fin_consulta) {
                $cita->fecha_fin_consulta = now();
            }
            $consulta = \App\Models\ConsultaMedica::where('cita_id', $cita->id)->first();
            if ($consulta) {
                $consulta->update(['estado' => 'finalizada', 'finalizada_at' => now()]);
            }
        }

        $cita->estado = $nuevoEstado;
        $cita->save();

        return back()->with('success', 'Estado de la cita cambiado a: ' . $cita->estado_formateado);
    }

    /**
     * Actualiza el estado de pago y monto pagado en caja para la cita.
     */
    public function updatePago(Request $request, Cita $cita)
    {
        $validated = $request->validate([
            'estado_pago' => 'required|in:pendiente,pagado,parcial,reembolsado',
            'monto_pagado' => 'nullable|numeric|min:0',
        ]);

        $cita->estado_pago = $validated['estado_pago'];
        if ($validated['estado_pago'] === 'pagado') {
            $cita->monto_pagado = $validated['monto_pagado'] ?? $cita->monto_estimado;
        } elseif ($validated['estado_pago'] === 'pendiente') {
            $cita->monto_pagado = 0.00;
        } elseif (isset($validated['monto_pagado'])) {
            $cita->monto_pagado = $validated['monto_pagado'];
        }

        $cita->save();

        return back()->with('success', 'Estado de pago actualizado a: ' . $cita->estado_pago_formateado);
    }

    public function destroy(Cita $cita)
    {
        $this->citaService->validarLimiteCancelacion($cita);
        $cita->delete();

        return back()->with('success', 'Registro de cita eliminado.');
    }

    public function sendWhatsAppRecordatorio(Cita $cita)
    {
        $paciente = $cita->paciente;
        $medico = $cita->medico;

        $telefono = $paciente->telefono ?? $paciente->tutor_telefono;
        if (!$telefono) {
            return back()->with('error', 'El paciente no tiene un número de teléfono registrado.');
        }

        // Generar o recuperar enlace de preconsulta
        $linkPreconsulta = null;
        try {
            $preconsultaService = app(\App\Services\PreconsultaService::class);
            $preconsulta = $preconsultaService->obtenerOGenerarPreconsulta($cita);
            $linkPreconsulta = url('/preconsulta/' . $preconsulta->token);
        } catch (\Exception $e) {
            // Ignorar si no hay plantilla activa
        }

        $fechaFormateada = $cita->fecha_hora_inicio->format('d/m/Y h:i A');
        $nombrePaciente = $paciente->tipo_paciente === 'animal'
            ? "{$paciente->nombre_mascota} (Tutor: {$paciente->tutor_nombre})"
            : "{$paciente->nombres}";

        $mensaje = "*CONFIRMACIÓN DE CITA MÉDICA - SISMED*\n\n"
            . "Hola *{$nombrePaciente}*,\n"
            . "Le recordamos su próxima consulta médica:\n\n"
            . "*Código:* {$cita->codigo_cita}\n"
            . "*Médico:* Dr(a). {$medico->nombres} {$medico->apellidos}\n"
            . "*Tipo de Atención:* " . ($cita->tipoAtencion->nombre ?? 'Consulta') . "\n"
            . "*Fecha y Hora:* {$fechaFormateada}\n\n";

        if ($cita->link_virtual) {
            $mensaje .= "*Enlace Virtual:* {$cita->link_virtual}\n\n";
        }

        if ($linkPreconsulta) {
            $mensaje .= "📋 *CUESTIONARIO DE PRE-CONSULTA:*\n"
                . "Por favor complete este breve formulario antes de su consulta médica para agilizar su atención:\n"
                . "👉 {$linkPreconsulta}\n\n";
        }

        $mensaje .= "Por favor confirme su asistencia respondiendo a este mensaje. ¡Le esperamos!";

        $this->whatsAppService->sendMessage($telefono, $mensaje);

        $cita->update([
            'recordatorio_whatsapp_enviado' => true,
            'fecha_envio_recordatorio' => now(),
        ]);

        return back()->with('success', 'Confirmación y enlace de Preconsulta enviados exitosamente vía WhatsApp.');
    }

    /**
     * Envía notificaciones de confirmación de cita por WhatsApp al Paciente y al Médico Tratante.
     */
    private function enviarNotificacionesWhatsAppNuevaCita(Cita $cita): void
    {
        try {
            $cita->loadMissing(['paciente', 'medico', 'especialidad', 'tipoAtencion']);

            $paciente = $cita->paciente;
            $medico = $cita->medico;
            $fechaFormateada = Carbon::parse($cita->fecha_hora_inicio)->format('d/m/Y h:i A');

            // 1. Notificación al Paciente / Tutor
            $telefonoPaciente = $paciente->telefono ?? $paciente->tutor_telefono;
            if (!empty($telefonoPaciente)) {
                $nombrePaciente = $paciente->tipo_paciente === 'animal'
                    ? "🐾 {$paciente->nombre_mascota}"
                    : "{$paciente->nombres}";

                $mensajePaciente = "🗓️ *CONFIRMACIÓN DE CITA MÉDICA - SISMED*\n\n"
                    . "Hola *{$nombrePaciente}*,\n"
                    . "Su cita médica ha sido agendada con éxito.\n\n"
                    . "📌 *Código de Cita:* {$cita->codigo_cita}\n"
                    . "👨‍⚕️ *Médico:* Dr(a). {$medico->nombres} {$medico->apellidos}\n"
                    . "🩺 *Especialidad:* " . ($cita->especialidad->nombre ?? 'Medicina General') . "\n"
                    . "📋 *Atención:* " . ($cita->tipoAtencion->nombre ?? 'Consulta Médica') . "\n"
                    . "⏰ *Fecha y Hora:* {$fechaFormateada}\n";

                if (!empty($cita->link_virtual)) {
                    $mensajePaciente .= "💻 *Enlace Virtual:* {$cita->link_virtual}\n";
                }

                $mensajePaciente .= "\n¡Gracias por su confianza!";

                $this->whatsAppService->sendMessage($telefonoPaciente, $mensajePaciente);

                $cita->update([
                    'recordatorio_whatsapp_enviado' => true,
                    'fecha_envio_recordatorio' => now(),
                ]);
            }

            // 2. Notificación al Doctor / Médico Tratante
            $telefonoDoctor = $medico->telefono ?? $medico->telefono_whatsapp;
            if (!empty($telefonoDoctor)) {
                $infoPaciente = $paciente->tipo_paciente === 'animal'
                    ? "🐾 {$paciente->nombre_mascota} (Tutor: {$paciente->tutor_nombre})"
                    : "{$paciente->nombres} {$paciente->apellidos}";

                $mensajeDoctor = "🩺 *NUEVA CITA AGENDADA EN SU AGENDA*\n\n"
                    . "Estimado(a) *Dr(a). {$medico->nombres} {$medico->apellidos}*,\n"
                    . "Se ha registrado una nueva cita médica en su agenda:\n\n"
                    . "📌 *Código:* {$cita->codigo_cita}\n"
                    . "👤 *Paciente:* {$infoPaciente}\n"
                    . "📱 *Teléfono Paciente:* " . ($telefonoPaciente ?? 'No registrado') . "\n"
                    . "📋 *Atención:* " . ($cita->tipoAtencion->nombre ?? 'Consulta Médica') . "\n"
                    . "⏰ *Fecha y Hora:* {$fechaFormateada}\n";

                if (!empty($cita->motivo_consulta)) {
                    $mensajeDoctor .= "📝 *Motivo:* {$cita->motivo_consulta}\n";
                }

                if (!empty($cita->link_virtual)) {
                    $mensajeDoctor .= "💻 *Enlace Virtual:* {$cita->link_virtual}\n";
                }

                $mensajeDoctor .= "\nPor favor revise su agenda en el sistema SISMED.";

                $this->whatsAppService->sendMessage($telefonoDoctor, $mensajeDoctor);
            }
        } catch (\Exception $e) {
            Log::error('Error enviando notificaciones de creación de cita por WhatsApp: ' . $e->getMessage());
        }
    }

    /**
     * Sube un archivo de resultados (PDF / Imagen) para una cita de servicio.
     */
    public function uploadResultado(Request $request, Cita $cita)
    {
        $request->validate([
            'archivo' => 'required|file|mimes:pdf,jpg,jpeg,png,webp,doc,docx|max:20480', // Máx 20MB
            'notas' => 'nullable|string|max:500',
        ]);

        $file = $request->file('archivo');
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getClientMimeType();
        $size = $file->getSize();

        $path = $file->store('resultados_citas/' . $cita->empresa_id, 'public');

        $archivoResultado = \App\Models\CitaArchivoResultado::create([
            'empresa_id' => $cita->empresa_id,
            'cita_id' => $cita->id,
            'nombre_original' => $originalName,
            'archivo_path' => $path,
            'tamano_bytes' => $size,
            'mime_type' => $mimeType,
            'notas' => $request->input('notas'),
            'subido_por_user_id' => Auth::id(),
        ]);

        // Si es el primer resultado, actualizar automáticamente el estado del servicio
        if ($cita->estado_servicio === 'pendiente_muestra' || $cita->estado_servicio === 'en_proceso') {
            $cita->update(['estado_servicio' => 'resultados_listos']);
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Archivo de resultado subido correctamente.',
                'archivo' => $archivoResultado->load('subidoPor'),
            ]);
        }

        return back()->with('success', 'Archivo de resultado subido correctamente.');
    }

    /**
     * Elimina un archivo de resultado adjunto.
     */
    public function deleteResultado(\App\Models\CitaArchivoResultado $archivo)
    {
        if ($archivo->archivo_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($archivo->archivo_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($archivo->archivo_path);
        }

        $archivo->delete();

        return back()->with('success', 'Archivo de resultado eliminado.');
    }

    /**
     * Actualiza el estado técnico del servicio (Toma de muestra, análisis, listo).
     */
    public function updateEstadoServicio(Request $request, Cita $cita)
    {
        $validated = $request->validate([
            'estado_servicio' => 'required|in:pendiente_muestra,en_proceso,resultados_listos,entregado',
        ]);

        $cita->update([
            'estado_servicio' => $validated['estado_servicio'],
        ]);

        return back()->with('success', 'Estado del servicio actualizado.');
    }

    /**
     * Envía los resultados del estudio o laboratorio al paciente vía WhatsApp.
     */
    public function sendResultadosWhatsApp(Cita $cita)
    {
        $paciente = $cita->paciente;
        $telefono = $paciente->telefono ?? $paciente->tutor_telefono;

        if (!$telefono) {
            return back()->with('error', 'El paciente no tiene un número de teléfono registrado.');
        }

        $archivos = $cita->archivosResultados;
        if ($archivos->isEmpty()) {
            return back()->with('error', 'No hay archivos de resultados adjuntos para enviar.');
        }

        $nombrePaciente = $paciente->tipo_paciente === 'animal'
            ? "🐾 {$paciente->nombre_mascota} (Tutor: {$paciente->tutor_nombre})"
            : "{$paciente->nombres}";

        $nombreEstudio = $cita->catalogoEstudio->nombre_estudio ?? $cita->motivo_consulta ?? 'Servicio / Estudio';

        $mensaje = "🧪 *RESULTADOS DISPONIBLES - SISMED*\n\n"
            . "Estimado(a) *{$nombrePaciente}*,\n"
            . "Le informamos que los resultados de su estudio *{$nombreEstudio}* ya se encuentran listos para su descarga:\n\n";

        foreach ($archivos as $idx => $arch) {
            $num = $idx + 1;
            $mensaje .= "📄 *Resultado {$num}:* {$arch->nombre_original}\n"
                . "👉 {$arch->url_descarga}\n\n";
        }

        $mensaje .= "📌 *Código de Cita:* {$cita->codigo_cita}\n"
            . "Cualquier duda, estamos a su disposición. ¡Gracias por su confianza!";

        $this->whatsAppService->sendMessage($telefono, $mensaje);

        $cita->update([
            'estado_servicio' => 'entregado',
        ]);

        return back()->with('success', 'Resultados enviados exitosamente por WhatsApp al paciente.');
    }
}
