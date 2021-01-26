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
  public strsubtitulo:string = "";
  public objdetrep:any;
  public cargando:Boolean = false;
  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;
  

  constructor(private formBuilder: FormBuilder, private empresasPrd: RepresentanteLegalService, private routerActivePrd: ActivatedRoute,
    private routerPrd:Router) {
    debugger;
    this.routerActivePrd.params.subscribe(datos => {
      //this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.insertar = true;

      this.strTitulo = (this.insertar) ? "¿Deseas registrar el representatne legal?" : "¿Deseas actualizar el representatne legal?";

    });

  
    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${anio}-${mes}-${dia}`;

  }
    
  ngOnInit(): void {
    debugger;
    let objdetrep = history.state.data == undefined ? {} : history.state.data ;
    this.myFormrep = this.createFormrep((objdetrep));

  }


  public createFormrep(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPat, [Validators.required]],
      apellidoMat: [obj.apellidoMat],
      ibaNacionalidadId: [obj.ibaNacionalidadId,[Validators.required]],
      curp: [obj.curp,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      emailCorp: [obj.emailCorp, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.ciEmailPersonal, [Validators.required, Validators.email]],
      ciTelefono: [obj.ciTelefono, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta.replace("/","-").replace("/","-")), disabled: true }, [Validators.required]],
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
    debugger;
    this.modal = true;
    this.routerPrd.navigate(["/empresa/detalle/idempresa/representantelegal"]);
    this.modal = false;
    

  }

  public recibir($evento: any) {
    debugger;
    this.modal = false;
    if(this.iconType == "warning"){
      if ($evento) {
        let obj = this.myFormrep.value;

        if(this.insertar){
          debugger;
          
          /*this.companyPrd.savecont(obj).subscribe(datos => {
            
            this.iconType = datos.result? "success":"error";
    
            this.strTitulo = datos.message;
            this.strsubtitulo = 'Registro agregado correctamente'
            this.modal = true;
            this.compania = false;
            this.contacto = true;
            
          });*/

        }else{
    
          debugger;   

          /*this.companyPrd.modificarCont(obj).subscribe(datos =>{
            this.iconType =  datos.result? "success":"error";  
            this.strTitulo = datos.message;
            this.strsubtitulo = 'Registro modificado correctamente!'
            this.modal = true;
            this.listcontacto = true;
            this.compania = false;

          });*/
        }
      
      }
    }else{
      if(this.iconType == "success"){
          this.routerPrd.navigate(["/company"]);
      }
     
      this.modal = false;
    }
  }
  get f() { return this.myFormrep.controls; }

 
}

