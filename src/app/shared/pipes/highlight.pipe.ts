import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(searchText: string, item: string): any {
    const re = new RegExp(item, 'gi');
    return searchText.replace(re, `<mark class="highlight">$&</mark>` );
  }

}
