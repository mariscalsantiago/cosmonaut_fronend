import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-editarmensaje-chat',
  templateUrl: './editarmensaje-chat.component.html',
  styleUrls: ['./editarmensaje-chat.component.scss']
})
export class EditarmensajeChatComponent implements OnInit {

  public myForm!:FormGroup;
  public arreglotipomensaje:any = [];
  @Output() salida = new EventEmitter<any>();

  constructor(private fb:FormBuilder,private modalPrd:ModalService) { }

  ngOnInit(): void {
    this.myForm = this.createForm();
  }


  public createForm(){
    return this.fb.group({
      tipomensaje:['',[Validators.required]],
      mensaje:['',[Validators.required]]
    });
  }

  public get f(){
    return this.myForm.controls;
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  public enviarPeticion(){
    if(this.myForm.invalid){

      Object.values(this.myForm.controls).forEach(control =>{
        control.markAsTouched();
      });

      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas guardar el mensaje predeterminado?").then(valor =>{
      if(valor){


        this.guardarMensaje();

        }
    });;


  }

  public guardarMensaje(){
    

    let obj = this.myForm.value;

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    setTimeout(() => {
      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      this.modalPrd.showMessageDialog(this.modalPrd.success,"Operacion guardado exitosamente").then(()=>{
        this.salida.emit({type:"guardar",datos:true});
      });
    }, 2000);
  
  }

}
