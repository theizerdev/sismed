<?php

namespace Tests\Feature;

use App\Models\CatalogoEstudio;
use App\Models\Cita;
use App\Models\Empresa;
use App\Models\Paciente;
use App\Models\TipoAtencion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CitaServicioLaboratorioTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Empresa $empresa;
    protected Paciente $paciente;
    protected CatalogoEstudio $estudio;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->empresa = Empresa::create([
            'razon_social' => 'Clínica Central Test',
            'documento' => '12345678901',
            'status' => true,
        ]);

        $roleAdmin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'servicios.view', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'servicios.create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'servicios.edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'servicios.delete', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'citas.view', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'citas.create', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'citas.edit', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'citas.delete', 'guard_name' => 'web']);

        $roleAdmin->syncPermissions(Permission::all());

        $this->admin = User::factory()->create([
            'empresa_id' => $this->empresa->id,
        ]);
        $this->admin->assignRole('admin');

        $this->paciente = Paciente::create([
            'empresa_id' => $this->empresa->id,
            'codigo_paciente' => 'PAC-TEST-001',
            'nombres' => 'Carlos',
            'apellidos' => 'Martínez',
            'tipo_paciente' => 'humano',
            'telefono' => '+584121234567',
            'status' => true,
        ]);

        $this->estudio = CatalogoEstudio::create([
            'empresa_id' => $this->empresa->id,
            'codigo' => 'LAB-001',
            'categoria' => 'Laboratorio Clínico',
            'tipo_estudio' => 'Laboratorio',
            'nombre_estudio' => 'Perfil 20 Completo',
            'precio' => 45.00,
            'duracion_minutos' => 20,
            'indicaciones_predeterminadas' => 'Ayuno de 12 horas',
            'status' => true,
        ]);
    }

    public function test_puede_crear_y_listar_servicios_en_catalogo(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/servicios');
        $response->assertStatus(200);

        $postResponse = $this->actingAs($this->admin)->post('/admin/servicios', [
            'nombre_estudio' => 'Radiografía de Tórax AP',
            'categoria' => 'Imagenología / Radiología',
            'precio' => 35.50,
            'duracion_minutos' => 15,
            'indicaciones_predeterminadas' => 'Retirar objetos metálicos',
            'status' => true,
        ]);

        $postResponse->assertRedirect();
        $this->assertDatabaseHas('catalogo_estudios', [
            'nombre_estudio' => 'Radiografía de Tórax AP',
            'precio' => 35.50,
        ]);
    }

    public function test_puede_agendar_cita_de_servicio_sin_medico(): void
    {
        $fechaInicio = now()->addDays(2)->setHour(10)->setMinute(0)->format('Y-m-d H:i:s');

        $response = $this->actingAs($this->admin)->post('/admin/citas', [
            'categoria_cita' => 'servicio',
            'catalogo_estudio_id' => $this->estudio->id,
            'paciente_id' => $this->paciente->id,
            'medico_id' => null,
            'fecha_hora_inicio' => $fechaInicio,
            'duracion_minutos' => 20,
            'monto_estimado' => 45.00,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('citas', [
            'categoria_cita' => 'servicio',
            'catalogo_estudio_id' => $this->estudio->id,
            'paciente_id' => $this->paciente->id,
            'medico_id' => null,
            'monto_estimado' => 45.00,
            'estado_servicio' => 'pendiente_muestra',
        ]);
    }

    public function test_puede_subir_archivo_de_resultado_y_actualizar_estado(): void
    {
        $fechaInicio = now()->addDays(2)->setHour(11)->setMinute(0)->format('Y-m-d H:i:s');

        $cita = Cita::create([
            'empresa_id' => $this->empresa->id,
            'codigo_cita' => 'CIT-SRV-001',
            'categoria_cita' => 'servicio',
            'catalogo_estudio_id' => $this->estudio->id,
            'paciente_id' => $this->paciente->id,
            'fecha_hora_inicio' => $fechaInicio,
            'fecha_hora_fin' => now()->addDays(2)->setHour(11)->setMinute(20)->format('Y-m-d H:i:s'),
            'duracion_minutos' => 20,
            'estado' => 'pendiente',
            'estado_servicio' => 'pendiente_muestra',
            'monto_estimado' => 45.00,
            'created_by' => $this->admin->id,
        ]);

        $file = UploadedFile::fake()->create('informe_perfil_20.pdf', 500, 'application/pdf');

        $uploadResponse = $this->actingAs($this->admin)->post("/admin/citas/{$cita->id}/resultados", [
            'archivo' => $file,
            'notas' => 'Resultados sin alteraciones significativas',
        ]);

        $uploadResponse->assertRedirect();

        $this->assertDatabaseHas('cita_archivos_resultados', [
            'cita_id' => $cita->id,
            'nombre_original' => 'informe_perfil_20.pdf',
        ]);

        $cita->refresh();
        $this->assertEquals('resultados_listos', $cita->estado_servicio);
    }
}
