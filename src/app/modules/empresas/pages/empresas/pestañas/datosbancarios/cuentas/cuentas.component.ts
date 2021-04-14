import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosempresa:any;


  public mostrartooltip: boolean = false;
  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public id_empresa: number = 0;
  public esInsert: boolean = true;
  public cuenta: any;
  public cuentasBancarias: any;
  public objdsede: any = []; 
  public peticion: any = [];
  public obj: any = [];
  public habcontinuarSede: boolean = false;
  public insertarMof: boolean = false;
  public funcionCuenta: any = [];

 
  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService,
    private catalogosPrd:CatalogosService) { }

  ngOnInit(): void {
 
   
    this.objdsede = this.datosempresa.idModificar;
    if(this.datosempresa.insertar){
      this.obj = { 
        bancoId: { bancoId: 0 },
        funcionCuentaId: { funcionCuentaId: 0 }
      };
      this.myForm = this.createForm(this.obj);
    }
    else if(!this.datosempresa.insertar && this.objdsede != undefined){
      this.esInsert= false;
      this.objdsede = this.datosempresa.idModificar;
      this.myForm = this.createForm(this.objdsede);
     
    }else{

    let obj : any = {};
    this.myForm = this.createForm(obj);

    }
    

    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => {
      this.cuentasBancarias = datos.datos;
    });

    this.catalogosPrd.getFuncionCuenta(true).subscribe(datos => {
      this.funcionCuenta = datos.datos;
    });

  }

  public createForm(obj: any) {

   return this.formBuild.group({

    numeroCuenta: [obj.numeroCuenta, [Validators.required]],
    nombreCuenta: [obj.nombreCuenta, [Validators.required]],
    idbanco: [obj.bancoId?.bancoId, [Validators.required]],
    funcionCuentaId: [obj.funcionCuentaId?.funcionCuentaId, [Validators.required]],
    descripcion: [obj.descripcion],
    num_informacion: [obj.numInformacion],
    clabe: [obj.clabe, [Validators.required, Validators.pattern(/^\d{18}$/)]],
    num_sucursal: [obj.numSucursal],
    esActivo: [{ value: (this.esInsert) ? true : obj.esActivo, disabled: this.esInsert}, [Validators.required]]
    });

  }



  public enviarFormulario() {
    
   
   if(!this.habcontinuarSede){
    this.submitEnviado = true;
   if (this.myForm.invalid) {
     
     this.alerta.modal = true;
     this.alerta.strTitulo = "Campos obligatorios o inválidos";
     this.alerta.iconType = "error";
     return;
   }

   this.alerta.modal = true;
   this.alerta.strTitulo = (this.datosempresa.insertar) ? "¿Deseas registrar la cuenta bancaria" : "¿Deseas actualizar la cuenta bancaria?";
   this.alerta.iconType = "warning";

 }else{
   this.enviado.emit({
     type:"cuentasCont"
   });
   this.habcontinuarSede= false;
   this.alerta.modal = true;
   this.alerta.strTitulo = "¿Deseas cancelar?";
   this.alerta.iconType = "warning";

 }
}

public validarBanco(clabe:any){
  
  this.myForm.controls.idbanco.setValue("");
  this.myForm.controls.clabe.setValue("");

  if(this.myForm.controls.clabe.errors?.pattern === undefined ){


  if(clabe == '' || clabe == null || clabe == undefined){

    this.myForm.controls.idbanco.setValue("");
    this.myForm.controls.clabe.setValue("");
  }else{
  this.cuentasPrd.getListaCuentaBancaria(clabe).subscribe(datos => {
    if (datos.resultado) {

      this.myForm.controls.idbanco.setValue( datos.datos.bancoId);
      this.myForm.controls.clabe.setValue( clabe);

    }
    else{
      this.alerta.modal = true;
      this.alerta.iconType = datos.resultado? "success" : "error";
      this.alerta.strTitulo = datos.mensaje;
    }

});

  }

}

}

public activarCancel(){

  this.habcontinuarSede = true;
}


  get f() {
    return this.myForm.controls;
  }

  ngOnChanges(changes: SimpleChanges) {
    
   if (this.enviarPeticion.enviarPeticion) {
     this.enviarPeticion.enviarPeticion = false;
      let obj = this.myForm.value;

      if(!this.datosempresa.insertar && this.objdsede == undefined){
        this.insertarMof = true;
      }

          this.peticion = {
            numeroCuenta: obj.numeroCuenta,
            nombreCuenta: obj.nombreCuenta,
            descripcion: obj.descripcion,
            numInformacion: obj.num_informacion,
            clabe: obj.clabe,
            numSucursal: obj.num_sucursal,
            funcionCuentaId : { funcionCuentaId: obj.funcionCuentaId},
            esActivo: obj.esActivo,
            nclCentrocCliente: {
              centrocClienteId: this.datosempresa.centrocClienteEmpresa
            },
            bancoId: {
              bancoId: obj.idbanco
            }
          };
    
          if(this.insertarMof){
            this.cuentasPrd.save(this.peticion).subscribe(datos =>{
              this.alerta.iconType = datos.resultado ? "success" : "error";
              this.alerta.strTitulo = datos.mensaje;
              this.alerta.modal = true;
              if(datos.resultado){
                  this.enviado.emit({
                    type:"cuentasCont"
                  });
                }
    
            });
          }
          else if(this.datosempresa.insertar){

          this.cuentasPrd.save(this.peticion).subscribe(datos => {
          this.alerta.iconType = datos.resultado ? "success" : "error";
          this.alerta.strTitulo = datos.mensaje;
          this.alerta.modal = true;
          if(datos.resultado){
          this.enviado.emit({ 
            type:"cuentasCont"
          });
          }

        });
        }else{
      
        this.peticion.cuentaBancoId = this.objdsede.cuentaBancoId;
         this.cuentasPrd.modificar(this.peticion).subscribe(datos =>{
           this.alerta.iconType = datos.resultado ? "success" : "error";
           this.alerta.strTitulo = datos.mensaje;
           this.alerta.modal = true;
           if(datos.resultado){
            this.enviado.emit({ 
              type:"cuentasCont"
            });
            }
         });
     }
    }

 }


}
