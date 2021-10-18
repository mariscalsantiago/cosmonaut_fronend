export interface Noticia {
    noticiaId: number,
    usuarioId: number,
    centrocClienteId: number,
    titulo: string,
    subtitulo?: string,
    categoria: string,
    contenido?: string,
    thumbnail?: string,
    imagen?: string,
    fechaCarga: number,
    fechaInicio: number,
    fechaFin: number,
    esActivo: boolean
}