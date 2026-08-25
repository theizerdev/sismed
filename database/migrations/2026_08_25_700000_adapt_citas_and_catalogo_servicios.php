<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ampliar catálogo de estudios / servicios
        Schema::table('catalogo_estudios', function (Blueprint $table) {
            if (!Schema::hasColumn('catalogo_estudios', 'codigo')) {
                $table->string('codigo', 50)->nullable()->after('tipo_estudio');
            }
            if (!Schema::hasColumn('catalogo_estudios', 'categoria')) {
                $table->string('categoria', 100)->default('Laboratorio Clínico')->after('codigo');
            }
            if (!Schema::hasColumn('catalogo_estudios', 'precio')) {
                $table->decimal('precio', 10, 2)->default(0.00)->after('indicaciones_predeterminadas');
            }
            if (!Schema::hasColumn('catalogo_estudios', 'duracion_minutos')) {
                $table->integer('duracion_minutos')->default(15)->after('precio');
            }
        });

        // 2. Clasificar tipos de atención (médica vs servicio)
        Schema::table('tipos_atencion', function (Blueprint $table) {
            if (!Schema::hasColumn('tipos_atencion', 'categoria')) {
                $table->string('categoria', 50)->default('medica')->after('modalidad');
            }
        });

        // 3. Flexibilizar citas para servicios
        Schema::table('citas', function (Blueprint $table) {
            if (!Schema::hasColumn('citas', 'categoria_cita')) {
                $table->string('categoria_cita', 50)->default('medica')->after('tipo_atencion_id');
            }
            if (!Schema::hasColumn('citas', 'catalogo_estudio_id')) {
                $table->foreignId('catalogo_estudio_id')->nullable()->after('categoria_cita')->constrained('catalogo_estudios')->onDelete('set null');
            }
            if (!Schema::hasColumn('citas', 'estado_servicio')) {
                $table->string('estado_servicio', 50)->default('pendiente_muestra')->after('estado');
            }
        });

        // 4. Tabla de archivos y resultados adjuntos de la cita
        if (!Schema::hasTable('cita_archivos_resultados')) {
            Schema::create('cita_archivos_resultados', function (Blueprint $table) {
                $table->id();
                $table->foreignId('empresa_id')->nullable()->constrained('empresas')->onDelete('cascade');
                $table->foreignId('cita_id')->constrained('citas')->onDelete('cascade');
                $table->string('nombre_original');
                $table->string('archivo_path');
                $table->unsignedBigInteger('tamano_bytes')->nullable();
                $table->string('mime_type', 100)->nullable();
                $table->text('notas')->nullable();
                $table->foreignId('subido_por_user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();

                $table->index(['empresa_id', 'cita_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cita_archivos_resultados');

        Schema::table('citas', function (Blueprint $table) {
            if (Schema::hasColumn('citas', 'catalogo_estudio_id')) {
                $table->dropForeign(['catalogo_estudio_id']);
                $table->dropColumn('catalogo_estudio_id');
            }
            if (Schema::hasColumn('citas', 'categoria_cita')) {
                $table->dropColumn('categoria_cita');
            }
            if (Schema::hasColumn('citas', 'estado_servicio')) {
                $table->dropColumn('estado_servicio');
            }
        });

        Schema::table('tipos_atencion', function (Blueprint $table) {
            if (Schema::hasColumn('tipos_atencion', 'categoria')) {
                $table->dropColumn('categoria');
            }
        });

        Schema::table('catalogo_estudios', function (Blueprint $table) {
            $table->dropColumn(['codigo', 'categoria', 'precio', 'duracion_minutos']);
        });
    }
};
