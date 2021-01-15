import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-detalle-company',
  templateUrl: './detalle-company.component.html',
  styleUrls: ['./detalle-company.component.scss']
})
export class DetalleCompanyComponent implements OnInit {

  public myFormcomp!: FormGroup;
  //public myFormcont!: FormGroup;
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType:string = "";
  public fechaActual: string = "";
  public strTitulo: string = "";
  public strsubtitulo:string = "";
  public objcompany:any;
  public fechaAlta: string = "";
  public fechaConst: number = 1610258400000;

  constructor(private formBuilder: FormBuilder, private companyPrd: CompanyService, private routerActivePrd: ActivatedRoute, private routerPrd:Router) {

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

    let objCompany = history.state.data == undefined ? {} : history.state.data;
    //let objCompanycont = history.state.data == undefined ? {} : history.state.data;

    this.myFormcomp = this.createFormcomp((objCompany));
    //this.myFormcont = this.createFormcont((objCompany));
  }


  public createFormcomp(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre,[Validators.required]],
      razonSocial: [obj.razonSocial,[Validators.required]],
      rfc: [obj.rfc,[Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      emailCorp: [obj.emailCorp, [Validators.required, Validators.email]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta.replace("/","-").replace("/","-")), disabled: true }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      centrocClienteId: obj.centrocClienteId
      
    });
  }

  /*public createFormcont(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      curp: [obj.curp,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      correoEmpresarial: [obj.correoEmpresarial, [Validators.required, Validators.email]],
      correoPersonal: [obj.correoPersonal, [Validators.required, Validators.email]],
      telefono: [obj.telefono, [Validators.required]],
      fechaRegistro: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaRegistro), disabled: true }, [Validators.required]],
      id: obj.idcont

    });
  }*/

  public subirarchivos(){

  }

  
  public enviarPeticioncomp() {
    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar la compañía?" : "¿Deseas actualizar la compañía?";
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
        let obj = this.myFormcomp.value;
               obj = {
                ...obj,
                fechaAlta: this.fechaConst,
              };
        

        if(this.insertar){
          debugger;
          this.companyPrd.save(obj).subscribe(datos => {
           
            this.iconType = datos.result? "success":"error";
    
            this.strTitulo = datos.message;
            this.strsubtitulo = 'Registro agregado correctamente'
            this.modal = true;
          });

        }else{
    
          debugger;   

          this.companyPrd.modificar(obj).subscribe(datos =>{
            this.iconType =  datos.result? "success":"error";  
            this.strTitulo = datos.message;
            this.strsubtitulo = 'Registro modificado correctamente!'
            this.modal = true;

          });
        }
      
      }
    }else{
      this.modal = false;

      if(this.iconType == "success"){
          this.routerPrd.navigate(["/company"]);
      }

    }
  }

  /*public recibircont($evento: any) {
    this.modal = false;
    if(this.iconType == "warning"){
      if ($evento) {
       
        let obj = this.myFormcont.value;
     
  
        this.companyPrd.save(obj).subscribe(datos => {
          this.iconType = "success";
  
          this.strTitulo = datos.message;
          this.strsubtitulo = datos.message
          this.modal = true;
        });
      }
    }else{
      this.modal = false;
    }
  }*/

  get f() { return this.myFormcomp.controls;  }

 
}
