import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConceptosService } from '../../services/conceptos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-listasconceptospercepciones',
  templateUrl: './listasconceptospercepciones.component.html',
  styleUrls: ['./listasconceptospercepciones.component.scss']
})
export class ListasconceptospercepcionesComponent implements OnInit {

  public tamanio: number = 0;
  public objEnviar: any;
  public changeIconDown: boolean = false;
  public nombre: string = "";
  public cargando: boolean = false;
  public id_empresa: number = 0;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallegrupo:boolean = false;
  public indexSeleccionado: number = 0;

  public arreglotablaPer: any = [];

  public arreglotablaDed: any = [];

  public arreglodetalle:any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;

    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }
  }

  constructor(private conceptosPrd: ConceptosService, private routerPrd: Router,
    private routerActive: ActivatedRoute,private modalPrd:ModalService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];

      this.cargando = true;
      
      this.conceptosPrd.getListaConceptoPercepcion(this.id_empresa).subscribe(datos => {
        debugger;

        if(datos.datos !== undefined){
          datos.datos.forEach((part:any) => {
            part.descripcion=part.tipoPercepcionId?.descripcion;
            if(part.tipoConcepto == "O"){
              part.tipoConcepto= "Ordinario"
            }
            if(part.tipoConcepto == "E"){
              part.tipoConcepto= "Extraordinario"
            }

            if(part.tipoPeriodicidad == "P"){
              part.tipoPeriodicidad= "Periodica"
            }
            if(part.tipoPeriodicidad == "E"){
              part.tipoPeriodicidad= "Estandar"
            }
            if(part.tipoPeriodicidad == "A"){
              part.tipoPeriodicidad= "Ambos"
            }

          });
        }
        this.arreglotablaPer = datos.datos;
        this.cargando = false;
      });

      this.conceptosPrd.getListaConceptoDeduccion(this.id_empresa).subscribe(datos => {
        this.arreglotablaDed = datos.datos;
        this.cargando = false;
      });

    });

  }

  public filtrar() {

  }


  public eliminarPer(obj: any) {
    debugger;
    this.objEnviar = {
      conceptoPercepcionId: obj.conceptoPercepcionId,
      tipoPercepcionId: {
        tipoPercepcionId: obj.tipoPercepcionId.tipoPercepcionId
       },
      centrocClienteId: obj.centrocClienteId
      }

      const titulo = "¿Deseas eliminar el concepto de la percepción?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){


        this.conceptosPrd.eliminarPer(this.objEnviar).subscribe(datos => {
          this.cargando = false;        
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        
          if (datos.resultado) {
            this.conceptosPrd.getListaConceptoPercepcion(this.id_empresa).subscribe(datos => {

              if(datos.datos !== undefined){
                datos.datos.forEach((part:any) => {
                  part.descripcion=part.tipoPercepcionId?.descripcion;
                  if(part.tipoConcepto == "O"){
                    part.tipoConcepto= "Ordinario"
                  }
                  if(part.tipoConcepto == "E"){
                    part.tipoConcepto= "Extraordinario"
                  }
                  if(part.tipoPeriodicidad == "P"){
                    part.tipoPeriodicidad= "Periodica"
                  }
                  if(part.tipoPeriodicidad == "E"){
                    part.tipoPeriodicidad= "Estandar"
                  }
                  if(part.tipoPeriodicidad == "A"){
                    part.tipoPeriodicidad= "Ambos"
                  }
      
                });
              }
              this.arreglotablaPer = datos.datos;
              this.cargando = false;
            });

        }
  
        });
       }
    });



  }

  public eliminarDed(obj: any) {
debugger;
    this.objEnviar = {
      conceptoDeduccionId: obj.conceptoDeduccionId,
      tipoDeduccionId: {
        tipoDeduccionId: obj.tipoDeduccionId.tipoDeduccionId
       },
      centrocClienteId: obj.centrocClienteId
      }

      const titulo = "¿Deseas eliminar el concepto de la deducción?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){


        this.conceptosPrd.eliminarDed(this.objEnviar).subscribe(datos => {
          this.cargando = false;        
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        
          if (datos.resultado) {
            this.conceptosPrd.getListaConceptoDeduccion(this.id_empresa).subscribe(datos => {
              this.arreglotablaDed = datos.datos;
            });

        }
  
        });
       }
    });



  }

  public verdetallePer(obj: any) {
    debugger;
        if(obj == undefined){
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosPercepciones', 'nuevo']);
        }else{
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosPercepciones', 'editar'],{ state: { data: obj}});
        }
      }
      public verdetalleDed(obj: any) {
    debugger;
        if(obj == undefined){
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosDeducciones', 'nuevo']);
        }else{
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosDeducciones', 'editar'],{ state: { data: obj}});
        }
      }

  apagandoPer(indice: number) {

    

    for(let x = 0;x < this.arreglotablaPer.length; x++){
      if(x == indice)
            continue;

      this.arreglotablaPer[x].seleccionado = false;
    }


    this.arreglotablaPer[indice].seleccionado = !this.arreglotablaPer[indice].seleccionado;
  
  }

  apagandoDed(indice: number) {

    

    for(let x = 0;x < this.arreglotablaDed.length; x++){
      if(x == indice)
            continue;

      this.arreglotablaDed[x].seleccionado = false;
    }


    this.arreglotablaDed[indice].seleccionado = !this.arreglotablaDed[indice].seleccionado;
  
  }



}
