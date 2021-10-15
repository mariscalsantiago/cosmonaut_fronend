export interface Noticia {
    idNoticia: number,
    idUsuario: number,
    idCompania: number,
    titulo: string,
    subtitulo?: string,
    categoria: string,
    contenido?: string,
    thumbnail?: string,
    imagen?: string,
    fechaCarga: number,
    fechaInicio: number,
    fechaFin: number,
}