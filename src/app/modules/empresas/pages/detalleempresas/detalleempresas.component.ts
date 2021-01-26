import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalleempresas',
  templateUrl: './detalleempresas.component.html',
  styleUrls: ['./detalleempresas.component.scss']
})
export class DetalleempresasComponent implements OnInit {

  public titulo:string = "CONFIGURACIÓN";

  constructor(private routerPrd:Router) { }

  ngOnInit(): void {
  }



}
