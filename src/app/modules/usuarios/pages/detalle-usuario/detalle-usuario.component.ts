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
  public objusuario: any;
  public arregloCompany: any;


  constructor(private formBuilder: FormBuilder, private usuariosPrd: UsuarioService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'new');


      if ((this.insertar)) {
        this.strTitulo = "¿Deseas registrar el usuario?";

      } else {
        this.strTitulo = "¿Deseas actualizar el usuario?";

      }



    });





    let fecha = new Date();
    let dia = fecha.getDay() < 10 ? `0${fecha.getDay()}` : fecha.getDay();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${anio}-${mes}-${dia}`;






  }

  ngOnInit(): void {

    this.objusuario = history.state.data == undefined ? {} : history.state.data;
    this.arregloCompany = history.state.company == undefined ? [] : history.state.company;

    console.log(this.arregloCompany);
    this.verificarCompaniasExista();
    

    this.myForm = this.createForm((this.objusuario));
    console.log("mi usuario recibido");
    console.log(this.objusuario);
  }


  public verificarCompaniasExista(){
    if ((this.arregloCompany == undefined))
      this.cancelar();
    else 
      if (this.arregloCompany.length == 0) 
        this.cancelar();
  }


  public createForm(obj: any) {





    return this.formBuilder.group({



      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPat, [Validators.required]],
      apellidoMat: [obj.apellidoMat],
      curp: [obj.curp, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      emailCorp: [obj.emailCorp, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.ciEmailPersonal, [Validators.required, Validators.email]],
      ciTelefono: [obj.ciTelefono, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta.replace("/", "-").replace("/", "-")), disabled: true }, [Validators.required]],
      representanteLegalCentrocClienteId: [{ value: obj.representanteLegalCentrocClienteId.centrocClienteId, disabled: !this.insertar }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      personaId: obj.personaId


    });
  }


  public enviarPeticion() {
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
        let objEnviar:any = {
            nombre: obj.nombre,
            apellidoPat: obj.apellidoPat,
            apellidoMat: obj.apellidoMat,
            curp: obj.curp,
            emailCorp: obj.emailCorp,
            ciEmailPersonal: obj.ciEmailPersonal,
            ciTelefono: obj.ciTelefono,
            representanteLegalCentrocClienteId: {
                centrocClienteId: obj.representanteLegalCentrocClienteId
            }
        }


      
        if (this.insertar) {
          this.usuariosPrd.save(objEnviar).subscribe(datos => {

            this.iconType = datos.result ? "success" : "error";

            this.strTitulo = datos.message;
            this.strsubtitulo = datos.message
            this.modal = true;
          });

        } else {
          objEnviar.personaId = obj.personaId;

          this.usuariosPrd.modificar(objEnviar).subscribe(datos => {
            this.iconType = datos.result ? "success" : "error";
            this.strTitulo = datos.message;
            this.strsubtitulo = datos.message
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
