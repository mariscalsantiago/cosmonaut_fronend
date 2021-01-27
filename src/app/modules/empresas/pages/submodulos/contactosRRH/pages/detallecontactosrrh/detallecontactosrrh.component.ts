import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariocontactorrhService } from '../services/usuariocontactorrh.service';

@Component({
  selector: 'app-detallecontactosrrh',
  templateUrl: './detallecontactosrrh.component.html',
  styleUrls: ['./detallecontactosrrh.component.scss']
})
export class DetallecontactosrrhComponent implements OnInit {



  public iconType: string = "";
  public myForm!: FormGroup;
  public modal: boolean = false;
  public strTitulo: string = "";
  public strsubtitulo: string = "";
  public fechaActual: string = "";
  public subbmitActive: boolean = false;
  public id_empresa: number = 0;
  public esInsert: boolean = true;
  public usuario:any;
  constructor(private formBuild: FormBuilder, private usuariosPrd: UsuariocontactorrhService, private ActiveRouter: ActivatedRoute,
    private routerPrd:Router) { }

  ngOnInit(): void {


    this.ActiveRouter.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if(datos["tipoinsert"]=="nuevo"){
         this.esInsert = true;
      }else if(datos["tipoinsert"]=="editar"){
          this.esInsert = false;
      }else{
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa,'contactosrrh']);
      }
    });


    let obj = {};

    if(!this.esInsert){//Solo cuando es modificar
      obj = history.state.data;
      this.usuario = obj;
      if(this.usuario == undefined) this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa,'contactosrrh']);
    }

    this.myForm = this.createForm(obj);

  }

  public createForm(obj: any) {


    let fecha = new Date();
    let dia = fecha.getDay() < 10 ? `0${fecha.getDay()}` : fecha.getDay();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${anio}-${mes}-${dia}`;

    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPat, [Validators.required]],
      apellidoMat: [obj.apellidoMat],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      emailCorp: [obj.emailCorp, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.ciEmailPersonal, [Validators.required, Validators.email]],
      ciTelefono: [obj.ciTelefono, [Validators.required]],
      ciExtension: [obj.ciExtension],
      fechaAlta: { value: this.fechaActual, disabled: true },
      personaId:[obj.personaId]

    });

  }



  public enviarPeticion() {


    this.subbmitActive = true;
    if (!this.myForm.valid)
      return;



    this.iconType = "warning";
    this.strTitulo = (this.esInsert) ? "¿Deseas registrar el usuario?" : "¿Deseas actualizar el usuario?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;
  }


  public cancelar() {
    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa,'contactosrrh']);
  }


  get f() {
    return this.myForm.controls;
  }


  public recibir($event: any) {

    this.modal = false;


    if (this.iconType == "warning") {


      if ($event) {

        let obj = this.myForm.value;

        let peticion:any = {
          nombre: obj.nombre,
          apellidoPat: obj.apellidoPat,
          apellidoMat: obj.apellidoMat,
          curp: obj.curp,
          emailCorp: obj.emailCorp,
          ciEmailPersonal: obj.ciEmailPersonal,
          ciTelefono: obj.ciTelefono,
          representanteLegalCentrocClienteId: {
            "centrocClienteId": this.id_empresa
          }
        };
  
  
        if (this.esInsert) {
  
          this.usuariosPrd.save(peticion).subscribe(datos => {

            this.iconType = datos.result ? "success" : "error";

            this.strTitulo = datos.message;
            this.strsubtitulo = datos.message
            this.modal = true;  
  
          });
        }else{

          peticion.personaId = obj.personaId;

          this.usuariosPrd.modificar(peticion).subscribe(datos => {

            this.iconType = datos.result ? "success" : "error";

            this.strTitulo = datos.message;
            this.strsubtitulo = datos.message
            this.modal = true;  
  
          });

        }
  
      }
  

    }else{
      this.modal = false;

      if (this.iconType == "success") {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa,'contactosrrh']);
      }
    }






  }







}
