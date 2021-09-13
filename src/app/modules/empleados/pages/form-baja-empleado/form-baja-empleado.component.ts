import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/modules/usuarios/services/usuario.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { EmpleadosService } from '../../services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-form-baja-empleado',
  templateUrl: './form-baja-empleado.component.html',
  styleUrls: ['./form-baja-empleado.component.scss']
})
export class FormBajaEmpleadoComponent implements OnInit {
  @ViewChild("nombre") nombre: any;

  public myFormcomp!: FormGroup;
  public arreglo: any = [];
  public insertar: boolean = false;
  public objCompany: any = [];

  public cargando: Boolean = false;
  public submitEnviado: boolean = false;
  
  public arregloMotivoBaja: any = [];
  public arregloTipoBaja: any = []; 
  public arregloempleados: any = [];
  public arreglobaja: any = [];
  public fechaContrato = new Date();
  public personaId: number = 0;
  public idEmpresa: number = 0;
  public estatusBaj: boolean = true;
  public liquidacion: boolean = false; 
  public arregloLiquidacion: any = [];
  public mostrardias: boolean = false;
  public actguardar: boolean = false;
  public numerodias: boolean = false;
  public esRegistrar:boolean = false;
  public ultimaNomina: boolean = false;
  public arregloEmpleado: any = [];
  public etiquetas:any = [];


  constructor(private formBuilder: FormBuilder, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private usuariosPrd: UsuarioService,private modalPrd:ModalService,private usuarioSistemaPrd:UsuarioSistemaService,
    private catalogosPrd:CatalogosService, private EmpleadosService:EmpleadosService,public configuracionPrd:ConfiguracionesService) {
  }

