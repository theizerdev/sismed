<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Especialidad;
use App\Models\PlantillaConsulta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlantillaConsultaController extends Controller
{
    /**
     * Muestra la pantalla principal del configurador de plantillas de especialidad.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $empresaId = $user->empresa_id;

        // Obtener especialidades con sus ramas médicas
        $especialidades = Especialidad::with(['ramaMedica'])
            ->where('status', true)
            ->orderBy('nombre', 'asc')
            ->get();

        // Obtener plantillas personalizadas de la empresa y plantillas base de sistema
        $plantillasQuery = PlantillaConsulta::with('especialidad');
        if ($empresaId) {
            $plantillasQuery->where(function ($q) use ($empresaId) {
                $q->where('empresa_id', $empresaId)
                  ->orWhere(function ($sub) {
                      $sub->whereNull('empresa_id')->where('es_sistema', true);
                  });
            });
        } else {
            $plantillasQuery->where('es_sistema', true);
        }

        $todasPlantillas = $plantillasQuery->get();

        // Si una empresa tiene una plantilla personalizada para una especialidad, priorizarla sobre la de sistema
        $plantillasPorEspecialidad = [];
        foreach ($especialidades as $esp) {
            $personalizada = $todasPlantillas->first(function ($p) use ($esp, $empresaId) {
                return $p->especialidad_id == $esp->id && $p->empresa_id == $empresaId;
            });

            if ($personalizada) {
                $plantillasPorEspecialidad[$esp->id] = $personalizada;
            } else {
                $sistema = $todasPlantillas->first(function ($p) use ($esp) {
                    return $p->especialidad_id == $esp->id && $p->es_sistema;
                });
                $plantillasPorEspecialidad[$esp->id] = $sistema;
            }
        }

        $selectedEspecialidadId = $request->query('especialidad_id', (string) ($especialidades->first()?->id ?? ''));

        return Inertia::render('admin/Especialidades/Plantillas', [
            'especialidades' => $especialidades,
            'plantillasPorEspecialidad' => $plantillasPorEspecialidad,
            'selectedEspecialidadId' => $selectedEspecialidadId,
        ]);
    }

    /**
     * Guarda o actualiza los campos configurados para la especialidad de la empresa.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'especialidad_id' => 'required|exists:especialidades,id',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'campos' => 'required|array',
            'campos.*.id' => 'required|string',
            'campos.*.label' => 'required|string',
            'campos.*.type' => 'required|string',
            'campos.*.unit' => 'nullable|string',
            'campos.*.width' => 'nullable|string',
            'campos.*.section' => 'nullable|string',
            'campos.*.required' => 'nullable|boolean',
            'campos.*.is_active' => 'nullable|boolean',
            'campos.*.options' => 'nullable|array',
            'campos.*.placeholder' => 'nullable|string',
        ]);

        $user = Auth::user();
        $empresaId = $user->empresa_id;

        // Buscar si ya existe una plantilla personalizada para esta empresa
        $plantilla = PlantillaConsulta::where('especialidad_id', $validated['especialidad_id'])
            ->where('empresa_id', $empresaId)
            ->first();

        if (! $plantilla) {
            $plantilla = new PlantillaConsulta();
            $plantilla->empresa_id = $empresaId;
            $plantilla->especialidad_id = $validated['especialidad_id'];
            $plantilla->es_sistema = false;
        }

        $plantilla->nombre = $validated['nombre'];
        $plantilla->descripcion = $validated['descripcion'] ?? null;
        $plantilla->estructura_json = $validated['campos'];
        $plantilla->status = true;
        $plantilla->save();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => '¡Configuración de campos guardada exitosamente!',
                'plantilla' => $plantilla,
            ]);
        }

        return back()->with('success', '¡Configuración de campos guardada exitosamente!');
    }

    /**
     * Restaura los campos de la especialidad al diseño base predeterminado del sistema.
     */
    public function resetDefault(Request $request, Especialidad $especialidad)
    {
        $user = Auth::user();
        $empresaId = $user->empresa_id;

        if ($empresaId) {
            PlantillaConsulta::where('especialidad_id', $especialidad->id)
                ->where('empresa_id', $empresaId)
                ->delete();
        }

        return back()->with('success', "Se han restaurado los campos predeterminados para {$especialidad->nombre}.");
    }
}
