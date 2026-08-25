<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CatalogoEstudio;
use App\Models\Especialidad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServicioController extends Controller
{
    /**
     * Muestra el catálogo completo de servicios y exámenes.
     */
    public function index(Request $request)
    {
        $query = CatalogoEstudio::query()
            ->with(['especialidad']);

        // Búsqueda por texto (nombre, código, categoría)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre_estudio', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('categoria', 'like', "%{$search}%")
                    ->orWhere('tipo_estudio', 'like', "%{$search}%");
            });
        }

        // Filtro por categoría
        if ($categoria = $request->input('categoria')) {
            if ($categoria !== 'all') {
                $query->where('categoria', $categoria);
            }
        }

        // Filtro por estado
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', filter_var($request->input('status'), FILTER_VALIDATE_BOOLEAN));
        }

        $servicios = $query->orderBy('categoria')
            ->orderBy('nombre_estudio')
            ->paginate($request->input('per_page', 15))
            ->withQueryString();

        // Categorías únicas existentes para el filtro rápido
        $categoriasExistentes = CatalogoEstudio::distinct()
            ->whereNotNull('categoria')
            ->pluck('categoria');

        $especialidades = Especialidad::where('status', true)->orderBy('nombre')->get();

        // Métricas rápidas
        $stats = [
            'total' => CatalogoEstudio::count(),
            'activos' => CatalogoEstudio::where('status', true)->count(),
            'laboratorio' => CatalogoEstudio::where('categoria', 'Laboratorio Clínico')->orWhere('tipo_estudio', 'Laboratorio')->count(),
            'imagenologia' => CatalogoEstudio::where('categoria', 'Imagenología / Radiología')->orWhere('tipo_estudio', 'Imagenología')->count(),
        ];

        return Inertia::render('admin/Servicios/Index', [
            'servicios' => $servicios,
            'categorias' => $categoriasExistentes,
            'especialidades' => $especialidades,
            'stats' => $stats,
            'filters' => $request->only(['search', 'categoria', 'status', 'per_page']),
        ]);
    }

    /**
     * Almacena un nuevo servicio o examen en el catálogo.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_estudio' => 'required|string|max:200',
            'codigo' => 'nullable|string|max:50',
            'categoria' => 'required|string|max:100',
            'tipo_estudio' => 'nullable|string|max:100',
            'especialidad_id' => 'nullable|exists:especialidades,id',
            'precio' => 'required|numeric|min:0',
            'duracion_minutos' => 'required|integer|min:5|max:480',
            'indicaciones_predeterminadas' => 'nullable|string|max:1000',
            'status' => 'boolean',
        ]);

        $validated['tipo_estudio'] = $validated['tipo_estudio'] ?? $validated['categoria'];
        $validated['empresa_id'] = Auth::user()->empresa_id;

        // Auto-generar código si no viene
        if (empty($validated['codigo'])) {
            $prefijo = match (strtolower($validated['categoria'])) {
                'laboratorio clínico', 'laboratorio' => 'LAB',
                'imagenología / radiología', 'imagenología', 'radiología' => 'IMG',
                'ecografía / ultrasonido', 'ecografía' => 'ECO',
                'cardiología / diagnóstico', 'cardiología' => 'CARD',
                'procedimientos de enfermería', 'procedimientos' => 'PROC',
                'terapia / rehabilitación', 'terapia' => 'TER',
                default => 'SRV',
            };
            $count = CatalogoEstudio::count() + 1;
            $validated['codigo'] = sprintf('%s-%04d', $prefijo, $count);
        }

        $servicio = CatalogoEstudio::create($validated);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Servicio registrado exitosamente.',
                'servicio' => $servicio->load('especialidad'),
            ]);
        }

        return back()->with('success', 'Servicio agregado al catálogo exitosamente.');
    }

    /**
     * Actualiza un servicio o examen existente.
     */
    public function update(Request $request, CatalogoEstudio $servicio)
    {
        $validated = $request->validate([
            'nombre_estudio' => 'required|string|max:200',
            'codigo' => 'nullable|string|max:50',
            'categoria' => 'required|string|max:100',
            'tipo_estudio' => 'nullable|string|max:100',
            'especialidad_id' => 'nullable|exists:especialidades,id',
            'precio' => 'required|numeric|min:0',
            'duracion_minutos' => 'required|integer|min:5|max:480',
            'indicaciones_predeterminadas' => 'nullable|string|max:1000',
            'status' => 'boolean',
        ]);

        $servicio->update($validated);

        return back()->with('success', 'Servicio actualizado correctamente.');
    }

    /**
     * Alterna el estado activo/inactivo de un servicio.
     */
    public function toggleStatus(CatalogoEstudio $servicio)
    {
        $servicio->update([
            'status' => !$servicio->status,
        ]);

        return back()->with('success', 'Estado del servicio modificado con éxito.');
    }

    /**
     * Elimina un servicio del catálogo.
     */
    public function destroy(CatalogoEstudio $servicio)
    {
        $servicio->delete();

        return back()->with('success', 'Servicio eliminado del catálogo.');
    }
}
