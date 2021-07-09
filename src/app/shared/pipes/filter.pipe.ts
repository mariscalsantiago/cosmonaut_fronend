import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(arr: any[], text: string, column: string): any[]{
    if ( text === '') {
    return arr;
    } else {
      return arr.filter(item => {
        text = text.toLowerCase();
        if (arr.length < 1) {
          return ;
        }
        let x : any;
        if(item[column].toLowerCase().includes(text) === false){
           x = true
        }else {
          x = item[column].toLowerCase().includes(text)
        }
     
        return x;
  });

}
}
}