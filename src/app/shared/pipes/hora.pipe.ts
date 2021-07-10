import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {

  transform( value: any ,nombre: any ): any {
    if(nombre === 'Hora de entrada'  ||nombre === 'Hora de salida' ||nombre === 'Hora fin de comida' ||nombre === 'Hora de inicio de comida'){
      if(value === undefined){
        return '';
      }
      return value.slice(0, 5);
    }
    return value;
  }
}
