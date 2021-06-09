import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

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

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  public myForm!: FormGroup;
  constructor(private formbuilder: FormBuilder, private modal: ModalService, private catalogosPrd:CatalogosService) { }
 
  ngOnInit(): void {

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
