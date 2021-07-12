import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'centrar'
})
export class CentrarPipe implements PipeTransform {

  transform(item: string): any {
    item = item.toLowerCase();
    if( item.includes('fecha') || item.includes('monto') || item.includes('pago') ||
        item.includes('anio') || item.includes('periodo') || item.includes('sbc') ||
        item.includes('dias') || item.includes('bimestre') || item.includes('total') || 
        item.includes('tiempo') || item.includes('num') || item.includes('periodo') || item.includes('clave')||
        item.includes('tipoconcepto') || item.includes('limiteinferior')|| item.includes('limitesuperior') ||
        item.includes('cuota') || item.includes('porc') || item.includes('excedente') || item === 'valor'
        ) {
      return true;
    }
    return false;
  }

}
