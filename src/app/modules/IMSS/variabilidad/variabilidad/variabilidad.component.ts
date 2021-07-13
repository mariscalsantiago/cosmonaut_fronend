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
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { truncate } from 'fs';

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



  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService, private reportesPrd: ReportesService, 
    private companyProd: CompanyService, private formBuild: FormBuilder, public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    
    
    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();
    this.idUsuario = this.usauriosSistemaPrd.getUsuario();
    this.idUsuario = this.idUsuario.usuarioId;

    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    this.anioFiscal = fecha.getFullYear();

    this.fechaActual = `${dia}/${mes}/${this.anioFiscal}`;

    this.cargando = true;

        this.objFiltro = {
          ...this.objFiltro,
          //clienteId: 463
          clienteId: this.idEmpresa

        };
    
    this.empresasPrd.filtrarVariabilidad(this.objFiltro).subscribe(datos => {
      this.arreglo = datos.datos;
  
      this.traerTabla({ datos: this.arreglo });
  
      this.cargando = false;
      let obj: any  = [];
      this.myForm = this.createForm(obj);
    });

    

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
  
      if(this.arreglo !== undefined){
        for(let item of this.arreglo){
          if(item.fechaAplicacion !== undefined ){
          item.fechaAplicacion = (new Date(item.fechaAplicacion).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fecha = datepipe.transform(item.fechaAplicacion , 'dd-MMM-y')?.replace(".","");
          this.razonSocial = item.razonSocial;
          if(item.bimestre == undefined || item.bimestre == null){

            this.bimestreLeyenda = "1er Bimestre"
            this.bimestreCalcular = 1;
            let anio = this.fecha.getFullYear();
            this.fechaActual = `01/03/${anio}`;
          }
          else if(item.bimestre ==1){
            this.bimestreLeyenda = "2er Bimestre"
            this.bimestreCalcular = 2;
            let anio = this.fecha.getFullYear();
            this.fechaActual = `01/05/${anio}`;
          }
          else if(item.bimestre ==2){
            this.bimestreLeyenda = "3er Bimestre"
            this.bimestreCalcular = 3;
            let anio = this.fecha.getFullYear();
            this.fechaActual = `01/07/${anio}`;
          }
          else if(item.bimestre ==3){
            this.bimestreLeyenda = "4to Bimestre"
            this.bimestreCalcular = 4;
            let anio = this.fecha.getFullYear();
            this.fechaActual = `01/09/${anio}`;
            
          }
          else if(item.bimestre ==4){
            this.bimestreLeyenda = "5to Bimestre"
            this.bimestreCalcular = 5;
            let anio = this.fecha.getFullYear();
            this.fechaActual = `01/11/${anio}`;
            
          }
          else if(item.bimestre ==5){
            this.bimestreLeyenda = "6to Bimestre"
            this.bimestreCalcular = 6;
            let anio = this.fecha.getFullYear();
            anio = anio + 1; 
            this.fechaActual = `01/01/${anio}`;
          }
  
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
    
                this.modalPrd.showMessageDialog(this.modalPrd.variabilidad,"Proceso de promedio de varibales completo").then(valor =>{
        
                  if (datos.resultado) {
                      this.desgargarArchivo(undefined);
                      this.cancelar();
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
        new tabla("diferencia", "Promedio"),

      ];
      
      this.arreglotablaListaEmpleadosPromedio = {
        columnas:[],
        filas:[]
      }
  
      if(this.arregloListaEmpleadosPromedio !== undefined){
        for(let item of this.arregloListaEmpleadosPromedio){
          item.nombreCompleto = item.calculoEmpleadoVariabilidad.nombre + " " + item.calculoEmpleadoVariabilidad.apellidoPat+" "+(item.calculoEmpleadoVariabilidad.apellidoMat == undefined ? "":item.calculoEmpleadoVariabilidad.apellidoMat);
          item.diasLaboradosBimestre = item.calculoEmpleadoVariabilidad.diasLaboradosBimestre;
          item.diferencia = item.calculoEmpleadoVariabilidad.diferencia;

        }
      }
  
      this.arreglotablaListaEmpleadosPromedio.columnas = columna;
      this.arreglotablaListaEmpleadosPromedio.filas = this.arregloListaEmpleadosPromedio
      this.cargando = false;
    }

    public createForm(obj: any) {

      
    if(this.bimestreCalcular==0){

      this.bimestreLeyenda = "1er Bimestre"
      this.bimestreCalcular = 1;
      let anio = this.fecha.getFullYear();
      this.fechaActual = `01/03/${anio}`;
  }

      return this.formBuild.group({
  
        razonSocial: [this.razonSocial],
        bimestre: [this.bimestreLeyenda],
        fecha: [this.fechaActual],
        diaspromediar: [this.diasCalcular, Validators.required]

  
      });
  
    }

  public filtrar() {

   // 

    this.cargando = true;

        this.objFiltro = {
          ...this.objFiltro,
          clienteId: this.razonSocialEmpresa,
          anioFiscal: this.anioFiltro,
          bimestre: this.bimestre
        };
   
  //
  this.empresasPrd.filtrarVariabilidad(this.objFiltro).subscribe(datos => {
    this.arreglo = datos.datos;

    this.traerTabla({ datos: this.arreglo });

    this.cargando = false;
  });

  }


  public desgargarArchivo(obj:any) {
    debugger;
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

  public promedioVariabilidad(){
    
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.reportesPrd.getCalcularDías(this.bimestreCalcular).subscribe(archivo => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.diasCalcular = archivo.datos.diasTotales;
      this.myForm.controls.diaspromediar.setValue(this.diasCalcular);

    });

    this.listaVariabilidad = false;
    this.fromPromediar = true;
  }

  public cancelar(){
    this.listaVariabilidad = true;
    this.fromPromediar = false;
    this.listaVariable = true;
    this.listaPromedio = false;

  }

  public cancelarPromedio(){
    this.listaVariabilidad = false;
    this.fromPromediar = true;


  }

  public enviarPeticion() {
    
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
            
            if(obj.bimestre == "1er Bimestre"){
              obj.bimestre = 1;
            }
            else if(obj.bimestre == "2er Bimestre"){
              obj.bimestre = 2;
            }
            else if(obj.bimestre == "3er Bimestre"){
              obj.bimestre = 3;
              
            }
            else if(obj.bimestre == "4to Bimestre"){
              obj.bimestre = 4;
              
            }
            else if(obj.bimestre == "5to Bimestre"){
              obj.bimestre = 5;
              
            }
            else if(obj.bimestre == "6to Bimestre"){
              obj.bimestre = 6;
              
            }
            
              let objEnviar : any = 
              
              /*{
                clienteId: 461,
                bimestre: 3,
                fechaAplicacion: "2021-06-01",
                anioFiscal: 2021,
                usuarioId: 1
                personaID
              };*/

              {
                clienteId: this.idEmpresa,
                bimestre: obj.bimestre,
                fechaAplicacion: obj.fecha,
                anioFiscal: this.arreglo.anioFiscal,
                usuarioId: this.idUsuario
              };

           
                this.empresasPrd.calculoPromedioVariables(objEnviar).subscribe(datos => {
                  valor = 0;
                  this.modalPrd.showMessageDialog(this.modalPrd.dispersar,"Calculando promedio de variables","Espere un momento, el proceso se tardara varios minutos.");
                  let intervalo = interval(1000);
                  intervalo.pipe(take(11));
                  intervalo.subscribe((valor)=>{
                  this.configuracionPrd.setCantidad(valor*10);
                
                  if(valor == 10){
                    valor = 0;
                  this.configuracionPrd.setCantidad(0);
                  this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                     if (datos.resultado) {
                      
                      this.listaVariabilidad = true;
                      this.fromPromediar = false;
                      this.listaPromedio = true;
                      this.listaVariable = false;
                      this.cargando = true;
                      let objLista : any ={
                        variabilidad: datos.datos.variabilidadId
                        //variabilidad: 86
                        
                      }
                      this.variabilidad = objLista.variabilidad;
                                                            
                      this.empresasPrd.listaEmpleadosPromedioVariables(objLista).subscribe(datos => {
                      
                      this.crearTablaListaEmpleadosPromedio(datos.datos);
                    });
                  } else{

                    this.modalPrd.showMessageDialog(this.modalPrd.warning,datos.mensaje).then(valor =>{
                    this.listaVariabilidad = false;
                    this.fromPromediar = true;
                    });
                  }  
                }
                  });
              });     

          }
        });
        

  }

  public recibirTabla(obj: any) {
    debugger;
    switch (obj.type) {
      case "descargar":
          this.desgargarArchivo(obj);
         break;
    }

  }

  public get f() {
    return this.myForm.controls;
  }
}
