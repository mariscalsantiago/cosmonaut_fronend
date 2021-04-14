import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { CuentasbancariasService } from 'src/app/modules/empresas/services/cuentasbancarias/cuentasbancarias.service';


@Component({
  selector: 'app-datosbancarios',
  templateUrl: './datosbancarios.component.html',
  styleUrls: ['./datosbancarios.component.scss']
})
export class DatosbancariosComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosempresa:any;
  

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;
  public habcontinuar: boolean = false;
  public habGuardar: boolean = false;
  public actguardar: boolean = false;
  public id_empresa: number = 0;
  public listaCuentaNuevo: boolean = true;
  public listaCuentaModificar: boolean = false;
  public cargando: Boolean = false;
  public arregloListaCuenta: any = [];
  public obj: any =[];
  public objenviar: any = [];
  public insertarMof: boolean = false;
  public mostrarSTP:boolean= false;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDesglose: any = {
    columnas: [],
    filas: []
  };

  constructor(private formBuilder: FormBuilder,private cuentasPrd:CuentasbancariasService,
    private routerPrd:Router) { }

  ngOnInit(): void {
    
    
    this.datosempresa.activarGuardaMod= true;
    this.id_empresa = this.datosempresa.centrocClienteEmpresa
    //this.listaCuentaModificar = this.datosempresa.activarList;
    //this.listaCuentaNuevo = this.datosempresa.activarForm;
    this.cargando = true;
   this.cuentasPrd.getAllByEmpresa(this.id_empresa).subscribe(datos => {
    
    let columnas: Array<tabla> = [
      new tabla("nombreCuenta", "Nombre cuenta"),
      new tabla("numeroCuenta", "Número de cuenta"),
      new tabla("nombrebanco", "Nombre banco"),
      new tabla("clabe", "Cuenta CLABE"),
      new tabla("esActivo", "Estatus")
    ];

    console.log("datos de cuentas",datos);

    if(datos.datos !== undefined){
      datos.datos.forEach((part:any) => {
        part.nombrebanco=part.bancoId?.nombreCorto;
      });
    }
  

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = datos.datos;
    this.cargando = false;
    
  });

  //});
  /*if(!this.datosempresa.insertar || this.mostrarSTP){
  this.cuentasPrd.getAllByDetCuentas(this.id_empresa).subscribe(datos => {
    this.obj = datos.datos;
    this.myForm = this.createForm(this.obj);
    this.cargando = false;
 
   });
  }else{
    this.myForm = this.createForm(this.obj);
  }*/
    this.myForm = this.createForm(this.obj);

  }

  public createForm(obj: any) {
    if(!this.datosempresa.insertar && obj.usaStp){
      this.activar();
      obj.usaStp= true;
      
    }
    return this.formBuilder.group({

      usaStp: obj.usaStp,
      cuentaStp: [obj.cuentaStp, [Validators.required,Validators.pattern('[0-9]+')]],
      clabeStp: [obj.clabeStp, [Validators.required,Validators.pattern(/^\d{18}$/)]],
    
    });

  }


  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);
  }

  public activar(){
     
    if(!this.actguardar){
    this.habGuardar= true;
    this.actguardar= true;
    }else{
    this.habGuardar = false;
    this.actguardar= false;
    }
  }

  public activarCont(){
    this.habcontinuar = true;
  }

  public recibirTabla(obj:any){
    switch(obj.type){

      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "desglosar":
            let item = obj.datos;

            this.cuentasPrd.getAllByEmpresa(this.id_empresa).subscribe(datos => {
              let temp = datos.datos;
              console.log("DAtos Banco",temp);
              if (temp != undefined) {
    
                for (let llave in temp) {
                  item[llave] = temp[llave];
                }
    
              }
    
    
              let columnas: Array<tabla> = [
                new tabla("descripcion", "Descripcion"),
                new tabla("funcionCuenta", "Función de la cuenta "),
                new tabla("numInformacion", "Número de información"),
                new tabla("numSucursal", "Número de sucursal")
              ];
              
              item.funcionCuenta = item.funcionCuentaId?.descripcion;
    
    
              this.arreglotablaDesglose.columnas = columnas;
              this.arreglotablaDesglose.filas = item;
    
              item.cargandoDetalle = false;
    
            });
    
            break;

    }
  }

  public enviarFormulario() {
     
    this.submitEnviado = true;
    
    if(!this.habcontinuar){
    if (this.myForm.invalid) {
      
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o inválidos";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    this.alerta.iconType = "warning";

  }else{
    this.enviado.emit({
      type:"bancosCont"
    });
    
    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas continuar?";
    this.alerta.iconType = "warning";
    this.habcontinuar = false;
  }
}

public verdetalle(obj:any){
  
  this.datosempresa.idModificar = obj;
  this.enviado.emit({
    type:"cuentas"
  }); 

}

  public get f() {
    return this.myForm.controls;
  }


  ngOnChanges(changes: SimpleChanges) {
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      
      let obj = this.myForm.value;

      if(!this.datosempresa.insertar && this.obj.cuentaBancoId == undefined){
        this.insertarMof = true;
     }

      this.objenviar = 
          {
 
            usaStp: true,
            cuentaStp: obj.cuentaStp, 
            clabeStp: obj.clabeStp,
            nclCentrocCliente: {
              centrocClienteId: this.datosempresa.centrocClienteEmpresa
            }
          
      }

      if(this.insertarMof){
        this.cuentasPrd.save(this.objenviar).subscribe(datos =>{
          this.alerta.iconType = datos.resultado ? "success" : "error";
          this.alerta.strTitulo = datos.mensaje;
          this.alerta.modal = true;
          
            if(datos.resultado){
              this.mostrarSTP= true;
              this.enviado.emit({
                type:"cuentasBancarias"
              });
            }
        });
      }
      else if(this.datosempresa.insertar){
      this.cuentasPrd.save(this.objenviar).subscribe(datos =>{

        this.alerta.iconType = datos.resultado ? "success" : "error";
        this.alerta.strTitulo = datos.mensaje;
        this.alerta.modal = true;
        if(datos.resultado){
        this.mostrarSTP= true;
        this.enviado.emit({
          type:"cuentasBancarias"
        });
        this.habcontinuar= true;
        this.habGuardar=false;
        }
      });
      }else{
        this.objenviar.cuentaBancoId = this.obj.cuentaBancoId;
        this.cuentasPrd.modificar(this.objenviar).subscribe(datos =>{

          this.alerta.iconType = datos.resultado ? "success" : "error";
          this.alerta.strTitulo = datos.mensaje;
          this.alerta.modal = true;
          if(datos.resultado){
          this.mostrarSTP= true;
          this.enviado.emit({
            type:"cuentasBancarias"
          });
          this.habcontinuar= true;
          this.habGuardar=false;
          }
        });



      }
     }

  }

}
