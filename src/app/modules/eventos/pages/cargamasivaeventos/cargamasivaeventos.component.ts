import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';


@Component({
  selector: 'app-cargamasivaeventos',
  templateUrl: './cargamasivaeventos.component.html',
  styleUrls: ['./cargamasivaeventos.component.scss']
})
export class CargaMasivaEventosComponent implements OnInit {

  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true },
    { tab: false, form: false, disabled: false, seleccionado: false }];
  @Output() salida = new EventEmitter();

  public valor:string = "1";
  public cargandoIcon:boolean = false;
  public cargando:boolean = false;
  public arregloMonedas: any = [];
  public cuentasBancarias: any = [];
  public listaErrores: boolean = false;
  public idEmpleado: number = 0;
  public idEmpresa : number = 0;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  public myForm!: FormGroup;
  constructor(private formbuilder: FormBuilder, private modalPrd: ModalService, 
    private catalogosPrd:CatalogosService, private usuarioSistemaPrd:UsuarioSistemaService,
    private reportesPrd: ReportesService) { }
 
  ngOnInit(): void {

    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();

    this.catalogosPrd.getMonedas(true).subscribe(datos => this.arregloMonedas = datos.datos);
    
    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => this.cuentasBancarias = datos.datos);

    this.myForm = this.createEtapa1();
  }

  public createEtapa1() {
    return this.formbuilder.group({
      nombre: ['', Validators.required],
      bancoId:['',Validators.required],
      monedaId:['',Validators.required]
    });
  }

  public backTab(index: number) {
    
    switch(index){
      case 0:
        this.activado[0].form = true;
        this.activado[0].seleccionado = true;
        this.activado[0].tab = true;
        this.activado[1].tab = false;
        this.activado[1].form = false;
        break;
        case 1:
          this.activado[1].form = true;
          this.activado[1].seleccionado = true;
          this.activado[1].tab = true;
          this.activado[0].tab = false;
          this.activado[0].form = false;

        break;

    }

  }

  public iniciarDescarga(){
    debugger;
    let obj = this.myForm.value;
    if(obj.tipoCargaId == '0' || obj.tipoCargaId == undefined){
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Debe seleccionar un formato a cargar");
    }else{

        debugger;
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

          let objEnviar : any = {
            
              idEmpresa: this.idEmpresa,
              tipoCargaId: obj.tipoCargaId
            

          }
          
            this.reportesPrd.getTipoFormatoEmpleado(objEnviar).subscribe(archivo => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
              const downloadLink = document.createElement("a");
              let fileName = `${"Formato carga masiva Empleados"}.xlsx`;
              
     
              downloadLink.href = linkSource;
              downloadLink.download = fileName;
              downloadLink.click();
            });

    }

  }
 
  public get f(){
    return this.myForm.controls;
  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  public cambiarTab(obj:any){
    debugger;
    for(let item of this.activado){
        item.form = false;
        item.seleccionado = false;
    }


    switch(obj.type){
      case "etapa1":
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        this.activado[1].tab = true;
        this.activado[0].seleccionado = true;
        break;
        case "etapa2":
          this.activado[1].tab = true;
          this.activado[1].form = true;
          this.activado[1].seleccionado = true;
          this.activado[0].seleccionado = false;
          this.activado[0].form = false;
          this.activado[0].tab = false;
        break;
    }
  }


  public seleccionarItem(){
    debugger;
    this.cambiarTab({type:"etapa2",datos:true});
  }

  public abrirArchivo()
  {


  }

  public agregar(){
    

  }


}
