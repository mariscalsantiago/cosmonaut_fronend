import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  public iconType:string = "";
  public fechaActual: string = "";
  public strTitulo: string = "";
  public strsubtitulo:string = "";
  

  constructor(private formBuilder: FormBuilder, private usuariosPrd: UsuarioService, private routerActivePrd: ActivatedRoute) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'new');

      this.strTitulo = (this.insertar) ? "¿Deseas registrar el usuario?" : "¿Deseas actualizar el usuario?";

    });





    let fecha = new Date();
    let dia = fecha.getDay() < 10 ? `0${fecha.getDay()}` : fecha.getDay();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${anio}-${mes}-${dia}`;



    


  }

  ngOnInit(): void {

    let objUsuario = history.state.data == undefined ? {} : history.state.data;

    this.myForm = this.createForm((objUsuario));

    console.log(this.f.nombre);
  }


  public createForm(obj: any) {


    

    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      curp: [obj.curp,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      correoEmpresarial: [obj.correoEmpresarial, [Validators.required, Validators.email]],
      correoPersonal: [obj.correoPersonal, [Validators.required, Validators.email]],
      telefono: [obj.telefono, [Validators.required]],
      fechaRegistro: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaRegistro), disabled: true }, [Validators.required]],
      idTipoUsuario: [{ value: obj.idTipoUsuario, disabled: !this.insertar }, [Validators.required]],
      idCompañia: [{ value: obj.idCompañia, disabled: !this.insertar }, [Validators.required]],
      status: [{ value: (this.insertar) ? true : obj.status, disabled: this.insertar }, [Validators.required]],
      id: obj.id


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
    if(this.iconType == "warning"){
      if ($evento) {
       
        let obj = this.myForm.value;
     
  
        this.usuariosPrd.save(obj).subscribe(datos => {
          this.iconType = "success";
  
          this.strTitulo = datos.message;
          this.strsubtitulo = datos.message
          this.modal = true;
        });
      }
    }else{
      this.modal = false;
    }
  }


  get f() { return this.myForm.controls; }







}
