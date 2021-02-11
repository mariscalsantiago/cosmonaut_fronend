import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-informacionbasica',
  templateUrl: './informacionbasica.component.html',
  styleUrls: ['./informacionbasica.component.scss']
})
export class InformacionbasicaComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta:any;
  @Input() enviarPeticion:any;
  @Input() cambiaValor:boolean = false;



  public myform!:FormGroup;

  public submitEnviado:boolean = false;

  public arreglonacionalidad:any = [];


  constructor(private formBuilder:FormBuilder,private catalogosPrd:CatalogosService,
    private empleadosPrd:EmpleadosService) { }

  ngOnInit(): void {

    let obj = {
      nacionalidadId:{},
      medioContacto:{}
    };
    this.myform = this.createForm(obj);

    this.catalogosPrd.getNacinalidades().subscribe(datos => this.arreglonacionalidad = datos.datos);

  }


  public createForm(obj:any){
      return this.formBuilder.group({
         nombre:[obj.nombre,[Validators.required]],
         apellidoPaterno:[obj.apellidoPaterno,[Validators.required]],
         apellidoMaterno:[obj.apellidoMaterno],
         genero:[obj.genero],
         fechaNacimiento:[obj.fechaNacimiento],
         tieneCurp:[obj.tieneCurp],
         contactoInicialEmailPersonal:[obj.contactoInicialEmailPersonal,[Validators.required,Validators.email]],
         emailCorporativo:[obj.emailCorporativo],
         invitarEmpleado:obj.invitarEmpleado,
         nacionalidadId:[obj.nacionalidadId.nacionalidadId,[Validators.required]],
         estadoCivil:obj.estadoCivil,
         contactoInicialTelefono:[obj.contactoInicialTelefono,[Validators.required]],
         tieneHijos:obj.tieneHijos,
         numeroHijos:obj.numeroHijos,
         url:obj.medioContacto.url,
         contactoEmergenciaNombre:[obj.contactoEmergenciaNombre,[Validators.required]],
         contactoEmergenciaApellidoPaterno:[obj.contactoEmergenciaApellidoPaterno,[Validators.required]],
         contactoEmergenciaApellidoMaterno:obj.contactoEmergenciaApellidoMaterno,
         contactoEmergenciaParentesco:obj.contactoEmergenciaParentesco,
         contactoEmergenciaEmail:[obj.contactoEmergenciaEmail,[Validators.email]],
         contactoEmergenciaTelefono:obj.contactoEmergenciaTelefono
      });
  }

 
  public guardar(){
    this.enviado.emit({type:"informacion",valor:true});
  }


  public cancelar(){
    
  }


  public enviarFormulario(){

    this.submitEnviado = true;
    if(this.myform.invalid){
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o invalidos";
      this.alerta.strsubtitulo = "Hay campos invalidos o sin rellenar, favor de verificar";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    this.alerta.strsubtitulo = "Esta apunto de guardar un empleado";
    this.alerta.iconType = "warning";

  }

  public get f(){
    return this.myform.controls;
  }


  ngOnChanges(changes: SimpleChanges) {

    if(this.enviarPeticion.enviarPeticion ){
      this.enviarPeticion.enviarPeticion  = false;

      let obj = this.myform.value;

      let objenviar = {  nombre:obj.nombre,
        apellidoPaterno:obj.apellidoPaterno,
        apellidoMaterno:obj.apellidoMaterno,
        genero:obj.genero,
        fechaNacimiento:obj.fechaNacimiento,
        tieneCurp:obj.tieneCurp,
        contactoInicialEmailPersonal:obj.contactoInicialEmailPersonal,
        emailCorporativo:obj.emailCorporativo,
        invitarEmpleado:obj.invitarEmpleado,
        nacionalidadId:{
          nacionalidadId:obj.nacionalidadId
        },
        estadoCivil:obj.estadoCivil,
        contactoInicialTelefono:obj.contactoInicialTelefono,
        tieneHijos:obj.tieneHijos,
        numeroHijos:obj.numeroHijos,
        medioContacto:{
          url:obj.url
        },
        contactoEmergenciaNombre:obj.contactoEmergenciaNombre,
        contactoEmergenciaApellidoPaterno:obj.contactoEmergenciaApellidoPaterno,
        contactoEmergenciaApellidoMaterno:obj.contactoEmergenciaApellidoMaterno,
        contactoEmergenciaParentesco:obj.contactoEmergenciaParentesco,
        contactoEmergenciaEmail:obj.contactoEmergenciaEmail,
        contactoEmergenciaTelefono:obj.contactoEmergenciaTelefono}

      this.empleadosPrd.save(objenviar).subscribe(datos =>{
        this.alerta.iconType = datos.resultado ? "success" : "error";

            this.alerta.strTitulo = datos.mensaje;
            this.alerta.strsubtitulo = datos.mensaje
            this.alerta.modal = true;
      });

      
    }

  }
}
