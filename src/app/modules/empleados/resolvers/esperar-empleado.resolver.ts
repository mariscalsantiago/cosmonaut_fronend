import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContratocolaboradorService } from '../services/contratocolaborador.service';

@Injectable({
  providedIn: 'root'
})
export class EsperarEmpleadoResolver implements Resolve<any> {
  constructor(private contratoColaboradorPrd: ContratocolaboradorService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let idEmpleado = route.params["id"];
    return this.contratoColaboradorPrd.getContratoColaboradorById(idEmpleado).pipe(map(datos => datos.datos));
  }
}
