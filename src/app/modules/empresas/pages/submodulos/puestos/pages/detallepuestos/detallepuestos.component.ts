import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PuestosService } from '../services/puestos.service';

@Component({
  selector: 'app-detallepuestos',
  templateUrl: './detallepuestos.component.html',
  styleUrls: ['./detallepuestos.component.scss']
})
export class DetallepuestosComponent implements OnInit {
  public myFormrep!: FormGroup;
  public arreglo:any = [];
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType:string = "";
  public strTitulo: string = "";
  public strsubtitulo:string = "";
  public objdetrep:any;
  public cargando:Boolean = false;
  

  constructor(private formBuilder: FormBuilder, private puestosPrd: PuestosService, private routerActivePrd: ActivatedRoute,
    private routerPrd:Router) {
    debugger;
    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      //this.insertar = true;

      this.strTitulo = (this.insertar) ? "¿Deseas registrar el área?" : "¿Deseas actualizar el área?";

    });

  }
    
  ngOnInit(): void {
    debugger;
    let objdetrep = history.state.datos == undefined ? {} : history.state.datos ;
    this.myFormrep = this.createFormrep((objdetrep));

  }


  public createFormrep(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPat, [Validators.required]],
      ibaNacionalidadId: [obj.ibaNacionalidadId,[Validators.required]],
      personaId: obj.personaId

    });
  }


  public enviarPeticion() {
    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar el área" : "¿Deseas actualizar el área?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }


  public redirect(obj:any){
    debugger;
    this.modal = true;
    this.routerPrd.navigate(["/empresa/detalle/idempresa/puestos"]);
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
          this.routerPrd.navigate(["/empresa/detalle/idempresa/puestos"]);
      }
     
      this.modal = false;
    }
  }
  get f() { return this.myFormrep.controls; }

 
}

