<?php

namespace App\Models;

use App\Traits\Multitenantable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogoEstudio extends Model
{
    use HasFactory, Multitenantable;

    protected $table = 'catalogo_estudios';

    protected $fillable = [
        'empresa_id',
        'especialidad_id',
        'tipo_estudio',
        'codigo',
        'categoria',
        'nombre_estudio',
        'indicaciones_predeterminadas',
        'precio',
        'duracion_minutos',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'precio' => 'decimal:2',
        'duracion_minutos' => 'integer',
    ];

    protected $appends = [
        'precio_formateado',
    ];

    public function getPrecioFormateadoAttribute(): string
    {
        return '$' . number_format((float) ($this->precio ?? 0), 2) . ' USD';
    }

    public function especialidad(): BelongsTo
    {
        return $this->belongsTo(Especialidad::class, 'especialidad_id');
    }
}
