import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-listaempresas',
  templateUrl: './listaempresas.component.html',
  styleUrls: ['./listaempresas.component.scss']
})
export class ListaEmpresasComponent implements OnInit {

  public cargando: Boolean = false;

  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public arreglo: any = [];
  public tamanio:number = 0;
  public changeIconDown:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  constructor(private routerPrd: Router, private empresasProd: EmpresasService) { }

  ngOnInit(): void {
debugger;
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.empresasProd.getAllEmp().subscribe(datos => {

      this.arreglo = datos.datos;

      this.cargando = false;
    });

  }
  public verdetalleemp(obj: any) {
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['listaempresas', 'empresas', tipoinsert], { state: { data: obj } });
    this.cargando = false;

  }



  public verPerfilEmpresa(obj: any) {
    this.routerPrd.navigate(['/empresa', 'detalle', obj.centrocClienteId,'representantelegal']);
  }


}