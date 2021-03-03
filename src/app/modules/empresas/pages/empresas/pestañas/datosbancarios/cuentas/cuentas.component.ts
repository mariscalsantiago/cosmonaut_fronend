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
  public habcontinuarSede: boolean = false;
 
  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService,
    private catalogosPrd:CatalogosService) { }

  ngOnInit(): void {
 
    this.objdsede = history.state.data == undefined ? {} : history.state.data ;
    this.esInsert = this.objdsede.insertar;
    let obj = { csBanco: { bancoId: 0 } };

    this.myForm = this.createForm(obj);


    this.catalogosPrd.getCuentasBanco().subscribe(datos => {
      this.cuentasBancarias = datos.datos;
    });

  }

  public createForm(obj: any) {

   return this.formBuild.group({

      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      nombreCuenta: [obj.nombreCuenta, [Validators.required]],
      bancoId: [obj.csBanco.bancoId, [Validators.required]],
      descripcion: [obj.descripcion],
      num_informacion: [obj.numInformacion],
      clabe: [obj.clabe, [Validators.required, Validators.pattern(/^\d{18}$/)]],
      num_sucursal: [obj.numSucursal]

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
      this.peticion = {
        numeroCuenta: obj.numeroCuenta,
        nombreCuenta: obj.nombreCuenta,
        descripcion: obj.descripcion,
        numInformacion: obj.num_informacion,
        clabe: obj.clabe,
        numSucursal: obj.num_sucursal,
        nclCentrocCliente: {
          centrocClienteId: this.objdsede.centrocClienteEmpresa
        },
        bancoId: {
          bancoId: obj.bancoId
        }
      };

     if(this.datosempresa.insertar){

        this.cuentasPrd.save(this.peticion).subscribe(datos => {
        this.alerta.iconType = datos.resultado ? "success" : "error";
        this.alerta.strTitulo = datos.mensaje;
        this.alerta.modal = true;
        this.enviado.emit({
          type:"cuentasCont"
        });

      });
     }else{
      
   
         this.cuentasPrd.save(this.peticion).subscribe(datos =>{
           this.alerta.iconType = datos.resultado ? "success" : "error";
           this.alerta.strTitulo = datos.mensaje;
           this.alerta.modal = true;
             //if(!this.modsinIdDom){
               this.enviado.emit({
               type:"domicilioSede"
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
