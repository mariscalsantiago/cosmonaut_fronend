import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { datosTemporales, UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

import { EmpresasService } from '../../services/empresas.service';
import { DatePipe } from '@angular/common';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

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
  public tamanio: number = 0;
  public changeIconDown: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };
  public indexSeleccionado: number = 0;


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  constructor(private routerPrd: Router, private empresasProd: EmpresasService,
    private usuarioSistemaPrd: UsuarioSistemaService, private modalPrd: ModalService,private configuracionesPrd:ConfiguracionesService,
    public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    this.establecerPermisos();

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;



    if(this.usuarioSistemaPrd.esCliente()){
      this.empresasProd.getAllEmp(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
          this.cargandoTablas(datos.datos);
      });
    }else{
      this.empresasProd.getEmpresaById(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos =>{
            this.cargandoTablas([datos.datos]);
      });
    }

  }
  public verdetalleemp(obj: any) {
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['listaempresas', 'empresas', tipoinsert], { state: { data: obj } });
    this.cargando = false;

  }


  public cargandoTablas(arreglo:any){
    this.arreglo = arreglo;
  
    let columnas: Array<tabla> = [
      new tabla("url", "imagen"),
      new tabla("centrocClienteId", "ID empresa"),
      new tabla("razonSocial", "Razón social	", this.esConsultar,this.esConsultar),
      new tabla("nombre", "Nombre de la empresa	"),
      new tabla("rfc", "RFC"),
      new tabla("fechaAlta", "Fecha de registro en el sistema"),
      new tabla("esActivo", "Estatus")
    ];
    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaAlta = datepipe.transform(item.fechaAlta , 'dd-MMM-y')?.replace(".","");;
        
      }
    }

    
    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }



 



  public recibirTabla(obj: any) {

    if (obj.type == "eliminar") {
      this.eliminar(obj.datos);
    }
    if (obj.type == "editar") {
      this.routerPrd.navigate(['listaempresas', 'empresas', 'modifica'], { state: { data: obj.datos } });
    } else if (obj.type == "columna") {
  
      this.configuracionPrd.accesoRuta = true;
      

      datosTemporales.configuracionEmpresaNombreEmpresa = obj.datos.razonSocial;
      
      this.routerPrd.navigate(['/empresa', 'detalle', obj.datos.centrocClienteId, 'representantelegal']);
    }

  }

  public eliminar(indice: any) {


    this.indexSeleccionado = indice.centrocClienteId;
    




    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas desactivar la empresa?")
      .then(valor => {

        if (valor) {




          let id = this.indexSeleccionado;

          this.empresasProd.eliminar(id).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);

            if (datos.resultado) {

               indice.esActivo = false;
            }
          });
        }

      });


     


  }


  public clonar(obj:any){
     return JSON.parse(JSON.stringify(obj));
  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionesPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
  }

}
