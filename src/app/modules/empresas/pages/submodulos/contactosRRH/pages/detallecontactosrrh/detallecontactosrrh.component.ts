import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariocontactorrhService } from '../services/usuariocontactorrh.service';
import { DatePipe } from '@angular/common';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-detallecontactosrrh',
  templateUrl: './detallecontactosrrh.component.html',
  styleUrls: ['./detallecontactosrrh.component.scss']
})
export class DetallecontactosrrhComponent implements OnInit {

  @ViewChild("nombre") public nombre!: ElementRef;

  public myForm!: FormGroup;
  public fechaActual: string = "";
  public subbmitActive: boolean = false;
  public id_empresa: number = 0;
  public esInsert: boolean = true;
  public usuario: any;
  constructor(private formBuild: FormBuilder, private usuariosPrd: UsuariocontactorrhService, private ActiveRouter: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService) { }

  ngOnInit(): void {


    this.ActiveRouter.params.subscribe(datos => {
      
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      } else {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
      }
    });
    

    let obj = {};

    if (!this.esInsert) {//Solo cuando es modificar
      obj = history.state.data;
      this.usuario = obj;
      if (this.usuario == undefined) this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
    }

    this.myForm = this.createForm(obj);

  }

  public createForm(obj: any) {
    let fecha = new Date();
    this.fechaActual = fecha.toLocaleDateString();
    
    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPaterno, [Validators.required]],
      apellidoMat: [obj.apellidoMaterno],
      celular: [obj.celular, []],
      curp: [obj.curp, [Validators.required, Validators.pattern(ConfiguracionesService.regexCurp)]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern(ConfiguracionesService.regexRFC)]],
      emailCorp: [obj.emailCorporativo?.toLowerCase(), [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.contactoInicialEmailPersonal?.toLowerCase(), [ Validators.email]],
      ciTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      ciExtension: [obj.contactoInicialExtension],
      //fechaAlta: [{ value: ((this.esInsert) ? datePipe.transform(new Date(), 'dd-MMM-y') : obj.fechaAlta), disabled: true }, [Validators.required]],
      personaId: [obj.personaId]

    });

  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }



  public enviarPeticion() {

    this.subbmitActive = true;

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    let moralFiscia = this.myForm.controls.rfc.value.substr(10,12).length;
    if(moralFiscia === 3){
      let rfcFisica = this.myForm.controls.rfc.value.substr(0,10);
      let curp = this.myForm.controls.curp.value.substr(0,10);
      if(curp !== rfcFisica){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"Los datos de RFC y CURP no corresponden");
  
        return;
      }
    }
    else if(moralFiscia === 2){
      let rfcMoral = this.myForm.controls.rfc.value.substr(0,9);
      let curp = this.myForm.controls.curp.value.substr(0,9);
      if(curp !== rfcMoral){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"Los datos de RFC y CURP no corresponden");
  
        return;
      }
    }
    let titulo = this.esInsert ? "¿Desea registrar el contacto RRHH?" : "¿Desea actualizar los datos del contacto RRHH?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        let obj = this.myForm.value;

        let peticion: any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPat,
          apellidoMaterno: obj.apellidoMat,
          curp: obj.curp,
          celular: obj.celular,
          rfc: obj.rfc,
          esActivo: true,
          emailCorporativo: obj.emailCorp?.toLowerCase(),
          contactoInicialEmailPersonal: obj.ciEmailPersonal?.toLowerCase(),
          contactoInicialTelefono: obj.ciTelefono,
          contactoInicialExtension: obj.ciExtension,
          centrocClienteId: {
            centrocClienteId: this.id_empresa
          },
          tipoPersonaId:{
            tipoPersonaId:4
          }
        };


        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        if (this.esInsert) {
          this.usuariosPrd.save(peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
            if(datos.resultado){
              this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
            }
              
          });
        } else {
          peticion.personaId = obj.personaId;
          this.usuariosPrd.modificar(peticion).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
            if(datos.resultado){
              this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
            }
              

          });

        }
      }
    });

  }


  public cancelar() {
    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
  }


  get f() {
    return this.myForm.controls;
  }

}
