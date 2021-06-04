import { submodulo } from "./submodulos";

export interface modulos {
    moduloId?: string,
    nombreModulo?: string,
    fechaAlta?: string,
    esActivo?: boolean,
    submodulos?:Array<submodulo>,
    seleccionado?:boolean,
    checked?:boolean,
    previo?:boolean
}