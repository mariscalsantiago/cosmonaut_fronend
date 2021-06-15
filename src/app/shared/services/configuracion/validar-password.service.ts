import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidarPasswordService {

  constructor() { }  

  public static validarPassword(control:FormControl){

    let valor:string = control.value;

    let mayuscula:boolean = false;
    let minuscula:boolean = false;
    let numero:boolean = false;
    
    Object.values(valor).forEach(v1 => {
      if(v1.charCodeAt(0) >= 65  && v1.charCodeAt(0) <= 90){
        mayuscula = true;
      }
      if(v1.charCodeAt(0) >= 97  && v1.charCodeAt(0) <= 122){
          minuscula = true;
      }
      if(v1.charCodeAt(0) >= 48  && v1.charCodeAt(0) <= 57){
          numero = true;
      }
      
    });

    return (mayuscula && minuscula && numero)?null:{errorPassword:true} ;
  }


}
