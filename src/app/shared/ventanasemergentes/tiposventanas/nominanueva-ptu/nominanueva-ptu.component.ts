import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

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

  public myForm!: FormGroup;
  constructor(private formbuilder: FormBuilder, private modal: ModalService) { }

  ngOnInit(): void {
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
        break;
        case "etapa2":
          this.activado[2].form = true;
          this.activado[2].seleccionado = true;
          this.activado[2].tab = true;
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
