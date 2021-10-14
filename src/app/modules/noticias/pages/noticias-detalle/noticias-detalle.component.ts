import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';


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

  noticia: string = ``;

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


  public cargandoImg: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private navigator: Router,
    public cfgService: ConfiguracionesService) { }

  ngOnInit(): void {

    this.cargandoImg = true;

    this.router.params.subscribe(datos => {

      this.cargandoImg = false;
    });

    this.formulario = this.createFormcomp();
  }

  ngAfterViewInit(): void {
    this.titulo.nativeElement.focus();
  }

  public createFormcomp() {

    let datePipe = new DatePipe("en-MX");
    return this.formBuilder.group({

      titulo: ['', [Validators.required]],
      subtitulo: [''],
      fechaAlta: [{ value: ((this.insertar) ? datePipe.transform(new Date(), 'dd/MM/yyyy') : datePipe.transform(new Date(), 'dd/MM/yyyy')), disabled: true }, [Validators.required]],
      fechaInicio: ['01/01/2021', [Validators.required]],
      fechaFin: ['11/03/2021', [Validators.required]],
      categoria: ['', Validators.required],
      contenido: [``]
    });
  }

  public subirarchivos() {

  }

  public actualizarPreview() {
    this.noticia = this.formulario.controls.contenido.value;
  }

  public enviarPeticioncomp() {
    this.submitEnviado = true;
  }

  public cancelarcomp() {
    this.navigator.navigate(['/noticias']);
  }

  public recibirImagen(imagen: any) {
    this.imagen = imagen;
  }
}
