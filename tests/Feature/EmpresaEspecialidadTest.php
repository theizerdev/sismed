<?php

namespace Tests\Feature;

use App\Models\Empresa;
use App\Models\Especialidad;
use App\Models\RamaMedica;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class EmpresaEspecialidadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'PermissionSeeder']);
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        $this->artisan('db:seed', ['--class' => 'EmpresaSucursalSeeder']);
    }

    public function test_usuario_puede_acceder_a_especialidades_sin_id_de_empresa(): void
    {
        $empresa = Empresa::first();
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo(Permission::all());

        $response = $this->actingAs($user)->get('/admin/especialidades');
        $response->assertStatus(200);
    }

    public function test_usuario_puede_actualizar_especialidades_activas_en_admin_especialidades(): void
    {
        $empresa = Empresa::first();
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo(Permission::all());

        $rama = RamaMedica::create([
            'nombre' => 'Medicina Humana',
            'slug' => 'medicina-humana',
        ]);

        $esp1 = Especialidad::create([
            'rama_medica_id' => $rama->id,
            'nombre' => 'Medicina General',
            'slug' => 'medicina-general',
        ]);

        $esp2 = Especialidad::create([
            'rama_medica_id' => $rama->id,
            'nombre' => 'Cardiología',
            'slug' => 'cardiologia',
        ]);

        $payload = [
            'especialidades' => [$esp1->id, $esp2->id],
            'especialidad_principal_id' => $esp1->id,
        ];

        $response = $this->actingAs($user)->put('/admin/especialidades', $payload);
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('empresa_especialidades', [
            'empresa_id' => $empresa->id,
            'especialidad_id' => $esp1->id,
            'es_principal' => 1,
        ]);

        $this->assertDatabaseHas('empresa_especialidades', [
            'empresa_id' => $empresa->id,
            'especialidad_id' => $esp2->id,
            'es_principal' => 0,
        ]);
    }
}
