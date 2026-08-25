<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantillaConsulta extends Model
{
    protected $table = 'plantillas_consultas';

    protected $fillable = [
        'empresa_id',
        'especialidad_id',
        'nombre',
        'descripcion',
        'estructura_json',
        'es_sistema',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'estructura_json' => 'array',
            'es_sistema' => 'boolean',
            'status' => 'boolean',
        ];
    }

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function especialidad(): BelongsTo
    {
        return $this->belongsTo(Especialidad::class, 'especialidad_id');
    }
}
