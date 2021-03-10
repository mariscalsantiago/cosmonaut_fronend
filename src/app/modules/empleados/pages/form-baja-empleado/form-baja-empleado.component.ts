import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/modules/usuarios/services/usuario.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { EmpleadosService } from '../../services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

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
  public estatus: boolean = true;
  public arregloMotivoBaja: any = [];
  public arregloTipoBaja: any = []; 
  public arregloempleados: any = [];
  public arreglobaja: any = [];
  public fechaContrato = new Date();
  public fechaUltimo: string = "";
  public idEmpresa: number = 0;
  public estatusBaj: boolean = false;
  


  constructor(private formBuilder: FormBuilder, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private usuariosPrd: UsuarioService,private modalPrd:ModalService,private usuarioSistemaPrd:UsuarioSistemaService,
    private catalogosPrd:CatalogosService, private EmpleadosService:EmpleadosService) {
  }

  ngOnInit(): void {

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
    this.EmpleadosService.getEmpleadosBaja(this.idEmpresa,this.estatusBaj).subscribe(datos => this.arreglobaja = datos.datos);
    //this.EmpleadosService.empleadoListCom(objEnviar).subscribe(datos => this.arregloempleados = datos.datos);
    this.catalogosPrd.getMotivoBajaEmpleado(this.estatus).subscribe(datos => this.arregloMotivoBaja = datos.datos);
    this.catalogosPrd.getTipoBajaEmpleado(this.estatus).subscribe(datos => this.arregloTipoBaja = datos.datos);

    

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      if (!this.insertar) {
      }


      

      this.myFormcomp = this.createFormcomp((this.objCompany));
    });


  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormcomp(obj: any) {

    return this.formBuilder.group({

      personaId: [obj.personaId, [Validators.required]],
      tipoBajaId: [obj.tipoBajaId, [Validators.required]],
      motivoBajaId: [obj.motivoBajaId, [Validators.required]],
      ultimoDia: [obj.ultimoDia, [Validators.required]],
      calculoAntiguedadx: [obj.calculoAntiguedadx],
      pagosXliquidacionId: [obj.pagosXliquidacionId],
      notas: [obj.notas],



    });
  }

  public subirarchivos() {

  }


  public enviarPeticion() {
    
    this.submitEnviado = true;
    if (this.myFormcomp.invalid) {     
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let mensaje = "¿Deseas dar de baja el empleado?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{

      if(valor){
        let obj = this.myFormcomp.value;
        for (let item of this.arreglobaja){
          if(item.numEmpleado == obj.personaId){
                this.fechaContrato = item.fechaContrato
              }
        }

        let fechar = "";
        let arre = obj.ultimoDia.split('-');
        fechar = arre[2] + "/" + arre[1] + "/" + arre[0];
        
        let antiguedad = obj.calculoAntiguedadx == "contrato"?"C":"A";
        
        let objEnviar: any ={
          fechaContrato: this.fechaContrato,
          notas: obj.notas,
          personaId: {
              personaId: obj.personaId
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
          pagosXliquidacionId: {
              pagosXliquidacionId: obj.pagosXliquidacionId
          },
          ultimoDia: fechar,
          fechaParaCalculo: antiguedad
      }

          
          this.EmpleadosService.saveBaja(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
              //.then(()=> this.routerPrd.navigate(['/empleados']
            //));
              if(datos.resultado){
                this.routerPrd.navigate(['/empleados']);
              }
          });

     }

    });

  }

  public cancelarcomp() {
    this.routerPrd.navigate(['/empleados']);
  }

  get f() { return this.myFormcomp.controls; }


}
