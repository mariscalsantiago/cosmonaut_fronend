export interface Noticia {
    noticiaId: number,
    usuarioId: number,
    centrocClienteId: number,
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
    fechaCarga: number,
    fechaInicio: number,
    fechaFin: number,

    fechaInicioFormato?: string,
    fechaFinFormato?: string,
    categoriaFormato?: string,
}