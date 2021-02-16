import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreferenciasService } from 'src/app/modules/empleados/services/preferencias.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.scss']
})
export class PreferenciasComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosPersona:any;

  

  public submitEnviado: boolean = false;

  public arregloPreferencias:any = [];

  constructor(private formBuilder: FormBuilder,private catalogosPrd:CatalogosService,
    private preferenciasPrd:PreferenciasService) { }


  ngOnInit(): void {

    



    this.catalogosPrd.getPreferencias().subscribe(datos =>{
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

    this.submitEnviado = true;
    
    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    this.alerta.strsubtitulo = "Esta apunto de guardar un empleado";
    this.alerta.iconType = "warning";

  }




  ngOnChanges(changes: SimpleChanges) {

    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      

      for(let item of this.arregloPreferencias){
        item.personaId = {
          personaId:this.datosPersona.personaId
        }
        this.preferenciasPrd.save(item).subscribe(datos =>{
          this.alerta.iconType = datos.resultado ? "success" : "error";

          this.alerta.strTitulo = datos.mensaje;
          this.alerta.strsubtitulo = datos.mensaje
          this.alerta.modal = true;
        });
      }
    }
  }
}
