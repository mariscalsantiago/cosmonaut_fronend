import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private _sanitizer:DomSanitizer) {
  }
  transform(searchText: string, item: string): SafeHtml {
    if(item === ''){
      return searchText;
    }
    const re = new RegExp(item, 'gi');
    return this._sanitizer.bypassSecurityTrustHtml(searchText.replace(re, `<u class="highlight">$&</u>` ));
  }

}
