import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit {


  public myForm!: FormGroup;
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType: string = "";
  public fechaActual: string = "";
  public strTitulo: string = "";
  public strsubtitulo: string = "";
  public objusuario: any = {};
  public arregloCompany: any;
  public summitenviado:boolean = false;


  constructor(private formBuilder: FormBuilder, private usuariosPrd: UsuarioService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router) {
    let fecha = new Date();
    let dia = fecha.getDay() < 10 ? `0${fecha.getDay()}` : fecha.getDay();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    this.fechaActual = `${anio}-${mes}-${dia}`;
  }

  ngOnInit(): void {

    this.arregloCompany = history.state.company == undefined ? [] : history.state.company;

    this.verificarCompaniasExista();
    

      this.routerActivePrd.params.subscribe(parametros => {
        let id = parametros["idusuario"];
        this.insertar = id == undefined;
        if (id != undefined) {
          console.log("viene y recupera el usuario ");
          this.usuariosPrd.getById(id).subscribe(datosusuario => {
            this.objusuario = datosusuario.datos;
            this.myForm = this.createForm((this.objusuario));
          });
        }
      });



    this.objusuario.centrocClienteId = {};


    this.myForm = this.createForm((this.objusuario));



  }


  public verificarCompaniasExista() {
    if ((this.arregloCompany == undefined))
      this.cancelar();
    else
      if (this.arregloCompany.length == 0)
        this.cancelar();
  }


  public createForm(obj: any) {




    console.log("construir esto", obj);

    return this.formBuilder.group({



      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPaterno, [Validators.required]],
      apellidoMat: [obj.apellidoMaterno],
      curp: [obj.curp, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      emailCorp: [obj.emailCorporativo, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      ciTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta.replace("/", "-").replace("/", "-")), disabled: true }, [Validators.required]],
      centrocClienteId: [{ value: obj.centrocClienteId.centrocClienteId, disabled: !this.insertar }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.activo, disabled: this.insertar }, [Validators.required]],
      personaId: obj.personaId


    });
  }


  public enviarPeticion() {

    if(this.myForm.invalid){
      this.iconType = "error";
      this.strTitulo =  "Campos incorrectos";
      this.strsubtitulo = "Verificar si hay campos incorrectos o por rellenar.";
      this.modal = true;
      this.summitenviado= true;


      return;

    }

    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar el usuario?" : "¿Deseas actualizar el usuario?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }


  public recibir($evento: any) {
    this.modal = false;
    if (this.iconType == "warning") {
      if ($evento) {

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
          this.usuariosPrd.save(objEnviar).subscribe(datos => {
            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.strsubtitulo = datos.mensaje
            this.modal = true;
          });

        } else {
          objEnviar.personaId = obj.personaId;
          objEnviar.centrocClienteId.centrocClienteId = this.objusuario.centrocClienteId.centrocClienteId;

          this.usuariosPrd.modificar(objEnviar).subscribe(datos => {
            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.strsubtitulo = datos.mensaje
            this.modal = true;

          });
        }



      }
    } else {
      this.modal = false;

      if (this.iconType == "success") {
        this.routerPrd.navigate(["/usuarios"]);
      }

    }
  }


  get f() { return this.myForm.controls; }





  public cancelar() {
    this.routerPrd.navigate(['/usuarios']);
  }




}
