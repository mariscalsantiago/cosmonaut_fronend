import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepresentanteLegalService } from '../services/representantelegal.service';

@Component({
  selector: 'app-detallerepresentantelegal',
  templateUrl: './detallerepresentantelegal.component.html',
  styleUrls: ['./detallerepresentantelegal.component.scss']
})
export class DetallerepresentantelegalComponent implements OnInit {
  public myFormrep!: FormGroup;
  public arreglo:any = [];
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType:string = "";
  public fechaActual: string = "";
  public strTitulo: string = "";
  public nacionalidad: string = "";
  public strsubtitulo:string = "";
  public objdetrep:any;
  public cargando:Boolean = false;
  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;
  public tipoRepresentanteId: number = 1;
  public centrocClienteId: number = 1;
  public nacionalidadId: number = 1;
  

  constructor(private formBuilder: FormBuilder, private representantePrd: RepresentanteLegalService, private routerActivePrd: ActivatedRoute,
    private routerPrd:Router) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.strTitulo = (this.insertar) ? "¿Deseas registrar el representatne legal?" : "¿Deseas actualizar el representatne legal?";

    });

  
    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${dia}/${mes}/${anio}`; 

  }
    
  ngOnInit(): void {
    debugger;
    let objdetrep = history.state.data == undefined ? {} : history.state.data ;
    if(!this.insertar){
      if(objdetrep.nacionalidadId.nacionalidadId==1){
        this.nacionalidad= "Mexicana";
      }
    }

    this.myFormrep = this.createFormrep((objdetrep));
    
  }


  public createFormrep(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      nacionalidadId: [this.nacionalidad,[Validators.required]],
      curp: [obj.curp,[Validators.required,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      emailCorporativo: [obj.emailCorporativo, [Validators.required, Validators.email]],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta), disabled: true }, [Validators.required]],
      activo: [{ value: (this.insertar) ? true : obj.activo, disabled: this.insertar }, [Validators.required]],
      personaId: obj.personaId

    });
  }


  public activarMultiseleccion(){
    this.multiseleccion = true;
}


public guardarMultiseleccion(){
  this.multiseleccionloading = true;
    setTimeout(() => {
      this.multiseleccionloading = false;
      this.multiseleccion = false;
    }, 3000);
}


public cancelarMulti(){
  this.multiseleccionloading = false;
  this.multiseleccion = false;
}
  

  public enviarPeticion() {
    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar el representante legal" : "¿Deseas actualizar el representante legal?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }


  public redirect(obj:any){
 
    this.modal = true;
    this.routerPrd.navigate(["/empresa/detalle/idempresa/representantelegal"]);
    this.modal = false;
    

  }

  public recibir($evento: any) {

    this.modal = false;
    if(this.iconType == "warning"){
      if ($evento) {
        let obj = this.myFormrep.value;
        let objEnviar:any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPaterno,
          apellidoMaterno: obj.apellidoMaterno,
          curp: obj.curp,
          emailCorporativo: obj.emailCorporativo,
          contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal,
          contactoInicialTelefono: obj.contactoInicialTelefono,
          tipoRepresentanteId: {
            tipoRepresentanteId: this.tipoRepresentanteId
          },
          representanteLegalCentrocClienteId: {
            centrocClienteId: this.centrocClienteId
          },
          ibaNacionalidadId: {
            nacionalidadId: this.nacionalidadId
          }
      }

        if(this.insertar){
          //objEnviar.fechaAlta= this.fechaActual;
          
          this.representantePrd.save(objEnviar).subscribe(datos => {
            
            this.iconType = datos.result? "success":"error";
            if(datos.result){
              this.strTitulo = datos.message;
              this.strsubtitulo = 'Registro agregado correctamente'
              this.modal = true;
            }else{
              this.strTitulo = datos.message;
              this.strsubtitulo = 'Favor de verificar'
              this.modal = true;

            }

            
          });

        }else{
          debugger;
  
          objEnviar.personaId = obj.personaId;
          this.representantePrd.modificar(objEnviar).subscribe(datos =>{
            this.iconType = datos.result? "success":"error";
            if(datos.result){
              this.strTitulo = datos.message;
              this.strsubtitulo = 'Registro modificado correctamente!'
              this.modal = true;
            }else{
              this.strTitulo = datos.message;
              this.strsubtitulo = 'Favor de verificar'
              this.modal = true;

            }

          });
        }
      
      }
    }else{
      if(this.iconType == "success"){
          this.routerPrd.navigate(["/empresa/detalle/idempresa/representantelegal"]);
      }
     
      this.modal = false;
    }
  }
  get f() { return this.myFormrep.controls; }

 
}

