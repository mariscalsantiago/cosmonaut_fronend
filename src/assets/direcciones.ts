import {environment} from './../environments/environment';

const ip:string = environment.rutaEmpresa;
const ip3:string = environment.rutaCatalogos;
const ipCalculos:string = environment.rutaCalculos;
const ipAdmin: string = environment.rutaAdmin;
const ipReportes:string = environment.rutaReportes;
const ipSocket:string = environment.rutaSocket;

export const direcciones = {

    
    usuarios:`${ip}/persona`,
    empleado:`${ip}/empleado`,
    centroCostosCliente: `${ip}/centroCostosCliente`,
    area: `${ip}/area`,
    politica: `${ip}/Politica`,
    jornada: `${ip}/jornadas`,
    cuentasbancarias:`${ip}/cuentaBanco`,
    catalogo:`${ip3}/catalogo`,
    gruponomina:`${ip}/grupoNomina`,
    colaboradorGrupoNomina:`${ip}/colaboradorGrupoNomina`,
    domicilio:`${ip}/domicilio`,
    preferencias:`${ip}/preferencias`,
    contratoColaborador:`${ip}/contratoColaborador`,
    nclPolitica:`${ip}/Politica`,
    sedes:`${ip}/sede`,
	reportes:`${ipReportes}`,
    registroPatronal:`${ip}/registroPatronal`,
    conceptos:`${ip}/percepcionDeduccion`,
    incidencias:`${ip}/incidencias`,
    documentos:`${ip}/documentos`,
    kardex:`${ip}/kardex`,
    tablasValores: `${ipAdmin}/TablasValores`,
    adminCatalogo: `${ipAdmin}/adminCatalogo`,
    roles: `${ipAdmin}/rol`,
    modulos: `${ipAdmin}/modulos`,
    permisos: `${ipAdmin}/permisos`,
    chat: `${ip}/chat`,
    socket: `${ipSocket}/websocket`,
    usuariosAuth:`${ipAdmin}/usuarios`,
    versiones:`${ipAdmin}/version`,
    ptu:`${ip}/ptu`,
    oauth:`${ipAdmin}/oauth`,
    nominaOrdinaria:`${ipCalculos}/nomina-ordinaria`,
    nominaExtraordinaria:`${ipCalculos}/nomina-extraordinaria`,
    nominaLiquidacion:`${ipCalculos}/nomina-liquidacion`,
    nominaPtu:`${ipCalculos}/nomina-ptu`,
    orquestador:`${ipCalculos}/orquestador`,
    calculo:`${ipCalculos}/calculo`,
    imss: `${ip}/imss`,
    dispersion:`${ipCalculos}/dispersion-timbrado`
};
