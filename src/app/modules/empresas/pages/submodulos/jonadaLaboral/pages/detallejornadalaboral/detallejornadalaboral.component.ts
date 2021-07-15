import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { JornadalaboralService } from '../../services/jornadalaboral.service';

@Component({
  selector: 'app-detallejornadalaboral',
  templateUrl: './detallejornadalaboral.component.html',
  styleUrls: ['./detallejornadalaboral.component.scss']
})
export class DetallejornadalaboralComponent implements OnInit {
  @ViewChild("nombre") public nombre!:ElementRef;
  public myForm!: FormGroup;

  public submitInvalido: boolean = false;
  public esInsert: boolean = false;
  public id_empresa: number = 0;
  public activadoISR: boolean = false;
  public arreglotipojornadas:any = [];
  public peticion:any = [];
  public arreglosumahoras: any =[];
  public arreglodetalleJornada: any =[];
  public horarioComida: boolean = false;
  public jornada: any;
  public horaSalida : any;


  



  constructor(private formbuilder: FormBuilder, private activeprd: ActivatedRoute,
    private routerPrd: Router, private jornadaPrd: JornadalaboralService,
    private catalogosPrd:CatalogosService,private modalPrd:ModalService) { 

      this.activeprd.params.subscribe(datos => {
        this.esInsert = (datos["tipoinsert"] == 'nuevo');
        this.id_empresa = datos["id"]
      });

    }

