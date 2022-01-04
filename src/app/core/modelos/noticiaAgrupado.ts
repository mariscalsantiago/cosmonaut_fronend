import { DetalleGrupos } from './detalleGrupos';

export class NoticiaAgrupado {
    noticiaId: number;
    categoria: string | undefined;   
    detalles:DetalleGrupos[]=[];
    
    constructor(
        noticiaId: number,
        categoria: string | undefined,
        ){
        this.noticiaId=noticiaId;
        this.categoria=categoria;
    }

    addDetalleso(detalles: DetalleGrupos) {
        this.detalles.push(detalles);
    }
}