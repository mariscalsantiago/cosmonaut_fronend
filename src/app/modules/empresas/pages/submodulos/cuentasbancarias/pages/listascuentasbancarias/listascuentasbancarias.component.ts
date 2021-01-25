import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasbancariasService } from '../../services/cuentasbancarias.service';

@Component({
  selector: 'app-listascuentasbancarias',
  templateUrl: './listascuentasbancarias.component.html',
  styleUrls: ['./listascuentasbancarias.component.scss']
})
export class ListascuentasbancariasComponent implements OnInit {

  public tamanio:number = 0;
  public cargando:boolean = false;
  public changeIconDown:boolean = false;

  
  public id_empresa:number = 0;
  public arreglo:any = [{nombrecuenta:"Pagos chesues",nocuenta:5424515,nombrebanco:"BBVA Bancomer",cuentaclabe:"87456321458785423"}];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  constructor(private routerPrd:Router,private activateRouter:ActivatedRoute,
    private cuentasPrd:CuentasbancariasService) { }

  ngOnInit(): void {

    this.activateRouter.params.subscribe(datos =>{
    
        this.id_empresa = datos["id"];


    });

  }


  public verdetalle(obj:any){

    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'cuentasbancarias','nuevo']);


  }

}
