import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { CompanyService } from 'src/app/modules/company/services/company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';


@Component({
  selector: 'app-variabilidad',
  templateUrl: './variabilidad.component.html',
  styleUrls: ['./variabilidad.component.scss']
})
export class VariabilidadComponent implements OnInit {

  public myForm!: FormGroup;
  public submitEnviado:boolean = false;
  public empresa: any;
  public idEmpresa: number = 0;
  public arreglo: any = [];
  public arregloListaEmpleadosPromedio: any = [];
  public cargando: boolean = false;
  public cargandoIcon: boolean = false;
  public objFiltro: any = [];
  public mensaje : string = "";
  public fromPromediar : boolean = false;
  public listaVariabilidad : boolean = true;
  public razonSocial: string = "";
  public bimestreLeyenda : any = "";
  public fechaActual: string = "";
  public listaPromedio : boolean = false;
  public listaVariable : boolean = true;
  public variabilidad : number = 0;
  public bimestreCalcular: number = 0;
  public diasCalcular : number = 0;
  public apellidoPat:string = "";
  public fecha: Date = new Date;
  public anioFiscal: number = 0;
  public idUsuario: any = [];
  public varibilidadID: number = 0;
  public varibilidadRecalculoID: number = 0;
  public calcularPromedio: boolean = true;
  public recalcularPromedio : boolean = false;
  public objRecalculo : any = [];
  public esREcalcular : boolean = false;
  public sinPromedios : boolean = false;
  public conPromedios : boolean = true;
  //public anioinical: number = 0;


  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public arreglotablaListaEmpleadosPromedio: any = {
    columnas: [],
    filas: []
  }

  public arreglotablaDesglose:any = {
      columnas:[],
      filas:[]
  };

      /*
    Directivas de filtros
  */


    public razonSocialEmpresa: string = "0";
    public anioFiltro: string = "";
    public bimestre: string = "";

