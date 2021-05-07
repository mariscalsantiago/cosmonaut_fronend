import { Injectable } from '@angular/core';
import {  AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresFormsService {

  constructor() { }


  public ageValidator (control: AbstractControl):{[key: string]: boolean} | null {

    if( control.value !==null && (isNaN(control.value) || control.value <20  || control.value> 70)){
      return {'ageValidator': true}
    }
    return null;
  };

  public prueba(){
     

  }

}