  ngOnInit(): void {
    this.establecerPermisos();

    this.objCompany = history.state.datos == undefined ? {} : history.state.datos;

    let objEnviar: any = {

      centrocClienteId: {
        centrocClienteId:this.usuarioSistemaPrd.getIdEmpresa(),
      },
      tipoPersonaId: {
        tipoPersonaId: 5
      }
    }
    
    this.idEmpresa=this.usuarioSistemaPrd.getIdEmpresa();
    this.EmpleadosService.getEmpleadosBaja(this.idEmpresa,this.estatusBaj).subscribe(datos =>{
      
    this.arreglobaja = datos.datos

  });
    this.EmpleadosService.empleadoListCom(objEnviar).subscribe(datos => this.arregloempleados = datos.datos);
    this.catalogosPrd.getMotivoBajaEmpleado(true).subscribe(datos => this.arregloMotivoBaja = datos.datos);
    this.catalogosPrd.getTipoBajaEmpleado(true).subscribe(datos => this.arregloTipoBaja = datos.datos);

    

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      if (!this.insertar) {
      }


      

      this.myFormcomp = this.createFormcomp((this.objCompany));
    });


  }



 public establecerPermisos(){
  this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");

}



 

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormcomp(obj: any) {
    
      obj.calculoAntiguedadx = "antiguedad";
      obj.pagosXliquidacionIdPrima = true;

    return this.formBuilder.group({

      personaId: [obj.personaId, [Validators.required]],
      tipoBajaId: [obj.tipoBajaId, [Validators.required]],
      motivoBajaId: [obj.motivoBajaId, [Validators.required]],
      ultimoDia: [obj.ultimoDia, [Validators.required]],
      fechaFinUltimoPago:[obj.fechaFinUltimoPago],
      calculoAntiguedadx: [obj.calculoAntiguedadx, [Validators.required]],
      pagosXliquidacionIdPrima: [obj.pagosXliquidacionIdPrima],
      pagosXliquidacionId20: [obj.pagosXliquidacionId20],
      pagosXliquidacionId90: [obj.pagosXliquidacionId90],
      notas: [obj.notas],
      numeroDias: [obj.numeroDias,[Validators.required]],
      identificadorPersona: [''],

    });
  }

  public validarEmpleado() {
    

    const nombreCapturado = this.myFormcomp.value.personaId;
    if (nombreCapturado !== undefined) {
      if (nombreCapturado.trim() !== "") {
        for (let item of this.arreglobaja) {
          const nombreCompleto = item.personaId?.nombre + " " + item.personaId?.apellidoPaterno;
          if (nombreCapturado.includes(nombreCompleto)) {
            this.myFormcomp.controls.identificadorPersona.setValue(item.personaId?.personaId);
            this.fechaContrato = item.fechaContrato;
            this.personaId = item.personaId?.personaId;
            if(this.personaId != null){

              this.EmpleadosService.getEmpleadoValidarFecha(this.personaId).subscribe(datos => {
                  this.arregloEmpleado = datos.datos;
                  if(this.arregloEmpleado.mostrarFechaFinUltimoPago == true){
                      this.ultimaNomina = true;
                      this.myFormcomp.controls.fechaFinUltimoPago.setValidators([Validators.required]);
                      this.myFormcomp.controls.fechaFinUltimoPago.updateValueAndValidity();
                  }else{
                    
                    this.myFormcomp.controls.fechaFinUltimoPago.setValidators([]);
                    this.myFormcomp.controls.fechaFinUltimoPago.updateValueAndValidity();
                    this.ultimaNomina = false;
                  }
              });
            }

            break;
          }
        }


      }
    }


  }


  public recibirEtiquetas(obj: any) {
    
    this.etiquetas = obj;
 }

  public validarTipoCalculo(calculo:any){
    
    if(calculo != ""){
      if(calculo == 1){
        this.liquidacion = true;
      }else{
        this.liquidacion = false;
        if(this.mostrardias){
          this.mostrardias = false;
          this.numerodias = false;
        }
      }
   }
 }

 public dias(){
    if(!this.actguardar){
    this.mostrardias = true;
    this.actguardar= true;
    this.numerodias = true;
    }
 }

 public diasOcultar(){
    if(this.actguardar){
    this.mostrardias = false;
    this.actguardar= false;
    this.numerodias = false;
    }
   
 }


  public enviarPeticion() {
    
    this.submitEnviado = true;

    if (this.myFormcomp.invalid) {
      let invalido: boolean = true;
      if (!this.numerodias) {
        for (let item in this.myFormcomp.controls) {

        if (item == "numeroDias")
        continue;

        if (this.myFormcomp.controls[item].invalid) {
          invalido = true;
          break;
        }
        invalido = false;
      }
      }
      if (invalido) {
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
      }

    }

    let mensaje = "¿Deseas dar de baja el empleado?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{

      if(valor){
        
        let obj = this.myFormcomp.value;

/*         let fechar = "";
        if (obj.ultimoDia != undefined || obj.ultimoDia != null) {
    
          if (obj.ultimoDia != "") {
    
            const fecha1 = new Date(obj.ultimoDia).toUTCString().replace("GMT", "");
            fechar = `${new Date(fecha1).getTime()}`;
          }
        } */

/*         let fecharUltimoPago = "";
        if (obj.fechaFinUltimoPago != undefined || obj.fechaFinUltimoPago != null) {
    
          if (obj.fechaFinUltimoPago != "") {
    
            const fecha1 = new Date(obj.fechaFinUltimoPago).toUTCString().replace("GMT", "");
            fecharUltimoPago = `${new Date(fecha1).getTime()}`;
          }
        } */


        if(obj.pagosXliquidacionIdPrima == true && obj.tipoBajaId != "2"){
          obj.pagosLiquidacionId= 1
          let objEnviar: any = 
          {
            fechaContrato: this.fechaContrato,
            personaId: {
                personaId: this.personaId,
            },
            centrocClienteId: {
                centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
            },
            pagosLiquidacionId: {
                pagosLiquidacionId: obj.pagosLiquidacionId
            }
          }
          this.arregloLiquidacion.push(objEnviar);
        }
        if(obj.pagosXliquidacionId20 == true){
          obj.pagosLiquidacionId= 3
          let objEnviar: any = 
          {
            fechaContrato: this.fechaContrato,
            personaId: {
                personaId: this.personaId,
            },
            centrocClienteId: {
                centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
            },
            pagosLiquidacionId: {
                pagosLiquidacionId: obj.pagosLiquidacionId
            }
          }
          this.arregloLiquidacion.push(objEnviar);
          }
        if(obj.pagosXliquidacionId90 != null){
          if(obj.pagosXliquidacionId90 == 2){
          obj.pagosLiquidacionId= 2
          let objEnviar: any = 
          {
            fechaContrato: this.fechaContrato,
            personaId: {
                personaId: this.personaId,
            },
            centrocClienteId: {
                centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
            },
            pagosLiquidacionId: {
                pagosLiquidacionId: obj.pagosLiquidacionId
            }
          }
          this.arregloLiquidacion.push(objEnviar);
          }else{
            obj.pagosLiquidacionId= 4
            let objEnviar: any = 
            {
              fechaContrato: this.fechaContrato,
              personaId: {
                  personaId: this.personaId,
              },
              centrocClienteId: {
                  centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
              },
              pagosLiquidacionId: {
                  pagosLiquidacionId: obj.pagosLiquidacionId
              },
              numeroDias: obj.numeroDias
            }
            this.arregloLiquidacion.push(objEnviar);
          }
        }
             
    
        let antiguedad = obj.calculoAntiguedadx == "contrato"?"C":"A";
        
        let objEnviar: any ={
          fechaContrato: this.fechaContrato,
          notas: obj.notas,
          fecharUltimoPago: obj.fechaFinUltimoPago,
          personaId: {
              personaId: this.personaId,
          },
          centrocClienteId: {
              centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
          },
          tipoBajaId: {
              tipoBajaId: obj.tipoBajaId
          },
          motivoBajaId: {
              motivoBajaId: obj.motivoBajaId
          },
          pagosLiquidacionColaborador: this.arregloLiquidacion,
          ultimoDia: obj.ultimoDia,
          fechaParaCalculo: antiguedad,
          estatusBajaId:1
      }


      
      
          
      this.modalPrd.showMessageDialog(this.modalPrd.loading);
          
          this.EmpleadosService.saveBaja(objEnviar).subscribe(datos => {
            
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.configuracionPrd.setPermisos(this.configuracionPrd.getPermisosBySubmodulo(3,10));
                this.routerPrd.navigate(['/empleados']);
              }
            });
          });

     }

    });

  }

  public cancelarcomp() {
    
    this.configuracionPrd.setPermisos(this.configuracionPrd.getPermisosBySubmodulo(3,10));
    this.routerPrd.navigate(['/empleados']);
    this.myFormcomp = this.createFormcomp({});
  }

  get f() { return this.myFormcomp.controls; }


}
