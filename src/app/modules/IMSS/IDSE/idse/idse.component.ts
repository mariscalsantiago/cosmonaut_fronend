import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';


@Component({
  selector: 'app-idse',
  templateUrl: './idse.component.html',
  styleUrls: ['./idse.component.scss']
})

export class IDSEComponent implements OnInit {

  public empresa: any;
  public idEmpresa: number = 0;
  public arregloMovimientos: any = [];
  public arregloRegistroPatronal: any = [];
  public arreglo: any = [];
  public cargandoIcon: boolean = false;
  public cargando: boolean = false;
  public objFiltro: any = [];
  public activarMultiseleccion: boolean = false;
  public arregloIDSE : any = [];
  public arregloEnvioIDSE : any = [];
  public movimientoImssId : number = 0;
  public registroPatronalIdse : string = '';
  public idCsd : string = '';

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


    public registroPatronal: string = "";
    public idregistroPatronal: number = 0;
    public nombre: string = "";
    public apellidoPat: string = "";
    public apellidoMat: string = "";
    public numeroEmpleado: string = "";
    public fechaMovimiento: any = null;
    public movimiento: number = 0;
    public esActivo : number = 0;

    
    public modulo: string = "";
    public subModulo: string = "";


    public esDescargar:boolean = false;


  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService, private router: Router,
    private modalPrd:ModalService, private reportesPrd: ReportesService,public configuracionPrd:ConfiguracionesService,) { }

  ngOnInit(): void {

    this.establecerPermisos();
    
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();
    
    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();

    this.empresasPrd.getListarMovimientosIDSE().subscribe(datos => this.arregloMovimientos = datos.datos);
    this.empresasPrd.getListarRegistroPatronal(this.idEmpresa).subscribe(datos => this.arregloRegistroPatronal = datos.datos);


    this.filtrar();



  }

  public traerTabla(datos:any) {
    
    this.arreglo = datos.datos;
    const columna: Array<tabla> = [
      new tabla("nombre", "Nombre completo del empleado"),
      new tabla("sbcDecimal", "SBC"),
      new tabla("movimiento", "Movimiento"),
      new tabla("fechamovimiento", "Fecha de movimiento"),
      new tabla("estatus", "Estatus de movimiento"),
      new tabla("vigencia_movimiento", "Vigencia de movimiento")
    ];

    this.arreglotabla = {
      columnas:[],
      filas:[]
    }

    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        if(item.fecha_movimiento !== undefined ){
        item.fechamovimiento = new DatePipe("es-MX").transform(item.fecha_movimiento, 'dd-MMM-y')?.replace(".","");
        item.nombre = item.nombre + " " + item.apellidoPat+" "+(item.apellidoMat == undefined ? "":item.apellidoMat);
        }
        if(item.sbc !== undefined ){
          item.sbcDecimal = item.sbc.toFixed(2);   
        }
        if(item.salario_diario !== undefined ){
          item.salarioDiario = item.salario_diario.toFixed(2);   
        }
/*         if(item.es_activo !== undefined){
          if(item.es_activo){
            item.esActivo = 'Activo';
            }
          else if(!item.es_activo){
            item.esActivo = 'Inactivo';
            }
        }   */
      }
    }

    this.arreglotabla.columnas = columna;
    this.arreglotabla.filas = this.arreglo
    this.cargando = false;
  }

  public establecerPermisos(){
    this.esDescargar = this.configuracionPrd.getPermisos("Descargar");
  }

  public filtrar() {

    

    this.cargando = true;
    this.objFiltro = {};
    if(this.fechaMovimiento == ''){
      this.fechaMovimiento = null;
    }

    for(let item of this.arregloRegistroPatronal){
      if(item.registroPatronalId = this.idregistroPatronal)
      this.registroPatronal = item.registroPatronal;
    }
    if(this.registroPatronal != ''){
    this.objFiltro = {
      ...this.objFiltro,
      registroPatronal: this.registroPatronal
    };
    }

    if(this.nombre != ''){
      this.objFiltro = {
        ...this.objFiltro,
        nombre: this.nombre
      };
      }
      if(this.apellidoPat != ''){
        this.objFiltro = {
          ...this.objFiltro,
          apellidoPat: this.apellidoPat
        };
        }
        if(this.apellidoMat != ''){
          this.objFiltro = {
            ...this.objFiltro,
            apellidoMat: this.apellidoMat
          };
        }
        if(this.numeroEmpleado != ''){
          this.objFiltro = {
            ...this.objFiltro,
            numeroEmpleado: this.numeroEmpleado
          };
        }
        if(this.movimiento != 0){
          this.objFiltro = {
            ...this.objFiltro,
            movimiento: this.movimiento
          };
          this.movimiento = 0 ;
        }
        this.objFiltro = {
          ...this.objFiltro,
          clienteId: this.idEmpresa,
          fechaMovimiento: this.fechaMovimiento
        };
  
  this.empresasPrd.filtrarIDSE(this.objFiltro).subscribe(datos => {
    this.arreglo = datos.datos;

    this.traerTabla({ datos: this.arreglo });

    this.cargando = false;
  });

  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public seleccionarTodosBool(input: any) {
    
    for (let item of this.arreglo)
        if(item.personaId){
        input.checkbox = input.checked;
        let checkboxes  = document.getElementsByName('ajusteirs');
        }
      }


      public descargaArchivoTxtItem(obj: any) {

        let mensaje = `¿Deseas descargar el archivo?`;
    
        this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
          if (valor) {
    
            let valor = [];
  
            valor.push(obj.kardex_colaborador_id);
    
            this.arregloIDSE = { 
              idEmpresa: this.idEmpresa,
              idKardex: valor
            }
    
    
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
    
            this.reportesPrd.getDescargaLayaoutIDSE(this.arregloIDSE).subscribe(archivo => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
              const downloadLink = document.createElement("a");
              const fileName = `${"Txt de envio IDSE"}.txt`;
      
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            });
          }
        });
      }

      public descargaAcuseRespuesta(obj: any) {

        let mensaje = `¿Deseas descargar el acuse de respuesta?`;
    
        this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
          if (valor) {
    
            let ID = obj.kardex_colaborador_id;
  
    
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
    
            this.empresasPrd.getAcuseRespuesta(ID).subscribe(archivo => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
              const downloadLink = document.createElement("a");
              const fileName = `${"Acuse de respuesta"}.pdf`;
      
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            });
          }
        });
      }

      public descargaAcuseMovimiento(obj: any) {

        let mensaje = `¿Deseas descargar el acuse de envio?`;
    
        this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
          if (valor) {
    
            let ID = obj.kardex_colaborador_id;
  
    
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
    
            this.empresasPrd.getAcuseMovimiento(ID).subscribe(archivo => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
              const downloadLink = document.createElement("a");
              const fileName = `${"Acuse de envio"}.pdf`;
      
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            });
          }
        });
      }
      
  public guardarMultiseleccion() {
    
    let mensaje = `¿Deseas descargar el archivo de lo seleccionado?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {

        let valor = [];
        for (let item of this.arreglo) {

          if (item["seleccionado"]) {

            valor.push(item.kardex_colaborador_id);

          }
        }
        this.arregloIDSE = { 
          idEmpresa: this.idEmpresa,
          idKardex: valor
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.reportesPrd.getDescargaLayaoutIDSE(this.arregloIDSE).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Layaout  IDSE"}.txt`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          if (archivo) {
            for (let item of this.arregloIDSE.idKardex) {
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
    });
  }
  
  public enviarIdse() {
    
    let mensaje = `¿Deseas enviar estos registros a IDSE?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        
        let valor = [];
        for (let item of this.arreglo) {
          this.registroPatronalIdse = item.registro_patronal;
          this.idCsd = item.credencialesImssId;
          if (item["seleccionado"] && item.estatus !== 'En proceso' && item.estatus !== 'En validación' && item.estatus !== 'Aceptado') {

            valor.push(item.kardex_colaborador_id);

          }
        }
        if(valor === undefined){
          this.modalPrd.showMessageDialog(this.modalPrd.error,"No es ha seleccionado ningun archivo a enviar");
            return;
        }

        this.arregloEnvioIDSE = [];
        this.arregloEnvioIDSE = { 

          clienteId: this.idEmpresa,
          registroPatronal: this.registroPatronalIdse,
          idCsd: this.idCsd,
          movimientosKardexIds: valor
        }



        console.log(JSON.stringify(this.arregloEnvioIDSE));
        

        
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.empresasPrd.afiliaRecepcionIdse(this.arregloEnvioIDSE).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          if(archivo.resultado){
              this.modalPrd.showMessageDialog(archivo.resultado,archivo.mensaje)
              .then(()=> {
            
                  this.empresasPrd.filtrarIDSE(this.objFiltro).subscribe(datos => {
                    this.arreglo = datos.datos;
                
                    this.traerTabla({ datos: this.arreglo });
                
                    this.cargando = false;
                  });
                  this.activarMultiseleccion = false;
              });    

          }else{

              this.modalPrd.showMessageDialog(archivo.resultado,archivo.mensaje);

          }
        });
     

      }
    });
  }

  public recibirTabla(obj: any) {
    

    switch (obj.type) {
      case "eliminar":
        
        let mensaje = "¿Estás seguro de eliminar el registro?";
        this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{

        if(valor){
        let idKardex = obj.datos.kardex_colaborador_id;
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
    
        this.empresasPrd.eliminarPPP(idKardex).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
          if(datos.resultado){
            this.filtrar();
          }
          
        });
      }  
      });

      break;
      case "desglosar":

        let item = obj.datos;
       
         let columnas: Array<tabla> = [
          new tabla("politica", "Política"),
          new tabla("registro_patronal", "Registro patronal"),
          new tabla("esActivo", "Estatus de empleado"),
          new tabla("salarioDiario", "Salario diario"),
          new tabla("sbcDecimal", "SBC"),
          //new tabla("salario_diario_integrado", "Salario diario integrado"),

          
        ];
        this.arreglotablaDesglose.columnas = columnas;
        this.arreglotablaDesglose.filas = item;

        item.cargandoDetalle = false;
        
        break;
        case "filaseleccionada":
        
          this.activarMultiseleccion = obj.datos;
          
        break;
        case "txtImss":
          
          this.descargaArchivoTxtItem(obj.datos);
          break;
        case "acuseRespuesta":
          
          this.descargaAcuseRespuesta(obj.datos);
          break;     
        case "acuseMovimiento":
          
          this.descargaAcuseMovimiento(obj.datos);
          break;
        case "editar":
          
          let empleado : any = obj.datos.persona_id;
          this.configuracionPrd.accesoRuta = true;
          this.router.navigate(['/empleados',empleado, 'pagos']);
          this.configuracionPrd.activa = 3;

          break;
    }

  }

}
