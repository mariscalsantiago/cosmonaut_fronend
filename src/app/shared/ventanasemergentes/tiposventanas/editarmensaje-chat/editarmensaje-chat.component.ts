import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ChatSocketService } from 'src/app/shared/services/chat/ChatSocket.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-editarmensaje-chat',
  templateUrl: './editarmensaje-chat.component.html',
  styleUrls: ['./editarmensaje-chat.component.scss']
})
export class EditarmensajeChatComponent implements OnInit {

  public myForm!:FormGroup;
  public arreglotipomensaje:any = [];
  @Output() salida = new EventEmitter<any>();


  constructor(private fb:FormBuilder,private modalPrd:ModalService,private catalogosPrd:CatalogosService,
    private socketPrd:ChatSocketService,private usuariosSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {
    this.myForm = this.createForm();
    this.catalogosPrd.getListaTipoMensaje().subscribe(datos=>this.arreglotipomensaje = datos.datos);
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
    
      
          let objEnviar = {
            mensajeGenerico:obj.mensaje,
            tipoMensajeId:{
              tipoMensajeId:obj.tipomensaje
            },
            centrocClienteId:{
              centrocClienteId:this.usuariosSistemaPrd.getIdEmpresa()
            },
            personaId:{
              personaId:this.usuariosSistemaPrd.usuario.usuarioId
            }
          }

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.socketPrd.guardarMensajeGenerico(objEnviar).subscribe((datos)=>{
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(() =>{
                if(datos.resultado){
                  this.salida.emit({type:"guardar",datos:true});
                }
            });
          });
      
    

    
   
  
  }

}
