import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminUsuariosService } from '../../services/admin-usuarios.service';

@Component({
  selector: 'app-admin-detalle-usuarios',
  templateUrl: './admin-detalle-usuarios.component.html',
  styleUrls: ['./admin-detalle-usuarios.component.scss']
})
export class AdminDetalleUsuariosComponent implements OnInit {

  
  public tamanio:number= 0;

  
  @ViewChild("nombre") public nombre!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerHeight;
    
  }


  public myForm!: FormGroup;
  public insertar: boolean = false;
  public fechaActual: any = "";;
  public objusuario: any = {};
  public arregloCompany: any;
  public summitenviado: boolean = false;


  constructor(private formBuilder: FormBuilder, private usuariosPrd: AdminUsuariosService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService) {

    let datePipe = new DatePipe("es-MX");

    let fecha = new Date();
    this.fechaActual = datePipe.transform(fecha, 'dd-MMM-y')?.replace(".","");
  }

  ngOnInit(): void {
    this.routerActivePrd.params.subscribe(parametros => {
      
      let id = parametros["idusuario"];
      console.log("ESTO ES LA URTA RECIBIDA",parametros);
      this.insertar = id == undefined;
      if (id != undefined) {
        

        this.usuariosPrd.getById(id).subscribe(datosusuario => {          
          this.objusuario = datosusuario.datos;
          
          let datePipe = new DatePipe("es-MX");
          this.objusuario.fechaAlta = (new Date(this.objusuario.fechaAlta).toUTCString()).replace(" 00:00:00 GMT","");
          this.objusuario.fechaAlta = datePipe.transform(this.objusuario.fechaAlta,"dd-MMM-y")?.replace(".","");
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
    
  }


  public verificarCompaniasExista() {
    console.log("Se verifica que las COMPAÑIAS EXISTAN");
    console.log(this.arregloCompany.length,"longitud del arreglo");
      if (this.arregloCompany.length == 0){
        this.cancelar();
      }
  }


  public createForm(obj: any) {


    return this.formBuilder.group({



      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPaterno, [Validators.required]],
      apellidoMat: [obj.apellidoMaterno],
      celular: [obj.celular, []],
      curp: [obj.curp, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      emailCorp: [obj.emailCorporativo, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.contactoInicialEmailPersonal, [ Validators.email]],
      ciTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta), disabled: true }, [Validators.required]],
      centrocClienteId: [{ value: obj.centrocClienteId.centrocClienteId, disabled: !this.insertar }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.activo, disabled: this.insertar }, [Validators.required]],
      personaId: obj.personaId,
      cambiarMulticliente:false


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
          celular: obj.celular,
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
            if(datos.resultado){
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => this.routerPrd.navigate(["/usuarios"]));
            }else{
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
            }
            
          });

        } else {
          objEnviar.personaId = obj.personaId;
          objEnviar.centrocClienteId.centrocClienteId = this.objusuario.centrocClienteId.centrocClienteId;

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.usuariosPrd.modificar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            if(datos.resultado){
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => this.routerPrd.navigate(["/usuarios"]));
            }else{
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
            }
            
          });
        }
      }
    });

  }




  get f() { return this.myForm.controls; }





  public cancelar() {
    console.log("YA SE CANCELO");
    this.routerPrd.navigate(['/usuarios']);
  }


  public cambiarMulticliente(){

  }




}
