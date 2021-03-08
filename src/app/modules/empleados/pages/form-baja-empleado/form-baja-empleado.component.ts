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
  public arregloEmpleados: any = [];


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
    this.EmpleadosService.empleadoListCom(objEnviar).subscribe(datos => this.arregloEmpleados = datos.datos);
    console.log("Empleados",this.arregloEmpleados)
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
      pagosXliquidacionId: [obj.pagosXliquidacionId]


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
        let antiguedad = obj.calculoAntiguedadx == "contrato"?"C":"A";
        let objEnviar: any ={
          fechaContrato: "09/02/2021",
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
              pagosXliquidacionId: 1
          },
          ultimoDia: obj.ultimoDia,
          fechaParaCalculo: antiguedad
      }


          this.EmpleadosService.saveBaja(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
              .then(()=> this.routerPrd.navigate(['/empleado'], { state: { datos: undefined } }));

            //this.compania = !datos.resultado;

          });

     }

    });

  }

  public cancelarcomp() {
    this.routerPrd.navigate(['/empleado']);
  }

  get f() { return this.myFormcomp.controls; }


}
