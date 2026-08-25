import React, { useEffect, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    FlaskConical,
    Search,
    Plus,
    Edit2,
    Trash2,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Activity,
    Layers,
    FileText,
    Sparkles,
    MoreVertical,
    ToggleRight,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatCard } from '@/components/stat-card';
import { ModuleHeader } from '@/components/module-header';
import { FilterBar, FilterField } from '@/components/filter-bar';
import { DataTable, type ColumnDef } from '@/components/data-table';
import { useTranslate } from '@/hooks/use-translate';
import { notifySuccess, notifyError } from '@/utils/notifications';
import { cleanParams, cn } from '@/lib/utils';

export interface Servicio {
    id: number;
    codigo?: string;
    categoria: string;
    tipo_estudio?: string;
    nombre_estudio: string;
    indicaciones_predeterminadas?: string;
    precio: number;
    precio_formateado?: string;
    duracion_minutos: number;
    status: boolean;
    especialidad_id?: number;
    especialidad?: {
        id: number;
        nombre: string;
    };
    created_at?: string;
    updated_at?: string;
}

interface Props {
    servicios: any;
    categorias: string[];
    especialidades: { id: number; nombre: string }[];
    stats: {
        total: number;
        activos: number;
        laboratorio: number;
        imagenologia: number;
    };
    filters: {
        search?: string;
        categoria?: string;
        status?: string;
        perPage?: string;
    };
}

const CATEGORIAS_DEFAULT = [
    'Laboratorio Clínico',
    'Imagenología / Radiología',
    'Ecografía / Ultrasonido',
    'Cardiología / Diagnóstico',
    'Procedimientos de Enfermería',
    'Terapia / Rehabilitación',
    'Otro Servicio',
];

