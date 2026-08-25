<?php

namespace Tests\Feature;

use App\Models\Cita;
use App\Models\Empresa;
use App\Models\Medico;
use App\Models\Paciente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CitaConfirmacionYPagoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Permission::firstOrCreate(['name' => 'citas.view', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'citas.edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'citas.cambiar_estado', 'guard_name' => 'web']);
    }

    public function test_confirmar_cita_y_actualizar_pago_en_caja_independientemente()
    {
        $empresa = Empresa::create(['razon_social' => 'Clínica Demo', 'documento' => 'J-123456789']);
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo(['citas.view', 'citas.edit', 'citas.cambiar_estado']);

        $paciente = Paciente::create([
            'empresa_id' => $empresa->id,
            'codigo_paciente' => 'PAC-2026-0001',
            'tipo_paciente' => 'humano',
            'nombres' => 'Carlos',
            'apellidos' => 'Pérez',
            'documento_identidad' => '12345678',
            'telefono' => '4121234567',
        ]);

        $medico = Medico::create([
            'empresa_id' => $empresa->id,
            'codigo_medico' => 'MED-2026-0001',
            'nombres' => 'Ana',
            'apellidos' => 'Gómez',
            'documento_identidad' => '87654321',
        ]);

        $cita = Cita::create([
            'empresa_id' => $empresa->id,
            'paciente_id' => $paciente->id,
            'medico_id' => $medico->id,
            'fecha_hora_inicio' => now()->addDays(2),
            'fecha_hora_fin' => now()->addDays(2)->addMinutes(30),
            'duracion_minutos' => 30,
            'estado' => 'pendiente',
            'estado_pago' => 'pendiente',
            'monto_estimado' => 60.00,
        ]);

        // 1. Confirmar la cita (debe cambiar estado clínico a confirmada)
        $responseEstado = $this->actingAs($user)
            ->patch("/admin/citas/{$cita->id}/estado", [
                'estado' => 'confirmada',
            ]);

        $responseEstado->assertStatus(302);
        $cita->refresh();
        $this->assertEquals('Confirmada', $cita->estado_formateado);
        $this->assertNotNull($cita->fecha_confirmacion);
        $this->assertEquals('pendiente', $cita->estado_pago); // El pago en caja sigue pendiente

        // 2. Registrar el pago en caja (debe cambiar estado de pago a pagado)
        $responsePago = $this->actingAs($user)
            ->patch("/admin/citas/{$cita->id}/pago", [
                'estado_pago' => 'pagado',
                'monto_pagado' => 60.00,
            ]);

        $responsePago->assertStatus(302);
        $cita->refresh();
        $this->assertEquals('pagado', $cita->estado_pago);
        $this->assertEquals('Pagada en Caja', $cita->estado_pago_formateado);
        $this->assertEquals(60.00, (float) $cita->monto_pagado);
    }

    public function test_recepcionista_bloqueada_del_wizard_de_atencion_medica()
    {
        $empresa = Empresa::create(['razon_social' => 'Clínica Demo 2', 'documento' => 'J-123456788']);
        $roleRecepcionista = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'recepcionista', 'guard_name' => 'web']);
        
        $recepcionista = User::factory()->create(['empresa_id' => $empresa->id]);
        $recepcionista->assignRole($roleRecepcionista);
        $recepcionista->givePermissionTo(['citas.view', 'citas.edit']);

        $paciente = Paciente::create([
            'empresa_id' => $empresa->id,
            'codigo_paciente' => 'PAC-2026-0002',
            'tipo_paciente' => 'humano',
            'nombres' => 'Laura',
            'apellidos' => 'Méndez',
            'documento_identidad' => '12345679',
        ]);

        $medico = Medico::create([
            'empresa_id' => $empresa->id,
            'codigo_medico' => 'MED-2026-0002',
            'nombres' => 'Dr. Fernando',
            'apellidos' => 'Rivas',
            'documento_identidad' => '87654322',
        ]);

        $cita = Cita::create([
            'empresa_id' => $empresa->id,
            'paciente_id' => $paciente->id,
            'medico_id' => $medico->id,
            'fecha_hora_inicio' => now()->addDays(1),
            'fecha_hora_fin' => now()->addDays(1)->addMinutes(30),
            'duracion_minutos' => 30,
            'estado' => 'pendiente',
        ]);

        // La recepcionista intenta acceder a la ruta de atención médica
        $response = $this->actingAs($recepcionista)->get("/admin/consultas/{$cita->id}/atencion");

        // Debe ser redirigida con mensaje de error sin acceso clínico
        $response->assertRedirect('/admin/citas');
        $response->assertSessionHas('error');
    }
}
