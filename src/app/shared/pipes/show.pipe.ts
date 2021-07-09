import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'show'
})
export class ShowPipe implements PipeTransform {

  transform( text: any,arr: any[], filter: string, column: string ): any {
    if(arr.length < 1){
      return text;
    }
    return arr.find(value => value[filter] === text)[column] ;
  }

}
