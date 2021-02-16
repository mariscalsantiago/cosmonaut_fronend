import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticasService } from '../services/politicas.service';

@Component({
  selector: 'app-detallepoliticas',
  templateUrl: './detallepoliticas.component.html',
  styleUrls: ['./detallepoliticas.component.scss']
})
export class DetallepoliticasComponent implements OnInit {
  public myFormpol!: FormGroup;
  public arreglo:any = [];
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType:string = "";
  public strTitulo: string = "";
  public strsubtitulo:string = "";
  public cargando:Boolean = false;
 
  public submitInvalido:boolean = false;
  public esInsert:boolean = false;
  public id_empresa:number = 0;

  constructor(private formBuilder: FormBuilder, private politicasPrd: PoliticasService, private routerActivePrd: ActivatedRoute,
    private routerPrd:Router) {
    debugger;
    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      

      this.strTitulo = (this.insertar) ? "¿Deseas registrar la política?" : "¿Deseas actualizar la política?";

    });


  }
    
  ngOnInit(): void {
    debugger;
    let objdetrep = history.state.data == undefined ? {} : history.state.data ;
    this.myFormpol = this.createFormrep((objdetrep));

  }


  public createFormrep(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      diasEconomicos: [obj.diasEconomicos, [Validators.required]],
      primaAniversario: [obj.primaAniversario],
      descuentaFaltas: [obj.descuentaFaltas],
      descuentaIncapacidades: [obj.descuentaIncapacidades],
      costoValesRestaurante: [obj.costoValesRestaurante],
      descuentoPropDia: [obj.descuentoPropDia],
      politicaId: obj.politicaId

    });
  }




  public enviarPeticion() {
    debugger;
    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar la política" : "¿Deseas actualizar la política?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }


  public redirect(obj:any){
    debugger;
    this.modal = true;
    this.routerPrd.navigate(["/empresa/detalle/idempresa/politicas"]);
    this.modal = false;
    

  }

  public recibir($evento: any) {
    debugger;
    this.modal = false;
    if(this.iconType == "warning"){
      if ($evento) {
        let obj = this.myFormpol.value;

        let objEnviar: any ={
          nombre: obj.nombre,
          nombreCorto: obj.nombre,
          diasEconomicos: obj.diasEconomicos,
          calculoAntiguedadx: "A",
          centrocClienteId: {
            centrocClienteId: this.id_empresa
            },
          calculoAntiguedadId: {
            calculoAntiguedadxId: 1
          },
          esEstandar: true
        }

        if(this.insertar){
          debugger;
          
            this.politicasPrd.save(objEnviar).subscribe(datos => {
            
            this.iconType = datos.result? "success":"error";
    
            this.strTitulo = datos.message;
            this.strsubtitulo = 'Registro agregado correctamente'
            this.modal = true;

            
          });

        }else{
    
          debugger;   

          this.politicasPrd.modificar(objEnviar).subscribe(datos =>{
            this.iconType =  datos.resultado? "success":"error";  
            this.strTitulo = datos.mensaje;
            this.strsubtitulo = 'Registro modificado correctamente!'
            this.modal = true;


          });
        }
      
      }
    }else{
      if(this.iconType == "success"){
          this.routerPrd.navigate(["/empresa/detalle/idempresa/politicas"]);
      }
     
      this.modal = false;
    }
  }
  get f() { return this.myFormpol.controls; }

 
}

