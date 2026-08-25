import citas from './citas'
import plantillasPreconsulta from './plantillas-preconsulta'
import consultas from './consultas'
import monitoring from './monitoring'
import empresas from './empresas'
import especialidades from './especialidades'
import plantillasConsultas from './plantillas-consultas'
import integrations from './integrations'
import medicos from './medicos'
import pacientes from './pacientes'
import paises from './paises'
import roles from './roles'
import servicios from './servicios'
import sucursales from './sucursales'
import tiposAtencion from './tipos-atencion'
import usuarios from './usuarios'
const admin = {
    citas: Object.assign(citas, citas),
plantillasPreconsulta: Object.assign(plantillasPreconsulta, plantillasPreconsulta),
consultas: Object.assign(consultas, consultas),
monitoring: Object.assign(monitoring, monitoring),
empresas: Object.assign(empresas, empresas),
especialidades: Object.assign(especialidades, especialidades),
plantillasConsultas: Object.assign(plantillasConsultas, plantillasConsultas),
integrations: Object.assign(integrations, integrations),
medicos: Object.assign(medicos, medicos),
pacientes: Object.assign(pacientes, pacientes),
paises: Object.assign(paises, paises),
roles: Object.assign(roles, roles),
servicios: Object.assign(servicios, servicios),
sucursales: Object.assign(sucursales, sucursales),
tiposAtencion: Object.assign(tiposAtencion, tiposAtencion),
usuarios: Object.assign(usuarios, usuarios),
}

export default admin