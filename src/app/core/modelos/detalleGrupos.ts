export class DetalleGrupos {
    titulo: string;
    subtitulo?: string;
  static titulo: string | undefined;

    constructor(
        titulo: string,
        subtitulo: any ,
        ){
        this.titulo=titulo;
        this.subtitulo=subtitulo;
    }
}