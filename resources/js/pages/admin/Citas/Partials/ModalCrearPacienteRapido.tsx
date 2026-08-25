import React, { useState, useEffect } from 'react';
import { User, PawPrint, CheckCircle2, UserPlus, Phone, Mail, Calendar, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { notifySuccess, notifyError } from '@/utils/notifications';
import { useTranslate } from '@/hooks/use-translate';
import PhoneInputGroup, { type PaisPhoneOption } from '../../Empresas/Partials/PhoneInputGroup';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (paciente: any) => void;
    initialSearch?: string;
    paises?: PaisPhoneOption[];
}

export default function ModalCrearPacienteRapido({
    isOpen,
    onClose,
    onSuccess,
    initialSearch = '',
    paises = [],
}: Props) {
    const { __ } = useTranslate();
    const [tipoPaciente, setTipoPaciente] = useState<'humano' | 'animal'>('humano');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Formulario Humano
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [documentoIdentidad, setDocumentoIdentidad] = useState('');
    const [genero, setGenero] = useState<'masculino' | 'femenino' | 'otro' | ''>('masculino');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [email, setEmail] = useState('');
    const [paisTelefonoId, setPaisTelefonoId] = useState<string | number>(paises[0]?.id || '');
    const [telefono, setTelefono] = useState('');

    // Formulario Mascota
    const [nombreMascota, setNombreMascota] = useState('');
    const [especie, setEspecie] = useState('Perro');
    const [raza, setRaza] = useState('');
    const [tutorNombre, setTutorNombre] = useState('');
    const [tutorDocumento, setTutorDocumento] = useState('');
    const [paisTelefonoTutorId, setPaisTelefonoTutorId] = useState<string | number>(paises[0]?.id || '');
    const [tutorTelefono, setTutorTelefono] = useState('');
    const [tutorEmail, setTutorEmail] = useState('');

    // Inicializar con el término de búsqueda si existe
    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (initialSearch.trim()) {
                const parts = initialSearch.trim().split(' ');
                if (parts.length > 1) {
                    setNombres(parts[0]);
                    setApellidos(parts.slice(1).join(' '));
                } else {
                    setNombres(initialSearch.trim());
                    setApellidos('');
                }
                setNombreMascota(initialSearch.trim());
            } else {
                setNombres('');
                setApellidos('');
                setNombreMascota('');
            }
        }
    }, [isOpen, initialSearch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const payload: Record<string, any> = {
            tipo_paciente: tipoPaciente,
            status: true,
        };

        if (tipoPaciente === 'humano') {
            payload.nombres = nombres;
            payload.apellidos = apellidos;
            payload.documento_identidad = documentoIdentidad;
            payload.genero = genero || null;
            payload.fecha_nacimiento = fechaNacimiento || null;
            payload.email = email || null;
            payload.pais_telefono_id = paisTelefonoId || null;
            payload.telefono = telefono || null;
        } else {
            payload.nombre_mascota = nombreMascota;
            payload.especie = especie;
            payload.raza = raza || null;
            payload.tutor_nombre = tutorNombre;
            payload.tutor_documento = tutorDocumento || null;
            payload.pais_telefono_tutor_id = paisTelefonoTutorId || null;
            payload.tutor_telefono = tutorTelefono || null;
            payload.tutor_email = tutorEmail || null;
        }

        try {
            // Obtenemos token CSRF de la cookie o meta
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

            const response = await fetch('/admin/pacientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    setErrors(result.errors);
                    notifyError(__('Por favor verifique los campos del formulario.'));
                } else {
                    notifyError(result.message || __('Error al crear el paciente.'));
                }
                setIsSubmitting(false);
                return;
            }

            notifySuccess(__('Paciente registrado con éxito.'));
            onSuccess(result.paciente);
            onClose();
        } catch (err: any) {
            console.error('Error al registrar paciente rápido:', err);
            notifyError(__('Ocurrió un error inesperado al registrar el paciente.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="w-full sm:max-w-2xl rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto z-[60]"
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <UserPlus className="size-5" />
                        </div>
                        {__('Crear Nuevo Paciente')}
                    </DialogTitle>
                </DialogHeader>

                {/* Selector Tipo de Paciente */}
                <div className="flex gap-2 p-1 bg-muted/60 rounded-2xl border">
                    <button
                        type="button"
                        onClick={() => setTipoPaciente('humano')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            tipoPaciente === 'humano'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <User className="size-4 text-blue-500" />
                        {__('Paciente Humano')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipoPaciente('animal')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            tipoPaciente === 'animal'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <PawPrint className="size-4 text-emerald-500" />
                        {__('Mascota / Veterinario')}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {tipoPaciente === 'humano' ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Nombres *')}
                                    </Label>
                                    <Input
                                        value={nombres}
                                        onChange={(e) => setNombres(e.target.value)}
                                        placeholder={__('Ej. María')}
                                        required
                                        className="h-10 rounded-xl"
                                    />
                                    {errors.nombres && <p className="text-xs text-rose-500 font-medium">{errors.nombres}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Apellidos *')}
                                    </Label>
                                    <Input
                                        value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                        placeholder={__('Ej. Rodríguez')}
                                        required
                                        className="h-10 rounded-xl"
                                    />
                                    {errors.apellidos && <p className="text-xs text-rose-500 font-medium">{errors.apellidos}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Documento de Identidad / Cédula')}
                                    </Label>
                                    <Input
                                        value={documentoIdentidad}
                                        onChange={(e) => setDocumentoIdentidad(e.target.value)}
                                        placeholder={__('Ej. 12345678')}
                                        className="h-10 rounded-xl"
                                    />
                                    {errors.documento_identidad && <p className="text-xs text-rose-500 font-medium">{errors.documento_identidad}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Género')}
                                    </Label>
                                    <Select value={genero} onValueChange={(val: any) => setGenero(val)}>
                                        <SelectTrigger className="h-10 rounded-xl">
                                            <SelectValue placeholder={__('Seleccionar')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="masculino">{__('Masculino')}</SelectItem>
                                            <SelectItem value="femenino">{__('Femenino')}</SelectItem>
                                            <SelectItem value="otro">{__('Otro')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-foreground">
                                    {__('Teléfono de Contacto (WhatsApp)')}
                                </Label>
                                <PhoneInputGroup
                                    paises={paises}
                                    selectedPaisId={paisTelefonoId}
                                    phoneValue={telefono}
                                    onPaisChange={(val) => setPaisTelefonoId(val)}
                                    onPhoneChange={(val) => setTelefono(val)}
                                    placeholder={__('Número de teléfono')}
                                />
                                {errors.telefono && <p className="text-xs text-rose-500 font-medium">{errors.telefono}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Correo Electrónico')}
                                    </Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={__('ejemplo@correo.com')}
                                        className="h-10 rounded-xl"
                                    />
                                    {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Fecha de Nacimiento')}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={fechaNacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                        className="h-10 rounded-xl"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Nombre de Mascota *')}
                                    </Label>
                                    <Input
                                        value={nombreMascota}
                                        onChange={(e) => setNombreMascota(e.target.value)}
                                        placeholder={__('Ej. Max')}
                                        required
                                        className="h-10 rounded-xl"
                                    />
                                    {errors.nombre_mascota && <p className="text-xs text-rose-500 font-medium">{errors.nombre_mascota}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Especie *')}
                                    </Label>
                                    <Select value={especie} onValueChange={(val) => setEspecie(val)}>
                                        <SelectTrigger className="h-10 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Perro">{__('Perro (Canino)')}</SelectItem>
                                            <SelectItem value="Gato">{__('Gato (Felino)')}</SelectItem>
                                            <SelectItem value="Ave">{__('Ave')}</SelectItem>
                                            <SelectItem value="Conejo">{__('Conejo')}</SelectItem>
                                            <SelectItem value="Otro">{__('Otro')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Raza')}
                                    </Label>
                                    <Input
                                        value={raza}
                                        onChange={(e) => setRaza(e.target.value)}
                                        placeholder={__('Ej. Labrador')}
                                        className="h-10 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 border-t space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {__('Datos del Tutor / Dueño')}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-foreground">
                                            {__('Nombre del Tutor *')}
                                        </Label>
                                        <Input
                                            value={tutorNombre}
                                            onChange={(e) => setTutorNombre(e.target.value)}
                                            placeholder={__('Ej. Carlos Pérez')}
                                            required
                                            className="h-10 rounded-xl"
                                        />
                                        {errors.tutor_nombre && <p className="text-xs text-rose-500 font-medium">{errors.tutor_nombre}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-foreground">
                                            {__('Documento del Tutor')}
                                        </Label>
                                        <Input
                                            value={tutorDocumento}
                                            onChange={(e) => setTutorDocumento(e.target.value)}
                                            placeholder={__('Ej. 98765432')}
                                            className="h-10 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-foreground">
                                        {__('Teléfono del Tutor (WhatsApp)')}
                                    </Label>
                                    <PhoneInputGroup
                                        paises={paises}
                                        selectedPaisId={paisTelefonoTutorId}
                                        phoneValue={tutorTelefono}
                                        onPaisChange={(val) => setPaisTelefonoTutorId(val)}
                                        onPhoneChange={(val) => setTutorTelefono(val)}
                                        placeholder={__('Número de teléfono')}
                                    />
                                    {errors.tutor_telefono && <p className="text-xs text-rose-500 font-medium">{errors.tutor_telefono}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    <DialogFooter className="pt-4 border-t flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl"
                        >
                            {__('Cancelar')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <span>{__('Guardando...')}</span>
                            ) : (
                                <>
                                    <CheckCircle2 className="size-4" />
                                    {__('Guardar y Seleccionar')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
