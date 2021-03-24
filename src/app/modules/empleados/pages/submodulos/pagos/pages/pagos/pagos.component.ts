import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  public arreglopintar: any = [false, false, false, false, false];

  public metodopagobool:boolean = false;
  public detallecompensacionbool:boolean = false;
  public esTransferencia:boolean = false;
  public submitEnviado:boolean = false;
  public indexMetodoSeleccionado:number = 0;
  

  public arregloMetodosPago!:Promise<any>;
  public arreglogrupoNomina!:Promise<any>;
  public arregloCompensacion!:Promise<any>;
  public arreglobancos!:Promise<any>;
  public idEmpleado:number = -1;
  public empleado:any = {};


  public myFormMetodoPago!:FormGroup;

  

  constructor(private modalPrd:ModalService,private catalogosPrd:CatalogosService,
    private gruponominaPrd: GruponominasService,private usuariosSistemaPrd:UsuarioSistemaService,
    private formbuilder:FormBuilder,private router:ActivatedRoute,private contratoColaboradorPrd:ContratocolaboradorService,
    private bancosPrd: CuentasbancariasService) {

     }

  ngOnInit(): void {

    this.myFormMetodoPago = this.formbuilder.group({});
    this.myFormCompensacion = this.formbuilder.group({});

   this.arregloMetodosPago =  this.catalogosPrd.getAllMetodosPago().toPromise();   
   this.arreglogrupoNomina = this.gruponominaPrd.getAll(this.usuariosSistemaPrd.getIdEmpresa()).toPromise();
   this.arregloCompensacion = this.catalogosPrd.getCompensacion().toPromise();
   this.arreglobancos = this.catalogosPrd.getCuentasBanco().toPromise();


   this.router.params.subscribe(params => {
    this.idEmpleado = params["id"];

    this.contratoColaboradorPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {
      this.empleado = datos.datos;
    });;
  });



  }


  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];
  }

  //*****************Métodos de pago******************* */



  

  public createMyFormMetodoPago(obj:any){
    return this.formbuilder.group({
      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      clabe: [obj.clabe, [Validators.required]],
      csBanco: [obj.bancoId?.bancoId, [Validators.required]],
      numInformacion: obj.numInformacion,
      cuentaBancoId:obj.cuentaBancoId
    });
  }

  public editandoMetodoPago(obj:any){
    this.myFormMetodoPago = this.createMyFormMetodoPago({});
    this.metodopagobool = true;
    if(obj == undefined){
      this.indexMetodoSeleccionado = this.empleado.metodoPagoId?.metodoPagoId;
    }
    this.esTransferencia = this.indexMetodoSeleccionado  == 4;   

    if(this.esTransferencia){   

      

        this.bancosPrd.getByEmpleado(this.idEmpleado).subscribe(datos =>{
          if(datos.resultado){
              
              this.myFormMetodoPago = this.createMyFormMetodoPago(datos.datos);
          }
        });
        
    }

  }

  public guardandometodoPago(){//Solo guarda el método de pago metodopagoid
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas actualizar los datos del método de pago?").then(valor =>{
      if(valor){
        
        let objEnviar = {
          ...this.empleado,
          metodoPagoId:{
            metodoPagoId: this.indexMetodoSeleccionado
          }
        }
        this.contratoColaboradorPrd.update(objEnviar).subscribe(datos =>{
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
            if(datos.resultado){
              this.empleado = datos.datos;
              this.metodopagobool = false;
              this.detallecompensacionbool = false;
            }
          });
        });

      }
    });
  }

  

  public enviandoMetodoPago(){ //Método guardar transferencia bancaría...
    this.submitEnviado = true;
    if(this.myFormMetodoPago.invalid){
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas guardar los datos?").then(valor =>{
      if(valor){
        let obj = this.myFormMetodoPago.value;  
        let objEnviar:any = {  
          numeroCuenta: obj.numeroCuenta,
          clabe: obj.clabe,
          bancoId: {
            bancoId: obj.csBanco
          },
          numInformacion: obj.numInformacion,
          ncoPersona: {
            personaId: this.idEmpleado
          },
          nclCentrocCliente: {
            centrocClienteId: this.empleado.centrocClienteId.centrocClienteId
          },
          nombreCuenta: '  '
  
        };  

      
        if(obj.cuentaBancoId == undefined){
          console.log("Se va a insertar");
          this.bancosPrd.save(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                let objEnviar = {
                  ...this.empleado,
                  metodoPagoId:{
                    metodoPagoId:this.indexMetodoSeleccionado
                  }
                }
                this.contratoColaboradorPrd.update(objEnviar).subscribe((respContrato) =>{
                  this.empleado = respContrato.datos;
                  console.log(this.empleado);
                  this.cancelar();
                });
  
              }
            });
  
          });
        }else{
          console.log("Se va a modificar");
        
          objEnviar.cuentaBancoId=obj.cuentaBancoId;
          objEnviar.esActivo=true;
          this.bancosPrd.modificar(objEnviar).subscribe(datos => {
            console.log("se modifica el cliente cuentas bancarias",datos.datos);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                let objEnviar = {
                  ...this.empleado,
                  metodoPagoId:{
                    metodoPagoId:this.indexMetodoSeleccionado
                  }
                }

                console.log("Esto se va a mandar",objEnviar);
                this.contratoColaboradorPrd.update(objEnviar).subscribe((requestContrato) =>{
                  this.empleado = requestContrato.datos;
                  console.log(requestContrato);
                  this.cancelar();
                });
  
              }
            });
  
          });
        }
  
      }
    });
  }

  public cancelar(){
    this.metodopagobool = false;
    this.detallecompensacionbool = false;
  }

  public cambiaValorMetodo(){
    this.editandoMetodoPago("");    
  }
  public get f(){
    return this.myFormMetodoPago.controls;
  }



  //*********************Termina métodos de pago***************** */


  //*************Empieza lo de detalle de compensacion****************

  public myFormCompensacion!:FormGroup;

  public createFormCompensacion(obj:any){
      return this.formbuilder.group({
        grupoNominaId:[obj.grupoNominaId?.grupoNominaId,[Validators.required]],
        tipoCompensacionId:[obj.tipoCompensacionId?.tipoCompensacionId,[Validators.required]],
        sueldoBrutoMensual:[obj.sueldoBrutoMensual,[Validators.required]],
        sbc:[obj.sbc,[Validators.required]]
      });
  }

  public guardarDetalleCompensacion(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas actualizar los datos del usuario?").then(valor =>{
      if(valor){
          setTimeout(() => {
            this.modalPrd.showMessageDialog(this.modalPrd.success,"Operación exitosa").then(()=>{
              this.detallecompensacionbool = false;
            });;
          }, 1000);
      }
    });
  }

  public enviarCompensacio(){
    if(this.myFormCompensacion){
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }


    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas actualizar los datos del empleado?").then(valor =>{
      if(valor){

        const obj = this.myFormCompensacion.value;
        const objEnviar = {
          ...this.empleado,
          grupoNominaId:{grupoNominaId:obj.grupoNominaId},
          tipoCompensacionId:{tipoCompensacionId:obj.tipoCompensacionId},
          sbc:obj.sbc
        }

        this.contratoColaboradorPrd.update(objEnviar).subscribe(datos =>{
          this.modalPrd.showMessageDialog(datos.resultados,datos.mensaje).then(()=>{
            if(datos.resultado){
                this.empleado = datos.datos;
                this.cancelar();
            }
          });
        });

      }
    });
  }


  public verDetalleCompensacion(){
    this.detallecompensacionbool=true
    this.myFormCompensacion = this.createFormCompensacion(this.empleado);
  }

  //*******************************Termina detalle compensación */

}
