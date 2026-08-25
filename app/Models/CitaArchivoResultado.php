<?php

namespace App\Models;

use App\Traits\Multitenantable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CitaArchivoResultado extends Model
{
    use HasFactory, Multitenantable;

    protected $table = 'cita_archivos_resultados';

    protected $fillable = [
        'empresa_id',
        'cita_id',
        'nombre_original',
        'archivo_path',
        'tamano_bytes',
        'mime_type',
        'notas',
        'subido_por_user_id',
    ];

    protected $appends = [
        'url_descarga',
        'es_imagen',
        'es_pdf',
        'tamano_formateado',
    ];

    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'cita_id');
    }

    public function subidoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subido_por_user_id');
    }

    public function getUrlDescargaAttribute(): string
    {
        return $this->archivo_path ? Storage::disk('public')->url($this->archivo_path) : '';
    }

    public function getEsImagenAttribute(): bool
    {
        return str_starts_with($this->mime_type ?? '', 'image/');
    }

    public function getEsPdfAttribute(): bool
    {
        return $this->mime_type === 'application/pdf' || str_ends_with(strtolower($this->nombre_original ?? ''), '.pdf');
    }

    public function getTamanoFormateadoAttribute(): string
    {
        if (!$this->tamano_bytes) {
            return 'N/A';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = $this->tamano_bytes;
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
