import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { EventosService } from 'src/app/modules/eventos/services/eventos.service';


@Component({
  selector: 'app-ventana-eventos',
  templateUrl: './ventana-eventos.component.html',
  styleUrls: ['./ventana-eventos.component.scss']
})
export class VentanaEventosComponent implements OnInit {
  @ViewChild("inputFile") public inputFile!: ElementRef;
  @Output() salida = new EventEmitter<any>();


  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public arregloIncidenciaTipo: any = [];
  public arregloEmpleados: any = [];
  public arregloTipoIncapacidad: any = [];
  public tagcomponente: boolean = false;
  public arregloUnidadMedida: any = [];
  public arregloUnidadMedidaDia: any = [];
  public arregloFechas: any = [];
  public archivo: string = '';
  public nombreArchivo: string = "";
  public empleado: number = 0;
  public fechaContrato: string = '';

  public esDomingo:boolean = false;


  @Input() public datos:any;


  constructor(private modalPrd: ModalService, private catalogosPrd: CatalogosService, private formbuilder: FormBuilder, private usuarioSistemaPrd: UsuarioSistemaService,
    private empleadosPrd: EmpleadosService, private router: Router, private eventoPrd: EventosService,
    public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    debugger;
    
    if(this.datos.idEmpleado != undefined){
      this.empleado = this.datos.idEmpleado;
    }
    if(this.datos.fechaContrato != undefined){
      this.fechaContrato = this.datos.fechaContrato;
    }


    this.myForm = this.createForms({});

    this.suscribirse();
    this.catalogosPrd.getTipoIncidencia(true).subscribe(datos => this.arregloIncidenciaTipo = datos.datos);
    this.catalogosPrd.getTipoIncapacidad(true).subscribe(datos => this.arregloTipoIncapacidad = datos.datos);
    this.catalogosPrd.getUnidadMedida(true).subscribe(datos => {
      this.arregloUnidadMedida = [];
      this.arregloUnidadMedidaDia = [];
      if (datos.datos) {
        for (let item of datos.datos) {
          if (item.unidadMedidaId == 2) {
            continue;
          }
          this.arregloUnidadMedida.push(item);
        }
        for (let itemDia of datos.datos) {
          if (itemDia.unidadMedidaId == 1) {
            continue;
          }
          this.arregloUnidadMedidaDia.push(itemDia);
        }
      }

    });
  }


  public ocultarMontoTemp:boolean = false;
  public ocultarHorasTemp:boolean = false;
  public ocultarDiasTemp:boolean = false;

  public suscribirse() {
    this.myForm.controls.unidadmedida.valueChanges.subscribe(valor => {

      this.ocultarHorasTemp = false;
      this.ocultarMontoTemp = false;
      this.ocultarDiasTemp = false;

      switch (valor) {
        case "1":
          this.myForm.controls.numerohoras.setValidators([Validators.required]);
          this.myForm.controls.numerohoras.updateValueAndValidity();

          this.myForm.controls.monto.clearValidators();
          this.myForm.controls.monto.updateValueAndValidity();
          this.ocultarMontoTemp = true;
          
          break;
        case "2":
          
            this.myForm.controls.monto.clearValidators();
            this.myForm.controls.monto.updateValueAndValidity();
            this.myForm.controls.duracion.setValidators([Validators.required]);
            this.myForm.controls.duracion.updateValueAndValidity();
            this.ocultarMontoTemp = true;
            this.tagcomponente = true;
            
            break;
        case "3":

          this.myForm.controls.duracion.setValidators([]);
          this.myForm.controls.duracion.updateValueAndValidity();
          this.myForm.controls.numerohoras.setValidators([]);
          this.myForm.controls.numerohoras.updateValueAndValidity();
          this.myForm.controls.monto.setValidators([Validators.required]);
          this.myForm.controls.monto.updateValueAndValidity();
          this.ocultarHorasTemp = true;
          this.ocultarDiasTemp = true;
          this.tagcomponente = false;
          break;
      }
    });
  }
  public createForms(obj: any) {
    var datePipe = new DatePipe("es-MX");
    return this.formbuilder.group({
      incidenciaId: ['', [Validators.required]],
      //personaId: ['', [Validators.required]],
      duracion: ['', Validators.required],
      fechaInicio: [datePipe.transform(new Date(), "yyyy-MM-dd"), Validators.required],
      monto: ['', [Validators.required]],
      fechaFin: [{ value: datePipe.transform(new Date(), "yyyy-MM-dd"), disabled: true }, Validators.required],
      fechaAplicacion: ['', Validators.required],
      tipoIncapacidadId: ['', Validators.required],
      archivo: [''],
      numeroFolio: ['', Validators.required],
      comentarios: [''],
      identificadorPersona: [''],
      fechaContrato: [''],
      unidadmedida: [],
      numerohoras: []

    });
  }


  public get f() {
    return this.myForm.controls;
  }