    public modulo: string = "";
    public subModulo: string = "";


  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService, private reportesPrd: ReportesService,private EmpleadosService:EmpleadosService,
    private companyProd: CompanyService, private formBuild: FormBuilder, private router: Router, public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {



    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();
    this.idUsuario = this.usauriosSistemaPrd.getUsuario();
    this.idUsuario = this.idUsuario.usuarioId;

    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    this.anioFiscal = fecha.getFullYear();

    this.fechaActual = `01/03/${this.anioFiscal}`;

    this.cargando = true;

    this.EmpleadosService.getEmpleadosCompania(this.idEmpresa).subscribe(datos => {
      if(datos.datos[0] !== undefined){
      let obj = datos.datos[0];
      this.razonSocial = obj.centrocClienteId?.razonSocial;
      }
      this.filtrar();

    });

  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

    public traerTabla(datos:any) {

      const columna: Array<tabla> = [
        new tabla("razonSocial", "Razón Social"),
        new tabla("anioFiscal", "Año"),
        new tabla("bimestre", "Bimestre"),
        new tabla("periodoCalculo", "Periodo de cálculo"),
        new tabla("fecha", "Fecha de aplicación"),
        new tabla("total_empleados", "Empleados"),
        new tabla("diasBimestre", "Días")
      ];

      this.arreglotabla = {
        columnas:[],
        filas:[]
      }

      this.bimestreCalcular = 0;
      //this.anioinical = 0;
      if(this.arreglo !== undefined){

        for(let item of this.arreglo){


          if(item.fechaAplicacion !== undefined ){
          item.fechaAplicacion = (new Date(item.fechaAplicacion).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fecha = datepipe.transform(item.fechaAplicacion , 'dd-MMM-y')?.replace(".","");

          //if(item.anioFiscal >= this.anioinical){
          if(item.bimestre == 1){
            //this.anioinical = item.anioFiscal;
            this.fechaActual = `01/05/${item.anioFiscal}`;
            this.bimestreCalcular = 2;
            this.bimestreLeyenda = "2do Bimestre"
          }
          else if(item.bimestre ==2){
            //this.anioinical = item.anioFiscal;
            this.fechaActual = `01/07/${item.anioFiscal}`;
            this.bimestreCalcular = 3;
            this.bimestreLeyenda = "3er Bimestre";
          }
          else if(item.bimestre == 3){
            //this.anioinical = item.anioFiscal;
            this.fechaActual = `01/09/${item.anioFiscal}`;
            this.bimestreCalcular = 4;
            this.bimestreLeyenda = "4to Bimestre";
          }
          else if(item.bimestre ==4){
            //this.anioinical = item.anioFiscal;
            this.fechaActual = `01/11/${item.anioFiscal}`;
            this.bimestreCalcular = 5;
            this.bimestreLeyenda = "5to Bimestre";
          }
          else if(item.bimestre ==5){
            //this.anioinical = item.anioFiscal;
            let anio = item.anioFiscal + 1;
            this.fechaActual = `01/01/${anio}`;
            this.bimestreCalcular = 6;
            this.bimestreLeyenda = "6to Bimestre";
          }
          else if(item.bimestre ==6){
            //this.anioinical = item.anioFiscal;
            let anio = item.anioFiscal + 1;
            this.anioFiscal = anio;
            this.fechaActual = `01/03/${anio}`;
            this.bimestreCalcular = 1;
            this.bimestreLeyenda = "1er Bimestre";
          }
          //}

          }
        }
      }

      this.arreglotabla.columnas = columna;
      this.arreglotabla.filas = this.arreglo
      this.cargando = false;
    }




    public aplicarPromedio(){

      this.modalPrd.showMessageDialog(this.modalPrd.warning,"Aplicar promedio de variables","Este cálculo afectará a las futuras nóminas del bimestre y permanecerá sin ser editable.").then(valor =>{

          if(valor){


              let objEnviar : any =
              {
                variabilidad: this.variabilidad

              };

              this.modalPrd.showMessageDialog(this.modalPrd.loading);
                this.empresasPrd.aplicarPromedioVariables(objEnviar).subscribe(datos => {

                this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

                this.modalPrd.showMessageDialog(this.modalPrd.variabilidad,"Proceso de promedio de variables completo").then(valor =>{
                  if(valor){
                      if (datos.resultado) {
                          this.desgargarArchivo(undefined);
                          this.variabilidad = 0;
                          this.cancelar();

                      }
                  }else{
                      this.cancelar();
                      this.variabilidad = 0;
                  }
                  });

              });

          }
        });


  }


    public crearTablaListaEmpleadosPromedio(datos:any) {

      this.arregloListaEmpleadosPromedio = datos;

      const columna: Array<tabla> = [
        new tabla("nombreCompleto", "Nombre"),
        new tabla("diasLaboradosBimestre", "Días"),
        new tabla("diferencia", "Promedio",false, false, true),

      ];

      this.arreglotablaListaEmpleadosPromedio = {
        columnas:[],
        filas:[]
      }
      const formatterDec = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
      })
      if(this.arregloListaEmpleadosPromedio !== undefined){
        
        for(let item of this.arregloListaEmpleadosPromedio){
          item.nombreCompleto = item.nombre + " " + item.apellidoPat+" "+(item.apellidoMat == undefined ? "":item.apellidoMat);
          item.diasLaboradosBimestre = item.diasLaboradosBimestre;
          item.diferencia = formatterDec.format(item.diferencia);

        }
      }

      this.arreglotablaListaEmpleadosPromedio.columnas = columna;
      this.arreglotablaListaEmpleadosPromedio.filas = this.arregloListaEmpleadosPromedio
      this.cargando = false;
    }

    public createForm(obj: any) {

   if(this.esREcalcular){
    if(obj !== undefined){
          if(obj.bimestre == 1){
            this.bimestreLeyenda = "1er Bimestre"
          }
          else if(obj.bimestre ==2){
            this.bimestreLeyenda = "2do Bimestre"
          }
          else if(obj.bimestre ==3){
            this.bimestreLeyenda = "3er Bimestre"

          }
          else if(obj.bimestre ==4){
            this.bimestreLeyenda = "4to Bimestre"

          }
          else if(obj.bimestre ==5){
            this.bimestreLeyenda = "5to Bimestre"
          }
          else if(obj.bimestre ==6){
            this.bimestreLeyenda = "6to Bimestre"
          }
    }
     this.fechaActual= obj.fecha;
     this.diasCalcular = obj.diasBimestre;
   }

      return this.formBuild.group({

        razonSocial: [this.razonSocial],
        bimestre: [this.bimestreLeyenda],
        fecha: [this.fechaActual],
        diaspromediar: [this.diasCalcular, Validators.required]


      });

    }

