import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-detalle-company',
  templateUrl: './detalle-company.component.html',
  styleUrls: ['./detalle-company.component.scss']
})
export class DetalleCompanyComponent implements OnInit {

  public myFormcomp!: FormGroup;
  public arreglo: any = [];
  public modal: boolean = false;
  public contacto: boolean = false;
  public listcontacto: boolean = false;
  public compania: boolean = true;
  public companiaprincipal: boolean = true;
  public insertar: boolean = false;
  public iconType: string = "";
  public fechaActual: string = "";
  public strTitulo: string = "";
  public strsubtitulo: string = "";
  public objcont: any;
  public fechaAlta: string = "";
  public cargando: Boolean = false;
  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public objCompany: any;
  public centrocClienteId: number = 1;
  public tipoPersonaId: number = 3;
  public submitEnviado: boolean = false;
  public imagen:any = undefined;

  constructor(private formBuilder: FormBuilder, private companyPrd: CompanyService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      if (!this.insertar) {
        this.listaContacto();
        this.listcontacto = true;
      }

      this.strTitulo = (this.insertar) ? "¿Deseas registrar la compañía?" : "¿Deseas actualizar la compañía?";

    });


    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${dia}/${mes}/${anio}`;

  }

  ngOnInit(): void {
    
    this.objCompany = history.state.datos == undefined ? {} : history.state.datos;
    this.myFormcomp = this.createFormcomp((this.objCompany));
    this.compania = true;
  }


  public createFormcomp(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      razonSocial: [obj.razonSocial, [Validators.required]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      emailCorp: [obj.emailCorp, [Validators.email]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta), disabled: true }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      centrocClienteId: obj.centrocClienteId

    });
  }

  public subirarchivos() {

  }


  public verdetallecont(obj: any) {
    
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['company', 'detalle_contacto', tipoinsert], { state: { datos: obj } });
    this.cargando = false;



  }



  public listaContacto() {
    
    let objEnviar: any = {

      centrocClienteId: {
        centrocClienteId: this.centrocClienteId
      },
      tipoPersonaId: {
        tipoPersonaId: this.tipoPersonaId
      }
    }

    this.companyPrd.getAllCont(objEnviar).subscribe(datos => {
      this.cargando = true;

      this.arreglo = datos.datos;
      this.cargando = false;

    });
  }

  public enviarPeticioncomp() {

    if (this.myFormcomp.invalid) {

      this.submitEnviado = true;
      this.iconType = "error";
      this.strTitulo = "Faltan campos obligatorios";
      this.strsubtitulo = "Verifica que campos hacen falta";
      this.modal = true;

      return;
    }


    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar la compañía?" : "¿Deseas actualizar la compañía?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
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
          fechaAlta: this.fechaActual,
          imagen:this.imagen
        };

        

        if (this.insertar) {
          

          this.companyPrd.save(obj).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.strsubtitulo = 'Registro agregado correctamente'
            this.modal = true;
            this.compania = !datos.resultado;
            this.contacto = true;
            if (datos.resultado == true) {
              let obj = this.objcont;
              this.verdetallecont(obj);
            }

          });

        } else {

          

          this.companyPrd.modificar(obj).subscribe(datos => {
            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.strsubtitulo = 'Registro modificado correctamente!'
            this.modal = true;
            this.listcontacto = true;
            this.compania = false;

          });
        }

      }
    } else {

      this.modal = false;
    }
  }

  get f() { return this.myFormcomp.controls; }


  public recibirImagen(imagen:any){

    
    this.imagen = imagen;

  }


}
