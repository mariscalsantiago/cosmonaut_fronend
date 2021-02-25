import {environment} from './../environments/environment';

const ip:string = environment.rutaEmpresa;
const ip2:string = environment.rutaProvicional;
const ip3:string = environment.rutaCatalogos;

export const direcciones = {

    usuarios:`${ip}/persona`,
    centroCostosCliente: `${ip}/centroCostosCliente`,
    area: `${ip2}/area`,
    politica: `${ip2}/Politica`,
    jornada: `${ip2}/jornadas`,
    cuentasbancarias:`${ip2}/cuentaBanco`,
    catalogo:`${ip3}/catalogo`,
    gruponomina:`${ip}/grupoNomina`,
    colaboradorGrupoNomina:`${ip}/colaboradorGrupoNomina`,
    domicilio:`${ip}/domicilio`,
    preferencias:`${ip}/preferencias`,
    contratoColaborador:`${ip}/contratoColaborador`,
    nclPolitica:`${ip2}/Politica`,
    sedes:`${ip}/sede`,
	reportes:`${ip}/reportes`,
    registroPatronal:`${ip}/registroPatronal`
};
