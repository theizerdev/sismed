<?php

namespace Tests\Feature;

use App\Models\Cita;
use App\Models\ConsultaMedica;
use App\Models\Empresa;
use App\Models\Especialidad;
use App\Models\Medico;
use App\Models\Paciente;
use App\Models\PlantillaConsulta;
use App\Models\RamaMedica;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class PlantillaConsultaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'PermissionSeeder']);
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        $this->artisan('db:seed', ['--class' => 'EmpresaSucursalSeeder']);
    }

    public function test_usuario_puede_acceder_al_configurador_de_plantillas_por_especialidad(): void
    {
        $empresa = Empresa::first();
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo(Permission::all());

        $rama = RamaMedica::create([
            'nombre' => 'Medicina Humana',
            'slug' => 'medicina-humana',
        ]);

        $especialidad = Especialidad::create([
            'rama_medica_id' => $rama->id,
            'nombre' => 'Pediatría',
            'slug' => 'pediatria',
            'codigo' => 'PED',
        ]);

        $response = $this->actingAs($user)->get('/admin/plantillas-consultas');
        $response->assertStatus(200);
    }

    public function test_usuario_puede_guardar_campos_personalizados_para_una_especialidad(): void
    {
        $empresa = Empresa::first();
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo(Permission::all());

        $rama = RamaMedica::create([
            'nombre' => 'Medicina Humana',
            'slug' => 'medicina-humana',
        ]);

        $especialidad = Especialidad::create([
            'rama_medica_id' => $rama->id,
            'nombre' => 'Cardiología',
            'slug' => 'cardiologia',
            'codigo' => 'CARDIO',
        ]);

        $campos = [
            [
                'id' => 'ruidos_cardiacos',
                'label' => 'Ruidos Cardíacos (R1/R2, Soplos)',
                'type' => 'textarea',
                'width' => 'full',
                'required' => true,
                'is_active' => true,
            ],
            [
                'id' => 'riesgo_framingham',
                'label' => 'Riesgo Cardiovascular (SCORE/Framingham)',
                'type' => 'select',
                'options' => ['Bajo (<1%)', 'Moderado (1-5%)', 'Alto (>5%)'],
                'width' => '1/2',
                'required' => false,
                'is_active' => true,
            ],
            [
                'id' => 'presion_intraocular',
                'label' => 'Presión Arterial Media Especializada',
                'type' => 'number',
                'unit' => 'mmHg',
                'width' => '1/2',
                'required' => false,
                'is_active' => true,
            ],
        ];

        $payload = [
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Evaluación Cardiológica Integral',
            'descripcion' => 'Parámetros hemodinámicos y electrocardiográficos.',
            'campos' => $campos,
        ];

        $response = $this->actingAs($user)->post('/admin/plantillas-consultas', $payload);
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('plantillas_consultas', [
            'empresa_id' => $empresa->id,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Evaluación Cardiológica Integral',
        ]);

        $plantillaGuardada = PlantillaConsulta::where('empresa_id', $empresa->id)
            ->where('especialidad_id', $especialidad->id)
            ->first();

        $this->assertNotNull($plantillaGuardada);
        $this->assertCount(3, $plantillaGuardada->estructura_json);
        $this->assertEquals('ruidos_cardiacos', $plantillaGuardada->estructura_json[0]['id']);
    }

    public function test_consulta_medica_recibe_e_inyecta_plantilla_de_especialidad_y_guarda_datos_especialidad(): void
    {
        $empresa = Empresa::first();
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo(Permission::all());

        $rama = RamaMedica::create([
            'nombre' => 'Medicina Humana',
            'slug' => 'medicina-humana',
        ]);

        $especialidad = Especialidad::create([
            'rama_medica_id' => $rama->id,
            'nombre' => 'Ginecología y Obstetricia',
            'slug' => 'ginecologia-y-obstetricia',
            'codigo' => 'GIN-OBS',
        ]);

        PlantillaConsulta::create([
            'empresa_id' => $empresa->id,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Control Prenatal y Ginecológico',
            'estructura_json' => [
                ['id' => 'fum', 'label' => 'Fecha de Última Menstruación', 'type' => 'date', 'is_active' => true],
                ['id' => 'fcf', 'label' => 'Frecuencia Cardíaca Fetal', 'type' => 'number', 'unit' => 'bpm', 'is_active' => true],
                ['id' => 'gestas', 'label' => 'Número de Gestas', 'type' => 'number', 'is_active' => true],
            ],
            'es_sistema' => false,
            'status' => true,
        ]);

        $paciente = Paciente::create([
            'empresa_id' => $empresa->id,
            'codigo_paciente' => 'PAC-GIN-01',
            'nombres' => 'María',
            'apellidos' => 'González',
            'tipo_paciente' => 'humano',
        ]);

        $medico = Medico::create([
            'empresa_id' => $empresa->id,
            'codigo_medico' => 'MED-GIN-01',
            'nombres' => 'Carlos',
            'apellidos' => 'Mendoza',
            'color_agenda' => '#ec4899',
        ]);

        $cita = Cita::create([
            'empresa_id' => $empresa->id,
            'paciente_id' => $paciente->id,
            'medico_id' => $medico->id,
            'especialidad_id' => $especialidad->id,
            'fecha_hora_inicio' => now()->toDateTimeString(),
            'fecha_hora_fin' => now()->addMinutes(30)->toDateTimeString(),
            'duracion_minutos' => 30,
            'estado' => 'en_sala_espera',
        ]);

        // 1. Verificar que al abrir la cita para atención se carga la plantilla
        $resAtencion = $this->actingAs($user)->get("/admin/consultas/{$cita->id}/atencion");
        $resAtencion->assertStatus(200);

        // 2. Guardar la consulta médica con los datos específicos de la especialidad
        $datosEspecialidad = [
            'fum' => '2026-06-15',
            'fcf' => 145,
            'gestas' => 2,
        ];

        $payloadConsulta = [
            'motivo_consulta' => 'Control prenatal semana 10',
            'enfermedad_actual' => 'Paciente asintomática con embarazo en curso.',
            'examen_fisico' => 'Abdomen blando, útero grávido acorde a edad gestacional.',
            'presion_arterial' => '110/70',
            'frecuencia_cardiaca' => 78,
            'temperatura' => 36.5,
            'peso_kg' => 62.0,
            'talla_cm' => 165.0,
            'spo2' => 99,
            'conclusion' => 'Embarazo intrauterino normoevolutivo de 10 semanas.',
            'datos_especialidad' => $datosEspecialidad,
            'diagnosticos_cie10_lista' => [
                [
                    'codigo' => 'Z34.0',
                    'nombre' => 'Supervisión de primer embarazo normal',
                    'tipo' => 'principal',
                ],
            ],
        ];

        $resGuardar = $this->actingAs($user)->post("/admin/consultas/{$cita->id}/atencion", $payloadConsulta);
        $resGuardar->assertSessionHasNoErrors();

        // 3. Comprobar que en la base de datos se guardaron los datos_especialidad
        $consultaMedica = ConsultaMedica::where('cita_id', $cita->id)->first();
        $this->assertNotNull($consultaMedica);
        $this->assertIsArray($consultaMedica->datos_especialidad);
        $this->assertEquals('2026-06-15', $consultaMedica->datos_especialidad['fum']);
        $this->assertEquals(145, $consultaMedica->datos_especialidad['fcf']);
        $this->assertEquals(2, $consultaMedica->datos_especialidad['gestas']);
        $this->assertEquals('finalizada', $consultaMedica->estado);

        // 4. Comprobar que la vista de impresión del informe médico renderiza los datos de la especialidad
        $resInforme = $this->actingAs($user)->get("/admin/consultas/{$consultaMedica->id}/imprimir/informe?format=html");
        $resInforme->assertStatus(200);
        $resInforme->assertSee('EVALUACIÓN ESPECIALIZADA');
        $resInforme->assertSee('2026-06-15');
        $resInforme->assertSee('145');
    }

    public function test_usuario_puede_restaurar_plantilla_de_especialidad_a_predeterminado(): void
    {
        $empresa = Empresa::first();
        $user = User::factory()->create(['empresa_id' => $empresa->id]);
        $user->givePermissionTo(Permission::all());

        $rama = RamaMedica::create([
            'nombre' => 'Medicina Humana',
            'slug' => 'medicina-humana',
        ]);

        $especialidad = Especialidad::create([
            'rama_medica_id' => $rama->id,
            'nombre' => 'Oftalmología',
            'slug' => 'oftalmologia',
            'codigo' => 'OFT',
        ]);

        // Plantilla de sistema
        PlantillaConsulta::create([
            'empresa_id' => null,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Consulta Oftalmológica Base',
            'estructura_json' => [['id' => 'agudeza_visual', 'label' => 'Agudeza Visual', 'type' => 'text']],
            'es_sistema' => true,
        ]);

        // Plantilla personalizada por la clínica
        PlantillaConsulta::create([
            'empresa_id' => $empresa->id,
            'especialidad_id' => $especialidad->id,
            'nombre' => 'Oftalmología Clínica Especial',
            'estructura_json' => [['id' => 'pio', 'label' => 'Presión Intraocular', 'type' => 'number']],
            'es_sistema' => false,
        ]);

        // Ejecutar reset
        $response = $this->actingAs($user)->post("/admin/plantillas-consultas/especialidades/{$especialidad->id}/reset");
        $response->assertSessionHas('success');

        // La personalizada debe haberse eliminado, manteniendo la de sistema
        $this->assertDatabaseMissing('plantillas_consultas', [
            'empresa_id' => $empresa->id,
            'especialidad_id' => $especialidad->id,
        ]);

        $this->assertDatabaseHas('plantillas_consultas', [
            'empresa_id' => null,
            'especialidad_id' => $especialidad->id,
            'es_sistema' => true,
        ]);
    }
}
