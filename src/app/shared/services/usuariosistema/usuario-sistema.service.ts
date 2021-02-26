import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaService {

  public usuario!:usuarioClass;

  constructor() { 
   
    this.usuario = new usuarioClass(171,1);

  }


  public getUsuario(){
    return this.usuario;
  }

  public setUsuario(usuario:usuarioClass){
    this.usuario = usuario;
  }

  public getIdEmpresa(){
    return this.usuario.idEmpresa;
  }
}


export class usuarioClass{
  public idEmpresa!:number;
  public nombreEmpresa!:string;
  public idUsuario!:number;


  public constructor(idEmpresa:number,idUsuario:number){

    this.idUsuario = idUsuario;
    this.idEmpresa = idEmpresa;
  }


  
  
}
