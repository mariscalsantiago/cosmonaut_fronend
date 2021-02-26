import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { UsuarioService } from 'src/app/modules/usuarios/services/usuario.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-detalle-company',
  templateUrl: './detalle-company.component.html',
  styleUrls: ['./detalle-company.component.scss']
})
export class DetalleCompanyComponent implements OnInit {
  @ViewChild("nombre") nombre: any;

  public myFormcomp!: FormGroup;
  public arreglo: any = [];
  public modal: boolean = false;
  public contacto: boolean = false;
  public listcontacto: boolean = false;
  public compania: boolean = true;
  public companiaprincipal: boolean = true;
  public insertar: boolean = false;
  public iconType: string = "";
  public strTitulo: string = "";

  public objcont: any;
  public fechaAlta: string = "";
  public cargando: Boolean = false;
  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public objCompany: any;
  public submitEnviado: boolean = false;
  public imagen: any = undefined;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  constructor(private formBuilder: FormBuilder, private companyPrd: CompanyService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private usuariosPrd: UsuarioService) {
  }

  ngOnInit(): void {

    this.objCompany = history.state.datos == undefined ? {} : history.state.datos;
    this.compania = true;

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      if (!this.insertar) {
        this.listaContacto();
        this.listcontacto = true;
      }

      this.myFormcomp = this.createFormcomp((this.objCompany));
    });


  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormcomp(obj: any) {
    let datePipe = new DatePipe("en-MX");
    console.log(datePipe.transform(new Date(), 'dd/MM/yyyy'));
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      razonSocial: [obj.razonSocial, [Validators.required]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      fechaAlta: [{ value: ((this.insertar) ? datePipe.transform(new Date(), 'dd/MM/yyyy') : obj.fechaAlta), disabled: true }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? "true" : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      centrocClienteId: obj.centrocClienteId

    });
  }

  public subirarchivos() {

  }


  public verdetallecont(obj: any) {

    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['company', 'detalle_contacto', tipoinsert], { state: { datos: obj, empresa: this.objCompany } });
    this.cargando = false;



  }



  public listaContacto() {

    let objEnviar: any = {

      centrocClienteId: {
        centrocClienteId: this.objCompany?.centrocClienteId
      },
      tipoPersonaId: {
        tipoPersonaId: 2
      }
    }

    this.cargando = true;
    this.usuariosPrd.filtrar(objEnviar).subscribe(datos => {
      this.arreglo = datos.datos;
      let columnas: Array<tabla> = [
        new tabla("personaId", "ID contacto"),
        new tabla("nombre", "Nombre contacto"),
        new tabla("emailCorporativo", "Correo Empresarial"),
        new tabla("contactoInicialTelefono", "Teléfono"),
        new tabla("fechaAlta", "Fecha registro")
      ]



      if (this.arreglo !== undefined)
        for (let item of this.arreglo)
          item.nombre = `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno}`;

      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;


    });
  }

  public enviarPeticioncomp() {

    if (this.myFormcomp.invalid) {

      this.submitEnviado = true;
      this.iconType = "error";
      this.strTitulo = "Campos obligatorios o inválidos";
      this.modal = true;

      return;
    }


    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar la compañía?" : "¿Deseas actualizar los datos de la compañía?";
    this.modal = true;

  }

  public cancelarcomp() {
    this.routerPrd.navigate(['/company']);
  }

  public recibir($evento: any) {

    this.modal = false;
    if (this.iconType == "warning") {
      if ($evento) {
        let obj = this.myFormcomp.value;
        obj = {
          ...obj,
          imagen: this.imagen
        };



        if (this.insertar) {


          this.companyPrd.save(obj).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.modal = true;
            this.compania = !datos.resultado;
            this.contacto = true;
            if (datos.resultado) {
              this.objCompany = datos.datos;
            }

          });

        } else {



          this.companyPrd.modificar(obj).subscribe(datos => {
            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.modal = true;
            this.listcontacto = true;
            this.compania = false;

          });
        }

      }
    } else {

      if (this.iconType == "success") {
        this.modal = false;


        if (this.insertar) {
          this.routerPrd.navigate(['company', 'detalle_contacto', "nuevo"], { state: { datos: undefined, empresa: this.objCompany } });
        }
      }
    }
  }

  get f() { return this.myFormcomp.controls; }


  public recibirImagen(imagen: any) {
    this.imagen = imagen;
  }


  public recibirTabla(obj: any) {

    console.log(obj.datos);

    this.verdetallecont(obj.datos);

  }


}
