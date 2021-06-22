import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { CompanyService } from 'src/app/modules/company/services/company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-variabilidad',
  templateUrl: './variabilidad.component.html',
  styleUrls: ['./variabilidad.component.scss']
})
export class VariabilidadComponent implements OnInit {

  public myForm!: FormGroup;
  public empresa: any;
  public idEmpresa: number = 0;
  public arregloMovimientos: any = [];
  public arregloEmpresa: any = [];
  public arregloRegistroPatronal: any = [];
  public arreglo: any = [];
  public arregloListaEmpleadosPromedio: any = [];
  public cargando: boolean = false;
  public cargandoIcon: boolean = false;
  public objFiltro: any = [];
  public activarMultiseleccion: boolean = false;
  public arregloSUA : any = [];
  public movimientoImssId : number = 0;
  public mensaje : string = "";
  public fromPromediar : boolean = false;
  public listaVariabilidad : boolean = true;
  public razonSocial: string = "";
  public bimestreLeyenda : any = "";
  public fechaActual: string = "";

  public arreglotabla: any = {
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


    public razonSocialEmpresa: string = "";
    public nombre: string = "";



  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService, private reportesPrd: ReportesService, 
    private companyProd: CompanyService, private formBuild: FormBuilder) { }

  ngOnInit(): void {
    debugger;
    let obj: any  = [];
    this.myForm = this.createForm(obj);
    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();

    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();

    this.fechaActual = `${dia}/${mes}/${anio}`;

    this.companyProd.getAll().subscribe(datos => {
      debugger;
      this.arregloEmpresa = datos.datos;

      this.myForm = this.createForm(obj);
    });
    
    this.filtrar();
    
    

  }

