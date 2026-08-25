import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Sparkles } from 'lucide-react';

export interface CampoEspecialidad {
    id: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'switch' | 'date' | 'grid';
    unit?: string;
    width?: '1/3' | '1/2' | 'full';
    section?: string;
    required?: boolean;
    is_active?: boolean;
    options?: string[];
    placeholder?: string;
    fields?: CampoEspecialidad[]; // Para campos tipo 'grid'
}

export interface PlantillaEspecialidad {
    id?: number;
    nombre?: string;
    descripcion?: string;
    estructura_json?: CampoEspecialidad[];
    es_sistema?: boolean;
}

interface Props {
    plantilla?: PlantillaEspecialidad | null;
    values: Record<string, any>;
    onChange: (fieldId: string, value: any) => void;
    readOnly?: boolean;
}

export const EspecialidadFormRenderer: React.FC<Props> = ({
    plantilla,
    values,
    onChange,
    readOnly = false,
}) => {
    if (!plantilla || !plantilla.estructura_json || plantilla.estructura_json.length === 0) {
        return null;
    }

    const camposActivos = plantilla.estructura_json.filter((c) => c.is_active !== false);

    if (camposActivos.length === 0) {
        return null;
    }

    // Agrupar campos por sección
    const secciones: { [key: string]: CampoEspecialidad[] } = {};
    const sinSeccion: CampoEspecialidad[] = [];

    camposActivos.forEach((campo) => {
        if (campo.section && campo.section.trim() !== '') {
            if (!secciones[campo.section]) {
                secciones[campo.section] = [];
            }
            secciones[campo.section].push(campo);
        } else {
            sinSeccion.push(campo);
        }
    });

    const renderInputControl = (campo: CampoEspecialidad) => {
        const val = values[campo.id] ?? '';

        switch (campo.type) {
            case 'number':
                return (
                    <div className="relative">
                        <Input
                            type="number"
                            step="any"
                            disabled={readOnly}
                            placeholder={campo.placeholder || '0.00'}
                            value={val}
                            onChange={(e) => onChange(campo.id, e.target.value)}
                            className={campo.unit ? 'pr-12' : ''}
                        />
                        {campo.unit && (
                            <span className="absolute right-3 top-2.5 text-xs font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {campo.unit}
                            </span>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <Textarea
                        rows={3}
                        disabled={readOnly}
                        placeholder={campo.placeholder || `Escriba los hallazgos de ${campo.label.toLowerCase()}...`}
                        value={val}
                        onChange={(e) => onChange(campo.id, e.target.value)}
                        className="resize-y"
                    />
                );

            case 'date':
                return (
                    <Input
                        type="date"
                        disabled={readOnly}
                        value={val}
                        onChange={(e) => onChange(campo.id, e.target.value)}
                    />
                );

            case 'select':
                return (
                    <Select
                        disabled={readOnly}
                        value={val ? String(val) : ''}
                        onValueChange={(v) => onChange(campo.id, v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={campo.placeholder || 'Seleccione una opción'} />
                        </SelectTrigger>
                        <SelectContent>
                            {(campo.options || []).map((opt, idx) => (
                                <SelectItem key={idx} value={opt}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'switch':
                return (
                    <div className="flex items-center space-x-3 pt-2">
                        <Switch
                            id={`switch-${campo.id}`}
                            disabled={readOnly}
                            checked={Boolean(val)}
                            onCheckedChange={(checked) => onChange(campo.id, checked)}
                        />
                        <span className="text-sm font-medium text-foreground">
                            {Boolean(val) ? 'Sí / Positivo' : 'No / Negativo'}
                        </span>
                    </div>
                );

            case 'grid':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                        {(campo.fields || []).map((subCampo) => (
                            <div key={subCampo.id} className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground font-medium">
                                    {subCampo.label}
                                </Label>
                                {renderInputControl(subCampo)}
                            </div>
                        ))}
                    </div>
                );

            case 'text':
            default:
                return (
                    <Input
                        type="text"
                        disabled={readOnly}
                        placeholder={campo.placeholder || ''}
                        value={val}
                        onChange={(e) => onChange(campo.id, e.target.value)}
                    />
                );
        }
    };

    const getColSpanClass = (width?: string) => {
        switch (width) {
            case '1/3':
                return 'col-span-12 md:col-span-4';
            case '1/2':
                return 'col-span-12 md:col-span-6';
            case 'full':
            default:
                return 'col-span-12';
        }
    };

    return (
        <Card className="border-primary/20 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4 border-b border-primary/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                                Evaluación Especializada: {plantilla.nombre || 'Consulta'}
                                <Badge variant="secondary" className="text-xs font-normal bg-primary/10 text-primary border-none">
                                    <Sparkles className="h-3 w-3 mr-1" /> Campos Adaptativos
                                </Badge>
                            </CardTitle>
                            {plantilla.descripcion && (
                                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                                    {plantilla.descripcion}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
                {/* Campos sin sección agrupada */}
                {sinSeccion.length > 0 && (
                    <div className="grid grid-cols-12 gap-4">
                        {sinSeccion.map((campo) => (
                            <div key={campo.id} className={getColSpanClass(campo.width)}>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
                                        <span>
                                            {campo.label}
                                            {campo.required && <span className="text-destructive ml-1">*</span>}
                                        </span>
                                    </Label>
                                    {renderInputControl(campo)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Secciones agrupadas */}
                {Object.keys(secciones).map((seccionKey) => (
                    <div key={seccionKey} className="space-y-3 pt-2 first:pt-0">
                        <div className="flex items-center space-x-2 border-b border-border pb-1.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                                {seccionKey}
                            </h4>
                        </div>
                        <div className="grid grid-cols-12 gap-4">
                            {secciones[seccionKey].map((campo) => (
                                <div key={campo.id} className={getColSpanClass(campo.width)}>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
                                            <span>
                                                {campo.label}
                                                {campo.required && <span className="text-destructive ml-1">*</span>}
                                            </span>
                                        </Label>
                                        {renderInputControl(campo)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
