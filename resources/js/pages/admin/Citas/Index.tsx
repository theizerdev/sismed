import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import {
    Calendar as CalendarIcon,
    Clock,
    UserCheck,
    Users,
    Stethoscope,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    AlertCircle,
    Video,
    Send,
    Trash2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Check,
    UserX,
    MapPin,
    DollarSign,
    User,
    PawPrint,
    X,
    ArrowRight,
    PanelLeftClose,
    PanelLeftOpen,
    UserPlus,
    FlaskConical,
    FileText,
    Upload,
    Download,
    Eye,
    Paperclip,
    Sparkles,
    CalendarSync,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select2, Select2Option } from '@/components/ui/select2';
import ModalCrearPacienteRapido from './Partials/ModalCrearPacienteRapido';
import type { PaisPhoneOption } from '../Empresas/Partials/PhoneInputGroup';
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
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/stat-card';
import { ModuleHeader } from '@/components/module-header';
import { notifySuccess, notifyError } from '@/utils/notifications';
import { cleanParams, cn } from '@/lib/utils';

// ── Componente MiniCalendar de Navegación Rápida ─────────────────────────────
interface MiniCalendarProps {
    selectedDate: Date;
    onSelectDate: (d: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onSelectDate }) => {
    const [viewMonthDate, setViewMonthDate] = useState<Date>(new Date(selectedDate));

    useEffect(() => {
        setViewMonthDate(new Date(selectedDate));
    }, [selectedDate]);

    const year = viewMonthDate.getFullYear();
    const month = viewMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Lunes start

    const daysInMonth = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const prevDays = Array.from({ length: startDayOfWeek }, (_, i) => {
        const dayNum = prevMonthLastDay - startDayOfWeek + i + 1;
        return { date: new Date(year, month - 1, dayNum), isCurrentMonth: false };
    });

    const currentDays = Array.from({ length: daysInMonth }, (_, i) => {
        return { date: new Date(year, month, i + 1), isCurrentMonth: true };
    });

    const allCells = [...prevDays, ...currentDays];
    const totalCells = allCells.length;
    const remainingCells = (7 - (totalCells % 7)) % 7;

    for (let i = 1; i <= remainingCells; i++) {
        allCells.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    const weekHeaderDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <div className="bg-card p-3 rounded-2xl border shadow-xs space-y-2 select-none">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-foreground">
                    {monthNames[month]} {year}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => setViewMonthDate(new Date(year, month - 1, 1))}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => setViewMonthDate(new Date(year, month + 1, 1))}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground border-b pb-1">
                {weekHeaderDays.map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {allCells.map((cell, idx) => {
                    const isSelected = cell.date.toDateString() === selectedDate.toDateString();
                    const isToday = cell.date.toDateString() === new Date().toDateString();

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectDate(cell.date)}
                            className={cn(
                                'h-7 w-7 mx-auto rounded-full flex items-center justify-center text-[11px] font-medium transition-all cursor-pointer',
                                !cell.isCurrentMonth && 'text-muted-foreground/30',
                                cell.isCurrentMonth && 'text-foreground hover:bg-muted',
                                isToday && !isSelected && 'border border-primary text-primary font-bold',
                                isSelected && 'bg-primary text-primary-foreground font-bold shadow-xs scale-105'
                            )}
                        >
                            {cell.date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ── Interfaces ───────────────────────────────────────────────────────────────
interface Paciente {
    id: number;
    codigo_paciente: string;
    nombres: string;
    apellidos: string;
    tipo_paciente: 'humano' | 'animal';
    nombre_mascota?: string;
    tutor_nombre?: string;
    telefono?: string;
    tutor_telefono?: string;
    fecha_nacimiento?: string;
    edad?: string;
}

interface Medico {
    id: number;
    codigo_medico: string;
    nombres: string;
    apellidos: string;
    color_agenda: string;
    especialidad_principal_id?: number;
}

interface TipoAtencion {
    id: number;
    nombre: string;
    categoria?: 'medica' | 'servicio';
    duracion_estimada_minutos: number;
    requiere_link_virtual: boolean;
    costo_adicional_sugerido?: number;
    modalidad: string;
}

export interface CatalogoServicioItem {
    id: number;
    codigo?: string;
    categoria: string;
    nombre_estudio: string;
    indicaciones_predeterminadas?: string;
    precio: number;
    duracion_minutos: number;
    status: boolean;
}

export interface CitaArchivoResultado {
    id: number;
    nombre_original: string;
    archivo_path: string;
    url_descarga: string;
    tamano_formateado: string;
    tamano_bytes?: number;
    mime_type?: string;
    es_pdf: boolean;
    es_imagen: boolean;
    notas?: string;
    created_at: string;
    subido_por?: {
        id: number;
        name: string;
    };
}

interface Especialidad {
    id: number;
    nombre: string;
}

interface Sucursal {
    id: number;
    nombre: string;
}

interface Cita {
    id: number;
    codigo_cita: string;
    categoria_cita?: 'medica' | 'servicio';
    catalogo_estudio_id?: number;
    catalogo_estudio?: CatalogoServicioItem;
    estado_servicio?: 'pendiente_muestra' | 'en_proceso' | 'resultados_listos' | 'entregado';
    archivos_resultados?: CitaArchivoResultado[];
    paciente_id: number;
    medico_id?: number;
    especialidad_id?: number;
    tipo_atencion_id?: number;
    sucursal_id?: number;
    fecha_hora_inicio: string;
    fecha_hora_fin: string;
    duracion_minutos: number;
    estado: 'pendiente' | 'confirmada_pagada' | 'en_sala_espera' | 'en_consulta' | 'atendida' | 'cancelada' | 'no_asistio' | 'bloqueado';
    color_estado: string;
    estado_formateado: string;
    estado_pago?: 'pendiente' | 'pagado' | 'parcial' | 'reembolsado';
    estado_pago_formateado?: string;
    monto_pagado?: number;
    motivo_consulta?: string;
    notas_recepcion?: string;
    link_virtual?: string;
    monto_estimado: number;
    recordatorio_whatsapp_enviado: boolean;
    paciente?: Paciente;
    medico?: Medico;
    especialidad?: Especialidad;
    tipoAtencion?: TipoAtencion;
}

interface SlotDisponibilidad {
    inicio: string;
    fin: string;
    hora_inicio_formateada: string;
    hora_fin_formateada: string;
    label: string;
}

interface Props {
    citas: Cita[];
    medicos: Medico[];
    pacientes: Paciente[];
    especialidades: Especialidad[];
    tiposAtencion: TipoAtencion[];
    catalogoServicios?: CatalogoServicioItem[];
    sucursales: Sucursal[];
    paises?: PaisPhoneOption[];
    estadisticas: {
        citas_hoy: number;
        confirmadas: number;
        en_sala_espera: number;
        en_consulta: number;
        atendidas: number;
        canceladas: number;
    };
    filters: any;
}

export default function Index({
    citas,
    medicos,
    pacientes,
    especialidades,
    tiposAtencion,
    catalogoServicios = [],
    sucursales,
    paises = [],
    estadisticas,
    filters,
}: Props) {
    const __ = (key: string) => key;

    // ── Auth & Role Permissions ───────────────────────────────────────────────
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isRecepcionista = Boolean(
        user?.roles?.includes('recepcionista') &&
        !user?.roles?.includes('medico') &&
        !user?.roles?.includes('admin') &&
        !user?.roles?.includes('super-admin')
    );
    const canAtenderConsulta = Boolean(user?.can_atender_consulta) || (
        !isRecepcionista && (
            user?.is_medico ||
            user?.roles?.includes('medico') ||
            user?.permissions?.includes('expedientes.create') ||
            user?.roles?.includes('admin') ||
            user?.roles?.includes('super-admin')
        )
    );

    // ── Local Patients State (for immediate selection upon quick creation) ────
    const [pacientesList, setPacientesList] = useState<Paciente[]>(pacientes);
    const [isQuickCreatePacienteOpen, setIsQuickCreatePacienteOpen] = useState(false);
    const [quickCreateSearchTerm, setQuickCreateSearchTerm] = useState('');

    useEffect(() => {
        setPacientesList(pacientes);
    }, [pacientes]);

    // ── Search & Filter States ────────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [medicoFilter, setMedicoFilter] = useState(filters.medico_id || 'all');
    const [especialidadFilter, setEspecialidadFilter] = useState(filters.especialidad_id || 'all');
    const [tipoAtencionFilter, setTipoAtencionFilter] = useState(filters.tipo_atencion_id || 'all');
    const [estadoFilter, setEstadoFilter] = useState(filters.estado || 'all');
    const [viewMode, setViewMode] = useState<'week' | 'day' | 'month' | 'table'>('week');
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    // ── FullCalendar & Navigation State ───────────────────────────────────────
    const calendarRef = useRef<any>(null);
    const [calendarTitle, setCalendarTitle] = useState('');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    // ── Tooltip Hover State ────────────────────────────────────────────────────
    const [hoveredTooltip, setHoveredTooltip] = useState<{
        x: number;
        y: number;
        cita: Cita;
    } | null>(null);

    const getEdadPaciente = (paciente?: Paciente) => {
        if (!paciente) return 'N/A';
        if (paciente.edad) return paciente.edad;
        if (!paciente.fecha_nacimiento) return 'No especificada';

        const birthDate = new Date(paciente.fecha_nacimiento);
        if (isNaN(birthDate.getTime())) return 'No especificada';

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age >= 1) {
            return `${age} ${age === 1 ? 'año' : 'años'}`;
        }
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        return `${months > 0 ? months : 0} ${months === 1 ? 'mes' : 'meses'}`;
    };

    const handleEventMouseEnter = (info: any) => {
        const rect = info.el.getBoundingClientRect();
        const citaId = Number(info.event.id);
        const foundCita = citas.find((c) => c.id === citaId) || info.event.extendedProps.cita;

        if (foundCita) {
            setHoveredTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top,
                cita: foundCita,
            });
        }
    };

    const handleEventMouseLeave = () => {
        setHoveredTooltip(null);
    };

    // ── Update Calendar Size when Sidebar Toggles ─────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            if (calendarRef.current) {
                calendarRef.current.getApi().updateSize();
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [showSidebar]);

    // ── Mapping & Filtering Events for FullCalendar ──────────────────────────
    const fullCalendarEvents = useMemo(() => {
        let filtered = citas;

        if (medicoFilter !== 'all') {
            filtered = filtered.filter((c) => c.medico_id.toString() === medicoFilter);
        }
        if (especialidadFilter !== 'all') {
            filtered = filtered.filter((c) => c.especialidad_id?.toString() === especialidadFilter);
        }
        if (tipoAtencionFilter !== 'all') {
            filtered = filtered.filter((c) => c.tipo_atencion_id?.toString() === tipoAtencionFilter);
        }
        if (estadoFilter !== 'all') {
            filtered = filtered.filter((c) => c.estado === estadoFilter);
        }
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((c) => {
                const cod = c.codigo_cita?.toLowerCase() || '';
                const pacNom = c.paciente ? `${c.paciente.nombres} ${c.paciente.apellidos} ${c.paciente.nombre_mascota || ''}`.toLowerCase() : '';
                const medNom = c.medico ? `${c.medico.nombres} ${c.medico.apellidos}`.toLowerCase() : '';
                return cod.includes(term) || pacNom.includes(term) || medNom.includes(term);
            });
        }

        return filtered.map((cita) => {
            const nombrePaciente = cita.paciente
                ? (cita.paciente.tipo_paciente === 'animal'
                    ? `🐾 ${cita.paciente.nombre_mascota}`
                    : `👤 ${cita.paciente.nombres} ${cita.paciente.apellidos}`)
                : 'Paciente N/A';

            const nombreMedico = cita.medico
                ? `Dr(a). ${cita.medico.nombres} ${cita.medico.apellidos}`
                : 'Médico N/A';

            return {
                id: cita.id.toString(),
                title: `${nombrePaciente} - ${nombreMedico}`,
                start: cita.fecha_hora_inicio.replace(' ', 'T'),
                end: cita.fecha_hora_fin.replace(' ', 'T'),
                backgroundColor: cita.color_estado || '#3b82f6',
                borderColor: cita.color_estado || '#3b82f6',
                textColor: '#ffffff',
                editable: true,
                extendedProps: {
                    cita,
                    codigo_cita: cita.codigo_cita,
                    estado: cita.estado,
                    estado_formateado: cita.estado_formateado,
                    paciente_nombre: nombrePaciente,
                    medico_nombre: nombreMedico,
                    especialidad_nombre: cita.especialidad?.nombre,
                    categoria_cita: cita.categoria_cita,
                    servicio_nombre: cita.catalogo_estudio?.nombre_estudio,
                    motivo_consulta: cita.motivo_consulta,
                    estado_pago: cita.estado_pago,
                    monto_estimado: cita.monto_estimado,
                    tipo_atencion: cita.tipoAtencion?.nombre || 'Consulta',
                    link_virtual: cita.link_virtual,
                    duracion_minutos: cita.duracion_minutos,
                },
            };
        });
    }, [citas, medicoFilter, especialidadFilter, tipoAtencionFilter, estadoFilter, searchTerm]);

    const handleDatesSet = (dateInfo: any) => {
        setCalendarTitle(dateInfo.view.title);
        setCurrentDate(dateInfo.view.calendar.getDate());
    };

    const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
        if (!calendarRef.current) return;
        const api = calendarRef.current.getApi();
        if (direction === 'today') api.today();
        else if (direction === 'next') api.next();
        else if (direction === 'prev') api.prev();
    };

    const handleViewModeChange = (mode: 'day' | 'week' | 'month' | 'table') => {
        setViewMode(mode);
        if (!calendarRef.current) return;
        const api = calendarRef.current.getApi();
        const map: Record<string, string> = {
            day: 'timeGridDay',
            week: 'timeGridWeek',
            month: 'dayGridMonth',
            table: 'listMonth',
        };
        if (map[mode]) {
            api.changeView(map[mode]);
        }
    };

    const handleMiniCalendarSelect = (d: Date) => {
        setCurrentDate(d);
        if (calendarRef.current) {
            calendarRef.current.getApi().gotoDate(d);
        }
    };

    const handleEventDrop = (info: any) => {
        const citaId = info.event.id;
        const startStr = info.event.startStr;
        const endStr = info.event.endStr || new Date(info.event.start.getTime() + (info.event.extendedProps.duracion_minutos || 30) * 60000).toISOString();

        router.patch(
            `/admin/citas/${citaId}/mover`,
            {
                fecha_hora_inicio: startStr,
                fecha_hora_fin: endStr,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    notifySuccess(__('Cita reprogramada con éxito.'));
                },
                onError: (errs) => {
                    info.revert();
                    notifyError((Object.values(errs)[0] as string) || __('No se pudo reprogramar la cita.'));
                },
            }
        );
    };

    const handleEventResize = (info: any) => {
        const citaId = info.event.id;
        const startStr = info.event.startStr;
        const endStr = info.event.endStr;

        router.patch(
            `/admin/citas/${citaId}/mover`,
            {
                fecha_hora_inicio: startStr,
                fecha_hora_fin: endStr,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    notifySuccess(__('Duración de la cita actualizada con éxito.'));
                },
                onError: (errs) => {
                    info.revert();
                    notifyError((Object.values(errs)[0] as string) || __('No se pudo modificar la duración.'));
                },
            }
        );
    };

    const handleDateSelect = (selectInfo: any) => {
        const startIso = selectInfo.startStr.length > 19 ? selectInfo.startStr.substring(0, 19) : selectInfo.startStr;
        const start = selectInfo.start;
        const end = selectInfo.end;
        const diffMin = Math.round((end.getTime() - start.getTime()) / 60000);

        handleCreateClick(startIso, diffMin > 0 ? diffMin : 30);
    };

    const handleDateClick = (arg: any) => {
        const startIso = arg.dateStr.includes('T') ? arg.dateStr.substring(0, 19) : `${arg.dateStr}T09:00:00`;
        handleCreateClick(startIso, 30);
    };

    const handleEventClick = (clickInfo: any) => {
        const citaId = Number(clickInfo.event.id);
        const foundCita = citas.find((c) => c.id === citaId) || clickInfo.event.extendedProps.cita;
        if (foundCita) {
            setSelectedCita(foundCita);
            setIsDetailModalOpen(true);
        }
    };

    const renderEventContent = (eventInfo: any) => {
        const props = eventInfo.event.extendedProps;
        const isList = eventInfo.view.type.startsWith('list');
        const isMonth = eventInfo.view.type.includes('Month') || eventInfo.view.type.includes('dayGrid');
        const bgColor = eventInfo.event.backgroundColor || '#3b82f6';
        const duracion = props.duracion_minutos || 30;

        if (isList) {
            return (
                <div className="flex items-center gap-2 py-0.5 w-full">
                    <span className="font-bold text-xs text-foreground">{eventInfo.timeText}</span>
                    <span className="font-semibold text-xs text-foreground">{props.paciente_nombre}</span>
                    <span className="text-[11px] text-muted-foreground">({props.medico_nombre})</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold text-white shadow-xs" style={{ backgroundColor: bgColor }}>
                        {props.estado_formateado}
                    </span>
                </div>
            );
        }

        // Vista Mes o citas cortas (<= 30 min)
        if (isMonth || duracion <= 30) {
            return (
                <div
                    className="px-2 py-1 w-full h-full text-white font-medium text-xs overflow-hidden flex items-center justify-between gap-1.5 rounded-lg shadow-xs transition-all hover:brightness-110 leading-tight"
                    style={{ backgroundColor: bgColor }}
                >
                    <span className="font-bold text-xs truncate text-white">
                        {props.paciente_nombre}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-mono shrink-0 font-bold bg-black/30 text-white px-1.5 py-0.5 rounded">
                        <span>{eventInfo.timeText}</span>
                        {props.link_virtual && <Video className="h-3 w-3 text-blue-200" />}
                    </div>
                </div>
            );
        }

        // Vista Expandida para citas mayores a 30 min (> 30 min)
        return (
            <div
                className="p-2 w-full h-full text-white font-medium text-xs overflow-hidden flex flex-col justify-between rounded-lg shadow-xs transition-all hover:brightness-110 leading-tight gap-1"
                style={{ backgroundColor: bgColor }}
            >
                {/* Fila Superior: Paciente y Horario */}
                <div className="flex items-center justify-between gap-1.5">
                    <span className="font-extrabold text-xs truncate text-white">
                        {props.paciente_nombre}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-mono shrink-0 font-bold bg-black/30 text-white px-1.5 py-0.5 rounded shadow-2xs">
                        <span>{eventInfo.timeText}</span>
                        <span className="opacity-85">({duracion}m)</span>
                        {props.link_virtual && <Video className="h-3 w-3 text-blue-200" />}
                    </div>
                </div>

                {/* Fila Media: Profesional / Estudio Asignado */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/95 truncate">
                    {props.categoria_cita === 'servicio' ? (
                        <>
                            <FlaskConical className="size-3 shrink-0 opacity-80" />
                            <span className="truncate">{props.servicio_nombre || props.motivo_consulta || __('Servicio de Laboratorio')}</span>
                        </>
                    ) : (
                        <>
                            <Stethoscope className="size-3 shrink-0 opacity-80" />
                            <span className="truncate">{props.medico_nombre} {props.especialidad_nombre ? `• ${props.especialidad_nombre}` : ''}</span>
                        </>
                    )}
                </div>

                {/* Fila Inferior: Motivo y Estado de Pago */}
                <div className="flex items-center justify-between gap-1 pt-0.5 border-t border-white/20 text-[10px]">
                    <span className="truncate opacity-90 font-medium">
                        {props.motivo_consulta ? props.motivo_consulta : (props.tipo_atencion || __('Consulta'))}
                    </span>
                    <span className={cn(
                        "px-1.5 py-0.5 rounded font-extrabold shrink-0 text-[9px] uppercase tracking-wider",
                        props.estado_pago === 'pagado' ? "bg-emerald-950/40 text-emerald-100" : "bg-black/30 text-amber-100"
                    )}>
                        {props.estado_pago === 'pagado' ? __('💵 Pagada') : __('⏳ Pend. Pago')}
                    </span>
                </div>
            </div>
        );
    };

    // ── Modal States ──────────────────────────────────────────────────────────
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
    const [editingCita, setEditingCita] = useState<Cita | null>(null);

    // ── Real-time Slots State ──────────────────────────────────────────────────
    const [availableSlots, setAvailableSlots] = useState<SlotDisponibilidad[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [selectedSlotInicio, setSelectedSlotInicio] = useState<string>('');
    const [motivoCancelacion, setMotivoCancelacion] = useState('');

    // ── Form State ────────────────────────────────────────────────────────────
    const { data, setData, post, put, processing, errors, reset } = useForm({
        categoria_cita: 'medica' as 'medica' | 'servicio',
        catalogo_estudio_id: '',
        paciente_id: '',
        medico_id: '',
        especialidad_id: '',
        tipo_atencion_id: '',
        sucursal_id: '',
        fecha_reserva: new Date().toISOString().substring(0, 10),
        hora_inicio: '',
        hora_fin: '',
        fecha_hora_inicio: '',
        fecha_hora_fin: '',
        duracion_minutos: 30,
        motivo_consulta: '',
        notas_recepcion: '',
        monto_estimado: '',
    });

    // ── Select2 Mapped Options ────────────────────────────────────────────────
    const pacienteSelectOptions: Select2Option[] = useMemo(() => {
        return pacientesList.map((p) => ({
            value: p.id.toString(),
            label: p.tipo_paciente === 'animal' ? `🐾 ${p.nombre_mascota}` : `${p.nombres} ${p.apellidos}`,
            sublabel: p.tipo_paciente === 'animal' ? `Tutor: ${p.tutor_nombre}` : `Código: ${p.codigo_paciente} ${p.telefono ? '• Tel: ' + p.telefono : ''}`,
            badge: p.codigo_paciente,
            icon: p.tipo_paciente === 'animal' ? <PawPrint className="h-4 w-4 text-emerald-500" /> : <User className="h-4 w-4 text-blue-500" />,
        }));
    }, [pacientesList]);

    const medicoSelectOptions: Select2Option[] = useMemo(() => {
        return medicos.map((m) => {
            const esp = especialidades.find((e) => e.id === m.especialidad_principal_id);
            return {
                value: m.id.toString(),
                label: `Dr(a). ${m.nombres} ${m.apellidos}`,
                sublabel: esp ? esp.nombre : 'Médico General',
                badge: m.codigo_medico,
                color: m.color_agenda || '#3b82f6',
            };
        });
    }, [medicos, especialidades]);

    const tecnicoResponsableSelectOptions: Select2Option[] = useMemo(() => {
        return [
            {
                value: '',
                label: __('Sin personal asignado (Atención por orden de llegada)'),
                sublabel: __('Cualquier técnico o enfermero de guardia'),
                icon: <Users className="h-4 w-4 text-muted-foreground" />,
            },
            ...medicoSelectOptions,
        ];
    }, [medicoSelectOptions]);

    const tipoAtencionSelectOptions: Select2Option[] = useMemo(() => {
        return tiposAtencion.map((t) => ({
            value: t.id.toString(),
            label: t.nombre,
            sublabel: `Duración: ${t.duracion_estimada_minutos} min • ${t.modalidad || 'Presencial'}`,
            badge: t.costo_adicional_sugerido ? `$${t.costo_adicional_sugerido}` : `${t.duracion_estimada_minutos}m`,
            icon: t.requiere_link_virtual ? <Video className="h-4 w-4 text-blue-500" /> : <Stethoscope className="h-4 w-4 text-emerald-500" />,
        }));
    }, [tiposAtencion]);

    const catalogoServicioSelectOptions: Select2Option[] = useMemo(() => {
        return catalogoServicios.map((s) => ({
            value: s.id.toString(),
            label: s.nombre_estudio,
            sublabel: `${s.categoria} • $${Number(s.precio || 0).toFixed(2)} USD • ${s.duracion_minutos || 15} min`,
            badge: s.codigo || `SRV-${s.id}`,
            icon: <FlaskConical className="h-4 w-4 text-blue-500" />,
        }));
    }, [catalogoServicios]);

    const especialidadSelectOptions: Select2Option[] = useMemo(() => {
        return especialidades.map((e) => ({
            value: e.id.toString(),
            label: e.nombre,
            icon: <Stethoscope className="h-4 w-4 text-primary" />,
        }));
    }, [especialidades]);

    const medicoFilterOptions: Select2Option[] = useMemo(() => [
        { value: 'all', label: __('Todos los Médicos'), icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        ...medicoSelectOptions,
    ], [medicoSelectOptions]);

    // ── Debounced Filtering ───────────────────────────────────────────────────
    const isFirstRender = useRef(true);
    const prevFiltersRef = useRef({ searchTerm, medicoFilter, especialidadFilter, tipoAtencionFilter, estadoFilter });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const prev = prevFiltersRef.current;
        const hasChanged =
            prev.searchTerm !== searchTerm ||
            prev.medicoFilter !== medicoFilter ||
            prev.especialidadFilter !== especialidadFilter ||
            prev.tipoAtencionFilter !== tipoAtencionFilter ||
            prev.estadoFilter !== estadoFilter;

        if (!hasChanged) return;
        prevFiltersRef.current = { searchTerm, medicoFilter, especialidadFilter, tipoAtencionFilter, estadoFilter };

        const timer = setTimeout(() => {
            router.get(
                window.location.pathname,
                cleanParams({
                    search: searchTerm,
                    medico_id: medicoFilter,
                    especialidad_id: especialidadFilter,
                    tipo_atencion_id: tipoAtencionFilter,
                    estado: estadoFilter,
                }),
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, medicoFilter, especialidadFilter, tipoAtencionFilter, estadoFilter]);

    // ── Real-Time Slots Loader ────────────────────────────────────────────────
    const fetchAvailableSlots = async (medicoId: string, fechaStr: string, duracion: number) => {
        if (!medicoId || !fechaStr) {
            setAvailableSlots([]);
            return;
        }
        setIsLoadingSlots(true);
        try {
            const response = await fetch(`/admin/citas/slots?medico_id=${medicoId}&fecha=${fechaStr}&duracion_minutos=${duracion}`, {
                headers: { Accept: 'application/json' },
            });
            const result = await response.json();
            setAvailableSlots(result.slots || []);
        } catch (err) {
            console.error('Error fetching slots:', err);
            setAvailableSlots([]);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    useEffect(() => {
        if (data.medico_id && data.fecha_reserva) {
            fetchAvailableSlots(data.medico_id, data.fecha_reserva, data.duracion_minutos);
        }
    }, [data.medico_id, data.fecha_reserva, data.duracion_minutos]);

    const filteredMedicoSelectOptions = useMemo(() => {
        if (!data.especialidad_id || data.especialidad_id === 'all') {
            return medicoSelectOptions;
        }
        return medicoSelectOptions.filter((m) => {
            const doc = medicos.find((docObj) => docObj.id.toString() === m.value);
            return doc?.especialidad_principal_id?.toString() === data.especialidad_id;
        });
    }, [medicoSelectOptions, medicos, data.especialidad_id]);

    const handleEspecialidadChange = (especialidadId: string) => {
        setData((prev) => ({
            ...prev,
            especialidad_id: especialidadId,
            medico_id: '',
            fecha_hora_inicio: '',
        }));
        setSelectedSlotInicio('');
    };

    // ── Time Helpers ─────────────────────────────────────────────────────────
    const addMinutesToTime = (timeStr: string, minutes: number): string => {
        if (!timeStr || !timeStr.includes(':')) return '';
        const [h, m] = timeStr.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) return '';
        const date = new Date(2000, 0, 1, h, m);
        date.setMinutes(date.getMinutes() + minutes);
        const rh = date.getHours().toString().padStart(2, '0');
        const rm = date.getMinutes().toString().padStart(2, '0');
        return `${rh}:${rm}`;
    };

    const getDiffMinutes = (startStr: string, endStr: string): number => {
        if (!startStr || !endStr || !startStr.includes(':') || !endStr.includes(':')) return 30;
        const [sh, sm] = startStr.split(':').map(Number);
        const [eh, em] = endStr.split(':').map(Number);
        if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 30;
        const sDate = new Date(2000, 0, 1, sh, sm);
        const eDate = new Date(2000, 0, 1, eh, em);
        const diff = Math.round((eDate.getTime() - sDate.getTime()) / 60000);
        return diff > 0 ? diff : 30;
    };

    const handleFechaReservaChange = (fecha: string) => {
        setData((prev) => ({
            ...prev,
            fecha_reserva: fecha,
            fecha_hora_inicio: prev.hora_inicio ? `${fecha}T${prev.hora_inicio}:00` : '',
            fecha_hora_fin: prev.hora_fin ? `${fecha}T${prev.hora_fin}:00` : '',
        }));
    };

    const handleHoraInicioChange = (hora: string) => {
        const hFin = hora ? addMinutesToTime(hora, data.duracion_minutos || 30) : '';
        setData((prev) => ({
            ...prev,
            hora_inicio: hora,
            hora_fin: hFin || prev.hora_fin,
            fecha_hora_inicio: hora ? `${prev.fecha_reserva}T${hora}:00` : '',
            fecha_hora_fin: hFin ? `${prev.fecha_reserva}T${hFin}:00` : prev.fecha_hora_fin,
        }));
        setSelectedSlotInicio(hora ? `${data.fecha_reserva}T${hora}:00` : '');
    };

    const handleHoraFinChange = (hora: string) => {
        const diff = data.hora_inicio ? getDiffMinutes(data.hora_inicio, hora) : (data.duracion_minutos || 30);
        setData((prev) => ({
            ...prev,
            hora_fin: hora,
            duracion_minutos: diff,
            fecha_hora_fin: hora ? `${prev.fecha_reserva}T${hora}:00` : '',
        }));
    };

    const handleDuracionManualChange = (minutos: number) => {
        const safeMin = Math.max(5, minutos);
        const hFin = data.hora_inicio ? addMinutesToTime(data.hora_inicio, safeMin) : data.hora_fin;
        setData((prev) => ({
            ...prev,
            duracion_minutos: safeMin,
            hora_fin: hFin,
            fecha_hora_fin: hFin ? `${prev.fecha_reserva}T${hFin}:00` : prev.fecha_hora_fin,
        }));
    };

    const handleSelectSlot = (slot: SlotDisponibilidad) => {
        const hIni = slot.inicio.includes('T') ? slot.inicio.substring(11, 16) : '';
        const hFin = slot.fin.includes('T') ? slot.fin.substring(11, 16) : '';
        const diff = getDiffMinutes(hIni, hFin);
        setSelectedSlotInicio(slot.inicio);
        setData((prev) => ({
            ...prev,
            hora_inicio: hIni,
            hora_fin: hFin,
            fecha_hora_inicio: slot.inicio,
            fecha_hora_fin: slot.fin,
            duracion_minutos: diff,
        }));
    };

    const handleDoctorChange = (medicoId: string) => {
        const doc = medicos.find((m) => m.id.toString() === medicoId);
        setData((prev) => ({
            ...prev,
            medico_id: medicoId,
            especialidad_id: doc?.especialidad_principal_id ? doc.especialidad_principal_id.toString() : prev.especialidad_id,
        }));
    };

    const handleCareTypeChange = (tipoId: string) => {
        const tipo = tiposAtencion.find((t) => t.id.toString() === tipoId);
        const duracion = tipo?.duracion_estimada_minutos || 30;
        const costo = tipo?.costo_adicional_sugerido ? tipo.costo_adicional_sugerido.toString() : '';
        const hFin = data.hora_inicio ? addMinutesToTime(data.hora_inicio, duracion) : data.hora_fin;

        setData((prev) => ({
            ...prev,
            tipo_atencion_id: tipoId,
            duracion_minutos: duracion,
            monto_estimado: costo,
            hora_fin: hFin,
            fecha_hora_fin: hFin ? `${prev.fecha_reserva}T${hFin}:00` : prev.fecha_hora_fin,
        }));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setMedicoFilter('all');
        setEspecialidadFilter('all');
        setTipoAtencionFilter('all');
        setEstadoFilter('all');
    };

    // ── Handlers ─────────────────────────────────────────────────────────────
    // ── File Upload State for Results ─────────────────────────────────────────
    const [uploadingFile, setUploadingFile] = useState<File | null>(null);
    const [uploadNotas, setUploadNotas] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleCreateClick = (slotTime?: string, duracionMin: number = 30) => {
        setEditingCita(null);
        reset();
        const defaultTipo = tiposAtencion[0]?.id.toString() || '';

        const initialFecha = slotTime
            ? slotTime.substring(0, 10)
            : currentDate.toISOString().substring(0, 10);

        const initialHoraInicio = slotTime && slotTime.includes('T') ? slotTime.substring(11, 16) : '';
        const initialHoraFin = initialHoraInicio ? addMinutesToTime(initialHoraInicio, duracionMin) : '';
        const initialFechaFin = initialHoraFin ? `${initialFecha}T${initialHoraFin}:00` : '';

        setData({
            categoria_cita: 'medica',
            catalogo_estudio_id: '',
            paciente_id: '',
            medico_id: '',
            especialidad_id: '',
            tipo_atencion_id: defaultTipo,
            sucursal_id: sucursales[0]?.id.toString() || '',
            fecha_reserva: initialFecha,
            hora_inicio: initialHoraInicio,
            hora_fin: initialHoraFin,
            fecha_hora_inicio: slotTime || '',
            fecha_hora_fin: initialFechaFin,
            duracion_minutos: duracionMin || tiposAtencion[0]?.duracion_estimada_minutos || 30,
            motivo_consulta: '',
            notas_recepcion: '',
            monto_estimado: tiposAtencion[0]?.costo_adicional_sugerido?.toString() || '50',
        });
        setSelectedSlotInicio(slotTime || '');
        setIsCreateModalOpen(true);
    };

    const handleOpenReagendar = (cita: Cita) => {
        setIsDetailModalOpen(false);
        setEditingCita(cita);

        const fecha = cita.fecha_hora_inicio.substring(0, 10);
        const hIni = cita.fecha_hora_inicio.includes('T') ? cita.fecha_hora_inicio.substring(11, 16) : cita.fecha_hora_inicio.substring(11, 16);
        const hFin = cita.fecha_hora_fin && cita.fecha_hora_fin.includes('T') ? cita.fecha_hora_fin.substring(11, 16) : addMinutesToTime(hIni, cita.duracion_minutos || 30);
        const fechaFin = cita.fecha_hora_fin || `${fecha}T${hFin}:00`;

        setData({
            categoria_cita: cita.categoria_cita || 'medica',
            catalogo_estudio_id: cita.catalogo_estudio_id?.toString() || '',
            paciente_id: cita.paciente_id?.toString() || '',
            medico_id: cita.medico_id?.toString() || '',
            especialidad_id: cita.especialidad_id?.toString() || '',
            tipo_atencion_id: cita.tipo_atencion_id?.toString() || '',
            sucursal_id: cita.sucursal_id?.toString() || '',
            fecha_reserva: fecha,
            hora_inicio: hIni,
            hora_fin: hFin,
            fecha_hora_inicio: cita.fecha_hora_inicio,
            fecha_hora_fin: fechaFin,
            duracion_minutos: cita.duracion_minutos || 30,
            motivo_consulta: cita.motivo_consulta || '',
            notas_recepcion: cita.notas_recepcion || '',
            monto_estimado: cita.monto_estimado?.toString() || '',
        });

        setSelectedSlotInicio(cita.fecha_hora_inicio);
        setIsCreateModalOpen(true);
    };

    const handleServiceSelect = (servicioId: string) => {
        const srv = catalogoServicios.find((s) => s.id.toString() === servicioId);
        if (srv) {
            setData((prev) => ({
                ...prev,
                catalogo_estudio_id: servicioId,
                monto_estimado: srv.precio.toString(),
                duracion_minutos: srv.duracion_minutos || 15,
                motivo_consulta: srv.nombre_estudio,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                catalogo_estudio_id: '',
            }));
        }
    };

    const handleUploadFile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCita || !uploadingFile) {
            notifyError(__('Por favor selecciona un archivo PDF o Imagen.'));
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('archivo', uploadingFile);
        if (uploadNotas) formData.append('notas', uploadNotas);

        try {
            const token = (document.querySelector('meta[name="csrf-token"]') as any)?.content || '';
            const res = await fetch(`/admin/citas/${selectedCita.id}/resultados`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    Accept: 'application/json',
                },
                body: formData,
            });
            const resData = await res.json();
            if (resData.success) {
                notifySuccess(__('Resultado subido correctamente.'));
                setUploadingFile(null);
                setUploadNotas('');
                router.reload({ preserveScroll: true });
            } else {
                notifyError(resData.message || __('Error al subir el archivo.'));
            }
        } catch (err) {
            notifyError(__('Ocurrió un error al subir el resultado.'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteResultado = (archivoId: number) => {
        if (confirm(__('¿Estás seguro de eliminar este resultado adjunto?'))) {
            router.delete(`/admin/citas/resultados/${archivoId}`, {
                preserveScroll: true,
                onSuccess: () => notifySuccess(__('Archivo eliminado.')),
            });
        }
    };

    const handleUpdateEstadoServicio = (cita: Cita, nuevoEstado: string) => {
        router.patch(
            `/admin/citas/${cita.id}/estado-servicio`,
            { estado_servicio: nuevoEstado },
            {
                preserveScroll: true,
                onSuccess: () => notifySuccess(__('Estado del servicio actualizado.')),
            }
        );
    };

    const handleSendResultadosWhatsApp = (cita: Cita) => {
        router.post(
            `/admin/citas/${cita.id}/send-whatsapp-resultados`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => notifySuccess(__('Resultados enviados por WhatsApp al paciente.')),
                onError: (errs) => notifyError((Object.values(errs)[0] as string) || __('No se pudieron enviar los resultados.')),
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.fecha_hora_inicio) {
            notifyError(__('Por favor selecciona un turno/horario disponible.'));
            return;
        }

        if (editingCita) {
            put(`/admin/citas/${editingCita.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    notifySuccess(__('Cita médica actualizada correctamente.'));
                },
                onError: (errs) => notifyError((Object.values(errs)[0] as string) || __('Por favor revisa los campos.')),
            });
        } else {
            post('/admin/citas', {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    notifySuccess(__('Cita registrada con éxito.'));
                },
                onError: (errs) => notifyError((Object.values(errs)[0] as string) || __('Por favor revisa los campos.')),
            });
        }
    };

    // Sincronizar selectedCita cuando cambia la lista de citas sin cerrar el modal
    useEffect(() => {
        if (selectedCita) {
            const updated = citas.find((c) => c.id === selectedCita.id);
            if (updated) {
                setSelectedCita(updated);
            }
        }
    }, [citas]);

    const handleQuickStateChange = (cita: Cita, nuevoEstado: string) => {
        if (nuevoEstado === 'cancelada') {
            setSelectedCita(cita);
            setMotivoCancelacion('');
            setIsCancelModalOpen(true);
            return;
        }

        // Actualización optimista de estado local para respuesta UI instantánea
        const estadoFormateadoMap: Record<string, string> = {
            pendiente: 'Pendiente',
            confirmada: 'Confirmada',
            confirmada_pagada: 'Confirmada',
            en_sala_espera: 'En Sala de Espera',
            en_consulta: 'En Consultorio',
            atendida: 'Atendida',
            cancelada: 'Cancelada',
            no_asistio: 'No Asistió',
        };

        setSelectedCita((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                estado: nuevoEstado as any,
                estado_formateado: estadoFormateadoMap[nuevoEstado] || nuevoEstado,
            };
        });

        router.patch(
            `/admin/citas/${cita.id}/estado`,
            { estado: nuevoEstado },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    notifySuccess(__('Estado de la cita actualizado a: ') + (estadoFormateadoMap[nuevoEstado] || nuevoEstado));
                },
                onError: () => {
                    notifyError(__('No se pudo actualizar el estado de la cita.'));
                },
            }
        );
    };

    const handleTogglePago = (cita: Cita, nuevoEstadoPago: 'pagado' | 'pendiente') => {
        setSelectedCita((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                estado_pago: nuevoEstadoPago,
                monto_pagado: nuevoEstadoPago === 'pagado' ? prev.monto_estimado : 0,
            };
        });

        router.patch(
            `/admin/citas/${cita.id}/pago`,
            { estado_pago: nuevoEstadoPago },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    notifySuccess(
                        nuevoEstadoPago === 'pagado'
                            ? __('Consulta marcada como Pagada en Caja.')
                            : __('Estado cambiado a Pago Pendiente.')
                    );
                },
                onError: () => {
                    notifyError(__('No se pudo actualizar el estado de pago.'));
                },
            }
        );
    };

    const handleConfirmCancel = () => {
        if (!selectedCita) return;
        if (!motivoCancelacion.trim()) {
            notifyError(__('Ingresa un motivo de cancelación.'));
            return;
        }

        setSelectedCita((prev) => (prev ? { ...prev, estado: 'cancelada', estado_formateado: 'Cancelada' } : null));

        router.patch(
            `/admin/citas/${selectedCita.id}/estado`,
            { estado: 'cancelada', motivo_cancelacion: motivoCancelacion },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsCancelModalOpen(false);
                    notifySuccess(__('Cita cancelada correctamente.'));
                },
                onError: (errs) => notifyError((Object.values(errs)[0] as string) || __('No se pudo cancelar.')),
            }
        );
    };

    const handleSendWhatsApp = (cita: Cita) => {
        router.post(`/admin/citas/${cita.id}/send-whatsapp-reminder`, {}, { preserveScroll: true });
    };

    const handleDeleteCita = (cita: Cita) => {
        if (confirm(__('¿Estás seguro de eliminar esta cita?'))) {
            router.delete(`/admin/citas/${cita.id}`, {
                preserveScroll: true,
                onSuccess: () => setIsDetailModalOpen(false),
            });
        }
    };

    // Helper estado badge
    const getBadgeVariant = (estado: string) => {
        switch (estado) {
            case 'confirmada_pagada':
                return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
            case 'pendiente':
                return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
            case 'en_sala_espera':
                return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
            case 'en_consulta':
                return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
            case 'atendida':
                return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30';
            case 'cancelada':
                return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30';
            default:
                return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30';
        }
    };

    // ── Native Weekly Date Range Helpers ─────────────────────────────────────
    const getStartOfWeek = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Lunes start
        return new Date(date.setDate(diff));
    };

    const getWeekDays = (start: Date) => {
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            return day;
        });
    };

    const formatLocalDate = (d: Date | string) => {
        if (!d) return '';
        const dateObj = typeof d === 'string' ? new Date(d.replace(' ', 'T')) : d;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = getWeekDays(startOfWeek);

    const navigateDate = (direction: 'prev' | 'next' | 'today') => {
        if (direction === 'today') {
            setCurrentDate(new Date());
            return;
        }

        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        } else {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const hoursRange = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 AM to 6:00 PM

    return (
        <div className="space-y-6">
            {/* Estructura Principal (Sidebar Filtros + Calendario Completo Toggleable) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Columna Izquierda: Panel Lateral de Filtros & Mini Calendario (Ocultable con Efecto) */}
                {showSidebar && (
                    <div className="lg:col-span-3 space-y-4 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-left-4">
                        <div className="p-4 bg-card rounded-2xl border shadow-xs space-y-4">
                            <Button
                                onClick={() => handleCreateClick()}
                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-11 font-bold shadow-md"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {__('Nueva Cita')}
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="w-full rounded-xl text-xs text-muted-foreground h-9"
                            >
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                {__('Limpiar Filtros')}
                            </Button>

                            <div className="space-y-3 pt-2 border-t">
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase">{__('Médico')}</Label>
                                    <Select2
                                        options={medicoFilterOptions}
                                        value={medicoFilter}
                                        onChange={setMedicoFilter}
                                        placeholder={__('Todos los médicos')}
                                        size="sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase">{__('Paciente')}</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            placeholder={__('Buscar paciente...')}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 h-9 rounded-xl text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mini Calendario Interactivo */}
                            <div className="pt-2">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">{__('Navegación por Fecha')}</Label>
                                <MiniCalendar
                                    selectedDate={currentDate}
                                    onSelectDate={handleMiniCalendarSelect}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Columna Derecha: Calendario Principal FullCalendar (Ocupa 12 columnas cuando el panel se oculta) */}
                <div className={cn("space-y-4 transition-all duration-300", showSidebar ? "lg:col-span-9" : "lg:col-span-12")}>
                    {/* Barra Superior del Calendario */}
                    <div className="p-3 bg-card rounded-2xl border shadow-xs flex flex-wrap items-center justify-between gap-4">
                        {/* Controles de Navegación + Toggle Panel */}
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSidebar((prev) => !prev)}
                                className={cn(
                                    "h-9 px-3 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors border",
                                    !showSidebar
                                        ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-xs"
                                        : "border-border text-foreground hover:bg-muted"
                                )}
                                title={showSidebar ? __('Ocultar panel lateral para ganar espacio') : __('Mostrar panel lateral (Nueva Cita & Filtros)')}
                            >
                                {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                                <span>{showSidebar ? __('Ocultar Panel') : __('Mostrar Panel')}</span>
                            </Button>

                            {!showSidebar && (
                                <Button
                                    size="sm"
                                    onClick={() => handleCreateClick()}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-3 text-xs font-bold shadow-xs flex items-center gap-1.5"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>{__('Nueva Cita')}</span>
                                </Button>
                            )}

                            <Button variant="outline" size="sm" onClick={() => handleNavigate('today')} className="h-9 px-3 rounded-xl font-semibold text-xs">
                                {__('Hoy')}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleNavigate('prev')} className="h-9 w-9 rounded-xl">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleNavigate('next')} className="h-9 w-9 rounded-xl">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-bold text-foreground capitalize pl-2">
                                {calendarTitle || currentDate.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>

                        {/* Controles de Vista */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center space-x-1 bg-muted p-1 rounded-xl">
                                <Button
                                    variant={viewMode === 'day' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleViewModeChange('day')}
                                    className="rounded-lg h-7 text-xs px-3"
                                >
                                    {__('Día')}
                                </Button>
                                <Button
                                    variant={viewMode === 'week' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleViewModeChange('week')}
                                    className="rounded-lg h-7 text-xs px-3"
                                >
                                    {__('Semana')}
                                </Button>
                                <Button
                                    variant={viewMode === 'month' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleViewModeChange('month')}
                                    className="rounded-lg h-7 text-xs px-3"
                                >
                                    {__('Mes')}
                                </Button>
                                <Button
                                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleViewModeChange('table')}
                                    className="rounded-lg h-7 text-xs px-3"
                                >
                                    {__('Lista')}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Leyenda de Colores */}
                    <div className="flex flex-wrap items-center gap-4 text-xs p-3 bg-card rounded-2xl border shadow-xs text-muted-foreground">
                        <span className="font-bold text-foreground">{__('Estados de Cita:')}</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> 🟢 Confirmada/Pagada</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> 🟡 Pendiente</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> 🔵 En Sala de Espera</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500"></span> 🟣 En Consulta</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> 🟠 Atendida</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> 🔴 Cancelada</span>
                    </div>

                    {/* Contenedor de FullCalendar */}
                    <div className="bg-card rounded-2xl border shadow-xs p-4 overflow-hidden fullcalendar-custom-container">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin] as any}
                            initialView={viewMode === 'day' ? 'timeGridDay' : viewMode === 'month' ? 'dayGridMonth' : viewMode === 'table' ? 'listMonth' : 'timeGridWeek'}
                            locale={esLocale as any}
                            headerToolbar={false}
                            events={fullCalendarEvents}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            nowIndicator={true}
                            slotDuration="00:30:00"
                            slotLabelInterval="01:00:00"
                            slotMinTime="07:00:00"
                            slotMaxTime="21:00:00"
                            slotLabelFormat={{
                                hour: 'numeric',
                                minute: '2-digit',
                                omitZeroMinute: false,
                                meridiem: 'short',
                                hour12: true,
                            }}
                            allDaySlot={false}
                            slotMinHeight={52}
                            eventMinHeight={42}
                            expandRows={true}
                            datesSet={handleDatesSet}
                            eventDrop={handleEventDrop}
                            eventResize={handleEventResize}
                            select={handleDateSelect}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            eventMouseEnter={handleEventMouseEnter}
                            eventMouseLeave={handleEventMouseLeave}
                            eventDisplay="block"
                            eventContent={renderEventContent}
                            height="auto"
                        />
                    </div>

                    {/* Vista Tabla Completa */}
                    {viewMode === 'table' && (
                        <div className="p-4 bg-card rounded-2xl border shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">{__('Código')}</th>
                                            <th className="px-4 py-3">{__('Paciente')}</th>
                                            <th className="px-4 py-3">{__('Médico / Especialidad')}</th>
                                            <th className="px-4 py-3">{__('Fecha y Hora')}</th>
                                            <th className="px-4 py-3">{__('Tipo / Modalidad')}</th>
                                            <th className="px-4 py-3">{__('Estado')}</th>
                                            <th className="px-4 py-3 text-right">{__('Acciones')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {citas.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    {__('No se encontraron citas médicas en este rango.')}
                                                </td>
                                            </tr>
                                        ) : (
                                            citas.map((c) => (
                                                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3 font-mono font-medium">{c.codigo_cita}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-foreground">
                                                            {c.paciente?.tipo_paciente === 'animal'
                                                                ? `🐾 ${c.paciente.nombre_mascota}`
                                                                : `👤 ${c.paciente?.nombres} ${c.paciente?.apellidos}`}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {c.paciente?.tipo_paciente === 'animal'
                                                                ? `Tutor: ${c.paciente.tutor_nombre}`
                                                                : `CI: ${c.paciente?.codigo_paciente}`}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-foreground">
                                                            Dr(a). {c.medico?.nombres} {c.medico?.apellidos}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {c.especialidad?.nombre || 'General'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-foreground">
                                                            {new Date(c.fecha_hora_inicio.replace(' ', 'T')).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(c.fecha_hora_inicio.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({c.duracion_minutos} min)
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium">{c.tipoAtencion?.nombre || 'Consulta'}</span>
                                                        {c.link_virtual && (
                                                            <a href={c.link_virtual} target="_blank" rel="noreferrer" className="block text-xs text-blue-600 hover:underline">
                                                                💻 Link Virtual
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={getBadgeVariant(c.estado)}>
                                                            {c.estado_formateado}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                                                        {c.estado !== 'atendida' && c.estado_pago !== 'pagado' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleOpenReagendar(c)}
                                                                className="h-8 text-xs font-bold rounded-xl border-indigo-200 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50"
                                                            >
                                                                <CalendarSync className="size-3.5 mr-1" />
                                                                {__('Reagendar')}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedCita(c);
                                                                setIsDetailModalOpen(true);
                                                            }}
                                                            className="h-8 text-xs font-bold rounded-xl"
                                                        >
                                                            {__('Ver Detalle')}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Agendar / Editar Cita */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={(open) => {
                    if (!open && isQuickCreatePacienteOpen) {
                        return;
                    }
                    setIsCreateModalOpen(open);
                }}
            >
                <DialogContent
                    onPointerDownOutside={(e) => {
                        if (isQuickCreatePacienteOpen) {
                            e.preventDefault();
                        }
                    }}
                    onInteractOutside={(e) => {
                        if (isQuickCreatePacienteOpen) {
                            e.preventDefault();
                        }
                    }}
                    className="w-full sm:max-w-5xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] p-6 md:p-8"
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                            {editingCita ? __('Editar Cita') : __('Agendar Nueva Cita')}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Selector de Categoría de Cita: Consulta Médica vs Servicio */}
                    <div className="flex p-1 bg-muted/60 rounded-2xl border gap-1 mb-2">
                        <button
                            type="button"
                            onClick={() => {
                                setData((prev) => ({
                                    ...prev,
                                    categoria_cita: 'medica',
                                    medico_id: prev.medico_id || medicos[0]?.id.toString() || '',
                                    especialidad_id: prev.especialidad_id || medicos[0]?.especialidad_principal_id?.toString() || '',
                                    tipo_atencion_id: prev.tipo_atencion_id || tiposAtencion[0]?.id.toString() || '',
                                    catalogo_estudio_id: '',
                                }));
                            }}
                            className={cn(
                                "flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
                                data.categoria_cita === 'medica'
                                    ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-sm border"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Stethoscope className="size-4" />
                            <span>{__('🩺 Consulta Médica (Doctor)')}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setData((prev) => ({
                                    ...prev,
                                    categoria_cita: 'servicio',
                                    medico_id: '',
                                    especialidad_id: '',
                                    tipo_atencion_id: '',
                                }));
                            }}
                            className={cn(
                                "flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
                                data.categoria_cita === 'servicio'
                                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-sm border"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <FlaskConical className="size-4" />
                            <span>{__('🧪 Servicio / Laboratorio / Estudio')}</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 py-2">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Columna Izquierda: Información Principal del Paciente y Atención */}
                            <div className="lg:col-span-6 space-y-4">
                                {/* Paciente */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-semibold text-foreground">{__('Paciente *')}</Label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setQuickCreateSearchTerm('');
                                                setIsQuickCreatePacienteOpen(true);
                                            }}
                                            className="text-xs text-primary hover:text-primary/80 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <UserPlus className="h-3.5 w-3.5" />
                                            <span>{__('+ Nuevo Paciente')}</span>
                                        </button>
                                    </div>
                                    <Select2
                                        options={pacienteSelectOptions}
                                        value={data.paciente_id}
                                        onChange={(val) => setData('paciente_id', val)}
                                        placeholder={__('Seleccionar paciente...')}
                                        searchPlaceholder={__('Buscar por nombre, código o tutor...')}
                                        onCreateNew={(term) => {
                                            setQuickCreateSearchTerm(term);
                                            setIsQuickCreatePacienteOpen(true);
                                        }}
                                        createNewLabel={__('+ Registrar Nuevo Paciente')}
                                    />
                                    {errors.paciente_id && <p className="text-xs text-rose-500 font-medium">{errors.paciente_id}</p>}
                                </div>

                                {data.categoria_cita === 'servicio' ? (
                                    /* Campos para Cita de Servicio / Laboratorio / Estudio */
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-semibold text-foreground">{__('Servicio / Examen Solicitado *')}</Label>
                                                <a
                                                    href="/admin/servicios"
                                                    target="_blank"
                                                    className="text-[11px] text-blue-600 hover:underline font-bold"
                                                >
                                                    {__('Gestionar Catálogo ↗')}
                                                </a>
                                            </div>
                                            <Select2
                                                options={catalogoServicioSelectOptions}
                                                value={data.catalogo_estudio_id}
                                                onChange={handleServiceSelect}
                                                placeholder={__('Seleccionar examen o estudio del catálogo...')}
                                                searchPlaceholder={__('Buscar por nombre, código o categoría...')}
                                            />
                                            {errors.catalogo_estudio_id && <p className="text-xs text-rose-500 font-medium">{errors.catalogo_estudio_id}</p>}
                                        </div>

                                        {/* Indicaciones de preparación si existen */}
                                        {(() => {
                                            const selSrv = catalogoServicios.find((s) => s.id.toString() === data.catalogo_estudio_id);
                                            if (selSrv?.indicaciones_predeterminadas) {
                                                return (
                                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs space-y-1">
                                                        <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                                                            <Sparkles className="size-3.5" />
                                                            {__('Preparación requerida para el paciente:')}
                                                        </span>
                                                        <p className="text-muted-foreground text-[11px]">
                                                            {selSrv.indicaciones_predeterminadas}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {/* Responsable o Técnico (Opcional en Servicios) */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">{__('Técnico / Responsable Asignado (Opcional)')}</Label>
                                            <Select2
                                                options={tecnicoResponsableSelectOptions}
                                                value={data.medico_id}
                                                onChange={(val) => setData('medico_id', val)}
                                                placeholder={__('Sin personal asignado (Atención por orden de llegada)...')}
                                                searchPlaceholder={__('Buscar personal...')}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    /* Campos para Consulta Médica Tradicional */
                                    <>
                                        {/* Especialidad Médica */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">{__('Especialidad Médica')}</Label>
                                            <Select2
                                                options={especialidadSelectOptions}
                                                value={data.especialidad_id}
                                                onChange={handleEspecialidadChange}
                                                placeholder={__('Todas las especialidades...')}
                                                searchPlaceholder={__('Buscar especialidad...')}
                                            />
                                            {errors.especialidad_id && <p className="text-xs text-rose-500 font-medium">{errors.especialidad_id}</p>}
                                        </div>

                                        {/* Médico Tratante */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">{__('Médico Tratante *')}</Label>
                                            <Select2
                                                options={filteredMedicoSelectOptions}
                                                value={data.medico_id}
                                                onChange={handleDoctorChange}
                                                placeholder={__('Seleccionar médico...')}
                                                searchPlaceholder={__('Buscar médico por nombre o especialidad...')}
                                            />
                                            {errors.medico_id && <p className="text-xs text-rose-500 font-medium">{errors.medico_id}</p>}
                                        </div>

                                        {/* Tipo de Atención */}
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-foreground">{__('Tipo de Atención *')}</Label>
                                            <Select2
                                                options={tipoAtencionSelectOptions}
                                                value={data.tipo_atencion_id}
                                                onChange={handleCareTypeChange}
                                                placeholder={__('Seleccionar tipo de atención...')}
                                                searchPlaceholder={__('Buscar tipo de atención...')}
                                            />
                                            {errors.tipo_atencion_id && <p className="text-xs text-rose-500 font-medium">{errors.tipo_atencion_id}</p>}
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <Label className="font-semibold text-foreground">
                                        {data.categoria_cita === 'servicio' ? __('Notas / Observaciones del Estudio') : __('Motivo de Consulta / Síntomas')}
                                    </Label>
                                    <Textarea
                                        placeholder={data.categoria_cita === 'servicio' ? __('Ej: Indicado por médico externo, revisión rutinaria...') : __('Describa brevemente el motivo o síntomas...')}
                                        value={data.motivo_consulta}
                                        onChange={(e) => setData('motivo_consulta', e.target.value)}
                                        className="rounded-2xl min-h-[90px] resize-none"
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha: Selección de Fecha, Horas Manuales y Huecos de Referencia */}
                            <div className="lg:col-span-6 space-y-4 bg-muted/30 p-6 rounded-3xl border shadow-inner">
                                {/* 1. Fecha de Cita */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-foreground text-sm flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-primary" />
                                        {__('1. Fecha de la Cita *')}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.fecha_reserva}
                                        onChange={(e) => handleFechaReservaChange(e.target.value)}
                                        className="h-11 rounded-xl bg-background border font-medium text-foreground"
                                    />
                                </div>

                                {/* 2. Horario Manual: Desde y Hasta */}
                                <div className="space-y-2">
                                    <Label className="font-bold text-foreground text-sm flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        {__('2. Horario de la Cita (Manual) *')}
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                                                {__('Hora Desde')}
                                            </span>
                                            <Input
                                                type="time"
                                                value={data.hora_inicio}
                                                onChange={(e) => handleHoraInicioChange(e.target.value)}
                                                className="h-11 rounded-xl bg-background border font-semibold text-foreground text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                                                {__('Hora Hasta')}
                                            </span>
                                            <Input
                                                type="time"
                                                value={data.hora_fin}
                                                onChange={(e) => handleHoraFinChange(e.target.value)}
                                                className="h-11 rounded-xl bg-background border font-semibold text-foreground text-sm"
                                            />
                                        </div>
                                    </div>
                                    {errors.fecha_hora_inicio && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.fecha_hora_inicio}</p>
                                    )}
                                    {errors.fecha_hora_fin && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.fecha_hora_fin}</p>
                                    )}
                                </div>

                                {/* 3. Huecos / Horarios de Referencia del Doctor */}
                                <div className="p-3.5 bg-background rounded-2xl border space-y-2.5 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                            {__('Huecos sugeridos del médico (Referencia):')}
                                        </span>
                                        {isLoadingSlots ? (
                                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                                        ) : availableSlots.length > 0 ? (
                                            <Badge variant="secondary" className="text-[10px] font-mono font-bold">
                                                {availableSlots.length} {__('libres')}
                                            </Badge>
                                        ) : null}
                                    </div>

                                    {!data.medico_id ? (
                                        <p className="text-[11px] text-muted-foreground italic">
                                            {__('Selecciona un médico a la izquierda para consultar sus huecos y turnos disponibles de referencia.')}
                                        </p>
                                    ) : availableSlots.length === 0 ? (
                                        <p className="text-[11px] text-muted-foreground italic">
                                            {isLoadingSlots
                                                ? __('Consultando disponibilidad del médico...')
                                                : __('No hay turnos libres calculados para este médico en esta fecha. Puedes establecer cualquier horario manual arriba.')}
                                        </p>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] text-muted-foreground block">
                                                {__('Haz clic en un turno para autocompletar las horas de inicio y fin:')}
                                            </span>
                                            <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-1">
                                                {availableSlots.map((slot, idx) => {
                                                    const isSelected = selectedSlotInicio === slot.inicio;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleSelectSlot(slot)}
                                                            className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${isSelected
                                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-95'
                                                                : 'bg-muted/40 hover:bg-primary/10 hover:border-primary/40 text-foreground'
                                                                }`}
                                                            title={`${slot.hora_inicio_formateada} - ${slot.hora_fin_formateada}`}
                                                        >
                                                            <span className="block font-bold">{slot.hora_inicio_formateada}</span>
                                                            <span className="text-[10px] opacity-75 font-mono">hasta {slot.hora_fin_formateada}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Monto y Duración */}
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-foreground">{__('Monto Estimado ($)')}</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={data.monto_estimado}
                                            onChange={(e) => setData('monto_estimado', e.target.value)}
                                            className="h-11 rounded-xl bg-background border font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-foreground">{__('Duración Total (min)')}</Label>
                                        <Input
                                            type="number"
                                            value={data.duracion_minutos}
                                            onChange={(e) => handleDuracionManualChange(parseInt(e.target.value) || 30)}
                                            className="h-11 rounded-xl bg-background border font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl px-5 h-11">
                                {__('Cancelar')}
                            </Button>
                            <Button type="submit" disabled={processing || !data.fecha_hora_inicio} className="bg-primary hover:bg-primary/90 rounded-xl px-6 h-11 font-bold">
                                {editingCita ? __('Guardar Cambios') : __('Confirmar Cita Médica')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Detalle y Acciones Rápidas de Cita */}
            {selectedCita && (
                <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="w-full sm:max-w-2xl rounded-3xl p-6 shadow-2xl border-0">
                        <DialogHeader className="pb-2 border-b">
                            <div className="flex items-center justify-between pr-4">
                                <DialogTitle className="text-base font-extrabold flex items-center gap-2">
                                    {selectedCita.categoria_cita === 'servicio' ? (
                                        <FlaskConical className="size-5 text-blue-600" />
                                    ) : (
                                        <Stethoscope className="size-5 text-indigo-600" />
                                    )}
                                    <span className="font-mono text-slate-800 dark:text-slate-200">{selectedCita.codigo_cita}</span>
                                    {selectedCita.categoria_cita === 'servicio' && (
                                        <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                                            {__('Servicio / Lab')}
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <Badge className={cn("text-xs font-bold px-3 py-1 rounded-xl shadow-xs", getBadgeVariant(selectedCita.estado))}>
                                    {selectedCita.estado_formateado}
                                </Badge>
                            </div>
                        </DialogHeader>

                        <div className="space-y-5 py-2">
                            {/* Datos del Paciente y Médico/Servicio en Tarjetas Elegantes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border flex items-start gap-3">
                                    <div className="size-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 font-extrabold text-sm">
                                        {selectedCita.paciente?.tipo_paciente === 'animal' ? '🐾' : <User className="size-5" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">{__('Paciente')}</span>
                                        <span className="font-extrabold text-xs text-foreground block truncate">
                                            {selectedCita.paciente?.tipo_paciente === 'animal'
                                                ? selectedCita.paciente.nombre_mascota
                                                : `${selectedCita.paciente?.nombres} ${selectedCita.paciente?.apellidos}`}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground font-medium block">
                                            Tel: {selectedCita.paciente?.telefono || selectedCita.paciente?.tutor_telefono || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border flex items-start gap-3">
                                    <div className="size-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 font-extrabold text-sm">
                                        {selectedCita.categoria_cita === 'servicio' ? <FlaskConical className="size-5" /> : <Stethoscope className="size-5" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                                            {selectedCita.categoria_cita === 'servicio' ? __('Servicio / Examen') : __('Médico Tratante')}
                                        </span>
                                        <span className="font-extrabold text-xs text-foreground block truncate">
                                            {selectedCita.categoria_cita === 'servicio'
                                                ? (selectedCita.catalogo_estudio?.nombre_estudio || selectedCita.motivo_consulta || 'Servicio de Laboratorio')
                                                : `Dr(a). ${selectedCita.medico?.nombres || 'No asignado'} ${selectedCita.medico?.apellidos || ''}`}
                                        </span>
                                        <span className="text-[11px] text-blue-700 dark:text-blue-400 font-bold block">
                                            {selectedCita.categoria_cita === 'servicio'
                                                ? (selectedCita.catalogo_estudio?.categoria || 'Laboratorio Clínico')
                                                : (selectedCita.especialidad?.nombre || 'Medicina General')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Fecha, Hora, Telemedicina y Estado de Pago en Caja */}
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-muted/30 rounded-2xl border gap-2 text-xs">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
                                            {new Date(selectedCita.fecha_hora_inicio.replace(' ', 'T')).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                                        </span>

                                        {selectedCita.estado !== 'atendida' && selectedCita.estado_pago !== 'pagado' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenReagendar(selectedCita)}
                                                className="h-7 text-[11px] font-bold rounded-xl border-indigo-200 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-1.5 cursor-pointer shadow-2xs px-2.5"
                                            >
                                                <CalendarSync className="size-3.5 text-indigo-600" />
                                                {__('Reagendar')}
                                            </Button>
                                        )}
                                    </div>

                                    {/* Estado de Pago en Caja (Diferenciado de la Confirmación Clínica) */}
                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        {selectedCita.estado_pago === 'pagado' ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5">
                                                    <DollarSign className="size-3.5 text-emerald-600" />
                                                    {__('Pagada en Caja')} (${Number(selectedCita.monto_pagado || selectedCita.monto_estimado).toFixed(2)} USD)
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleTogglePago(selectedCita, 'pendiente')}
                                                    title={__('Cambiar a Pendiente de Pago')}
                                                    className="text-[10px] text-muted-foreground hover:text-rose-500 underline cursor-pointer px-1"
                                                >
                                                    {__('Modificar')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                                    <DollarSign className="size-3.5 text-amber-600" />
                                                    {__('Pago Pendiente')} (${Number(selectedCita.monto_estimado).toFixed(2)} USD)
                                                </span>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleTogglePago(selectedCita, 'pagado')}
                                                    className="h-7 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs px-2.5 cursor-pointer"
                                                >
                                                    {__('Cobrar en Caja')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedCita.link_virtual && (
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Video className="h-5 w-5 text-blue-600" />
                                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Consulta Virtual Activa</span>
                                        </div>
                                        <a
                                            href={selectedCita.link_virtual}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-bold transition-colors shadow-sm"
                                        >
                                            Unirse a Videollamada
                                        </a>
                                    </div>
                                )}

                                {selectedCita.motivo_consulta && (
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 block">
                                            {selectedCita.categoria_cita === 'servicio' ? __('Observaciones / Notas:') : __('Motivo de Consulta:')}
                                        </span>
                                        <p className="text-xs font-medium bg-background p-3 rounded-2xl border text-slate-800 dark:text-slate-200">
                                            {selectedCita.motivo_consulta}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ─── VISTA ESPECIAL PARA SERVICIOS / LABORATORIO ─── */}
                            {selectedCita.categoria_cita === 'servicio' ? (
                                <div className="space-y-4">
                                    {/* Stepper de Servicio */}
                                    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <FlaskConical className="size-3.5 text-blue-600" />
                                                {__('Progreso del Servicio')}
                                            </span>
                                            <Badge variant="outline" className="text-[10px] font-bold text-blue-600 border-blue-300">
                                                {selectedCita.estado_servicio === 'resultados_listos' ? __('Resultados Listos') :
                                                 selectedCita.estado_servicio === 'en_proceso' ? __('En Proceso / Análisis') :
                                                 selectedCita.estado_servicio === 'entregado' ? __('Entregado al Paciente') : __('Pendiente de Muestra')}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                                            {[
                                                { key: 'pendiente_muestra', label: '1. Toma Muestra', color: 'bg-amber-500' },
                                                { key: 'en_proceso', label: '2. En Análisis', color: 'bg-blue-500' },
                                                { key: 'resultados_listos', label: '3. Resultados Listos', color: 'bg-purple-500' },
                                                { key: 'entregado', label: '4. Entregado', color: 'bg-emerald-500' },
                                            ].map((st, idx) => {
                                                const serviceSteps = ['pendiente_muestra', 'en_proceso', 'resultados_listos', 'entregado'];
                                                const currentIdx = serviceSteps.indexOf(selectedCita.estado_servicio || 'pendiente_muestra');
                                                const isCurrent = (selectedCita.estado_servicio || 'pendiente_muestra') === st.key;
                                                const isPassed = currentIdx > idx;

                                                return (
                                                    <button
                                                        key={st.key}
                                                        type="button"
                                                        onClick={() => handleUpdateEstadoServicio(selectedCita, st.key)}
                                                        className={cn(
                                                            "p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center space-y-1",
                                                            isCurrent && "bg-white dark:bg-slate-800 border-blue-500 ring-2 ring-blue-500/20 shadow-xs scale-105",
                                                            isPassed && "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-85",
                                                            !isCurrent && !isPassed && "bg-background border-dashed opacity-60 hover:opacity-100"
                                                        )}
                                                    >
                                                        <div className={cn("size-2.5 rounded-full", isCurrent || isPassed ? st.color : "bg-slate-300")} />
                                                        <span className={cn("text-[10px] font-bold block truncate w-full", isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-600")}>
                                                            {st.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Panel de Carga y Gestión de Archivos de Resultados */}
                                    <div className="bg-card rounded-2xl border p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-extrabold text-foreground flex items-center gap-2">
                                                <FileText className="size-4 text-indigo-600" />
                                                {__('Informes y Archivos de Resultados')} ({selectedCita.archivos_resultados?.length || 0})
                                            </span>
                                            {selectedCita.archivos_resultados && selectedCita.archivos_resultados.length > 0 && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleSendResultadosWhatsApp(selectedCita)}
                                                    className="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-xs"
                                                >
                                                    <Send className="size-3.5" />
                                                    {__('Enviar al WhatsApp del Paciente')}
                                                </Button>
                                            )}
                                        </div>

                                        {/* Lista de archivos adjuntos */}
                                        {selectedCita.archivos_resultados && selectedCita.archivos_resultados.length > 0 ? (
                                            <div className="space-y-2">
                                                {selectedCita.archivos_resultados.map((arch) => (
                                                    <div key={arch.id} className="p-3 bg-muted/30 rounded-xl border flex items-center justify-between gap-2 text-xs">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs">
                                                                {arch.es_pdf ? 'PDF' : arch.es_imagen ? 'IMG' : 'DOC'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <a
                                                                    href={arch.url_descarga}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="font-bold text-foreground hover:text-primary truncate block hover:underline"
                                                                >
                                                                    {arch.nombre_original}
                                                                </a>
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    {arch.tamano_formateado} • {new Date(arch.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <a
                                                                href={arch.url_descarga}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="size-8 rounded-lg bg-muted flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600"
                                                                title={__('Ver / Descargar')}
                                                            >
                                                                <Download className="size-3.5" />
                                                            </a>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteResultado(arch.id)}
                                                                className="size-8 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                                                                title={__('Eliminar')}
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 bg-muted/20 border border-dashed rounded-xl text-muted-foreground text-xs">
                                                <Paperclip className="size-6 mx-auto mb-1 opacity-40" />
                                                <p className="font-semibold">{__('Aún no se han adjuntado resultados.')}</p>
                                            </div>
                                        )}

                                        {/* Formulario de Carga Rápida */}
                                        <form onSubmit={handleUploadFile} className="pt-2 border-t space-y-2">
                                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                                                <Input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                                                    onChange={(e) => setUploadingFile(e.target.files?.[0] || null)}
                                                    className="text-xs h-9 rounded-xl file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={!uploadingFile || isUploading}
                                                    className="h-9 px-4 rounded-xl font-bold bg-primary text-white shrink-0 gap-1.5"
                                                >
                                                    <Upload className="size-3.5" />
                                                    {isUploading ? __('Subiendo...') : __('Subir Resultado')}
                                                </Button>
                                            </div>
                                            {uploadingFile && (
                                                <Input
                                                    type="text"
                                                    placeholder={__('Nota u observación técnica adicional (opcional)...')}
                                                    value={uploadNotas}
                                                    onChange={(e) => setUploadNotas(e.target.value)}
                                                    className="text-xs h-8 rounded-xl"
                                                />
                                            )}
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                /* ─── VISTA CLÍNICA PARA CONSULTAS MÉDICAS ─── */
                                <div className="space-y-4">
                                    {/* FLUJO CLÍNICO - STEPPER VISUAL INTERACTIVO */}
                                    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                {__('Flujo Clínico (Progreso de la Cita)')}
                                            </span>
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                                                {selectedCita.estado_formateado}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-5 gap-1.5 pt-1">
                                            {[
                                                { key: 'pendiente', label: 'Pendiente', color: 'bg-amber-500' },
                                                { key: 'confirmada_pagada', label: 'Confirmada', color: 'bg-emerald-500' },
                                                { key: 'en_sala_espera', label: 'Recepción', color: 'bg-blue-500' },
                                                { key: 'en_consulta', label: 'En Consulta', color: 'bg-purple-500' },
                                                { key: 'atendida', label: 'Atendida', color: 'bg-teal-500' },
                                            ].map((step, idx) => {
                                                const currentIdx = ['pendiente', 'confirmada_pagada', 'en_sala_espera', 'en_consulta', 'atendida'].indexOf(selectedCita.estado);
                                                const isCurrent = selectedCita.estado === step.key;
                                                const isPassed = currentIdx > idx;

                                                return (
                                                    <button
                                                        key={step.key}
                                                        type="button"
                                                        onClick={() => handleQuickStateChange(selectedCita, step.key)}
                                                        className={cn(
                                                            "p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5",
                                                            isCurrent && "bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs scale-105",
                                                            isPassed && "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-85",
                                                            !isCurrent && !isPassed && "bg-background border-dashed opacity-60 hover:opacity-100 hover:border-solid"
                                                        )}
                                                    >
                                                        <div className={cn("size-3 rounded-full transition-transform", isCurrent || isPassed ? step.color : "bg-slate-300")} />
                                                        <span className={cn("text-[10px] font-bold block truncate w-full", isCurrent ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400")}>
                                                            {step.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* HERO ACTION BUTTON & ACCIONES RÁPIDAS */}
                                    <div className="space-y-3 pt-1">
                                        {/* Botón Acción Principal Destacado (Exclusivo para Médicos y Personal Clínico) */}
                                        {canAtenderConsulta && (
                                            <Button
                                                type="button"
                                                onClick={() => router.get(`/admin/citas/${selectedCita.id}/atencion`)}
                                                className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                                            >
                                                <Stethoscope className="size-4" />
                                                {__('ATENDER CONSULTA MÉDICA (WIZARD DE ATENCIÓN)')}
                                                <ArrowRight className="size-4 ml-1" />
                                            </Button>
                                        )}

                                        {/* Barra de Herramientas Secundarias */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <Select
                                                value={selectedCita.estado}
                                                onValueChange={(val) => handleQuickStateChange(selectedCita, val)}
                                            >
                                                <SelectTrigger className="h-10 text-xs font-bold rounded-xl border bg-background w-full">
                                                    <SelectValue placeholder={__('Cambiar Estado...')} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    <SelectItem value="pendiente" className="text-xs font-bold">🟡 Pendiente por Confirmar</SelectItem>
                                                    <SelectItem value="confirmada_pagada" className="text-xs font-bold">🟢 Cita Confirmada</SelectItem>
                                                    <SelectItem value="en_sala_espera" className="text-xs font-bold">🔵 Llegó a Recepción</SelectItem>
                                                    <SelectItem value="en_consulta" className="text-xs font-bold">🟣 En Consultorio</SelectItem>
                                                    <SelectItem value="atendida" className="text-xs font-bold">🟠 Atendida / Finalizada</SelectItem>
                                                    <SelectItem value="cancelada" className="text-xs font-bold text-rose-600">🔴 Cancelar Cita</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {/* Cuestionario Pre-Consulta */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`/admin/citas/${selectedCita.id}/generar-preconsulta`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                                                            },
                                                        });
                                                        const data = await res.json();
                                                        if (data.url) {
                                                            navigator.clipboard.writeText(data.url);
                                                            notifySuccess(__('¡Link de Pre-Consulta copiado al portapapeles!'));
                                                            window.open(data.url, '_blank');
                                                        }
                                                    } catch (err) {
                                                        notifyError(__('No se pudo generar el enlace de preconsulta.'));
                                                    }
                                                }}
                                                className="h-10 border-emerald-600/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/10 rounded-xl font-bold text-xs gap-1.5"
                                            >
                                                📋 {__('Pre-Consulta')}
                                            </Button>

                                            {/* Recordatorio WhatsApp */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSendWhatsApp(selectedCita)}
                                                className="h-10 border-green-600/40 text-green-700 dark:text-green-400 hover:bg-green-600/10 rounded-xl font-bold text-xs gap-1.5"
                                            >
                                                📱 {__('WhatsApp')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 border-t pt-4">
                            <Button variant="ghost" onClick={() => handleDeleteCita(selectedCita)} className="text-rose-500 hover:bg-rose-500/10 rounded-xl mr-auto font-bold text-xs h-10 px-4">
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                {__('Eliminar Cita')}
                            </Button>
                            {selectedCita.estado !== 'atendida' && selectedCita.estado_pago !== 'pagado' && (
                                <Button
                                    type="button"
                                    onClick={() => handleOpenReagendar(selectedCita)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-10 px-4 flex items-center gap-1.5 shadow-sm"
                                >
                                    <CalendarSync className="size-4" />
                                    {__('Reagendar Cita')}
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl font-bold text-xs h-10 px-5">
                                {__('Cerrar')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal: Cancelación con Motivo */}
            <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogContent className="w-full sm:max-w-md rounded-3xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {__('Cancelar Cita Médica')}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <p className="text-xs text-muted-foreground">
                            {__('Esta acción cancelará la cita y liberará el horario en la agenda.')}
                        </p>
                        <div className="space-y-2">
                            <Label>{__('Motivo de Cancelación *')}</Label>
                            <Textarea
                                placeholder={__('Ingresa el motivo por el cual el paciente o la clínica cancela la cita...')}
                                value={motivoCancelacion}
                                onChange={(e) => setMotivoCancelacion(e.target.value)}
                                className="rounded-xl min-h-[90px]"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 border-t pt-4">
                        <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} className="rounded-xl">
                            {__('Volver')}
                        </Button>
                        <Button onClick={handleConfirmCancel} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
                            {__('Confirmar Cancelación')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Tooltip Enriquecido al pasar el Cursor por una Cita */}
            {hoveredTooltip && (
                <div
                    className="fixed z-50 w-80 p-4 bg-popover/95 dark:bg-slate-900/95 backdrop-blur-md text-popover-foreground rounded-2xl border shadow-2xl space-y-3 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
                    style={{
                        left: `${hoveredTooltip.x}px`,
                        top: `${hoveredTooltip.y - 10}px`,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    {/* Encabezado: Paciente y Estado Badge */}
                    <div className="flex items-start justify-between gap-2 border-b pb-2.5">
                        <div className="min-w-0 flex-1">
                            <span className="font-extrabold text-sm text-foreground flex items-center gap-1.5 truncate">
                                {hoveredTooltip.cita.paciente?.tipo_paciente === 'animal'
                                    ? `🐾 ${hoveredTooltip.cita.paciente.nombre_mascota}`
                                    : `👤 ${hoveredTooltip.cita.paciente?.nombres} ${hoveredTooltip.cita.paciente?.apellidos}`}
                            </span>
                            {hoveredTooltip.cita.paciente?.tipo_paciente === 'animal' && (
                                <span className="text-[11px] text-muted-foreground block truncate">
                                    Tutor: {hoveredTooltip.cita.paciente.tutor_nombre || 'N/A'}
                                </span>
                            )}
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
                                Edad: {getEdadPaciente(hoveredTooltip.cita.paciente)}
                            </span>
                        </div>
                        <Badge className={cn("text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-xs shrink-0 border", getBadgeVariant(hoveredTooltip.cita.estado))}>
                            {hoveredTooltip.cita.estado_formateado}
                        </Badge>
                    </div>

                    {/* Detalles: Médico, Especialidad, Horario, Motivo */}
                    <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2 text-foreground font-semibold">
                            <Stethoscope className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                                <span className="truncate block font-bold text-xs">
                                    Dr(a). {hoveredTooltip.cita.medico?.nombres} {hoveredTooltip.cita.medico?.apellidos}
                                </span>
                                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
                                    Especialidad: {hoveredTooltip.cita.especialidad?.nombre || 'Medicina General'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground font-mono">
                            <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                            <span>
                                {new Date(hoveredTooltip.cita.fecha_hora_inicio.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(hoveredTooltip.cita.fecha_hora_fin.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({hoveredTooltip.cita.duracion_minutos} min)
                            </span>
                        </div>

                        {hoveredTooltip.cita.motivo_consulta && (
                            <div className="pt-2 border-t text-[11px] text-muted-foreground">
                                <span className="font-bold text-foreground block mb-0.5">{__('Motivo de consulta:')}</span>
                                <p className="line-clamp-3 bg-muted/30 p-2 rounded-xl border text-slate-700 dark:text-slate-300 italic">
                                    "{hoveredTooltip.cita.motivo_consulta}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de Creación Rápida de Paciente */}
            <ModalCrearPacienteRapido
                isOpen={isQuickCreatePacienteOpen}
                onClose={() => setIsQuickCreatePacienteOpen(false)}
                initialSearch={quickCreateSearchTerm}
                paises={paises}
                onSuccess={(newPaciente) => {
                    setPacientesList((prev) => [newPaciente, ...prev]);
                    setData('paciente_id', newPaciente.id.toString());
                }}
            />
        </div>
    );
}
