import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { datosTemporales } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-detalleempresas',
  templateUrl: './detalleempresas.component.html',
  styleUrls: ['./detalleempresas.component.scss']
})
export class DetalleempresasComponent implements OnInit {

  public titulo:string = datosTemporales.configuracionEmpresaNombreEmpresa;

  constructor(private routerPrd:Router) { }

  ngOnInit(): void {
    
  }



}
