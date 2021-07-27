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

      this.selectJornada(this.myForm.controls.sumaHorasJornadaId)

    });;
    }else{

          this.myForm = this.crearForm((objdetrep));
          this.selectJornada(this.myForm.controls.sumaHorasJornadaId)
    }

    this.catalogosPrd.getTipoJornadas(true).subscribe(datos => this.arreglotipojornadas = datos.datos);
    this.catalogosPrd.getSumaHras(true).subscribe(datos => this.arreglosumahoras = datos.datos);
  }

  ngAfterViewInit(): void{

    // this.nombre.nativeElement.focus();

  }

  public crearForm(obj: any) {
    debugger;
      if(!this.esInsert){
        debugger;
        for(let item of obj.nclHorarioJornada){
          
        if(item.dia == 1 && item.esActivo== true){
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if(item.horaInicioComida != undefined){
          let splitHIC = item.horaInicioComida.split(' ');
          let horaHIC = splitHIC[1];
          let splitFHIC = horaHIC.split('.');
          obj.horaInicioComida = splitFHIC[0];
          }
          if(item.horaFinComida != undefined){
          let splitHFC = item.horaFinComida.split(' ');
          let horaHFC = splitHFC[1];
          let splitFHFC = horaHFC.split('.');
          obj.horaFinComida = splitFHFC[0];
          }
          obj.lunes= true;
          obj.horarioJornadaId1= item.horarioJornadaId;
        }
        if(item.dia == 2 && item.esActivo== true){
          obj.martes= true;
          obj.horarioJornadaId2= item.horarioJornadaId;
        }
        if(item.dia == 3 && item.esActivo== true){
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if(item.horaInicioComida != undefined){
          let splitHIC = item.horaInicioComida.split(' ');
          let horaHIC = splitHIC[1];
          let splitFHIC = horaHIC.split('.');
          obj.horaInicioComida = splitFHIC[0];
          }
          if(item.horaFinComida != undefined){
          let splitHFC = item.horaFinComida.split(' ');
          let horaHFC = splitHFC[1];
          let splitFHFC = horaHFC.split('.');
          obj.horaFinComida = splitFHFC[0];
          }
          obj.miercoles= true;
          obj.horarioJornadaId3= item.horarioJornadaId;
        }
        if(item.dia == 4 && item.esActivo== true){
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if(item.horaInicioComida != undefined){
          let splitHIC = item.horaInicioComida.split(' ');
          let horaHIC = splitHIC[1];
          let splitFHIC = horaHIC.split('.');
          obj.horaInicioComida = splitFHIC[0];
          }
          if(item.horaFinComida != undefined){
          let splitHFC = item.horaFinComida.split(' ');
          let horaHFC = splitHFC[1];
          let splitFHFC = horaHFC.split('.');
          obj.horaFinComida = splitFHFC[0];
          }
          obj.jueves= true;
          obj.horarioJornadaId4= item.horarioJornadaId;
        }
        if(item.dia == 5 && item.esActivo== true){
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if(item.horaInicioComida != undefined){
          let splitHIC = item.horaInicioComida.split(' ');
          let horaHIC = splitHIC[1];
          let splitFHIC = horaHIC.split('.');
          obj.horaInicioComida = splitFHIC[0];
          }
          if(item.horaFinComida != undefined){
          let splitHFC = item.horaFinComida.split(' ');
          let horaHFC = splitHFC[1];
          let splitFHFC = horaHFC.split('.');
          obj.horaFinComida = splitFHFC[0];
          }
          obj.viernes= true;
          obj.horarioJornadaId5= item.horarioJornadaId;
        }
        if(item.dia == 6 && item.esActivo== true){
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if(item.horaInicioComida != undefined){
          let splitHIC = item.horaInicioComida.split(' ');
          let horaHIC = splitHIC[1];
          let splitFHIC = horaHIC.split('.');
          obj.horaInicioComida = splitFHIC[0];
          }
          if(item.horaFinComida != undefined){
          let splitHFC = item.horaFinComida.split(' ');
          let horaHFC = splitHFC[1];
          let splitFHFC = horaHFC.split('.');
          obj.horaFinComida = splitFHFC[0];
          }
          obj.sabado= true;
          obj.horarioJornadaId6= item.horarioJornadaId;
        }
        if(item.dia == 7 && item.esActivo== true){
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if(item.horaInicioComida != undefined){
          let splitHIC = item.horaInicioComida.split(' ');
          let horaHIC = splitHIC[1];
          let splitFHIC = horaHIC.split('.');
          obj.horaInicioComida = splitFHIC[0];
          }
          if(item.horaFinComida != undefined){
          let splitHFC = item.horaFinComida.split(' ');
          let horaHFC = splitHFC[1];
          let splitFHFC = horaHFC.split('.');
          obj.horaFinComida = splitFHFC[0];
          }
          obj.domingo= true;
          obj.horarioJornadaId7= item.horarioJornadaId;
        }
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
      horaEntrada: [obj.horaEntrada, [Validators.required]],
      horaSalida: [obj.horaSalida, [Validators.required]],
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
    this.myForm.updateValueAndValidity();
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


        let obj = this.myForm.getRawValue(); 
        debugger;
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
          debugger;

          if(String(obj.sumaHorasJornadaId) === '1') {
 
            if(this.horaSalida !== undefined){
              this.hrInicio(obj.horaEntrada)
              obj.horaSalida = this.horaSalida;
            }
            
          }
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
    this.myForm.clearValidators();
    this.jornada = String(op.value);
    if(this.jornada =='1'){
      this.myForm.controls.horaSalida.disable();
    }
    if(this.jornada =='3'){
      this.myForm.controls.horaInicioComida.setValidators([Validators.required]);
      this.myForm.controls.horaFinComida.setValidators([Validators.required]);
      
    }
  }

  public hrInicio(response : any){
    if(this.jornada === '1') {
      this.myForm.controls.horaSalida.disable();
      let hr : number;
      let newValue : any;
      if(response.value !== undefined){
        hr = Number(response.value.substring(0,2))+8;
        newValue = response.value.replace(response.value.substring(0,2),Number(response.value.substring(0,2))+8)

      } else {
         hr = Number(response.substring(0,2))+8;
         newValue = response.replace(response.substring(0,2),Number(response.substring(0,2))+8)


      }

    if(hr  === 8 || hr === 9){
      newValue = response.value.replace(response.value.substring(0,2),'0'+String(hr))
    }
    if(hr > 23) {
      newValue = response.value.replace(response.value.substring(0,2),'0'+String(hr - 24))
    }

    this.myForm.controls.horaSalida.setValue(newValue);
    this.myForm.value.horaSalida = newValue ;

    this.horaSalida = newValue;
   
    }
    
  }

}