  public enviarPeticion() {
    this.submitEnviado = true;

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    if(this.arregloFechas.length !== 0){
      let duracion = this.myForm.controls.duracion.value;
      if(this.arregloFechas.length < Number(duracion)){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"El número de días no coincide con las fechas seleccionadas");
        return;

      }
    }
    let submensaje;
    submensaje = "Deberás recalcular la nómina para que se considere en el cálculo";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas registrar el evento?", submensaje).then(valor => {
      debugger;
      if (valor) {
        this.myForm.controls.identificadorPersona.setValue(this.empleado);
        let obj = this.myForm.getRawValue();
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        
        let objEnviar = {
          ...obj,
          tipoIncapacidadId: {
            tipoIncapacidadId: obj.tipoIncapacidadId
          },
          tipoIncidenciaId: {
            tipoIncidenciaId: obj.incidenciaId
          },
          personaId: this.empleado,
          clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
          fechaContrato: this.fechaContrato,
          archivo:  obj.archivo,
          nombreArchivo: this.nombreArchivo
        }
    
    
        let seleccionado = Number(this.myForm.controls.incidenciaId.value);
        let multifechas: boolean = (seleccionado == 1 || seleccionado == 2 || seleccionado == 5 || seleccionado == 11 || seleccionado == 16 || seleccionado == 9);
        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
    
            delete objEnviar.fechaFin;
            delete objEnviar.urlArchivo;
            delete objEnviar.archivo; 
            delete objEnviar.nombreArchivo; 
            delete objEnviar.numeroFolio;
            delete objEnviar.tipoIncapacidadId;
    
            if(!this.tagcomponente){
              multifechas = false;
              delete objEnviar.duracion;
              objEnviar.unidadMedidaId = {
                unidadMedidaId: obj.unidadmedida
              }
              objEnviar.heTiempo = obj.numerohoras;
    
            }else{
              multifechas = true;
              delete objEnviar.monto;
              delete objEnviar.unidadmedida;
              delete objEnviar.numerohoras;
            }
            break;
          case 11:
          case 16:
            delete objEnviar.numeroFolio;
            delete objEnviar.numerohoras;
            delete objEnviar.unidadmedida;
            delete objEnviar.urlArchivo;
            delete objEnviar.archivo;
            delete objEnviar.nombreArchivo; 
            delete objEnviar.fechaFin;
            delete objEnviar.tipoIncapacidadId;
            break;
          case 13:
          case 14:
            delete objEnviar.duracion;
            delete objEnviar.numeroFolio;
            delete objEnviar.urlArchivo;
            delete objEnviar.archivo;
            delete objEnviar.nombreArchivo; 
            delete objEnviar.fechaFin;
            delete objEnviar.tipoIncapacidadId;
            objEnviar.unidadMedidaId = {
              unidadMedidaId: obj.unidadmedida
            }
            objEnviar.heTiempo = obj.numerohoras;
            break;
          case 3:
            delete objEnviar.monto;
            delete objEnviar.numerohoras;
            break;
          case 9:
            delete objEnviar.tipoIncapacidadId;
            delete objEnviar.fechaInicio;
            delete objEnviar.monto;
            delete objEnviar.numeroFolio;
            delete objEnviar.numerohoras;
            delete objEnviar.unidadmedida;
            delete objEnviar.urlArchivo;
            delete objEnviar.archivo;
            delete objEnviar.nombreArchivo; 
            delete objEnviar.fechaFin;
    
    
            break;
          case 8:
            delete objEnviar.tipoIncapacidadId;
            delete objEnviar.fechaFin;
            delete objEnviar.duracion;
            delete objEnviar.urlArchivo;
            delete objEnviar.archivo;
            delete objEnviar.nombreArchivo; 
            delete objEnviar.numeroFolio;
            delete objEnviar.unidadmedida;
            delete objEnviar.numerohoras;
            break;
        }
    
        delete objEnviar.incidenciaId;
    
        let objEnviarArray: Array<any>;
    
    
    
    
        if (multifechas) {
          objEnviarArray = [];
          for (let item of this.arregloFechas) {
            let aux = JSON.parse(JSON.stringify(objEnviar));
            aux.fechaInicio = new DatePipe("es-MX").transform(item,"yyyy-MM-dd");
            aux.duracion = 1;
            objEnviarArray.push(aux);
          }
        } else {
          objEnviarArray = [objEnviar]
        }

