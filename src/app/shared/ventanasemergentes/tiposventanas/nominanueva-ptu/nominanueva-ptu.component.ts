import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-nominanueva-ptu',
  templateUrl: './nominanueva-ptu.component.html',
  styleUrls: ['./nominanueva-ptu.component.scss']
})
export class NominanuevaPtuComponent implements OnInit {

  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true },
    { tab: false, form: false, disabled: false, seleccionado: false },
    { tab: false, form: false, disabled: false, seleccionado: false }];
  @Output() salida = new EventEmitter();

  public valor:string = "1";
  public cargandoIcon:boolean = false;
  public arregloMonedas: any = [];
  public cuentasBancarias: any = [];

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
        this.activado[2].tab = false;
        this.activado[1].form = false;
        this.activado[2].form = false;
        break;
        case 1:
          this.activado[1].form = true;
          this.activado[1].seleccionado = true;
          this.activado[1].tab = true;
          this.activado[0].tab = false;
          this.activado[2].tab = false;
          this.activado[0].form = false;
          this.activado[2].form = false;

        break;
        case 3:
          this.activado[2].form = true;
          this.activado[2].seleccionado = true;
          this.activado[2].tab = true;
          this.activado[0].tab = false;
          this.activado[1].tab = false;
          this.activado[0].form = false;
          this.activado[1].form = false;
        break;
    }

  }


  public enviarEtapa1() {

    if (this.myForm.invalid) {

      this.modal.showMessageDialog(this.modal.error);
      Object.values(this.myForm.controls).forEach(controls => {
        controls.markAsTouched();
      });;
      return;
    }


    this.modal.showMessageDialog(this.modal.warning,"¿Deseas guardar la nòmina?").then(valor =>{
      if(valor){
          this.cambiarTab({type:"etapa1",datos:true});
      }
    });

  }

  public get f(){
    return this.myForm.controls;
  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  public cambiarTab(obj:any){
    
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
          this.activado[2].form = true;
          this.activado[2].seleccionado = true;
          this.activado[2].tab = true;
          this.activado[1].tab = true;
        break;
    }
  }


  public seleccionarItem(){
    this.cambiarTab({type:"etapa2",datos:true});
  }

  public abrirArchivo()
  {


  }

}
