import {environment} from './../environments/environment';

const ip:string = environment.rutaEmpresa;
const ip3:string = environment.rutaCatalogos;
const ipCalculos:string = environment.rutaNomina;
const ipNomina:string = environment.rutaNomina;
const ipAdmin: string = environment.rutaAdmin;
const ipReportes:string = environment.rutaReportes;
const ipSocket:string = environment.rutaSocket;

export const direcciones = {

    
    usuarios:`${ip}/persona`,
    empleado:`${ip}/empleado`,
    centroCostosCliente: `${ip}/centroCostosCliente`,
    tectel:`${ip}/tectel`,
    area: `${ip}/area`,
    politica: `${ip}/Politica`,
    jornada: `${ip}/jornadas`,
    cuentasbancarias:`${ip}/cuentaBanco`,
    catalogo:`${ip3}/catalogo`,
    proveedores:`${ip3}`,
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
    tablasValoresCAT: `${ip3}/TablasValores`,
    adminCatalogo: `${ipAdmin}/adminCatalogo`,
    adminCatalogoDisp: `${ipAdmin}/admin-catalogo`,
    roles: `${ipAdmin}/rol`,
    modulos: `${ipAdmin}/modulos`,
    permisos: `${ipAdmin}/permisos`,
    chat: `${ip}/chat`,
    socket: `${ipSocket}`,
    empresa: `${ip}`,
    usuariosAuth:`${ipAdmin}/usuarios`,
    versiones:`${ipAdmin}/version`,
    ptu:`${ipNomina}/ptu`,
    oauth:`${ipAdmin}/oauth`,
    nominaOrdinaria:`${ipCalculos}/nomina-ordinaria`,
    nominaExtraordinaria:`${ipCalculos}/nomina-extraordinaria`,
    nominaLiquidacion:`${ipCalculos}/nomina-liquidacion`,
    nominaPtu:`${ipCalculos}/nomina-ptu`,
    variabilidad:`${ipCalculos}/variabilidad`,
    orquestador:`${ipCalculos}/orquestador`,
    calculo:`${ipCalculos}/calculo`,
    imss: `${ip}/imss`,
    bitacoramovimientos: `${ipAdmin}/bitacora-movimientos`,
    dispersion:`${ipCalculos}/dispersion`,
    tipomensaje:`${ip3}/tipo-mensaje`,
    administrarMensajeChat:`${ipAdmin}/administrar-mensaje-chat`,
    nominasHistoricas: `${ipCalculos}/nominas-historicas`,
    timbrado:`${ipCalculos}/timbrado`,
    timbradoAdmin:`${ipNomina}/timbrado`

};
