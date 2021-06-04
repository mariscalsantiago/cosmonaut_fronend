import { permiso } from "./permiso";

export interface submodulo {
    submoduloId?: number,
    nombreSubmodulo?: string,
    fechaAlta?: Date,
    esActivo?: boolean,
    permisos?:Array<permiso>,
    checked?:boolean,
    previo?:boolean
}