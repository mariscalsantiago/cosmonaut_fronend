export class Utilidades {

  public quitarAcentosYEspacios = (str: string) => {
    let nombre = str.trim();
    return nombre.replace(/\s\s+/g, ' ');
    
  }

}
