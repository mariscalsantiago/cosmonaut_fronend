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

    this.usuario = this.serviceUsuario.getUsuario();

    this.esClienteEmpresa = this.navigator.url.includes("/detalle_noticia/cliente");

    this.cargandoImg = true;

    this.editando = !!history.state && !!history.state.noticia ? history.state.noticia as Noticia : undefined;

    this.cargandoImg = false;

    this.formulario = this.crearFormulario();

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

    this.actualizarPreview();
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
      titulo: [!!this.editando ? this.editando.titulo : '', [Validators.required]],
      subtitulo: [!!this.editando ? this.editando.subtitulo : ''],
      fechaAlta: [{ value: ((this.insertar) ? datePipe.transform(new Date(), 'dd/MM/yyyy') : datePipe.transform(new Date(), 'dd/MM/yyyy')), disabled: true }, [Validators.required]],
      fechaInicio: [!!this.editando ? new Date(this.editando.fechaInicio) : '', [Validators.required]],
      fechaFin: [!!this.editando ? datePipe.transform(new Date(this.editando.fechaFin), 'dd/MM/yyyy') : '', [Validators.required]],
      categoria: [{ value: 1, disabled: this.usuario?.rolId == 3 }, Validators.required],
      empresa: [!!this.editando ? this.editando.centrocClienteId : (this.puedeSeleccionarEmpresa() ? '' : this.usuario?.centrocClienteId), Validators.required],
      contenido: [!!this.editando ? this.editando.contenido : '']
    });
  }

  public actualizarPreview() {
    this.noticia = this.formulario.controls.contenido.value;
  }

  public enviarPeticion() {

    this.submitEnviado = true;

    if (!!this.editando) {

      const json = {
        noticiaId: this.editando?.noticiaId,
        usuarioId: this.usuario?.usuarioId,
        centrocClienteId: this.usuario?.centrocClienteId,
        titulo: this.formulario.controls.titulo.value,
        subtitulo: this.formulario.controls.subtitulo.value,
        categoriaId: { categoriaNoticiaId: this.formulario.controls.categoria.value },
        contenido: this.formulario.controls.contenido.value,
        imagen: this.imagen,
        fechaInicio: new Date(this.formulario.controls.fechaInicio.value).getTime(),
        fechaFin: new Date(this.formulario.controls.fechaFin.value).getTime()
      }

      console.log('editNoticia', json);
      this.serviceNoticias.editNoticia(json, this.editando?.noticiaId).subscribe(
        (response) => {
          if (!!response.resultado) {
            this.cancelar();
          }
        }
      );
    } else {

      const json = {
        usuarioId: this.usuario?.usuarioId,
        centrocClienteId: this.usuario?.centrocClienteId,
        titulo: this.formulario.controls.titulo.value,
        subtitulo: this.formulario.controls.subtitulo.value,
        categoriaId: { categoriaNoticiaId: this.formulario.controls.categoria.value },
        contenido: this.formulario.controls.contenido.value,
        imagen: this.imagen,
        fechaInicio: new Date(this.formulario.controls.fechaInicio.value).getTime(),
        fechaFin: new Date(this.formulario.controls.fechaFin.value).getTime()
      }

      console.log('createNoticia', json);
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
