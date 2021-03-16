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
  public esInsert: boolean = false;
  public cuenta: any;
  public cuentasBancarias: any;
  public objdsede: any = []; 
  public peticion: any = [];
  public obj: any = [];
  public habcontinuarSede: boolean = false;
  public insertarMof: boolean = false;
  public esActivoMod: boolean = true;
 
  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService,
    private catalogosPrd:CatalogosService) { }

  ngOnInit(): void {
 
    this.objdsede = history.state.data == undefined ? {} : history.state.data ;
    
    if(this.datosempresa.insertar){
      this.obj = { bancoId: { bancoId: 0 } };
    }

    this.myForm = this.createForm(this.obj);


    this.catalogosPrd.getCuentasBanco().subscribe(datos => {
      this.cuentasBancarias = datos.datos;
      console.log("Cuentas",this.cuentasBancarias);
      if(this.cuentasBancarias.cuentaBancoId == undefined){
          this.esActivoMod = true;
      }
    });

  }

  public createForm(obj: any) {
debugger;
   return this.formBuild.group({

    numeroCuenta: [obj.numeroCuenta, [Validators.required]],
    nombreCuenta: [obj.nombreCuenta, [Validators.required]],
    bancoId: [obj.bancoId?.bancoId, [Validators.required]],
    descripcion: [obj.descripcion],
    num_informacion: [obj.numInformacion],
    clabe: [obj.clabe, [Validators.required, Validators.pattern(/^\d{18}$/)]],
    num_sucursal: [obj.numSucursal],
    //esActivoMod: [{ value: (this.esActivoMod) ? true : obj.esActivo, disabled: this.esActivoMod }, [Validators.required]]
    esActivo: [(!this.esActivoMod) ? obj.esActivo : { value: "true", disabled: true }]
    });

  }



  public enviarFormulario() {
    debugger;
   
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

public activarCancel(){

  this.habcontinuarSede = true;
}


  get f() {
    return this.myForm.controls;
  }

  ngOnChanges(changes: SimpleChanges) {
    debugger;
   if (this.enviarPeticion.enviarPeticion) {
     this.enviarPeticion.enviarPeticion = false;
      let obj = this.myForm.value;

      if(!this.datosempresa.insertar && obj.cuentaBancoId == undefined){
        this.insertarMof = true;
      }

          this.peticion = {
            numeroCuenta: obj.numeroCuenta,
            nombreCuenta: obj.nombreCuenta,
            descripcion: obj.descripcion,
            numInformacion: obj.num_informacion,
            clabe: obj.clabe,
            numSucursal: obj.num_sucursal,
            esActivo: true,
            nclCentrocCliente: {
              centrocClienteId: this.datosempresa.centrocClienteEmpresa
            },
            bancoId: {
              bancoId: obj.bancoId
            }
          }
    
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
      
        this.peticion.cuentaBancoId = obj.cuentaBancoId;
         this.cuentasPrd.modificar(this.peticion).subscribe(datos =>{
           this.alerta.iconType = datos.resultado ? "success" : "error";
           this.alerta.strTitulo = datos.mensaje;
           this.alerta.modal = true;
             //if(!this.modsinIdDom){
               this.enviado.emit({
               type:"cuentasCont"
             });
             if(datos.resultado){
               //this.habcontinuar= true;
               //this.habGuardar=false;
               //this.modsinIdDom=false;
             }
           //}
         });
     }
    }

 }


}