  ngOnInit(): void {
    
    
    let objdetrep = history.state.data == undefined ? {} : history.state.data;
    if(!this.esInsert){
    this.jornadaPrd.getdetalleJornadaHorario(this.id_empresa,objdetrep.jornadaId).subscribe(datos =>{  
      this.arreglodetalleJornada = datos.datos
      this.myForm = this.crearForm(this.arreglodetalleJornada);

    });;
    }else{

          this.myForm = this.crearForm((objdetrep));
    }

    this.catalogosPrd.getTipoJornadas(true).subscribe(datos => this.arreglotipojornadas = datos.datos);
    this.catalogosPrd.getSumaHras(true).subscribe(datos => this.arreglosumahoras = datos.datos);
  }

  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }

  public crearForm(obj: any) {
      if(!this.esInsert){
        if(obj.nclHorarioJornada[0].dia == 1 && obj.nclHorarioJornada[0].esActivo== true){
          let splitHE = obj.nclHorarioJornada[0].horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = obj.nclHorarioJornada[0].horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if(obj.nclHorarioJornada[0].horaInicioComida != undefined){
          let splitHIC = obj.nclHorarioJornada[0].horaInicioComida.split(' ');
          let horaHIC = splitHIC[1];
          let splitFHIC = horaHIC.split('.');
          obj.horaInicioComida = splitFHIC[0];
          }
          if(obj.nclHorarioJornada[0].horaFinComida != undefined){
          let splitHFC = obj.nclHorarioJornada[0].horaFinComida.split(' ');
          let horaHFC = splitHFC[1];
          let splitFHFC = horaHFC.split('.');
          obj.horaFinComida = splitFHFC[0];
          }
          obj.lunes= true;
          obj.horarioJornadaId1= obj.nclHorarioJornada[0].horarioJornadaId;
        }
        if(obj.nclHorarioJornada[1].dia == 2 && obj.nclHorarioJornada[1].esActivo== true){
          obj.martes= true;
          obj.horarioJornadaId2= obj.nclHorarioJornada[1].horarioJornadaId;
        }
        if(obj.nclHorarioJornada[2].dia == 3 && obj.nclHorarioJornada[2].esActivo== true){
          obj.miercoles= true;
          obj.horarioJornadaId3= obj.nclHorarioJornada[2].horarioJornadaId;
        }
        if(obj.nclHorarioJornada[3].dia == 4 && obj.nclHorarioJornada[3].esActivo== true){
          obj.jueves= true;
          obj.horarioJornadaId4= obj.nclHorarioJornada[3].horarioJornadaId;
        }
        if(obj.nclHorarioJornada[4].dia == 5 && obj.nclHorarioJornada[4].esActivo== true){
          obj.viernes= true;
          obj.horarioJornadaId5= obj.nclHorarioJornada[4].horarioJornadaId;
        }
        if(obj.nclHorarioJornada[5].dia == 6 && obj.nclHorarioJornada[5].esActivo== true){
          obj.sabado= true;
          obj.horarioJornadaId6= obj.nclHorarioJornada[5].horarioJornadaId;
        }
        if(obj.nclHorarioJornada[6].dia == 7 && obj.nclHorarioJornada[6].esActivo== true){
          obj.domingo= true;
          obj.horarioJornadaId7= obj.nclHorarioJornada[6].horarioJornadaId;
        }

      }else{
      obj.lunes= true;
      obj.martes= true;
      obj.miercoles= true;
      obj.jueves= true;
      obj.viernes= true;
      }

    
    return this.formbuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      tipoJornadaId: [obj.tipoJornadaId?.tipoJornadaId, [Validators.required]],
      sumaHorasJornadaId: [obj.sumaHorasJornadaId?.sumaHorasJornadaId, [Validators.required]],
      horaEntrada: [{value:obj.horaEntrada, disabled: true}, [Validators.required]],
      horaSalida: [{value:obj.horaSalida, disabled: true}, [Validators.required]],
      horaInicioComida: [obj.horaInicioComida],
      horaFinComida: [obj.horaFinComida],
      lunes: obj.lunes,
      martes: obj.martes,
      miercoles: obj.miercoles,
      jueves: obj.jueves,
      viernes: obj.viernes,
      sabado: obj.sabado,
      domingo: obj.domingo,
      jornadaId: obj.jornadaId


    });
  }


  


  public enviarPeticion() {
    this.submitInvalido = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    const titulo = this.esInsert ? "¿Deseas registrar la jornada laboral?" : "¿Deseas actualizar los datos de la jornada laboral?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(this.myForm.value.sumaHorasJornadaId === '1'){
        this.myForm.value.horaSalida = this.horaSalida;
      }
      if(valor){


        let obj = this.myForm.value; 
        if(!obj.lunes){obj.lunes = false}
        if(!obj.martes){obj.martes = false}
        if(!obj.miercoles){obj.miercoles = false}
        if(!obj.jueves){obj.jueves = false}
        if(!obj.viernes){obj.viernes = false}
        if(!obj.sabado){obj.sabado = false}
        if(!obj.domingo){obj.domingo = false}
        if(obj.horaInicioComida != null)
        {
        this.horarioComida = true
        }else{
          this.horarioComida= false
        }

        this.peticion = {
          tipoJornadaId: {
            tipoJornadaId: obj.tipoJornadaId,
          },
          nombre: obj.nombre,
          mismoHorario: false,
          horarioComida: this.horarioComida,
          sumaHorasJornadaId: {
            sumaHorasJornadaId: obj.sumaHorasJornadaId,
          },
          horaEntrada: obj.horaEntrada,
          horaInicioComida: obj.horaInicioComida,
          horaFinComida: obj.horaFinComida,
          horaSalida: obj.horaSalida,
          centrocClienteId: {
            centrocClienteId: this.id_empresa
            
            },
         
          nclHorarioJornada: [
            {
              dia: 1,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.lunes
              
            },
             {
              dia: 2,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.martes
              
            },
             {
              dia: 3,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.miercoles
              
            },
             {
              dia: 4,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.jueves
              
            },
             {
              dia: 5,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.viernes
              
            },
             {
              dia: 6,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.sabado
              
            },
             {
              dia: 7,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.domingo
              
            }
          ]
        };

        if (this.esInsert) {
          debugger;
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.jornadaPrd.save(this.peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
           this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
             if(datos.resultado){
              this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
             }
           });

          });
        } else {
          this.peticion = {
            jornadaId: obj.jornadaId,
            tipoJornadaId: {
              tipoJornadaId: obj.tipoJornadaId,
            },
            nombre: obj.nombre,
            mismoHorario: false,
            horarioComida: this.horarioComida,
            sumaHorasJornadaId: {
              sumaHorasJornadaId: obj.sumaHorasJornadaId,
            },
            horaEntrada: obj.horaEntrada,
            horaInicioComida: obj.horaInicioComida,
            horaFinComida: obj.horaFinComida,
            horaSalida: obj.horaSalida,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
              
              },
           
            nclHorarioJornada: [
              {
                dia: 1,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId1,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.lunes
                
              },
               {
                dia: 2,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId2,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.martes
                
              },
               {
                dia: 3,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId3,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.miercoles
                
              },
               {
                dia: 4,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId4,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.jueves
                
              },
               {
                dia: 5,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId5,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.viernes
                
              },
               {
                dia: 6,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId6,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.sabado
                
              },
               {
                dia: 7,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId7,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.domingo
                
              }
            ]
          };


          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.jornadaPrd.modificar(this.peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
               this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
              }
            });

          });

        }
      }
    });
    

  }

  public cancelar() {
    this.routerPrd.navigate(['/empresa/detalle', this.id_empresa, 'jornadalaboral']);
  }

  get f() {
    return this.myForm.controls;
  }


  public activar(obj: any) {
    this.activadoISR = obj.checked;
  }

  public selectJornada(op: any){
    this.jornada = op.value;

    this.myForm.controls.horaEntrada.enable();
    this.myForm.controls.horaSalida.enable();
    if(op.value =='3'){
      this.myForm.controls.horaInicioComida.setErrors({required: true});
      this.myForm.controls.horaFinComida.setErrors({required: true});
      
    }
  }

  public hrInicio(response : any){
    if(this.jornada === '1') {
    let hr = Number(response.value.substring(0,2))+8;
    let newValue : any;
    newValue = response.value.replace(response.value.substring(0,2),Number(response.value.substring(0,2))+8)
    if(hr  === 8 || hr === 9){
      newValue = response.value.replace(response.value.substring(0,2),'0'+String(hr))
    }
    if(hr > 23) {
      newValue = response.value.replace(response.value.substring(0,2),'0'+String(hr - 24))
    }

    this.myForm.controls.horaSalida.setValue(newValue);
    this.horaSalida = newValue;
    this.myForm.controls.horaSalida.disable();
    }
  }

}
