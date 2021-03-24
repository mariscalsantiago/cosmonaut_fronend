import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit {

  public tamanio:number= 0;

  @ViewChild("centroCliente") public centrocliente!: ElementRef;
  @ViewChild("nombre") public nombre!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerHeight;
    console.log(this.tamanio);
  }


  public myForm!: FormGroup;
  public insertar: boolean = false;
  public fechaActual: any = "";;
  public objusuario: any = {};
  public arregloCompany: any;
  public summitenviado: boolean = false;


  constructor(private formBuilder: FormBuilder, private usuariosPrd: UsuarioService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService) {

    let datePipe = new DatePipe("es-MX");

    let fecha = new Date();
    this.fechaActual = datePipe.transform(fecha, 'dd-MMM-y')
  }

  ngOnInit(): void {

    this.arregloCompany = history.state.company == undefined ? [] : history.state.company;


    this.verificarCompaniasExista();

    

    this.routerActivePrd.params.subscribe(parametros => {
      
      let id = parametros["idusuario"];
      this.insertar = id == undefined;
      if (id != undefined) {
        

        this.usuariosPrd.getById(id).subscribe(datosusuario => {          
          this.objusuario = datosusuario.datos;
          console.log(this.objusuario);
          let datePipe = new DatePipe("es-MX");
          this.objusuario.fechaAlta = (new Date(this.objusuario.fechaAlta).toUTCString()).replace(" 00:00:00 GMT","");
          this.objusuario.fechaAlta = datePipe.transform(this.objusuario.fechaAlta,"dd-MMM-y");
           this.myForm = this.createForm((this.objusuario));
        });
      }
    });



    this.objusuario.centrocClienteId = {};


    this.myForm = this.createForm((this.objusuario));



  }


  ngAfterViewInit(): void {

    if (!this.insertar)
      this.nombre.nativeElement.focus();
    else
      this.centrocliente.nativeElement.focus();
  }


  public verificarCompaniasExista() {
    if ((this.arregloCompany == undefined))
      this.cancelar();
    else
      if (this.arregloCompany.length == 0)
        this.cancelar();
  }


  public createForm(obj: any) {


    return this.formBuilder.group({



      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPaterno, [Validators.required]],
      apellidoMat: [obj.apellidoMaterno],
      curp: [obj.curp, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      emailCorp: [obj.emailCorporativo, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      ciTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta), disabled: true }, [Validators.required]],
      centrocClienteId: [{ value: obj.centrocClienteId.centrocClienteId, disabled: !this.insertar }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.activo, disabled: this.insertar }, [Validators.required]],
      personaId: obj.personaId


    });
  }


  public enviarPeticion() {


    this.summitenviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let mensaje = this.insertar ? "¿Deseas registrar el usuario?" : "¿Deseas actualizar los datos del usuario?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let obj = this.myForm.value;
        let objEnviar: any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPat,
          apellidoMaterno: obj.apellidoMat,
          curp: obj.curp,
          emailCorporativo: obj.emailCorp,
          contactoInicialEmailPersonal: obj.ciEmailPersonal,
          contactoInicialTelefono: obj.ciTelefono,
          centrocClienteId: {
            centrocClienteId: obj.centrocClienteId
          }
        }

        if (this.insertar) {

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.usuariosPrd.save(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => this.routerPrd.navigate(["/usuarios"]));
          });

        } else {
          objEnviar.personaId = obj.personaId;
          objEnviar.centrocClienteId.centrocClienteId = this.objusuario.centrocClienteId.centrocClienteId;

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.usuariosPrd.modificar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => this.routerPrd.navigate(["/usuarios"]));
          });
        }
      }
    });

  }




  get f() { return this.myForm.controls; }





  public cancelar() {
    this.routerPrd.navigate(['/usuarios']);
  }




}
