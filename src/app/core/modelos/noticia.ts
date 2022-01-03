export interface Noticia {
    noticiaId: number,
    usuarioId: number,
    clienteId: number,
    titulo: string,
    subtitulo?: string,
    categoriaId: {
        categoriaNoticiaId: number,
        descripcion: string,
        nombre: string,
    },
    contenido?: string,
    thumbnail?: string,
    imagen?: string,
    fechaAlta: string,
    fechaInicio: string,
    fechaFin: string,

    __categoriaFormato?: string,
    todos?:boolean,
    todosEmpleados?:boolean,
    grupoNominaId?:number,
    centrocClienteId?:Array<any>,
    enlace?:string,
    personasId?:Array<any>
}