        this.salida.emit({type:"guardar",datos: objEnviarArray});
      }
    });;


  }



  public cancelar() {
    this.salida.emit({ type: "cancelar" });
  }


  public abrirArchivo() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputFile.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.nombreArchivo = this.inputFile.nativeElement.value;
          this.myForm.controls.archivo.setValue(this.arrayBufferToBase64(datos));
        });


      }

    }
  }

  public arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }


  public verificar(cadena: string) {

    let ocultar = true;
    let seleccionado = Number(this.myForm.controls.incidenciaId.value);
  

    var datePipe = new DatePipe("es-MX");
    switch (cadena) {
      case "dias":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
          case 3:
          case 9:
          case 10:
          case 11:
          case 16:
            ocultar = false;
            break;
        }
        break;
      case "fecha":
        switch (seleccionado) {
          case 4:
          case 8:
          case 10:
          case 11:
          case 13:
          case 14:
          case 16:
          case 1:
          case 2:
          case 5:
          case 9:
            ocultar = false;
            break;
        }
        break;
      case "monto":
        switch (seleccionado) {
          case 4:
          case 8:
          case 5:  
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
      case "fechainicio":

        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;
        }

        break;
      case "fechafin":

        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;
        }


        break;
      case "fechaaplicacion":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
          case 4:
          case 3:
          case 8:
          case 9:
          case 10:
          case 11:
          case 16:
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
      case "incapacidad":
        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;
        }
        break;
      case "archivo":
        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;   
        }
        break;
      case "folio":
        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;
        }
        break;
      case "monto2":
        
        break;
      case "unidad":
        switch (seleccionado) {
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
      case "unidadDia":
          switch (seleccionado) {
            case 5:
              ocultar = false;
              break;
          }
         break;  
      case "horas":
        switch (seleccionado) {
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
    }


    return ocultar;
  }

  public configurandoRestricciones() {
    debugger;

    let seleccionado = Number(this.myForm.controls.incidenciaId.value);

    this.esDomingo = (9 == seleccionado);

    this.myForm.controls.duracion.setValue("");

    let multifechas: boolean = (seleccionado == 1 || seleccionado == 2 || seleccionado == 5 || seleccionado == 11 || seleccionado == 16 || seleccionado == 9);
    if (multifechas) {
      this.myForm.controls.fechaInicio.setValue("");
    }
    for (let llave in this.myForm.controls) {
      if (llave == "incidenciaId")
        continue;


      this.myForm.controls[llave].clearValidators();
      this.myForm.controls[llave].updateValueAndValidity();
    }



    this.tagcomponente = (seleccionado == 1 || seleccionado == 2 || seleccionado == 5 || seleccionado == 11 || seleccionado == 16 || seleccionado == 9);




    if (seleccionado == 1 || seleccionado == 2 || seleccionado == 5) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.fechaFin.setValidators([Validators.required]);
      this.myForm.controls.fechaFin.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
    }
    if (seleccionado == 5) {
      this.myForm.controls.unidadmedida.setValidators([Validators.required]);
      this.myForm.controls.unidadmedida.updateValueAndValidity();
      this.myForm.controls.monto.setValidators([Validators.required]);
      this.myForm.controls.monto.updateValueAndValidity();
    }
    if (seleccionado == 4) {
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.monto.setValidators([Validators.required]);
      this.myForm.controls.monto.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
    }

    if (seleccionado == 3) {

      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.fechaFin.setValidators([Validators.required]);
      this.myForm.controls.fechaFin.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
      this.myForm.controls.tipoIncapacidadId.setValidators([Validators.required]);
      this.myForm.controls.tipoIncapacidadId.updateValueAndValidity();
      this.myForm.controls.numeroFolio.setValidators([Validators.required]);
      this.myForm.controls.numeroFolio.updateValueAndValidity();
    }

    if (seleccionado == 8 || seleccionado == 13 || seleccionado == 14) {
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.monto.setValidators([Validators.required]);
      this.myForm.controls.monto.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
    }

    if (seleccionado == 13 || seleccionado == 14) {
      this.myForm.controls.unidadmedida.setValidators([Validators.required]);
      this.myForm.controls.unidadmedida.updateValueAndValidity();
      this.myForm.controls.numerohoras.setValidators([Validators.required]);
      this.myForm.controls.numerohoras.updateValueAndValidity();
    }

    if (seleccionado == 9) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();

      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
    }

    if (seleccionado == 10 || seleccionado == 11 || seleccionado == 16) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
    }
  }


  public perderFoco() {
 
    const totalDias = this.myForm.controls.duracion.value;
    
    if (totalDias) {
      if (this.myForm.controls.fechaInicio.value) {
        var datePipe = new DatePipe("es-MX");
        let fechaActual = new Date((new Date(this.myForm.controls.fechaInicio.value)).toUTCString().replace("GMT", ""));
        let fechaFin: Date = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + (Number(totalDias) <= 0 ? 0 : Number(totalDias) - 1));

        this.myForm.controls.fechaFin.setValue(datePipe.transform(fechaFin, "yyyy-MM-dd"));
      }

    }
  }


  public recibirEtiquetas(obj: any) {

    if(obj.type == "error"){
      this.modalPrd.showMessageDialog(this.modalPrd.error,"Para prima dominical solo seleccionar domingos");
      return;
    }
    let fecha = obj.lenght == 0 ? "" : obj[0];
    this.myForm.controls.fechaInicio.setValue(fecha);
    this.arregloFechas = obj;
  }

}