import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { JornadalaboralService } from '../../services/jornadalaboral.service';

@Component({
  selector: 'app-listajornadalaboral',
  templateUrl: './listajornadalaboral.component.html',
  styleUrls: ['./listajornadalaboral.component.scss']
})
export class ListajornadalaboralComponent implements OnInit {


  public tamanio: number = 0;
  public objEnviar: any;
  public changeIconDown: boolean = false;
  public nombre: string = "";
  public cargando: boolean = false;
  public id_empresa: number = 0;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallegrupo: boolean = false;

  public indexSeleccionado: number = 0;



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDesglose:any = {
    columnas:[],
    filas:[]
  };



  public arreglo: any = [];
  public arreglodetalle: any = [];

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
  

  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;



 

  constructor(private jornadaPrd: JornadalaboralService, private routerPrd: Router,
    private routerActive: ActivatedRoute, private modalPrd: ModalService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {



    this.establecerPermisos();
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];

      this.cargando = true;

      this.jornadaPrd.getAllJornada(this.id_empresa).subscribe(datos => {
        this.arreglo = datos.datos;
        let columnas: Array<tabla> = [
          new tabla("nombre", "Nombre de jornada"),
          new tabla("descripcion", "Tipo de jornada"),
          new tabla("count", "Número de empleados",true,true,true)
        ];
    
    
        this.arreglotabla = {
          columnas: [],
          filas: []
        };
    
        this.arreglotabla.columnas = columnas;
        this.arreglotabla.filas = this.arreglo;
    
        this.cargando = false;
    
      });

    });

  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionesPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
  }

  public filtrar() {

  }


  public eliminar(obj: any) {

    this.objEnviar = {
      jornadaId: obj.jornadaId,
      centrocClienteId: {
        centrocClienteId: this.id_empresa
      }
    }



    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas eliminar la jornada laboral?").then(valor => {
      if (valor) {


        this.jornadaPrd.eliminar(this.objEnviar).subscribe(datos => {

          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);

          if (datos.resultado) {
            this.ngOnInit();
          }


        });
      }
    });



  }

  public verdetalle(obj: any) {
    if (obj == undefined) {
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'jornadalaboral', 'nuevo']);
    } else {
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'jornadalaboral', 'editar'], { state: { data: obj } });
    }
  }

  apagando(indice: number) {



    for (let x = 0; x < this.arreglo.length; x++) {
      if (x == indice)
        continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;

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


    let jornadaitem = this.arreglo[indice];

    this.cargandodetallegrupo = true;
    
    this.jornadaPrd.getdetalleJornada(this.id_empresa, jornadaitem.jornadaId).subscribe(datos => {
      
      this.cargandodetallegrupo = false;
      
      this.arreglodetalle = datos.datos == undefined ? [] : datos.datos;
      if (this.arreglodetalle !== undefined){
        for (let item of this.arreglodetalle){
          item.nombrecompleto = `${item.nombre == undefined ? '':item.nombre} ${item.apellidop == undefined ? '':item.apellidop} ${item.apellidom == undefined ? '':item.apellidom}`;
          
        }
      }
    });

  }

  public recibirTabla(obj: any) {
    debugger;
    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "eliminar":
        this.eliminar(obj.datos);
        break;
      case "columna":
          this.traerModal(obj.indice);
        break;
      case "desglosar":
        let item = obj.datos;
        this.jornadaPrd.getdetalleJornadaHorario(this.id_empresa, item.jornadaId).subscribe(datos => {
          debugger;
          this.arreglodetalle = datos.datos == undefined ? [] : datos.datos;

          for(let item of this.arreglodetalle.nclHorarioJornada){
            if(item.dia == 1 && item.esActivo== true){
              let splitHE = item.horaEntrada.split(' ');
              let horaHE = splitHE[1];
              let splitFHE = horaHE.split('.');
              this.arreglodetalle.horaEntrada = splitFHE[0];
              let splitHS = item.horaSalida.split(' ');
              let horaHS = splitHS[1];
              let splitFHS = horaHS.split('.');
              this.arreglodetalle.horaSalida = splitFHS[0];
              if(item.horaInicioComida != undefined){
              let splitHIC = item.horaInicioComida.split(' ');
              let horaHIC = splitHIC[1];
              let splitFHIC = horaHIC.split('.');
              this.arreglodetalle.horaInicioComida = splitFHIC[0];
              }
              if(item.horaFinComida != undefined){
              let splitHFC = item.horaFinComida.split(' ');
              let horaHFC = splitHFC[1];
              let splitFHFC = horaHFC.split('.');
              this.arreglodetalle.horaFinComida = splitFHFC[0];
              }
              this.arreglodetalle.lunes= true;
              this.arreglodetalle.horarioJornadaId1= item.horarioJornadaId;
            }
            if(item.dia == 2 && item.esActivo== true){
                let splitHE = item.horaEntrada.split(' ');
                let horaHE = splitHE[1];
                let splitFHE = horaHE.split('.');
                this.arreglodetalle.horaEntrada = splitFHE[0];
                let splitHS = item.horaSalida.split(' ');
                let horaHS = splitHS[1];
                let splitFHS = horaHS.split('.');
                this.arreglodetalle.horaSalida = splitFHS[0];
                if(item.horaInicioComida != undefined){
                let splitHIC = item.horaInicioComida.split(' ');
                let horaHIC = splitHIC[1];
                let splitFHIC = horaHIC.split('.');
                this.arreglodetalle.horaInicioComida = splitFHIC[0];
                }
                if(item.horaFinComida != undefined){
                let splitHFC = item.horaFinComida.split(' ');
                let horaHFC = splitHFC[1];
                let splitFHFC = horaHFC.split('.');
                this.arreglodetalle.horaFinComida = splitFHFC[0];
                }
              this.arreglodetalle.martes= true;
              this.arreglodetalle.horarioJornadaId2= item.horarioJornadaId;
            }
            if(item.dia == 3 && item.esActivo== true){
                let splitHE = item.horaEntrada.split(' ');
                let horaHE = splitHE[1];
                let splitFHE = horaHE.split('.');
                this.arreglodetalle.horaEntrada = splitFHE[0];
                let splitHS = item.horaSalida.split(' ');
                let horaHS = splitHS[1];
                let splitFHS = horaHS.split('.');
                this.arreglodetalle.horaSalida = splitFHS[0];
                if(item.horaInicioComida != undefined){
                let splitHIC = item.horaInicioComida.split(' ');
                let horaHIC = splitHIC[1];
                let splitFHIC = horaHIC.split('.');
                this.arreglodetalle.horaInicioComida = splitFHIC[0];
                }
                if(item.horaFinComida != undefined){
                let splitHFC = item.horaFinComida.split(' ');
                let horaHFC = splitHFC[1];
                let splitFHFC = horaHFC.split('.');
                this.arreglodetalle.horaFinComida = splitFHFC[0];
                }
              this.arreglodetalle.miercoles= true;
              this.arreglodetalle.horarioJornadaId3= item.horarioJornadaId;
            }
            if(item.dia == 4 && item.esActivo== true){
                let splitHE = item.horaEntrada.split(' ');
                let horaHE = splitHE[1];
                let splitFHE = horaHE.split('.');
                this.arreglodetalle.horaEntrada = splitFHE[0];
                let splitHS = item.horaSalida.split(' ');
                let horaHS = splitHS[1];
                let splitFHS = horaHS.split('.');
                this.arreglodetalle.horaSalida = splitFHS[0];
                if(item.horaInicioComida != undefined){
                let splitHIC = item.horaInicioComida.split(' ');
                let horaHIC = splitHIC[1];
                let splitFHIC = horaHIC.split('.');
                this.arreglodetalle.horaInicioComida = splitFHIC[0];
                }
                if(item.horaFinComida != undefined){
                let splitHFC = item.horaFinComida.split(' ');
                let horaHFC = splitHFC[1];
                let splitFHFC = horaHFC.split('.');
                this.arreglodetalle.horaFinComida = splitFHFC[0];
                }
              this.arreglodetalle.jueves= true;
              this.arreglodetalle.horarioJornadaId4= item.horarioJornadaId;
            }
            if(item.dia == 5 && item.esActivo== true){
                let splitHE = item.horaEntrada.split(' ');
                let horaHE = splitHE[1];
                let splitFHE = horaHE.split('.');
                this.arreglodetalle.horaEntrada = splitFHE[0];
                let splitHS = item.horaSalida.split(' ');
                let horaHS = splitHS[1];
                let splitFHS = horaHS.split('.');
                this.arreglodetalle.horaSalida = splitFHS[0];
                if(item.horaInicioComida != undefined){
                let splitHIC = item.horaInicioComida.split(' ');
                let horaHIC = splitHIC[1];
                let splitFHIC = horaHIC.split('.');
                this.arreglodetalle.horaInicioComida = splitFHIC[0];
                }
                if(item.horaFinComida != undefined){
                let splitHFC = item.horaFinComida.split(' ');
                let horaHFC = splitHFC[1];
                let splitFHFC = horaHFC.split('.');
                this.arreglodetalle.horaFinComida = splitFHFC[0];
                }
              this.arreglodetalle.viernes= true;
              this.arreglodetalle.horarioJornadaId5= item.horarioJornadaId;
            }
            if(item.dia == 6 && item.esActivo== true){
                let splitHE = item.horaEntrada.split(' ');
                let horaHE = splitHE[1];
                let splitFHE = horaHE.split('.');
                this.arreglodetalle.horaEntrada = splitFHE[0];
                let splitHS = item.horaSalida.split(' ');
                let horaHS = splitHS[1];
                let splitFHS = horaHS.split('.');
                this.arreglodetalle.horaSalida = splitFHS[0];
                if(item.horaInicioComida != undefined){
                let splitHIC = item.horaInicioComida.split(' ');
                let horaHIC = splitHIC[1];
                let splitFHIC = horaHIC.split('.');
                this.arreglodetalle.horaInicioComida = splitFHIC[0];
                }
                if(item.horaFinComida != undefined){
                let splitHFC = item.horaFinComida.split(' ');
                let horaHFC = splitHFC[1];
                let splitFHFC = horaHFC.split('.');
                this.arreglodetalle.horaFinComida = splitFHFC[0];
                }
              this.arreglodetalle.sabado= true;
              this.arreglodetalle.horarioJornadaId6= item.horarioJornadaId;
            }
            if(item.dia == 7 && item.esActivo== true){
                let splitHE = item.horaEntrada.split(' ');
                let horaHE = splitHE[1];
                let splitFHE = horaHE.split('.');
                this.arreglodetalle.horaEntrada = splitFHE[0];
                let splitHS = item.horaSalida.split(' ');
                let horaHS = splitHS[1];
                let splitFHS = horaHS.split('.');
                this.arreglodetalle.horaSalida = splitFHS[0];
                if(item.horaInicioComida != undefined){
                let splitHIC = item.horaInicioComida.split(' ');
                let horaHIC = splitHIC[1];
                let splitFHIC = horaHIC.split('.');
                this.arreglodetalle.horaInicioComida = splitFHIC[0];
                }
                if(item.horaFinComida != undefined){
                let splitHFC = item.horaFinComida.split(' ');
                let horaHFC = splitHFC[1];
                let splitFHFC = horaHFC.split('.');
                this.arreglodetalle.horaFinComida = splitFHFC[0];
                }
              this.arreglodetalle.domingo= true;
              this.arreglodetalle.horarioJornadaId7= item.horarioJornadaId;
            }

        }
          
          
          
        
     

        let columnas:Array<tabla>=[
          new tabla("nombre","Nombre de jornada"),
          new tabla("tipoJornada","Tipo de Jornada"),
          new tabla("sumaHorasJornada","Suma de horas para jornada"),
          new tabla("horaEntrada","Hora de entrada"),
          new tabla("horaSalida","Hora de salida"),
          new tabla("horaInicioComida","Hora de inicio de comida"),
          new tabla("horaFinComida","Hora fin de comida"),
          new tabla("x",""),
          new tabla("x",""),
          new tabla("x","Días de trabajo :"),
          new tabla("x",""),
          new tabla("x",""),
          new tabla("lunes","Lunes"),
          new tabla("martes","Martes"),
          new tabla("miercoles","Miercoles"),
          new tabla("jueves","Jueves"),
          new tabla("viernes","Viernes"),
          new tabla("sabado","Sábado"),
          new tabla("domingo","Domingo")];

          this.arreglodetalle.lunes = this.arreglodetalle.lunes?"Si":"No";
          this.arreglodetalle.martes = this.arreglodetalle.martes?"Si":"No";
          this.arreglodetalle.miercoles = this.arreglodetalle.miercoles?"Si":"No";
          this.arreglodetalle.jueves = this.arreglodetalle.jueves?"Si":"No";
          this.arreglodetalle.viernes = this.arreglodetalle.viernes?"Si":"No";
          this.arreglodetalle.sabado = this.arreglodetalle.sabado?"Si":"No";
          this.arreglodetalle.domingo = this.arreglodetalle.domingo?"Si":"No";
          this.arreglodetalle.tipoJornada = this.arreglodetalle.tipoJornadaId.descripcion;
          this.arreglodetalle.sumaHorasJornada = this.arreglodetalle.sumaHorasJornadaId.descripcion; 


        this.arreglotablaDesglose.columnas = columnas;
        this.arreglotablaDesglose.filas = this.arreglodetalle;

        
        item.cargandoDetalle = false;
        });
        break;
        
    }
  }


}
