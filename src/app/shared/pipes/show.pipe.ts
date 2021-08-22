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

    
    console.log("filter",filter,"texcto,",text);
    const resultado = arr.find(value => value[filter] === text) || {descripcion:''}
    console.log("Este es el resulñtado2",resultado,"FINAL",resultado[column]);
    return resultado[column]||'' ;
  }

}
