import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'show'
})
export class ShowPipe implements PipeTransform {

  transform( text: any,arr: any[], filter: string, column: string ): any {
    arr = arr || [];
    if(arr.length < 1){
      return text;
    }

    
    
    const resultado = arr.find(value => value[filter] === text) || {descripcion:''}
    
    return resultado[column]||'' ;
  }

}