  public filtrar() {

    this.cargando = true;
    this.objFiltro = [];
    let anioFinal = Number(this.anioFiltro);
    if(anioFinal != 0){
      if(anioFinal > 1500){
      this.objFiltro = {
        ...this.objFiltro,
        anio: anioFinal
      };
      }else{
        this.objFiltro = {
          ...this.objFiltro,
          anio: 1501
        };
      }
      }
      if(this.bimestre != ''){
        if(this.bimestre == '0' && this.bimestre > '6'){
          this.bimestre = '';
        }else{
          this.objFiltro = {
            ...this.objFiltro,
            bimestre: this.bimestre
          };
        }
        }
    this.objFiltro = {
      ...this.objFiltro,
      clienteId: this.idEmpresa
    };

    this.empresasPrd.filtrarVariabilidad(this.objFiltro).subscribe(datos => {


      if(datos.datos == undefined){
        this.sinPromedios = true;
        this.conPromedios = false;
        this.arreglo = datos.datos;
        this.traerTabla({ datos: this.arreglo });
        this.cargando = false;
        let obj: any  = [];
        this.myForm = this.createForm(obj);
        this.myForm.controls.bimestre.setValue("1");
        this.calcularDias(1);
        this.suscripciones();
      }else{
      this.sinPromedios = false;
      this.conPromedios = true;
      this.arreglo = datos.datos;
      this.traerTabla({ datos: this.arreglo });
      this.cargando = false;
      let obj: any  = [];
      this.myForm = this.createForm(obj);
      }
      if(!datos.resultado){

        this.modalPrd.showMessageDialog(this.modalPrd.error,datos.mensaje).then(valor =>{});
      }


    });
  }

  public validarfechaAplicacion(bim: any){

    if(this.arreglo === undefined ){
      if(bim == '1'){
          let anio = this.fecha.getFullYear();
          this.myForm.controls.fecha.setValue(`01/03/${anio}`);
      }
      if(bim == '2'){
        let anio = this.fecha.getFullYear();
        this.myForm.controls.fecha.setValue(`01/05/${anio}`);

      }
      if(bim == '3'){
        let anio = this.fecha.getFullYear();
        this.myForm.controls.fecha.setValue(`01/07/${anio}`);
      }
      if(bim == '4'){
        let anio = this.fecha.getFullYear();
        this.myForm.controls.fecha.setValue(`01/09/${anio}`);
      }
      if(this.myForm.controls.bimestre.value == '5'){
        let anio = this.fecha.getFullYear();
        this.myForm.controls.fecha.setValue(`01/11/${anio}`);
      }
      if(bim == '6'){
        let anio = this.fecha.getFullYear();
        anio = anio + 1;
        this.myForm.controls.fecha.setValue(`01/01/${anio}`);
      }
    }
  }

