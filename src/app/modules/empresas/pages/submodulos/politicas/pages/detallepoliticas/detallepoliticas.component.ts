import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { PoliticasService } from '../services/politicas.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';

@Component({
  selector: 'app-detallepoliticas',
  templateUrl: './detallepoliticas.component.html',
  styleUrls: ['./detallepoliticas.component.scss']
})
export class DetallepoliticasComponent implements OnInit {
  lineBreak = '\n\r\xa0\xa0\xa0\xa0\xa0\xa0\n\r';
  @ViewChild("nombre") public nombre!:ElementRef;
  public myFormpol!: FormGroup;
  public arreglo: any = [];
  public insertar: boolean = false;
  public cargando: Boolean = false;
  public idEmpleado: number = -1;
  public submitEnviado: boolean = false;
  public esInsert: boolean = false;
  public id_empresa: number = 0;
  public calculoAntiguedadx: number = 0;
  public arregloTablaBeneficios: any = [];
  public editField: string = "";
  public mostrarBeneficios: boolean = false;
  public arreglopintar: any = [false, false, false];
  public arreglotablaPer: any = [];
  public beneficio: any =[];
  public beneficiotab : any =[];
  public cargandoPer: boolean = false;
  public cargandoDed: boolean = false;
  public arreglotablaDed: any = [];
  public idPolitica : number = 0;
  public aniosAntiguedad : any;
  public diasAguinaldo : any;
  public diasVacaciones : any;
  public primaVacacional : any;

  public arreglotablaPert: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDedt: any = {
    columnas: [],
    filas: []
  };


