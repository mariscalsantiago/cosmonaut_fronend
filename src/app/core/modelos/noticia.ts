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
    fechaAlta: number,
    fechaInicio: number,
    fechaFin: number,

    __fechaInicioFormato?: string,
    __fechaFinFormato?: string,
    __categoriaFormato?: string,
}