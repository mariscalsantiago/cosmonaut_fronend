import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { PoliticasService } from '../services/politicas.service';

@Component({
  selector: 'app-listapoliticas',
  templateUrl: './listapoliticas.component.html',
  styleUrls: ['./listapoliticas.component.scss']
})
export class ListapoliticasComponent implements OnInit {

  
  public tamanio:number = 0;
  public cargando:Boolean = false;
  public id_empresa:number = 0;
  public changeIconDown: boolean = false;
  public objEnviar:any ;
  public aparecemodalito: boolean = false;
  public aparecemodalitoempleado: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallearea:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

 
  public arreglo:any = [];
  public arreglodetalle: any =[];
  public arreglodetalleemp: any = [];

  constructor(private routerPrd:Router,private politicasProd:PoliticasService,private CanRouterPrd:ActivatedRoute,
    private modalPrd:ModalService) { }

  ngOnInit(): void {
    
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{

      this.id_empresa = datos["id"]
      this.politicasProd.getAllPol(this.id_empresa).subscribe(datos => {
      this.arreglo = datos.datos;
      console.log(this.arreglo);
      this.cargando = false;

    });

    });

  }


  public verdetalle(obj:any){
    
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'politicas', tipoinsert],{state:{data:obj}});
    this.cargando = false;
  }
  public eliminar(obj:any){
    
     
    this.objEnviar = {
      politicaId: obj.politicaId,
      centrocClienteId: {
        centrocClienteId: obj.centrocClienteId
        }
      }

   
   const titulo = "¿Deseas eliminar la politíca?";
  
   this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
     if(valor){


      this.politicasProd.eliminar(this.objEnviar).subscribe(datos => {
        this.cargando = false;        
        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        if(datos.resultado){
          this.politicasProd.getAllPol(this.id_empresa).subscribe(datos => {
            this.arreglo = datos.datos;
          });
      }

      });
     }
   });;
           
 }

  public traerModal(indice: any) {

    
    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalito = true;



    if (elemento.getBoundingClientRect().y < -40) {
      let numero = elemento.getBoundingClientRect().y;
      numero = Math.abs(numero);

      this.scrolly = numero + 100 + "px";


    } else {

      this.scrolly = "5%";
    }



    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }

      let politicaitem = this.arreglo[indice];
      this.cargandodetallearea = true;
    
      this.politicasProd.getTabBen(politicaitem.politicaId,this.id_empresa).subscribe(datos =>{
        this.cargandodetallearea = false;
        this.arreglodetalle = datos.datos == undefined ? []:datos.datos;
      });

  }
  public traerModalEmpleo(indice: any) {
    
    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalitoempleado = true;



    if (elemento.getBoundingClientRect().y < -40) {
      let numero = elemento.getBoundingClientRect().y;
      numero = Math.abs(numero);

      this.scrolly = numero + 100 + "px";


    } else {

      this.scrolly = "5%";
    }



    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }

      let politicaitem = this.arreglo[indice];
      this.cargandodetallearea = true;
    
      this.politicasProd.getdetallePolitica(politicaitem.politicaId,this.id_empresa).subscribe(datos =>{
        this.cargandodetallearea = false;
        this.arreglodetalleemp = datos.datos == undefined ? []:datos.datos;
      });

  }

  apagando(indice:number){
    
    for(let x = 0;x < this.arreglo.length; x++){
      if(x == indice)
            continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;
  
  }



  
}


