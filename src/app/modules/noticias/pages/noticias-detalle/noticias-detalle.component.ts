import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Noticia } from 'src/app/core/modelos/noticia';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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

  @ViewChild("titulo") titulo: any;

  public formulario!: FormGroup;
  get f() { return this.formulario.controls; }

  public insertar: boolean = false;
  private esClienteEmpresa: boolean = false;
  private usuario: usuarioClass | undefined = undefined;
  noticia: string = ``;

  public cargando: boolean = true;
  public submitEnviado: boolean = false;

  public imagenCargada: any = undefined;
  public imagen: any = undefined;
  public thumbnail: any = undefined;

  private editando: Noticia | undefined = undefined;
  public empresas: any = [];

  public cargandoImg: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private navigator: Router,
    public configuracion: ConfiguracionesService,
    private serviceNoticias: NoticiasService,
    private serviceCompania: SharedCompaniaService,
    private serviceEmpresa: EmpresasService,
    private serviceUsuario: UsuarioSistemaService) {

  }

  ngOnInit(): void {

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

          if (!!this.editando?.thumbnail) this.imagenCargada = this.editando.thumbnail;
          this.cargandoImg = false;

          this.llenarFormulario();
        }
      );
    }

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
      titulo: ['', [Validators.required]],
      subtitulo: [''],
      fechaAlta: [{ value: datePipe.transform(new Date(), 'dd/MM/yyyy'), disabled: true }, [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      categoria: [{ value: 1, disabled: this.usuario?.rolId == 3 }, Validators.required],
      empresa: [this.puedeSeleccionarEmpresa() ? '' : this.usuario?.centrocClienteId, Validators.required],
      contenido: ['']
    });
  }

  private llenarFormulario() {

    let datePipe = new DatePipe("en-MX");

    this.formulario.controls.titulo.setValue(!!this.editando ? this.editando.titulo : '');
    this.formulario.controls.subtitulo.setValue(!!this.editando ? this.editando.subtitulo : '');
    this.formulario.controls.fechaAlta.setValue(!!this.editando ? datePipe.transform(new Date(this.editando.fechaAlta), 'yyyy-MM-dd') : datePipe.transform(new Date(), 'dd/MM/yyyy'));
    this.formulario.controls.fechaInicio.setValue(!!this.editando ? datePipe.transform(new Date(this.editando.fechaInicio), 'yyyy-MM-dd') : '');
    this.formulario.controls.fechaFin.setValue(!!this.editando ? datePipe.transform(new Date(this.editando.fechaFin), 'yyyy-MM-dd') : '');
    this.formulario.controls.categoria.setValue(!!this.editando ? this.editando.categoriaId.categoriaNoticiaId : 1);
    this.formulario.controls.empresa.setValue(!!this.editando ? this.editando.centrocClienteId : (this.puedeSeleccionarEmpresa() ? '' : this.usuario?.centrocClienteId));
    this.formulario.controls.contenido.setValue(!!this.editando ? this.editando.contenido : '');
  }

  public actualizarPreview() {
    this.noticia = this.formulario.controls.contenido.value;
  }

  public enviarPeticion() {

    this.submitEnviado = true;

    if (!!this.editando) {

      const json = {
        noticiaId: this.editando.noticiaId,
        usuarioId: this.usuario?.usuarioId,
        centrocClienteId: Number(this.formulario.controls.empresa.value),
        titulo: this.formulario.controls.titulo.value,
        subtitulo: this.formulario.controls.subtitulo.value,
        categoriaId: { categoriaNoticiaId: Number(this.formulario.controls.categoria.value) },
        contenido: this.formulario.controls.contenido.value,
        imagen: !!this.imagen ? this.imagen : this.editando.imagen,
        fechaInicio: new Date(this.formulario.controls.fechaInicio.value).getTime(),
        fechaFin: new Date(this.formulario.controls.fechaFin.value).getTime()
      }

      //console.log('editNoticia', json);
      this.serviceNoticias.editNoticia(json).subscribe(
        (response) => {
          if (!!response.resultado) {
            this.cancelar();
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
        fechaInicio: new Date(this.formulario.controls.fechaInicio.value).getTime(),
        fechaFin: new Date(this.formulario.controls.fechaFin.value).getTime()
      }

      //console.log('createNoticia', json);
      this.serviceNoticias.createNoticia(json).subscribe(
        (response) => {
          if (!!response.resultado) {
            this.cancelar();
          }
        }
      );
    }
  }

  public cancelar() {
    this.navigator.navigateByUrl(`/noticias${this.esClienteEmpresa ? '/cliente' : ''}`);
  }

  public async recibirImagen(imagen: any) {
    this.imagen = imagen;
  }
}
