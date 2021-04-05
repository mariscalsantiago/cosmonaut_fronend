import {environment} from './../environments/environment';

const ip:string = environment.rutaEmpresa;
const ip3:string = environment.rutaCatalogos;

export const direcciones = {

    usuarios:`${ip}/persona`,
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
	reportes:`${ip}/reportes`,
    registroPatronal:`${ip}/registroPatronal`,
    conceptos:`${ip}/percepcionDeduccion`,
    incidencias:`${ip}/incidencias`
};