    public traerTabla(datos:any) {

      const columna: Array<tabla> = [
        new tabla("razonSocial", "Razón Social"),
        new tabla("anioFiscal", "Año"),
        new tabla("bimestre", "Bimestre"),
        new tabla("periodoCalculo", "Periodo de cálculo"),
        new tabla("fecha", "Fecha de amplicación"),
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

          if(item.bimestre == undefined || item.bimestre == null){

            this.bimestreLeyenda = "1er Bimestre"
          }
          else if(item.bimestre ==1){
            this.bimestreLeyenda = "2er Bimestre"
          }
          else if(item.bimestre ==2){
            this.bimestreLeyenda = "3er Bimestre"
          }
          else if(item.bimestre ==3){
            this.bimestreLeyenda = "4to Bimestre"
            
          }
          else if(item.bimestre ==4){
            this.bimestreLeyenda = "5to Bimestre"
            
          }
          else if(item.bimestre ==5){
            this.bimestreLeyenda = "6to Bimestre"
            
          }
  
          }
        }
      }
  
      this.arreglotabla.columnas = columna;
      this.arreglotabla.filas = this.arreglo
    }

    public crearTablaListaEmpleadosPromedio(datos:any) {
      const columna: Array<tabla> = [
        new tabla("nombreCompleto", "Nombre"),
        new tabla("diasLaboradosBimestre", "Días"),
        new tabla("diferencia", "Promedio"),

      ];
      
      this.arreglotabla = {
        columnas:[],
        filas:[]
      }
  
      if(this.arreglo !== undefined){
        for(let item of this.arreglo){
          item.nombreCompleto = item.nombre + " " + item.apellidoPat+" "+(item.apellidoMat == undefined ? "":item.apellidoMat);

        }
      }
  
      this.arreglotabla.columnas = columna;
      this.arreglotabla.filas = this.arreglo
    }

    public createForm(obj: any) {

      for(let item of this.arregloEmpresa){
        if(item.centrocClienteId == 514){
          this.razonSocial = item.razonSocial;
        }
      }
  
      return this.formBuild.group({
  
        razonSocial: [this.razonSocial],
        bimestre: [this.bimestreLeyenda],
        fecha: [this.fechaActual]

  
      });
  
    }

  public filtrar() {

    debugger;

    this.cargando = true;

        this.objFiltro = {
          ...this.objFiltro,
          clienteId: 463,

        };
   
  debugger;
  this.empresasPrd.filtrarVariabilidad(this.objFiltro).subscribe(datos => {
    this.arreglo = datos.datos;

    this.traerTabla({ datos: this.arreglo });

    this.cargando = false;
  });

  }


  public guardarMultiseleccion(obj:any) {

    debugger;
    if(obj == 1){
      this.mensaje = `¿Deseas descargar el archivo de altas?`;
    }
    else if(obj == 2){
      this.mensaje = `¿Deseas descargar el archivo de modificaciones?`;
      }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, this.mensaje).then(valor => {
      if (valor) {

        let valorAltas = [];
        let valorModif = [];
        for (let item of this.arreglo) {

          if (item["seleccionado"]) {
            if(obj==1){

              if(item.movimientoImssId ==3){
                valorAltas.push(item.kardex_colaborador_id);
              }
            }
            else if(obj==2){
              if(item.movimientoImssId ==1 || item.movimientoImssId ==2){
                valorModif.push(item.kardex_colaborador_id);
              }
            }

          }
        }
        if(obj==1){
          this.arregloSUA = { 
            idEmpresa: this.idEmpresa,
            idKardex: valorAltas
          }
        }

        if(obj==2){
          this.arregloSUA = { 
            idEmpresa: this.idEmpresa,
            idKardex: valorModif
          }
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        if(obj == 1){
        this.reportesPrd.getDescargaLayaoutAltasSUA(this.arregloSUA).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Layaout reingresos/altas SUA"}.txt`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          if (archivo) {
            for (let item of this.arregloSUA.idKardex) {
              for (let item2 of this.arreglo) {
                if (item2.kardex_colaborador_id === item) {
                  item2["seleccionado"] = false;
                  break;
                }
              }
            }
            this.activarMultiseleccion = false;
          }
        });
      }
      if(obj == 2){
        this.reportesPrd.getDescargaLayaoutMoficacionSUA(this.arregloSUA).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Layaout modificacion SUA"}.txt`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          if (archivo) {
            for (let item of this.arregloSUA.idKardex) {
              for (let item2 of this.arreglo) {
                if (item2.kardex_colaborador_id === item) {
                  item2["seleccionado"] = false;
                  break;
                }
              }
            }
            this.activarMultiseleccion = false;
          }
        });
      }

      }
    });
    



  }

  public promedioVariabilidad(){

    this.listaVariabilidad = false;
    this.fromPromediar = true;
  }

  public cancelar(){
    this.listaVariabilidad = true;
    this.fromPromediar = false;

  }

  public enviarPeticion() {
    debugger;
    /*this.submitEnviado = true;
      if (this.myForm.invalid) {
        Object.values(this.myForm.controls).forEach(control => {
          control.markAsTouched();
        });
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
  
      }*/
  
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
              this.bimestreLeyenda = 6;
              
            }

              let objEnviar : any = 
              {
                clienteId: this.idEmpresa,
                bimestre: obj.bimestre,
                fechaAplicacion: this.fechaActual,
                anioFiscal: 2021,
                usuarioId: 1
              };

           
            this.modalPrd.showMessageDialog(this.modalPrd.loading);

                this.empresasPrd.calculoPromedioVariables(objEnviar).subscribe(datos => {
    
                this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    
                this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
                  .then(()=> {
                     if (datos.datos != null || datos.datos != undefined) {
                      debugger;
                      this.listaVariabilidad = false;
                      this.fromPromediar = false;
                      this.cargando = true;
                      let objLista : any ={
                        variabilidad: datos.datos.variabilidadId
                      }
                                                            
                      this.empresasPrd.listaEmpleadosPromedioVariables(objLista).subscribe(datos => {
                       
                      this.crearTablaListaEmpleadosPromedio({ datos: this.arregloListaEmpleadosPromedio });
                    });
                  } else{
                    this.listaVariabilidad = false;
                    this.fromPromediar = true;
                  }  
                  });
              });     

          }
        });
        

  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
        case "filaseleccionada":
          this.activarMultiseleccion = obj.datos;
        break;
    }

  }
}
