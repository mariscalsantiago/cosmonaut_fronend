import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Noticia } from 'src/app/core/modelos/noticia';
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
  encapsulation: ViewEncapsulation.None
})
export class NoticiasDetalleComponent implements OnInit {

  private static TAMANIO_RECOMENDADO_BANNER = "1800 x 350";
  private static TAMANIO_RECOMENDADO_CURSO = "340 x 200";

  @ViewChild("titulo") titulo: any;

  public formulario!: FormGroup;
  get f() { return this.formulario.controls; }

  public insertar: boolean = false;
  private esClienteEmpresa: boolean = false;
  private usuario: usuarioClass | undefined = undefined;
  noticia: string = ``;
  minimo = new Date();
  requiereImagen = false;
  tieneImagen = false;
  tamanioRecomendado = NoticiasDetalleComponent.TAMANIO_RECOMENDADO_BANNER;

  public cargando: boolean = true;
  public submitEnviado: boolean = false;

  public imagenCargada: any = undefined;
  public imagen: any = undefined;
  public thumbnail: any = undefined;

  private editando: Noticia | undefined = undefined;
  public empresas: any = [];

  public modulo: string = "";
  public subModulo: string = "";

  public cargandoImg: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private navigator: Router,
    public configuracion: ConfiguracionesService,
    private servicioModales: ModalService,
    private serviceNoticias: NoticiasService,
    private serviceCompania: SharedCompaniaService,
    private serviceEmpresa: EmpresasService,
    private serviceUsuario: UsuarioSistemaService) {

  }

  ngOnInit(): void {

    this.modulo = this.configuracion.breadcrum.nombreModulo.toUpperCase();
    this.subModulo = this.configuracion.breadcrum.nombreSubmodulo.toUpperCase();

    this.servicioModales.showMessageDialog(this.servicioModales.loading);

    this.esClienteEmpresa = this.navigator.url.includes("/detalle_noticia/cliente");
    this.usuario = this.serviceUsuario.getUsuario();

    this.formulario = this.crearFormulario();

    this.editando = !!history.state && !!history.state.noticia ? history.state.noticia as Noticia : undefined;
    if (!!this.editando) {

      this.cargandoImg = true;
      this.serviceNoticias.getNoticia(this.editando.noticiaId).subscribe(
        (response) => {

          //console.log("getNoticia", response);
          if (response.resultado || !!response.datos) {
            this.editando = response.datos as Noticia;
          }

          this.imagenCargada = this.editando?.thumbnail;
          this.imagen = this.editando?.imagen;

          this.cargandoImg = false;

          this.llenarFormulario();
          this.validarImagen();

          this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
        }
      );
    } else {

      this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
    }

    this.validarImagen();

    this.cargando = true;
    if (this.puedeSeleccionarEmpresa()) {

      this.serviceEmpresa.getAllEmp(this.usuario?.centrocClienteId).subscribe(datos => {

        this.empresas = datos.datos;
        this.cargando = false;
      });
    } else {

      this.serviceEmpresa.getEmpresaById(this.usuario?.centrocClienteId).subscribe(datos => {

        this.empresas = [datos.datos];
        this.cargando = false;
      });
    }
  }

  ngAfterViewInit(): void {
    this.titulo.nativeElement.focus();
  }

  puedeSeleccionarEmpresa() {
    return this.esClienteEmpresa && this.usuario?.esCliente && this.usuario?.centrocClienteIdPadre == 0;
  }

  public crearFormulario() {

    let datePipe = new DatePipe("en-MX");
    return this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      subtitulo: ['', [Validators.maxLength(50)]],
      fechaAlta: [{ value: datePipe.transform(new Date(), 'dd/MM/yyyy'), disabled: true }, [Validators.required]],
      fechaInicio: ['', [Validators.required, this.validarFecha]],
      fechaFin: ['', [Validators.required, this.validarFecha, this.validarFechaMin]],
      categoria: [{ value: 1, disabled: this.usuario?.rolId == 3 }, Validators.required],
      empresa: [this.puedeSeleccionarEmpresa() ? '' : this.usuario?.centrocClienteId, Validators.required],
      contenido: ['']
    });
  }

  private validarFecha(field: any) {

    if (field && field.value && !moment(field.value, 'YYYY-MM-DD', true).isValid()) {
      return { 'datevaidator': true };
    }
    return null;
  }

  private validarFechaMin(field: any) {

    if (!!field && !!field.parent && field.parent.controls["fechaInicio"].valid && field.parent.controls["fechaFin"].valid) {

      if (moment(field.parent.controls["fechaInicio"].value, 'YYYY-MM-DD', true).diff(moment(field.parent.controls["fechaFin"].value, 'YYYY-MM-DD', true)) >= 0) {
        return { 'datevaidatormin': true };
      }
    }
    return null;
  }

  public parseErrors(errors: any) {

    if (!!errors.required) {
      return "Campo necesario";
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

    let datePipe = new DatePipe("en-MX");

    this.formulario.controls.titulo.setValue(!!this.editando ? this.editando.titulo : '');
    this.formulario.controls.titulo.updateValueAndValidity();

    this.formulario.controls.subtitulo.setValue(!!this.editando ? this.editando.subtitulo : '');
    this.formulario.controls.subtitulo.updateValueAndValidity();

    this.formulario.controls.fechaAlta.setValue(!!this.editando ? datePipe.transform(this.editando.fechaAlta, 'yyyy-MM-dd') : datePipe.transform(new Date(), 'dd/MM/yyyy'));
    this.formulario.controls.fechaAlta.updateValueAndValidity();

    this.formulario.controls.fechaInicio.setValue(!!this.editando ? datePipe.transform(this.editando.fechaInicio, 'yyyy-MM-dd') : '');
    this.formulario.controls.fechaInicio.updateValueAndValidity();

    this.formulario.controls.fechaFin.setValue(!!this.editando ? datePipe.transform(this.editando.fechaFin, 'yyyy-MM-dd') : '');
    this.formulario.controls.fechaFin.updateValueAndValidity();

    this.formulario.controls.categoria.setValue(!!this.editando ? this.editando.categoriaId.categoriaNoticiaId : 1);
    this.formulario.controls.categoria.updateValueAndValidity();

    this.formulario.controls.empresa.setValue(!!this.editando ? this.editando.centrocClienteId : (this.puedeSeleccionarEmpresa() ? '' : this.usuario?.centrocClienteId));
    this.formulario.controls.empresa.updateValueAndValidity();

    this.formulario.controls.contenido.setValue(!!this.editando ? this.editando.contenido : '');
    this.formulario.controls.contenido.updateValueAndValidity();
  }

  validarImagen() {

    let categoria = this.formulario.controls.categoria.value;
    this.requiereImagen = (categoria == 1 || categoria == 5 || categoria == 6);
    this.tieneImagen = !!this.imagen;

    this.tamanioRecomendado = categoria == 1 ? NoticiasDetalleComponent.TAMANIO_RECOMENDADO_BANNER : (categoria == 5 || categoria == 6 ? NoticiasDetalleComponent.TAMANIO_RECOMENDADO_CURSO : 'NA')
  }

  public actualizarPreview() {
    this.noticia = this.formulario.controls.contenido.value;
  }

  public enviarPeticion() {

    this.submitEnviado = true;

    if (!this.formulario.valid || (this.requiereImagen && !this.tieneImagen)) {
      return;
    }

    let mensajeExtra = this.esClienteEmpresa ? '' : 'La noticia será visible para todos los empleados de la empresa';
    let titulo: string = !!this.editando ? '¿Deseas actualizar los datos de la noticia?' : '¿Deseas guardar la noticia?';

    this.servicioModales.showMessageDialog(this.servicioModales.question, titulo, mensajeExtra).then(valor => {
      if (valor) { this.guardar(); }
    });
  }

  private guardar() {

    this.servicioModales.showMessageDialog(this.servicioModales.loading);

    let datePipe = new DatePipe("en-MX");
    if (!!this.editando) {

      const json = {
        noticiaId: this.editando.noticiaId,
        usuarioId: this.usuario?.usuarioId,
        centrocClienteId: Number(this.formulario.controls.empresa.value),
        titulo: this.formulario.controls.titulo.value,
        subtitulo: this.formulario.controls.subtitulo.value,
        categoriaId: { categoriaNoticiaId: Number(this.formulario.controls.categoria.value) },
        contenido: this.formulario.controls.contenido.value,
        imagen: this.imagen,
        fechaInicio: this.formulario.controls.fechaInicio.value,
        fechaFin: this.formulario.controls.fechaFin.value,
      }

      //console.log('editNoticia', json);
      this.serviceNoticias.editNoticia(json).subscribe(
        (response) => {
          if (!!response.resultado) {
            this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
            this.servicioModales.showMessageDialog(response.resultado, response.mensaje).then(() => {
              this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
              this.regresar();
            });
          }
        }
      );
    } else {

      const json = {
        usuarioId: this.usuario?.usuarioId,
        centrocClienteId: Number(this.formulario.controls.empresa.value),
        titulo: this.formulario.controls.titulo.value,
        subtitulo: this.formulario.controls.subtitulo.value,
        categoriaId: { categoriaNoticiaId: Number(this.formulario.controls.categoria.value) },
        contenido: this.formulario.controls.contenido.value,
        imagen: this.imagen,
        fechaInicio: this.formulario.controls.fechaInicio.value,
        fechaFin: this.formulario.controls.fechaFin.value,
      }

      //console.log('createNoticia', json);
      this.serviceNoticias.createNoticia(json).subscribe(
        (response) => {
          if (!!response.resultado) {
            this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
            this.servicioModales.showMessageDialog(response.resultado, response.mensaje).then(() => {
              this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
              this.regresar();
            });
          }
        }
      );
    }
  }

  public regresar() {
    this.navigator.navigateByUrl(`/noticias${this.esClienteEmpresa ? '/cliente' : ''}`);
  }

  public async recibirImagen(imagen: any) {
    this.imagen = imagen;
    this.validarImagen();
  }
}