  constructor(private formBuilder: FormBuilder, private politicasPrd: PoliticasService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router,private modalPrd:ModalService,private router: ActivatedRoute, private bancosPrd: CuentasbancariasService,
    private usuariosSistemaPrd: UsuarioSistemaService, private ventana: VentanaemergenteService) {
    
    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.id_empresa = datos["id"]
    });


  }

  ngOnInit(): void {
    
    let objdetrep = history.state.data == undefined ? {} : history.state.data;
    this.idPolitica = objdetrep.politicaId;
    //this.id_empresa = objdetrep.centrocClienteId;
    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];
    });

  if(!this.insertar){
    
    this.mostrarBeneficios = true;
    this.politicasPrd.getdetalleBeneficio(this.idPolitica,this.id_empresa).subscribe(datos => this.arregloTablaBeneficios = datos.datos);
    this.myFormpol = this.createFormrep((objdetrep));

    
    this.cargandoPer = true;
    this.bancosPrd.getListaPercepcionesPolitica(this.idPolitica, this.id_empresa).subscribe(datos => {
      this.crearTablaPercepcion(datos);
    });


    this.cargandoDed = true;
    this.bancosPrd.getListaDeduccionesPolitica(this.idPolitica, this.id_empresa).subscribe(datos => {
      this.crearTablaDeduccion(datos);
    });
    
  }else{
    this.myFormpol = this.createFormrep((objdetrep));
  }


  }

  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }


  public createFormrep(obj: any) {
    
    if(!this.insertar){
      obj.calculoAntiguedadx = obj.calculoAntiguedadId == 2  ?"contrato":"antiguedad";
      if(obj.primaAniversario){

        obj.primaAniversario = obj.primaAniversario = "Aniversario";
      }else{
        obj.primaAniversario = obj.primaAniversario = "Evento";

      }


    }else{
      obj.primaAniversario = obj.primaAniversario = "Aniversario";
    }
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      diasEconomicos: [obj.diasEconomicos, [Validators.required]],
      primaAniversario: [obj.primaAniversario],
      descuentaFaltas: [obj.descuentaFaltas],
      descuentaIncapacidades: [obj.descuentaIncapacidades],
      costoValesRestaurante: [obj.costoValesRestaurante],
      descuentoPropDia: [obj.descuentoPropDia],
      politicaId: obj.politicaId,
      calculoAntiguedadx:[obj.calculoAntiguedadx]

    });
  }


  public updateList(id: number, property: string, event: any) {
    debugger;
    const value = event.target.textContent;
/*     if ( value < this.arregloTablaBeneficios[id][property] ) {
      (event.target as HTMLInputElement).textContent = value.replace(value, this.arregloTablaBeneficios[id][property]);
    }  */
    
    const editField = event.target.textContent;
    this.arregloTablaBeneficios[id][property] = editField;
  }


  public changeValue(id: number, property: string, event: any) {
    debugger;
    const value = event.target.textContent;
/*     if ( value < this.arregloTablaBeneficios[id][property] ) {
      (event.target as HTMLInputElement).textContent = value.replace(value, this.arregloTablaBeneficios[id][property]);
    }  */
      this.editField = event.target.textContent;
   
  }

  public enviarPeticion() {


    this.submitEnviado = true;
    if (this.myFormpol.invalid) {
     
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }


    const titulo = (this.insertar) ? "¿Deseas registrar la política" : "¿Deseas actualizar los datos de la política?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){
        
        let obj = this.myFormpol.value;
        let antiguedad = obj.calculoAntiguedadx == "contrato"?"C":"A";
        if(antiguedad == "C"){
          this.calculoAntiguedadx = 2;
        }else{
          this.calculoAntiguedadx = 1;
        }

        if(obj.primaAniversario == "Aniversario"){
          obj.primaAniversario = true;
        }else{
          obj.primaAniversario = false;
        }

        let objEnviar: any = {
          nombre: obj.nombre,
          diasEconomicos: obj.diasEconomicos,
          primaAniversario: obj.primaAniversario,
          descuentaFaltas: obj.descuentaFaltas,
          descuentaIncapacidades: obj.descuentaIncapacidades,
          costoValesRestaurante: obj.costoValesRestaurante,
          descuentoPropDia: obj.descuentoPropDia,
          calculoAntiguedadx: antiguedad,
          centrocClienteId: {
            centrocClienteId: this.id_empresa
          },
          calculoAntiguedadId: {
            calculoAntiguedadxId: this.calculoAntiguedadx
          },

        }
        if (this.insertar) {
          
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.politicasPrd.save(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
              }
            });


          });

        } else {
          
          for(let item of this.arregloTablaBeneficios){
            this.beneficio = 
              {
                beneficioPolitica: item.beneficioPolitica,
                aniosAntiguedad: item.aniosAntiguedad,
                diasAguinaldo: item.diasAguinaldo,
                diasVacaciones: item.diasVacaciones,
                primaVacacional: item.primaVacacional
              }
              
              this.beneficiotab.push(this.beneficio);

          }
          

          let objEnviar: any = {
            politicaId: obj.politicaId,
            nombre: obj.nombre,
            diasEconomicos: obj.diasEconomicos,
            primaAniversario: obj.primaAniversario,
            descuentaFaltas: obj.descuentaFaltas,
            descuentaIncapacidades: obj.descuentaIncapacidades,
            costoValesRestaurante: obj.costoValesRestaurante,
            descuentoPropDia: obj.descuentoPropDia,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
            },

            calculoAntiguedadx:  antiguedad,
            calculoAntiguedadId: {
              calculoAntiguedadxId: this.calculoAntiguedadx
            },
            beneficiosXPolitica: this.beneficiotab
          }
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.politicasPrd.modificar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
              }
            });


          });
        }

      }
    });
  }

  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];
  }

  public redirect(obj: any) {
    this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
  }

  

  public agregarPer() {
    
    let datosPer: any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.id_empresa,
      idPolitica: this.idPolitica
    };
    this.ventana.showVentana(this.ventana.percepciones, { datos: datosPer }).then(valor => {
      if (valor.datos) {

        this.agregarNuevaPercepcion(valor.datos);
      }
    });
  }
  public agregarDed() {
    let datosDed: any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.id_empresa,
      idPolitica: this.idPolitica
    };
    this.ventana.showVentana(this.ventana.deducciones, { datos: datosDed }).then(valor => {
      if (valor.datos) {

        this.agregarNuevaDeduccion(valor.datos);
      }
    });
  }

  public agregarNuevaPercepcion(obj: any) {
    
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.savePercepcionPolitica(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaPercepcionesPolitica(this.idPolitica, this.id_empresa).subscribe(datos => {
        this.crearTablaPercepcion(datos);
      });

    });
  }


  public agregarNuevaDeduccion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.saveDeduccionPolitica(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaDeduccionesPolitica(this.idPolitica, this.id_empresa).subscribe(datos => {
        this.crearTablaDeduccion(datos);
      });
    });
  }

  public crearTablaDeduccion(datos: any) {
    

    this.arreglotablaDed = datos.datos;


    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de deducción"),
      new tabla("fechaInicioDesctoDed", 'Fecha inicio de descuento'),
      //new tabla("", "Tipo de descuento"),
      new tabla("valorMonto", 'Valor (porcentaje/monto)'),
      new tabla("esActivo", "Estatus")
    ]


    this.arreglotablaDedt = {
      columnas: [],
      filas: []
    }


    if (this.arreglotablaDed !== undefined) {
      for (let item of this.arreglotablaDed) {
        if(item.fechaInicioDescto !== undefined ){
        item.fechaInicioDescto = (new Date(item.fechaInicioDescto).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicioDesctoDed = datepipe.transform(item.fechaInicioDescto, 'dd-MMM-y')?.replace(".", "");
        }
        item.nombre = item.conceptoDeduccionId?.nombre;

        if (item.esActivo) {
          item.esActivo = true
        }
        if (!item.esActivo) {
          item.esActivo = false
        }

        if(item.valor !== undefined){
          item.valorMonto = item.valor; 
        }
        else if(item.montoTotal !== undefined){
          item.valorMonto = item.montoTotal
        }
        if(item.tipoPercepcionId?.noEditable !== undefined ){
          item.tipoPercepcionId.noEditable = false;
          }
          if(item.tipoPercepcionId?.porDefecto !== undefined ){
            item.tipoPercepcionId.porDefecto = false;
          }
      }
    }

    this.arreglotablaDedt.columnas = columnas;
    this.arreglotablaDedt.filas = this.arreglotablaDed;
    this.cargandoDed = false;
  }

  public crearTablaPercepcion(datos: any) {
    
    this.arreglotablaPer = datos.datos;
    let columnas: Array<tabla> = [
      
      new tabla("nombre", "Nombre de percepción"),
      new tabla("fechaInicioPer", 'Fecha inicio percepción'),
      new tabla("tipoMonto", "Tipo de monto"),
      new tabla("valorMonto", 'Valor (porcentaje/monto)'),
      new tabla("esActivo", "Estatus")
    ]


    this.arreglotablaPert = {
      columnas: [],
      filas: []
    }
    if (this.arreglotablaPer !== undefined) {
      for (let item of this.arreglotablaPer) {
        if(item.fechaInicio !== undefined ){
        item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicioPer = datepipe.transform(item.fechaInicio, 'dd-MMM-y')?.replace(".", "");
        }

        item.nombre = item.conceptoPercepcionId?.nombre;

        item.tipoMonto = (item.baseCalculoId?.baseCalculoId == '1') ? 'Porcentual' : 'Fijo';

        if (item.esActivo) {
          item.esActivo = true;
        }
        if (!item.esActivo) {
          item.esActivo = false;
        }

        if(item.tipoPercepcionId?.noEditable !== undefined ){
          item.tipoPercepcionId.noEditable = false;
          }
          if(item.tipoPercepcionId?.porDefecto !== undefined ){
            item.tipoPercepcionId.porDefecto = false;
          }
          
        if(item.valor !== undefined){
          item.valorMonto = item.valor; 
        }
        else if(item.montoTotal !== undefined){
          item.valorMonto = item.montoTotal
        }

      }
    }


    this.arreglotablaPert.columnas = columnas;
    this.arreglotablaPert.filas = this.arreglotablaPer;
    this.cargandoPer = false;
  }

  public recibirTablaDed(obj: any) {

    if (obj.type == "editar") {
      let datosDed = obj.datos;
      this.ventana.showVentana(this.ventana.deducciones, { datos: datosDed }).then(valor => {
        if (valor.datos) {

          this.modificarDeduccion(valor.datos);
        }
      });
    }
  }

  public modificarDeduccion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.modificarDeduccionPolitica(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaDeduccionesPolitica(this.idPolitica, this.id_empresa).subscribe(datos => {
        this.crearTablaDeduccion(datos);
      });
    });
  }

  public recibirTablaPer(obj: any) {

    if (obj.type == "editar") {
      let datosPer = obj.datos;
      this.ventana.showVentana(this.ventana.percepciones, { datos: datosPer }).then(valor => {
        if (valor.datos) {

          this.modificarPercepcion(valor.datos);
        }
      });

    }
  }

  public modificarPercepcion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.modificarPercepcionPolitica(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaPercepcionesPolitica(this.idPolitica, this.id_empresa).subscribe(datos => {
        this.crearTablaPercepcion(datos);
      });
    });
  }
  get f() { return this.myFormpol.controls; }


}

