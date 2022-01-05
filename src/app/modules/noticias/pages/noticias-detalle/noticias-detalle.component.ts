import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Noticia } from 'src/app/core/modelos/noticia';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { NoticiasService } from '../../services/noticias.service';
import { usuarioClass } from './../../../../shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-noticias-detalle',
  templateUrl: './noticias-detalle.component.html',
  styleUrls: ['./noticias-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NoticiasDetalleComponent implements OnInit {
  private static TAMANIO_RECOMENDADO_BANNER = '1800 x 350';
  private static TAMANIO_RECOMENDADO_CURSO = '340 x 200';

  @ViewChild('titulo') titulo: any;

  public formulario!: FormGroup;
  get f() {
    return this.formulario.controls;
  }

  public insertar: boolean = false;
  public esClienteEmpresa: boolean = false;
  private usuario: usuarioClass | undefined = undefined;
  noticia: string = ``;
  minimo = new Date();
  requiereImagen = false;
  requiereURL = false;
  tieneImagen = false;
  tamanioRecomendado = NoticiasDetalleComponent.TAMANIO_RECOMENDADO_BANNER;

  public cargando: boolean = true;
  public submitEnviado: boolean = false;

  public imagenCargada: any = undefined;
  public imagen: any = undefined;
  public thumbnail: any = undefined;

  private editando: Noticia | undefined = undefined;
  public empresas: any = [];

  public modulo: string = '';
  public subModulo: string = '';

  public cargandoImg: boolean = false;
  public companiasenviar: any = [];
  public empleadoEnviar: any = [];
  public arreglogruposnomina: any = [];
  public arregloEmpleados: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private navigator: Router,
    public configuracion: ConfiguracionesService,
    private servicioModales: ModalService,
    private serviceNoticias: NoticiasService,
    private serviceCompania: SharedCompaniaService,
    private serviceEmpresa: EmpresasService,
    private serviceUsuario: UsuarioSistemaService,
    private grupoNominaPrd: GruponominasService,
    private empleadosPrd: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.modulo = this.configuracion.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo =
      this.configuracion.breadcrum.nombreSubmodulo?.toUpperCase();

    this.servicioModales.showMessageDialog(this.servicioModales.loading);

    this.esClienteEmpresa = this.navigator.url.includes(
      '/detalle_noticia/cliente'
    );
    this.usuario = this.serviceUsuario.getUsuario();

    this.formulario = this.crearFormulario();
    this.suscripcion();

    this.editando =
      !!history.state && !!history.state.noticia
        ? (history.state.noticia as Noticia)
        : undefined;
    if (!!this.editando) {
      this.cargandoImg = true;
      this.serviceNoticias
        .getNoticia(this.editando.noticiaId)
        .subscribe((response) => {
          //console.log("getNoticia", response);
          if (response.resultado || !!response.datos) {
            this.editando = response.datos as Noticia;
          }

          this.imagenCargada = this.editando?.thumbnail;
          this.imagen = this.editando?.imagen;

          this.cargandoImg = false;

          this.llenarFormulario();
          this.validarImagen();
          this.companiasenviar = this.editando?.centrocClienteId || [];
          let personasEnviar = this.editando?.personasId || [];
          
          for(let item of personasEnviar){
            item['nombre'] =
            item.nombre +
            ' ' +
            item.apellidoPaterno +
            ' ' +
            (item.apellidoMaterno || '');
          }

          this.empleadoEnviar = personasEnviar;

          this.servicioModales.showMessageDialog(
            this.servicioModales.loadingfinish
          );
        });
    } else {
      this.servicioModales.showMessageDialog(
        this.servicioModales.loadingfinish
      );
    }



    this.validarImagen();

    this.cargando = true;
    if (this.esCliente()) {
      this.serviceEmpresa
        .getAllEmp(this.usuario?.centrocClienteId)
        .subscribe((datos) => {
          this.empresas = datos.datos;
          this.cargando = false;
        });
    } else if (this.esEmpresa()) {
      this.serviceEmpresa
        .getEmpresaById(this.usuario?.centrocClienteId)
        .subscribe((datos) => {
          this.empresas = [datos.datos];
          this.cargando = false;
        });
      this.grupoNominaPrd
        .getAll(this.serviceUsuario.getIdEmpresa())
        .subscribe((datos) => (this.arreglogruposnomina = datos.datos));

      this.empleadosPrd
        .getEmpleadosCompania(this.serviceUsuario.getIdEmpresa())
        .subscribe((datos) => {
          console.log('Este son los empleados', datos);
          this.arregloEmpleados = datos.datos;
          for (let item of this.arregloEmpleados) {
            item['nombre'] =
              item.personaId?.nombre +
              ' ' +
              item.personaId?.apellidoPaterno +
              ' ' +
              (item.personaId?.apellidoMaterno || '');
          }
        });
    } else {
      this.serviceCompania.getAllCompany().subscribe((datos) => {
        this.empresas = datos.datos || [];
      });
    }
  }

  private suscripcion() {
    this.formulario.controls.seleccionarEmpresa.valueChanges.subscribe(
      (valor) => {
        this.companiasenviar = [];
      }
    );
    this.formulario.controls.seleccionarEmpleado.valueChanges.subscribe(
      (valor) => {
        this.empleadoEnviar = [];
      }
    );
  }

  ngAfterViewInit(): void {
    this.titulo.nativeElement.focus();
  }

  esAdministradorCosmonaut() {
    return (
      !this.esClienteEmpresa && this.serviceUsuario.getVersionSistema() == 1
    );
  }
  esCliente() {
    return (
      this.esClienteEmpresa &&
      this.serviceUsuario.getVersionSistema() !== 1 &&
      this.usuario?.esCliente
    );
  }
  esEmpresa() {
    return (
      this.esClienteEmpresa &&
      this.serviceUsuario.getVersionSistema() !== 1 &&
      !this.usuario?.esCliente
    );
  }

  public crearFormulario() {
    let datePipe = new DatePipe('en-MX');
    return this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      subtitulo: ['', [Validators.maxLength(50)]],
      fechaAlta: [
        {
          value: datePipe.transform(new Date(), 'dd-MMM-y'?.replace('.', '')),
          disabled: true,
        },
        [Validators.required],
      ],
      fechaInicio: ['', [Validators.required, this.validarFecha]],
      fechaFin: [
        '',
        [Validators.required, this.validarFecha, this.validarFechaMin],
      ],
      categoria: [{ value: 1, disabled: this.esAdministradorCosmonaut() }, Validators.required],
      empresa: [],
      contenido: [''],
      enlace: [''],
      seleccionarEmpresa: ['1'],
      seleccionarEmpleado: ['1'],
      grupoNomina:[]
    });
  }

  private validarFecha(field: any) {
    if (
      field &&
      field.value &&
      !moment(field.value, 'YYYY-MM-DD', true).isValid()
    ) {
      return { datevaidator: true };
    }
    return null;
  }

  private validarFechaMin(field: any) {
    if (
      !!field &&
      !!field.parent &&
      field.parent.controls['fechaInicio'].valid &&
      field.parent.controls['fechaFin'].valid
    ) {
      if (
        moment(
          field.parent.controls['fechaInicio'].value,
          'YYYY-MM-DD',
          true
        ).diff(
          moment(field.parent.controls['fechaFin'].value, 'YYYY-MM-DD', true)
        ) >= 0
      ) {
        return { datevaidatormin: true };
      }
    }
    return null;
  }

  public parseErrors(errors: any) {
    if (!!errors.required) {
      return 'Campo requerido';
    }
    if (!!errors.maxlength) {
      return `Máximo ${errors.maxlength.requiredLength} caracteres`;
    }
    if (!!errors.datevaidator) {
      return `Fecha inválida (formato inválido)`;
    }
    if (!!errors.datevaidatormin) {
      return `Fecha inválida (menor a fecha de inicio)`;
    }

    return '';
  }

  private llenarFormulario() {
    let datePipe = new DatePipe('en-MX');

    this.formulario.controls.titulo.setValue(
      !!this.editando ? this.editando.titulo : ''
    );
    this.formulario.controls.titulo.updateValueAndValidity();

    this.formulario.controls.subtitulo.setValue(
      !!this.editando ? this.editando.subtitulo : ''
    );
    this.formulario.controls.subtitulo.updateValueAndValidity();

    this.formulario.controls.fechaAlta.setValue(
      !!this.editando
        ? this.editando.fechaAlta
        : datePipe.transform(new Date(), 'dd-MMM-y')?.replace('.', '')
    );
    this.formulario.controls.fechaAlta.updateValueAndValidity();

    this.formulario.controls.fechaInicio.setValue(
      !!this.editando ? this.editando.fechaInicio : ''
    );
    this.formulario.controls.fechaInicio.updateValueAndValidity();

    this.formulario.controls.fechaFin.setValue(
      !!this.editando ? this.editando.fechaFin : ''
    );
    this.formulario.controls.fechaFin.updateValueAndValidity();

    this.formulario.controls.categoria.setValue(
      !!this.editando ? this.editando.categoriaId.categoriaNoticiaId : 1
    );
    this.formulario.controls.categoria.updateValueAndValidity();

    this.formulario.controls.empresa.setValue(
      !!this.editando
        ? this.editando.clienteId
        : !this.esAdministradorCosmonaut()
        ? ''
        : this.usuario?.centrocClienteId
    );
    this.formulario.controls.empresa.updateValueAndValidity();

    this.formulario.controls.contenido.setValue(
      !!this.editando ? this.editando.contenido : ''
    );
    this.formulario.controls.contenido.updateValueAndValidity();
    this.formulario.controls.seleccionarEmpresa.setValue(this.editando?.todos?'1':'2');
    this.formulario.controls.seleccionarEmpleado.setValue("1");
    if(this.esEmpresa()){
       if(Boolean(this.editando?.grupoNominaId)){
          this.formulario.controls.seleccionarEmpleado.setValue("2");
      }else if(!this.editando?.todosEmpleados){
        this.formulario.controls.seleccionarEmpleado.setValue("3");
      }
    }

    this.formulario.controls.enlace.setValue(this.editando?.enlace);
    this.formulario.controls.grupoNomina.setValue(this.editando?.grupoNominaId);
  }

  validarImagen() {
    let categoria = this.formulario.controls.categoria.value;
    this.requiereImagen = categoria == 1 || categoria == 5 || categoria == 6;
    this.requiereURL = categoria == 5 || categoria == 6;
    this.tieneImagen = !!this.imagen;

    this.tamanioRecomendado =
      categoria == 1
        ? NoticiasDetalleComponent.TAMANIO_RECOMENDADO_BANNER
        : categoria == 5 || categoria == 6
        ? NoticiasDetalleComponent.TAMANIO_RECOMENDADO_CURSO
        : 'NA';
  }

  public actualizarPreview() {
    this.noticia = this.formulario.controls.contenido.value;
  }

  public enviarPeticion() {
    this.submitEnviado = true;
    if (!this.formulario.valid || (this.requiereImagen && !this.tieneImagen)) {
      return;
    }

    let mensajeExtra = this.esClienteEmpresa
      ? ''
      : 'La noticia será visible para todos los empleados de la empresa';
    let titulo: string = !!this.editando
      ? '¿Deseas actualizar los datos de la noticia?'
      : '¿Deseas guardar la noticia?';

    this.servicioModales
      .showMessageDialog(this.servicioModales.question, titulo, mensajeExtra)
      .then((valor) => {
        if (valor) {
          this.guardar();
        }
      });
  }

  private guardar() {
    
    this.servicioModales.showMessageDialog(this.servicioModales.loading);

    let companysend = [];
    let empleadosSend = [];
    if (this.esCliente() || this.esAdministradorCosmonaut()) {
      for (let item of this.companiasenviar) {
        companysend.push(item.centrocClienteId);
      }
    } else {
      companysend.push(this.serviceUsuario.getIdEmpresa());

      
      for(let item of this.empleadoEnviar){
        empleadosSend.push(item.personaId.personaId || item.personaId);
      }
    }

    if (!!this.editando) {
      const json = {
        noticiaId: this.editando.noticiaId,
        usuarioId: this.usuario?.usuarioId,
        centrocClienteId: this.serviceUsuario.getIdEmpresa(),
        titulo: this.formulario.controls.titulo.value,
        subtitulo: this.formulario.controls.subtitulo.value,
        categoriaId: {
          categoriaNoticiaId: Number(this.formulario.controls.categoria.value),
        },
        contenido: this.formulario.controls.contenido.value,
        imagen: this.imagen,
        fechaInicio: this.formulario.controls.fechaInicio.value,
        fechaFin: this.formulario.controls.fechaFin.value,
        clientesId: companysend,
        enlace: this.formulario.controls.enlace.value,
        todos: this.formulario.controls.seleccionarEmpresa.value == '1',
        todosEmpleados:this.formulario.controls.seleccionarEmpleado.value == '1',
        personasId:empleadosSend,
        grupoNominaId:this.formulario.controls.seleccionarEmpleado.value !== '2' && this.formulario.controls.seleccionarEmpleado.value !== '1'?undefined:this.formulario.controls.grupoNomina.value
      };

      console.log(JSON.stringify(json));
      
      this.serviceNoticias.editNoticia(json).subscribe((response) => {
        if (!!response.resultado) {
          this.servicioModales.showMessageDialog(
            this.servicioModales.loadingfinish
          );
          this.servicioModales
            .showMessageDialog(response.resultado, response.mensaje)
            .then(() => {
              this.servicioModales.showMessageDialog(
                this.servicioModales.loadingfinish
              );
              this.regresar();
            });
        }
      });
    } else {
      const json = {
        usuarioId: this.usuario?.usuarioId,
        centrocClienteId: this.serviceUsuario.getIdEmpresa(),
        titulo: this.formulario.controls.titulo.value,
        subtitulo: this.formulario.controls.subtitulo.value,
        categoriaId: {
          categoriaNoticiaId: Number(this.formulario.controls.categoria.value),
        },
        contenido: this.formulario.controls.contenido.value,
        imagen: this.imagen,
        fechaInicio: this.formulario.controls.fechaInicio.value,
        fechaFin: this.formulario.controls.fechaFin.value,
        clientesId: companysend,
        enlace: this.formulario.controls.enlace.value,
        todos: this.formulario.controls.seleccionarEmpresa.value == '1',
        todosEmpleados:this.formulario.controls.seleccionarEmpleado.value == '1',
        personasId:empleadosSend,
        grupoNominaId:this.formulario.controls.seleccionarEmpleado.value !== '2' && this.formulario.controls.seleccionarEmpleado.value !== '1'?undefined:this.formulario.controls.grupoNomina.value
      };

      console.log(JSON.stringify(json));
      
      this.serviceNoticias.createNoticia(json).subscribe((response) => {
        if (!!response.resultado) {
          this.servicioModales.showMessageDialog(
            this.servicioModales.loadingfinish
          );
          this.servicioModales
            .showMessageDialog(response.resultado, response.mensaje)
            .then(() => {
              this.servicioModales.showMessageDialog(
                this.servicioModales.loadingfinish
              );
              this.regresar();
            });
        }
      });
    }
  }

  public regresar() {
    this.navigator.navigateByUrl(
      `/noticias${this.esClienteEmpresa ? '/cliente' : ''}`
    );
  }

  public async recibirImagen(imagen: any) {
    this.imagen = imagen;
    this.validarImagen();
  }

  public recibirEtiquetas(evento: any) {
    console.log('Recibir etiquetas', evento);
    this.formulario.controls.empresa.setValue(evento[0].centrocClienteId);
    this.companiasenviar = evento;
  }
  public recibirEmpleados(evento: any) {
    console.log('Recibir etiquetas empleados', evento);
    this.empleadoEnviar = evento;
  }
}
