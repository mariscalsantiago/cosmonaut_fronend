import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from '../../../../../services/empresas.service';

@Component({
  selector: 'app-detallerepresentantelegal',
  templateUrl: './detallerepresentantelegal.component.html',
  styleUrls: ['./detallerepresentantelegal.component.scss']
})
export class DetallerepresentantelegalComponent implements OnInit {
  public myFormdetemp!: FormGroup;
  public arreglo:any = [];
  public modal: boolean = false;
  public detEmpresa: boolean = true;
  public insertar: boolean = false;
  public iconType:string = "";
  public fechaActual: string = "";
  public strTitulo: string = "";
  public strsubtitulo:string = "";
  public objdetempresa:any;
  public fechaAlta: string = "";
  public cargando:Boolean = false;
  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;
  

  constructor(private formBuilder: FormBuilder, private empresasPrd: EmpresasService, private routerActivePrd: ActivatedRoute,
    private routerPrd:Router) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');

      this.strTitulo = (this.insertar) ? "¿Deseas registrar la compañía?" : "¿Deseas actualizar a compañía?";

    });

  
    let fecha = new Date();
    let dia = fecha.getDay() < 10 ? `0${fecha.getDay()}` : fecha.getDay();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${anio}-${mes}-${dia}`;

  }
    
  ngOnInit(): void {
    debugger;
    let objdetempresa = history.state.data == undefined ? {} : history.state.data ;
    this.myFormdetemp = this.createFormcont((objdetempresa));

  }


  public createFormcont(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPat, [Validators.required]],
      apellidoMat: [obj.apellidoMat],
      curp: [obj.curp,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      emailCorp: [obj.emailCorp, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.ciEmailPersonal, [Validators.required, Validators.email]],
      ciTelefono: [obj.ciTelefono, [Validators.required]],
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
  
  public enviarPeticionemp() {
    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar el contacto?" : "¿Deseas actualizar el contacto?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }

  public enviarPeticioncont() {
    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar el contacto?" : "¿Deseas actualizar el contacto?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }


  public redirect(obj:any){
    debugger;
    this.modal = true;
    this.routerPrd.navigate(["/company"]);
    this.modal = false;
    

  }

  public recibir($evento: any) {
    debugger;
    this.modal = false;
    if(this.iconType == "warning"){
      if ($evento) {
        let obj = this.myFormdetemp.value;

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



  get f() { return this.myFormdetemp.controls;  }

 
}

