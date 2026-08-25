import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Stethoscope,
    Plus,
    Trash2,
    Edit2,
    Eye,
    Save,
    RotateCcw,
    Check,
    X,
    Sparkles,
    MoveUp,
    MoveDown,
    Sliders,
    Layers,
    HelpCircle,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { ModuleHeader } from '@/components/module-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notifySuccess, notifyError } from '@/utils/notifications';
import {
    EspecialidadFormRenderer,
    CampoEspecialidad,
    PlantillaEspecialidad,
} from '@/components/admin/consultas/EspecialidadFormRenderer';

interface Especialidad {
    id: number;
    nombre: string;
    slug: string;
    codigo?: string;
    icono?: string;
    color?: string;
    descripcion?: string;
    rama_medica?: {
        nombre: string;
    };
}

interface Props {
    especialidades: Especialidad[];
    plantillasPorEspecialidad: Record<number, PlantillaEspecialidad>;
    selectedEspecialidadId: string;
}

export default function Plantillas({
    especialidades,
    plantillasPorEspecialidad,
    selectedEspecialidadId,
}: Props) {
    const [activeEspecialidadId, setActiveEspecialidadId] = useState<number>(
        Number(selectedEspecialidadId) || (especialidades[0]?.id ?? 0)
    );

    const currentEspecialidad = especialidades.find((e) => e.id === activeEspecialidadId);
    const currentPlantilla = plantillasPorEspecialidad[activeEspecialidadId] || null;

    // Estado local de los campos para edición en tiempo real y vista previa
    const [campos, setCampos] = useState<CampoEspecialidad[]>(
        currentPlantilla?.estructura_json || []
    );
    const [plantillaNombre, setPlantillaNombre] = useState<string>(
        currentPlantilla?.nombre || (currentEspecialidad ? `Consulta de ${currentEspecialidad.nombre}` : 'Consulta')
    );
    const [plantillaDescripcion, setPlantillaDescripcion] = useState<string>(
        currentPlantilla?.descripcion || ''
    );

    // Estado para pruebas en el Live Preview
    const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

    // Modal de Agregar / Editar Campo
    const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

    // Formulario de edición de un campo específico
    const [fieldData, setFieldData] = useState<{
        id: string;
        label: string;
        type: CampoEspecialidad['type'];
        unit: string;
        width: CampoEspecialidad['width'];
        section: string;
        required: boolean;
        is_active: boolean;
        placeholder: string;
        optionsText: string;
    }>({
        id: '',
        label: '',
        type: 'text',
        unit: '',
        width: '1/2',
        section: '',
        required: false,
        is_active: true,
        placeholder: '',
        optionsText: '',
    });

    // Sincronizar cuando cambia la especialidad seleccionada
    const handleSelectEspecialidad = (espId: number) => {
        setActiveEspecialidadId(espId);
        const esp = especialidades.find((e) => e.id === espId);
        const plan = plantillasPorEspecialidad[espId];

        const initialCampos = plan?.estructura_json || [
            {
                id: 'evaluacion_clinica',
                label: 'Evaluación Clínica y Hallazgos',
                type: 'textarea' as const,
                width: 'full' as const,
                required: false,
                is_active: true,
            },
        ];

        setCampos(initialCampos);
        setPlantillaNombre(plan?.nombre || (esp ? `Consulta de ${esp.nombre}` : 'Consulta'));
        setPlantillaDescripcion(plan?.descripcion || '');
        setPreviewValues({});
    };

    // Abrir modal para crear nuevo campo
    const handleOpenCreateField = () => {
        setEditingFieldId(null);
        setFieldData({
            id: `campo_${Date.now()}`,
            label: '',
            type: 'text',
            unit: '',
            width: '1/2',
            section: '',
            required: false,
            is_active: true,
            placeholder: '',
            optionsText: '',
        });
        setIsFieldModalOpen(true);
    };

    // Abrir modal para editar campo existente
    const handleOpenEditField = (campo: CampoEspecialidad) => {
        setEditingFieldId(campo.id);
        setFieldData({
            id: campo.id,
            label: campo.label,
            type: campo.type,
            unit: campo.unit || '',
            width: campo.width || '1/2',
            section: campo.section || '',
            required: Boolean(campo.required),
            is_active: campo.is_active !== false,
            placeholder: campo.placeholder || '',
            optionsText: (campo.options || []).join('\n'),
        });
        setIsFieldModalOpen(true);
    };

    // Guardar campo desde el modal
    const handleSaveFieldModal = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fieldData.label.trim()) {
            notifyError('El nombre o etiqueta del campo es obligatorio.');
            return;
        }

        const optionsArray =
            fieldData.type === 'select' || fieldData.type === 'radio'
                ? fieldData.optionsText
                      .split('\n')
                      .map((o) => o.trim())
                      .filter((o) => o !== '')
                : undefined;

        const newOrUpdatedField: CampoEspecialidad = {
            id: fieldData.id.trim() || `campo_${Date.now()}`,
            label: fieldData.label.trim(),
            type: fieldData.type,
            unit: fieldData.unit.trim() || undefined,
            width: fieldData.width || '1/2',
            section: fieldData.section.trim() || undefined,
            required: fieldData.required,
            is_active: fieldData.is_active,
            placeholder: fieldData.placeholder.trim() || undefined,
            options: optionsArray,
        };

        if (editingFieldId) {
            // Actualizar existente
            setCampos((prev) =>
                prev.map((c) => (c.id === editingFieldId ? newOrUpdatedField : c))
            );
            notifySuccess('Campo actualizado.');
        } else {
            // Agregar nuevo
            setCampos((prev) => [...prev, newOrUpdatedField]);
            notifySuccess('Campo agregado exitosamente.');
        }

        setIsFieldModalOpen(false);
    };

    // Eliminar campo
    const handleDeleteField = (fieldId: string) => {
        setCampos((prev) => prev.filter((c) => c.id !== fieldId));
        notifySuccess('Campo eliminado de la plantilla.');
    };

    // Alternar visibilidad activa/inactiva
    const handleToggleFieldActive = (fieldId: string) => {
        setCampos((prev) =>
            prev.map((c) => (c.id === fieldId ? { ...c, is_active: c.is_active === false ? true : false } : c))
        );
    };

    // Mover campo hacia arriba o abajo
    const handleMoveField = (index: number, direction: 'up' | 'down') => {
        const newCampos = [...campos];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newCampos.length) return;

        const temp = newCampos[index];
        newCampos[index] = newCampos[targetIndex];
        newCampos[targetIndex] = temp;

        setCampos(newCampos);
    };

    // Guardar cambios en el backend
    const [isSaving, setIsSaving] = useState(false);
    const handleSavePlantilla = () => {
        if (!activeEspecialidadId) return;

        setIsSaving(true);
        router.post(
            '/admin/plantillas-consultas',
            {
                especialidad_id: activeEspecialidadId,
                nombre: plantillaNombre,
                descripcion: plantillaDescripcion,
                campos: campos as any,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    notifySuccess('¡Configuración de especialidad guardada con éxito!');
                    setIsSaving(false);
                },
                onError: (errs) => {
                    console.error(errs);
                    notifyError('Hubo un error al guardar la configuración.');
                    setIsSaving(false);
                },
            }
        );
    };

    // Restaurar a predeterminado
    const handleResetDefault = () => {
        if (!activeEspecialidadId) return;
        if (!confirm(`¿Estás seguro de restaurar los campos predeterminados para ${currentEspecialidad?.nombre}?`)) {
            return;
        }

        router.post(
            `/admin/plantillas-consultas/especialidades/${activeEspecialidadId}/reset`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    notifySuccess('Campos restaurados al diseño predeterminado.');
                },
            }
        );
    };

    const previewPlantilla: PlantillaEspecialidad = {
        nombre: plantillaNombre,
        descripcion: plantillaDescripcion,
        estructura_json: campos,
    };

    const breadcrumbs = [
        { title: 'Consultas', href: '/admin/consultas/sala-de-espera' },
        { title: 'Campos por Especialidad', href: '/admin/plantillas-consultas' },
    ];

    return (
        <div className="space-y-6 pb-12">
            <Head title="Campos por Especialidad Médica" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <ModuleHeader
                title="Campos por Especialidad Médica"
                description="Configura qué campos clínicos deben aparecerle al médico cuando atienda a un paciente según su especialidad."
                icon={<Sliders className="h-6 w-6 text-primary" />}
            >
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetDefault}
                        className="text-xs text-muted-foreground hover:text-foreground rounded-xl"
                    >
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                        Restaurar Predeterminados
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSavePlantilla}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm text-xs sm:text-sm rounded-xl"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                </div>
            </ModuleHeader>

                {/* Selector Rápido de Especialidad (Pills / Badges Horizontales) */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Selecciona la Especialidad a Configurar:
                    </Label>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {especialidades.map((esp) => {
                            const isSelected = esp.id === activeEspecialidadId;
                            const hasCustom = plantillasPorEspecialidad[esp.id] && !plantillasPorEspecialidad[esp.id].es_sistema;

                            return (
                                <button
                                    key={esp.id}
                                    type="button"
                                    onClick={() => handleSelectEspecialidad(esp.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        isSelected
                                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-[1.02]'
                                            : 'bg-card border border-border text-foreground hover:bg-muted'
                                    }`}
                                >
                                    <Stethoscope className="h-3.5 w-3.5 opacity-70" />
                                    <span>{esp.nombre}</span>
                                    {hasCustom && (
                                        <Badge
                                            variant="secondary"
                                            className={`text-[10px] px-1 py-0 h-4 ${
                                                isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'
                                            }`}
                                        >
                                            Personalizada
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Panel de Trabajo: Gestor de Campos (Izquierda) + Live Preview (Derecha) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* COLUMNA IZQUIERDA: Gestor de Campos */}
                    <div className="lg:col-span-6 space-y-4">
                        <Card className="border-border shadow-sm">
                            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                                            <span>Campos de {currentEspecialidad?.nombre}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {campos.filter((c) => c.is_active !== false).length} activos
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="text-xs mt-0.5">
                                            Agrega, edita, oculta o reordena los datos clínicos requeridos.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={handleOpenCreateField}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                                    >
                                        <Plus className="h-3.5 w-3.5 mr-1" />
                                        Agregar Campo
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 space-y-3">
                                {campos.length === 0 ? (
                                    <div className="text-center py-10 px-4 border border-dashed rounded-lg border-muted-foreground/30">
                                        <Layers className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                                        <p className="text-sm font-semibold text-foreground">
                                            No hay campos configurados para esta especialidad
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                                            Haz clic en "Agregar Campo" para definir los parámetros médicos de {currentEspecialidad?.nombre}.
                                        </p>
                                        <Button
                                            size="sm"
                                            onClick={handleOpenCreateField}
                                            className="mt-4 text-xs"
                                        >
                                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                                            Agregar Primer Campo
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {campos.map((campo, index) => {
                                            const isActive = campo.is_active !== false;

                                            return (
                                                <div
                                                    key={campo.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                                        isActive
                                                            ? 'bg-card border-border shadow-xs'
                                                            : 'bg-muted/40 border-dashed border-muted-foreground/30 opacity-60'
                                                    }`}
                                                >
                                                    {/* Info del Campo */}
                                                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                                                        <div className="flex flex-col items-center justify-center space-y-0.5">
                                                            <button
                                                                type="button"
                                                                disabled={index === 0}
                                                                onClick={() => handleMoveField(index, 'up')}
                                                                className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition"
                                                            >
                                                                <MoveUp className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={index === campos.length - 1}
                                                                onClick={() => handleMoveField(index, 'down')}
                                                                className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition"
                                                            >
                                                                <MoveDown className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                                                                    {campo.label}
                                                                </span>
                                                                {campo.required && (
                                                                    <Badge variant="destructive" className="text-[9px] px-1 py-0 h-3.5">
                                                                        Obligatorio
                                                                    </Badge>
                                                                )}
                                                                {campo.unit && (
                                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted">
                                                                        {campo.unit}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                                                                <span className="capitalize font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[10px]">
                                                                    {campo.type}
                                                                </span>
                                                                <span>Ancho: {campo.width || '1/2'}</span>
                                                                {campo.section && (
                                                                    <span className="text-primary font-medium">
                                                                        • {campo.section}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Acciones del Campo */}
                                                    <div className="flex items-center space-x-1 shrink-0">
                                                        <div title={isActive ? 'Ocultar campo' : 'Mostrar campo'}>
                                                            <Switch
                                                                checked={isActive}
                                                                onCheckedChange={() => handleToggleFieldActive(campo.id)}
                                                                className="scale-75"
                                                            />
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                            onClick={() => handleOpenEditField(campo)}
                                                            title="Editar configuración del campo"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                            onClick={() => handleDeleteField(campo.id)}
                                                            title="Eliminar campo"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* COLUMNA DERECHA: Live Preview Interactivo */}
                    <div className="lg:col-span-6 space-y-3 sticky top-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Eye className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                                    Vista Previa en Vivo (Live Preview)
                                </h3>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Así lo verá el médico en consulta
                            </span>
                        </div>

                        <div className="rounded-xl border border-primary/20 bg-muted/10 p-1 shadow-inner">
                            <EspecialidadFormRenderer
                                plantilla={previewPlantilla}
                                values={previewValues}
                                onChange={(fieldId, val) =>
                                    setPreviewValues((prev) => ({ ...prev, [fieldId]: val }))
                                }
                            />
                        </div>
                    </div>
                </div>

            {/* MODAL: Agregar / Editar Campo */}
            <Dialog open={isFieldModalOpen} onOpenChange={setIsFieldModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSaveFieldModal}>
                        <DialogHeader>
                            <DialogTitle className="text-base font-bold flex items-center gap-2">
                                <Sliders className="h-4 w-4 text-primary" />
                                {editingFieldId ? 'Editar Campo Clínico' : 'Agregar Nuevo Campo Clínico'}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Configura las propiedades y validaciones para este parámetro de {currentEspecialidad?.nombre}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Etiqueta / Nombre del Campo */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Nombre o Etiqueta del Campo <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    required
                                    placeholder="Ej: Perímetro Cefálico, Presión Intraocular, FUM..."
                                    value={fieldData.label}
                                    onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
                                />
                            </div>

                            {/* Tipo de Campo */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Tipo de Entrada</Label>
                                    <Select
                                        value={fieldData.type}
                                        onValueChange={(val: any) => setFieldData({ ...fieldData, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Texto Corto</SelectItem>
                                            <SelectItem value="number">Numérico</SelectItem>
                                            <SelectItem value="textarea">Área de Texto (Largo)</SelectItem>
                                            <SelectItem value="select">Selector (Desplegable)</SelectItem>
                                            <SelectItem value="date">Fecha (Calendario)</SelectItem>
                                            <SelectItem value="switch">Interruptor (Sí / No)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Unidad de Medida (si es numérico o texto) */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Unidad de Medida (Opcional)</Label>
                                    <Input
                                        placeholder="Ej: cm, mmHg, %, bpm, kg"
                                        value={fieldData.unit}
                                        onChange={(e) => setFieldData({ ...fieldData, unit: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Opciones (si es select) */}
                            {fieldData.type === 'select' && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">
                                        Opciones (una por línea)
                                    </Label>
                                    <Textarea
                                        rows={3}
                                        placeholder="Opción A&#10;Opción B&#10;Opción C"
                                        value={fieldData.optionsText}
                                        onChange={(e) => setFieldData({ ...fieldData, optionsText: e.target.value })}
                                    />
                                </div>
                            )}

                            {/* Sección Agrupadora y Ancho */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Sección o Grupo</Label>
                                    <Input
                                        placeholder="Ej: Antecedentes, Examen Físico..."
                                        value={fieldData.section}
                                        onChange={(e) => setFieldData({ ...fieldData, section: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Ancho en Pantalla</Label>
                                    <Select
                                        value={fieldData.width}
                                        onValueChange={(val: any) => setFieldData({ ...fieldData, width: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1/3">1/3 de Pantalla</SelectItem>
                                            <SelectItem value="1/2">Mitad de Pantalla (1/2)</SelectItem>
                                            <SelectItem value="full">Ancho Completo (100%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Switches de Obligatorio y Activo */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="modal-required"
                                        checked={fieldData.required}
                                        onCheckedChange={(checked) => setFieldData({ ...fieldData, required: checked })}
                                    />
                                    <Label htmlFor="modal-required" className="text-xs font-medium cursor-pointer">
                                        ¿Campo Obligatorio?
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="modal-active"
                                        checked={fieldData.is_active}
                                        onCheckedChange={(checked) => setFieldData({ ...fieldData, is_active: checked })}
                                    />
                                    <Label htmlFor="modal-active" className="text-xs font-medium cursor-pointer">
                                        Activo / Visible
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsFieldModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                                {editingFieldId ? 'Guardar Cambios' : 'Agregar Campo'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
