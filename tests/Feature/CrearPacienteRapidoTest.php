<?php

namespace Tests\Feature;

use App\Models\Empresa;
use App\Models\Paciente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CrearPacienteRapidoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Permission::firstOrCreate(['name' => 'pacientes.create', 'guard_name' => 'web']);
    }

    public function test_crear_paciente_rapido_humano_via_json()
    {
        $empresa = Empresa::create(['razon_social' => 'Clínica Central', 'documento' => 'J-123456789']);
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo('pacientes.create');

        $response = $this->actingAs($user)
            ->postJson('/admin/pacientes', [
                'tipo_paciente' => 'humano',
                'nombres' => 'Valentina',
                'apellidos' => 'Morales',
                'documento_identidad' => '27890123',
                'telefono' => '4141234567',
                'email' => 'valentina@example.com',
                'genero' => 'femenino',
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Paciente registrado con éxito.',
        ]);

        $this->assertDatabaseHas('pacientes', [
            'nombres' => 'Valentina',
            'apellidos' => 'Morales',
            'documento_identidad' => '27890123',
            'empresa_id' => $empresa->id,
            'tipo_paciente' => 'humano',
        ]);
    }

    public function test_crear_paciente_rapido_animal_via_json()
    {
        $empresa = Empresa::create(['razon_social' => 'Clínica Veterinaria', 'documento' => 'J-987654321']);
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo('pacientes.create');

        $response = $this->actingAs($user)
            ->postJson('/admin/pacientes', [
                'tipo_paciente' => 'animal',
                'nombre_mascota' => 'Rocky',
                'especie' => 'Perro',
                'raza' => 'Golden Retriever',
                'tutor_nombre' => 'Alejandro Ramos',
                'tutor_telefono' => '4129876543',
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Paciente registrado con éxito.',
        ]);

        $this->assertDatabaseHas('pacientes', [
            'nombre_mascota' => 'Rocky',
            'especie' => 'Perro',
            'tutor_nombre' => 'Alejandro Ramos',
            'empresa_id' => $empresa->id,
            'tipo_paciente' => 'animal',
        ]);
    }
}