export default function Index({
    servicios,
    categorias,
    especialidades,
    stats,
    filters,
}: Props) {
    const { __ } = useTranslate();

    const breadcrumbs = [
        { title: __('Dashboard'), href: '/admin/dashboard' },
        { title: __('Servicios & Laboratorio'), href: '/admin/servicios' },
    ];

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [categoriaFilter, setCategoriaFilter] = useState(filters.categoria || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [perPageFilter, setPerPageFilter] = useState(filters.perPage || '15');
    const [isTableLoading, setIsTableLoading] = useState(false);

    // Modales de Crear / Editar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre_estudio: '',
        codigo: '',
        categoria: 'Laboratorio Clínico',
        tipo_estudio: 'Laboratorio',
        especialidad_id: '',
        precio: '0.00',
        duracion_minutos: 15,
        indicaciones_predeterminadas: '',
        status: true,
    });

    useEffect(() => {
        const unbindStart = router.on('start', () => setIsTableLoading(true));
        const unbindFinish = router.on('finish', () => setIsTableLoading(false));

        return () => {
            unbindStart();
            unbindFinish();
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                window.location.pathname,
                cleanParams({
                    search: searchTerm,
                    categoria: categoriaFilter,
                    status: statusFilter,
                    perPage: perPageFilter,
                }),
                { preserveState: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, categoriaFilter, statusFilter, perPageFilter]);

    const handleOpenCreate = () => {
        setEditingServicio(null);
        reset();
        setData({
            nombre_estudio: '',
            codigo: '',
            categoria: 'Laboratorio Clínico',
            tipo_estudio: 'Laboratorio',
            especialidad_id: '',
            precio: '0.00',
            duracion_minutos: 15,
            indicaciones_predeterminadas: '',
            status: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (servicio: Servicio) => {
        setEditingServicio(servicio);
        setData({
            nombre_estudio: servicio.nombre_estudio,
            codigo: servicio.codigo || '',
            categoria: servicio.categoria,
            tipo_estudio: servicio.tipo_estudio || 'Laboratorio',
            especialidad_id: servicio.especialidad_id ? servicio.especialidad_id.toString() : '',
            precio: servicio.precio.toString(),
            duracion_minutos: servicio.duracion_minutos || 15,
            indicaciones_predeterminadas: servicio.indicaciones_predeterminadas || '',
            status: Boolean(servicio.status),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingServicio) {
            put(`/admin/servicios/${editingServicio.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    notifySuccess(__('Servicio actualizado exitosamente.'));
                },
                onError: () => notifyError(__('Por favor revisa los errores del formulario.')),
            });
        } else {
            post('/admin/servicios', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    notifySuccess(__('Servicio creado exitosamente en el catálogo.'));
                },
                onError: () => notifyError(__('Por favor revisa los errores del formulario.')),
            });
        }
    };

    const handleToggleStatus = (servicio: Servicio) => {
        router.patch(
            `/admin/servicios/${servicio.id}/toggle-status`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => notifySuccess(__('Estado del servicio modificado.')),
            }
        );
    };

    const handleDelete = (servicio: Servicio) => {
        if (confirm(__('¿Estás seguro de eliminar este servicio del catálogo?'))) {
            router.delete(`/admin/servicios/${servicio.id}`, {
                preserveScroll: true,
                onSuccess: () => notifySuccess(__('Servicio eliminado correctamente.')),
            });
        }
    };

    // ── Columnas de la Tabla DataTable ────────────────────────────────────────
    const columns: ColumnDef<Servicio>[] = [
        {
            header: __('Código'),
            accessorKey: 'codigo',
            className: 'w-28 font-mono font-bold text-indigo-600 dark:text-indigo-400',
            cell: (srv) => srv.codigo || '—',
        },
        {
            header: __('Servicio / Estudio'),
            accessorKey: 'nombre_estudio',
            className: 'font-medium min-w-[240px]',
            cell: (srv) => (
                <div className="space-y-0.5">
                    <span className="font-bold text-foreground text-sm block">
                        {srv.nombre_estudio}
                    </span>
                    {srv.indicaciones_predeterminadas && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 truncate max-w-md">
                            ⚠️ {srv.indicaciones_predeterminadas}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: __('Categoría'),
            accessorKey: 'categoria',
            cell: (srv) => (
                <Badge variant="outline" className="font-semibold text-xs py-0.5">
                    {srv.categoria}
                </Badge>
            ),
        },
        {
            header: __('Duración'),
            accessorKey: 'duracion_minutos',
            hideOn: 'mobile',
            cell: (srv) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    <span>{srv.duracion_minutos} min</span>
                </div>
            ),
        },
        {
            header: __('Precio / Tarifa'),
            accessorKey: 'precio',
            cell: (srv) => (
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md">
                    {srv.precio_formateado || `$${Number(srv.precio).toFixed(2)} USD`}
                </span>
            ),
        },
        {
            header: __('Estado'),
            accessorKey: 'status',
            className: 'text-center',
            cell: (srv) => (
                <button
                    type="button"
                    onClick={() => handleToggleStatus(srv)}
                    className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-all',
                        srv.status
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-200'
                    )}
                >
                    {srv.status ? __('Activo') : __('Inactivo')}
                </button>
            ),
        },
        {
            header: '',
            className: 'text-right w-16',
            stopRowClick: true,
            cell: (srv) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(srv)}>
                            <Edit2 className="mr-2 h-4 w-4 text-indigo-600" />
                            {__('Editar Servicio')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(srv)}>
                            <ToggleRight className="mr-2 h-4 w-4 text-amber-600" />
                            {srv.status ? __('Desactivar') : __('Activar')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDelete(srv)}
                            className="text-rose-600 dark:text-rose-400"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {__('Eliminar')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <Head title={__('Catálogo de Servicios & Laboratorio')} />

            <div className="space-y-6">
                {/* ── Breadcrumbs ───────────────────────────────────────────── */}
                <Breadcrumbs breadcrumbs={breadcrumbs} />

                {/* ── Encabezado del Módulo ─────────────────────────────────── */}
                <ModuleHeader
                    icon={<FlaskConical className="h-6 w-6 text-white" />}
                    title={__('Catálogo de Servicios & Laboratorio')}
                    description={__('Administra los exámenes, procedimientos clínicos, pruebas de laboratorio y estudios con sus tarifas e indicaciones previas.')}
                    colorClassName="bg-blue-600"
                >
                    <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        <Plus className="mr-2 h-4 w-4" />
                        {__('Nuevo Servicio / Examen')}
                    </Button>
                </ModuleHeader>

                {/* ── Tarjetas Estadísticas ─────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <StatCard
                        icon={<FlaskConical className="h-6 w-6" />}
                        title={__('TOTAL SERVICIOS')}
                        value={stats.total}
                        colorClassName="bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                    />
                    <StatCard
                        icon={<CheckCircle className="h-6 w-6" />}
                        title={__('SERVICIOS ACTIVOS')}
                        value={stats.activos}
                        colorClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                    />
                    <StatCard
                        icon={<Activity className="h-6 w-6" />}
                        title={__('LABORATORIO CLÍNICO')}
                        value={stats.laboratorio}
                        colorClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                    />
                    <StatCard
                        icon={<Layers className="h-6 w-6" />}
                        title={__('IMAGENOLOGÍA / OTROS')}
                        value={stats.imagenologia}
                        colorClassName="bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"
                    />
                </div>

                {/* ── Filtros y Barra de Búsqueda ───────────────────────────── */}
                <FilterBar>
                    <div className="flex flex-wrap items-end gap-4 w-full">
                        <FilterField label={__('Buscar')} className="flex-1 min-w-[240px]">
                            <Input
                                placeholder={__('Buscar servicio por nombre, código o indicación...')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </FilterField>

                        <FilterField label={__('Categoría')} className="w-full sm:w-60">
                            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={__('Todas las Categorías')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">{__('Todas las Categorías')}</SelectItem>
                                    {CATEGORIAS_DEFAULT.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FilterField>

                        <FilterField label={__('Estado')} className="w-full sm:w-40">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={__('Todos')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">{__('Todos')}</SelectItem>
                                    <SelectItem value="active">{__('Activos')}</SelectItem>
                                    <SelectItem value="inactive">{__('Inactivos')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterField>

                        <FilterField label={__('Por página')} className="w-full sm:w-32">
                            <Select value={perPageFilter} onValueChange={setPerPageFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </FilterField>
                    </div>
                </FilterBar>

                {/* ── Tabla de Datos DataTable ──────────────────────────────── */}
                <div className="w-full">
                    <DataTable
                        columns={columns}
                        data={servicios}
                        loading={isTableLoading}
                    />
                </div>
            </div>

            {/* ── Modal: Crear / Editar Servicio ────────────────────────────── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-full sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-blue-600" />
                            {editingServicio ? __('Editar Servicio / Examen') : __('Registrar Nuevo Servicio')}
                        </DialogTitle>
                        <DialogDescription>
                            {__('Completa la información del estudio, su precio e indicaciones previas.')}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        {/* Nombre del Estudio */}
                        <div className="space-y-1.5">
                            <Label className="font-medium text-sm text-foreground">
                                {__('Nombre del Servicio o Examen *')}
                            </Label>
                            <Input
                                required
                                value={data.nombre_estudio}
                                onChange={(e) => setData('nombre_estudio', e.target.value)}
                                placeholder={__('Ej: Perfil 20 Completo, Radiografía de Tórax, Ecografía Pélvica...')}
                            />
                            {errors.nombre_estudio && <p className="text-xs text-destructive">{errors.nombre_estudio}</p>}
                        </div>

                        {/* Categoría y Código */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="font-medium text-sm text-foreground">{__('Categoría *')}</Label>
                                <Select
                                    value={data.categoria}
                                    onValueChange={(val) => setData('categoria', val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={__('Seleccionar...')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIAS_DEFAULT.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="font-medium text-sm text-foreground">
                                    {__('Código / Identificador')}
                                </Label>
                                <Input
                                    value={data.codigo}
                                    onChange={(e) => setData('codigo', e.target.value)}
                                    placeholder={__('Ej: LAB-001 (Auto si vacío)')}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Precio y Duración */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="font-medium text-sm text-foreground">{__('Tarifa / Precio ($ USD) *')}</Label>
                                <div className="relative">
                                    <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.precio}
                                        onChange={(e) => setData('precio', e.target.value)}
                                        placeholder="0.00"
                                        className="pl-9 font-bold"
                                    />
                                </div>
                                {errors.precio && <p className="text-xs text-destructive">{errors.precio}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="font-medium text-sm text-foreground">{__('Duración Estimada (min)')}</Label>
                                <div className="relative">
                                    <Clock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={data.duracion_minutos}
                                        onChange={(e) => setData('duracion_minutos', parseInt(e.target.value) || 15)}
                                        className="pl-9 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Indicaciones Previas / Preparación */}
                        <div className="space-y-1.5">
                            <Label className="font-medium text-sm text-foreground">
                                {__('Indicaciones de Preparación para el Paciente')}
                            </Label>
                            <Textarea
                                value={data.indicaciones_predeterminadas}
                                onChange={(e) => setData('indicaciones_predeterminadas', e.target.value)}
                                placeholder={__('Ej: Requiere ayuno estricto de 8 a 12 horas. Traer muestra de orina matutina...')}
                                rows={3}
                            />
                        </div>

                        {/* Switch de Estado Activo */}
                        <div className="flex items-center justify-between p-3.5 bg-muted/40 rounded-lg border">
                            <div>
                                <Label className="font-medium text-sm">{__('Servicio Activo en el Catálogo')}</Label>
                                <p className="text-xs text-muted-foreground">{__('Los servicios inactivos no se mostrarán en el agendamiento')}</p>
                            </div>
                            <Switch
                                checked={data.status}
                                onCheckedChange={(val) => setData('status', val)}
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-3 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                {__('Cancelar')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            >
                                {editingServicio ? __('Guardar Cambios') : __('Registrar Servicio')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
