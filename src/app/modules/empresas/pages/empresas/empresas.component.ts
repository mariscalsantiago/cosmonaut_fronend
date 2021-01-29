import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from '../../services/empresas.service';


@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  public titulo:string = "ADMINISTRACIÓN DE EMPRESA";

  public myFormemp!: FormGroup;
  public objEmpresa: any;
  public arreglo:any = [];
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType:string = "";
  public strTitulo: string = "";
  public strsubtitulo:string = "";
  public cargando:Boolean = false;
  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;

  constructor(private formBuilder: FormBuilder, private empresasPrd: EmpresasService, private routerActivePrd: ActivatedRoute,
    private routerPrd:Router) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');

      this.strTitulo = (this.insertar) ? "¿Deseas registrar la empresa?" : "¿Deseas actualizar la empresa?";

    });
    }

  ngOnInit(): void {
    debugger;
    this.objEmpresa = history.state.data == undefined ? {} : history.state.data ;
    this.myFormemp = this.createFormemp((this.objEmpresa));

  }

  public createFormemp(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre,[Validators.required]],
      razonSocial: [obj.razonSocial,[Validators.required]],
      rfc: [obj.rfc,[Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      emailCorp: [obj.emailCorp, [Validators.required, Validators.email]],
      //fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta.replace("/","-").replace("/","-")), disabled: true }, [Validators.required]],
      fechaAlta: [obj.fechaAlta , [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      centrocClienteId: obj.centrocClienteId
      
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
    debugger;
    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar la empresa?" : "¿Deseas actualizar la empresa?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }

  public cancelaremp(){
    this.routerPrd.navigate(['/company']);
  }

  public recibir($evento: any) {
    debugger;
    this.modal = false;
    if(this.iconType == "warning"){
      if ($evento) {
        /*let obj = this.myFormcomp.value;
               obj = {
                ...obj,
                fechaAlta: this.fechaConst,
              };*/

        if(this.insertar){
          debugger;
          
          /*this.companyPrd.save(obj).subscribe(datos => {
            
            this.iconType = datos.result? "success":"error";
    
            this.strTitulo = datos.message;
            this.strsubtitulo = 'Registro agregado correctamente'
            this.modal = true;
            this.compania = false;
            this.contacto = true;
            if(datos.result == true){
              let obj = this.objcont;
              this.verdetallecont(obj);
            }
            
            
          });*/

        }else{
    
          /*debugger;   

          this.companyPrd.modificar(obj).subscribe(datos =>{
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

      /*let obj = this.objcont;
      obj = {
       ...obj,
          representanteLegalCentrocClienteId: this.representanteLegalCentrocClienteId,
          tipoPersonaId: this.tipoPersonaId
        };

        
        this.companyPrd.getAllCont(obj).subscribe(datos =>{
          this.cargando = true;

            this.arreglo = datos.data;
    
            this.cargando = false;
          
        });

      this.modal = false;*/
    }
  }

  get f() { return this.myFormemp.controls;  }

 
}
