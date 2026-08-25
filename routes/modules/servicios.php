<?php

use App\Http\Controllers\Admin\ServicioController;
use Illuminate\Support\Facades\Route;

Route::middleware(['verified', 'auth', 'tenant'])->group(function () {
    Route::get('/servicios', [ServicioController::class, 'index'])
        ->name('servicios.index')
        ->can('servicios.view');

    Route::post('/servicios', [ServicioController::class, 'store'])
        ->name('servicios.store')
        ->can('servicios.create');

    Route::put('/servicios/{servicio}', [ServicioController::class, 'update'])
        ->name('servicios.update')
        ->can('servicios.edit');

    Route::patch('/servicios/{servicio}/toggle-status', [ServicioController::class, 'toggleStatus'])
        ->name('servicios.toggle-status')
        ->can('servicios.edit');

    Route::delete('/servicios/{servicio}', [ServicioController::class, 'destroy'])
        ->name('servicios.destroy')
        ->can('servicios.delete');
});
