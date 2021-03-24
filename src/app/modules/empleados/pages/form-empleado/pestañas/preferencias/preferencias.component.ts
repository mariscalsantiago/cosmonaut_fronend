import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreferenciasService } from 'src/app/modules/empleados/services/preferencias.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.scss']
})
export class PreferenciasComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() datosPersona:any;

  public arregloPreferencias:any = [];

  constructor(private formBuilder: FormBuilder,private catalogosPrd:CatalogosService,
    private preferenciasPrd:PreferenciasService,private modalPrd:ModalService) { }


  ngOnInit(): void {

    



    this.catalogosPrd.getPreferencias(true).subscribe(datos =>{
      let dd =   datos.datos;

      for(let item of dd){

        let obj:any = {
          valor:"",
          tipoPreferenciaId:item
          
        }
        
        this.arregloPreferencias.push(obj);
      }

    });
  }

  public createForm(obj: any) {

  

  }



 
  public cancelar() {

  }


  public enviarPreferencias() {

    const titulo  = "¿Deseas guardar cambios?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){
      

        for(let item of this.arregloPreferencias){
          item.personaId = {
            personaId:this.datosPersona.personaId
          }


        }

        this.enviado.emit({type:"preferencias"});
      }
    });

  }

}
