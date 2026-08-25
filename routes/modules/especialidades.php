<?php

use App\Http\Controllers\Admin\EmpresaEspecialidadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['verified', 'auth'])->group(function () {
    // Ruta directa para la empresa del usuario autenticado
    Route::get('/especialidades', [EmpresaEspecialidadController::class, 'edit'])
        ->name('especialidades.index')
        ->can('especialidades.edit');
    Route::put('/especialidades', [EmpresaEspecialidadController::class, 'update'])
        ->name('especialidades.update')
        ->can('especialidades.edit');

    // Rutas con ID de empresa para retrocompatibilidad
    Route::get('/empresas/{empresa}/especialidades', [EmpresaEspecialidadController::class, 'edit'])
        ->name('empresas.especialidades.edit')
        ->can('especialidades.edit');
    Route::put('/empresas/{empresa}/especialidades', [EmpresaEspecialidadController::class, 'update'])
        ->name('empresas.especialidades.update')
        ->can('especialidades.edit');

    // Rutas para el Configurador Visual de Campos por Especialidad (Form Builder)
    Route::get('/plantillas-consultas', [\App\Http\Controllers\Admin\PlantillaConsultaController::class, 'index'])
        ->name('plantillas-consultas.index');
    Route::post('/plantillas-consultas', [\App\Http\Controllers\Admin\PlantillaConsultaController::class, 'store'])
        ->name('plantillas-consultas.store');
    Route::post('/plantillas-consultas/especialidades/{especialidad}/reset', [\App\Http\Controllers\Admin\PlantillaConsultaController::class, 'resetDefault'])
        ->name('plantillas-consultas.reset');
});