  public desgargarArchivo(obj:any) {

    if(this.variabilidad == 0){
      this.varibilidadID = obj.datos.variabilidadId;
    }else{
      this.varibilidadID = this.variabilidad
    }
    this.modalPrd.showMessageDialog(this.modalPrd.loading);


        this.reportesPrd.getDescargaListaEmpleadosVariabilidad(this.varibilidadID).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"ListaEmpleadosCalculoPromedio"}.xlsx`;

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        });

  }

  public suscripciones() {
    this.myForm.controls.bimestre.valueChanges.subscribe(valor => {
      this.calcularDias(valor);
      this.validarfechaAplicacion(valor);

    });
  }

  public calcularDias(obj:any){
    this.reportesPrd.getCalcularDías(obj).subscribe(archivo => {

      this.diasCalcular = archivo.datos.diasTotales;
      this.myForm.controls.diaspromediar.setValue(this.diasCalcular);

    });
  }
  public promedioVariabilidad(){

    //let bimCalcular = this.bimestreCalcular + 1;
    this.reportesPrd.getCalcularDías(this.bimestreCalcular).subscribe(archivo => {

      this.diasCalcular = archivo.datos.diasTotales;
      this.myForm.controls.diaspromediar.setValue(this.diasCalcular);
    });

    this.listaVariabilidad = false;
    this.fromPromediar = true;

  }

  public cancelar(){

    this.recalcularPromedio = false;
    this.calcularPromedio = true;
    this.esREcalcular = false;
    this.listaVariabilidad = true;
    this.fromPromediar = false;
    this.listaVariable = true;
    this.listaPromedio = false;
    this.ngOnInit();

  }

  public cancelarPromedio(){
    this.listaVariabilidad = false;
    this.fromPromediar = true;


  }
  public recalcularVariabilidad() {

    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);


      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });

      return;
    }

      let mensaje = "¿Deseas realizar el recalculo de promedio de variables?";

      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{

          if(valor){

            if(this.variabilidad == 0){
              if(this.objRecalculo != undefined){
                this.varibilidadRecalculoID = this.objRecalculo.variabilidadId;
              }
            }else{
              this.varibilidadRecalculoID = this.variabilidad
            }

            this.modalPrd.showMessageDialog(this.modalPrd.loading);
                this.empresasPrd.recalculoPromedioVariables(this.varibilidadRecalculoID).subscribe(datos => {
                  this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                     if (datos.resultado) {

                      this.listaVariabilidad = true;
                      this.fromPromediar = false;
                      this.listaPromedio = true;
                      this.listaVariable = false;
                      this.cargando = true;
                      let objLista : any ={
                        variabilidad: datos.datos.variabilidadId

                      }
                      this.variabilidad = objLista.variabilidad;

                      this.empresasPrd.listaEmpleadosPromedioVariables(objLista).subscribe(datos => {

                      this.crearTablaListaEmpleadosPromedio(datos.datos);
                    });
                  }
              });

          }
        });


  }

  public calculoVariabilidad() {

    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);


      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });

      return;
    }

      let mensaje = "¿Deseas realizar el calculo promedio de variables?";

      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{

          if(valor){

            let  obj = this.myForm.getRawValue();

            let fecha = obj.fecha.split("/");
            let anio = fecha[2];
            let mes = fecha[1];
            let dia = fecha[0];
            fecha = anio + "-" + mes + "-" + dia;

            if(obj.bimestre == "1er Bimestre" || obj.bimestre == "1"){
              obj.bimestre = 1;
            }
            else if(obj.bimestre == "2do Bimestre" || obj.bimestre == "2"){
              obj.bimestre = 2;
            }
            else if(obj.bimestre == "3er Bimestre" || obj.bimestre == "3"){
              obj.bimestre = 3;

            }
            else if(obj.bimestre == "4to Bimestre" || obj.bimestre == "4"){
              obj.bimestre = 4;

            }
            else if(obj.bimestre == "5to Bimestre" || obj.bimestre == "5"){
              obj.bimestre = 5;

            }
            else if(obj.bimestre == "6to Bimestre" || obj.bimestre == "6"){
              obj.bimestre = 6;

            }

              let objEnviar : any =
              {
                clienteId: this.idEmpresa,
                bimestre: obj.bimestre,
                fechaAplicacion: fecha,
                anioFiscal: this.anioFiscal,
                usuarioId: this.idUsuario
              };

              this.modalPrd.showMessageDialog(this.modalPrd.loading);
                this.empresasPrd.calculoPromedioVariables(objEnviar).subscribe(datos => {

                  if(!datos.resultado){

                    this.modalPrd.showMessageDialog(this.modalPrd.error,datos.mensaje).then(valor =>{
                    this.listaVariabilidad = false;
                    this.fromPromediar = true;
                    });
                  } else{
                  this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                     if (datos.resultado) {

                      this.listaVariabilidad = true;
                      this.fromPromediar = false;
                      this.listaPromedio = true;
                      this.listaVariable = false;
                      this.cargando = true;
                      let objLista : any ={
                        variabilidad: datos.datos.variabilidadId

                      }
                      this.variabilidad = objLista.variabilidad;

                      this.empresasPrd.listaEmpleadosPromedioVariables(objLista).subscribe(datos => {

                      this.crearTablaListaEmpleadosPromedio(datos.datos);
                    });
                  }
                }
              });
          }
        });


  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "descargar":
          this.desgargarArchivo(obj);
         break;
      case "recalcular":

          this.esREcalcular = true;
          this.objRecalculo = obj.datos;
          this.myForm = this.createForm(this.objRecalculo);
          this.variabilidad = this.objRecalculo.variabilidadId;
          this.listaVariabilidad = false;
          this.calcularPromedio = false;
          this.recalcularPromedio = true;
          this.fromPromediar = true;
         break;
    }


  }

  public get f() {
    return this.myForm.controls;
  }




}



