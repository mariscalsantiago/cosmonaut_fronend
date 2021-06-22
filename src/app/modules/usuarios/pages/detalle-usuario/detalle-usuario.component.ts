import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from 'src/app/modules/rolesypermisos/services/roles.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit {

  public tamanio: number = 0;
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
  public companiasenviar:any = [];
  public arregloRoles: any = [];

  public esClienteEmpresa:boolean = false;


  constructor(private formBuilder: FormBuilder, private usuariosPrd: UsuarioService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService, private rolesPrd: RolesService,
    private usuariosSistemaPrd: UsuarioSistemaService, private usuariosAuth: UsuariosauthService) {

    let datePipe = new DatePipe("es-MX");

    let fecha = new Date();
    this.fechaActual = datePipe.transform(fecha, 'dd-MMM-y')?.replace(".", "");

    
  }

  ngOnInit(): void {

    this.esClienteEmpresa = this.routerPrd.url.includes("/cliente/usuarios");
    this.arregloCompany = history.state.company == undefined ? [] : history.state.company;
    this.insertar = !Boolean(history.state.usuario);
    this.objusuario = history.state.usuario;
    this.objusuario = this.objusuario == undefined ? {}:this.objusuario;

    this.verificarCompaniasExista();

    

    

  
    this.rolesPrd.getRolesByEmpresa(this.usuariosSistemaPrd.getIdEmpresa(), this.usuariosSistemaPrd.getVersionSistema(), true).subscribe(datos => this.arregloRoles = datos.datos);
    

    this.objusuario.centrocClienteId = {};


    this.myForm = this.createForm(this.objusuario);


    this.routerActivePrd.params.subscribe(params =>{
      
    });



  }


  ngAfterViewInit(): void {

    if (!this.insertar)
      this.nombre.nativeElement.focus();

  }


  public verificarCompaniasExista() {


    if (this.arregloCompany.length == 0) {
      this.cancelar();
    }
  }


  public createForm(obj: any) {


    return this.formBuilder.group({



      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPat, [Validators.required]],
      apellidoMaterno: [obj.apellidoMat],
      correoelectronico: [obj.email, [Validators.required, Validators.email]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : new DatePipe("es-MX").transform(obj.fechaAlta,"dd/MM/yyyy")), disabled: true }, [Validators.required]],
      centrocClienteId: [obj.centrocClientes[0].centrocClienteId, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      personaId: [{ value: obj.personaId, disabled: true }],
      multicliente: obj.esMulticliente == undefined ? false:obj.esMulticliente=="Sí",
      rol:[obj.rolId?.rolId,Validators.required],
      nombrecliente:{value:this.usuariosSistemaPrd.getUsuario().nombreEmpresa,disabled:true},
      usuarioId:obj.usuarioId


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

        let companysend = [];
        if(obj.multicliente){
          for(let item of this.companiasenviar){
            companysend.push(item.centrocClienteId);
          }
        }

        let objAuthEnviar = {
          nombre: obj.nombre,
          apellidoPat: obj.apellidoPaterno,
          apellidoMat: obj.apellidoMaterno,
          email: obj.correoelectronico,
          centrocClienteIds:obj.multicliente?companysend : [obj.centrocClienteId],
          rolId: obj.rol,
          esMulticliente:obj.multicliente,
          usuarioId:obj.usuarioId
        }




        if (this.insertar) {
          delete objAuthEnviar.usuarioId;

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.usuariosAuth.guardar(objAuthEnviar).subscribe((datos) => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => {
                if (datos.resultado) {
                  this.routerPrd.navigate(["/usuarios"])
                }
              });
          });


        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
        
          this.usuariosAuth.modificar(objAuthEnviar).subscribe(datos =>{
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => {
                if (datos.resultado) {
                  this.routerPrd.navigate(["/usuarios"])
                }
              });
          });
        }
      }
    });

  }




  get f() { return this.myForm.controls; }





  public cancelar() {

    this.routerPrd.navigate(['/usuarios']);
  }


  public cambiarMultiempresa() {


  }


  public recibirEtiquetas(evento: any) {
    this.myForm.controls.centrocClienteId.setValue(evento[0].centrocClienteId);
    this.companiasenviar = evento;

  }




}
