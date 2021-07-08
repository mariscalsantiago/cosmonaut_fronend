import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef, Input} from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDispercionTimbradoService } from 'src/app/modules/admindisptimbrado/services/admindisptimbrado.service';

@Component({
  selector: 'app-ventana-adminTimDisper',
  templateUrl: './ventana-adminTimDisper.component.html',
  styleUrls: ['./ventana-adminTimDisper.component.scss']
})
export class VentanaAdminTimbradoDispersionComponent implements OnInit {

  public myForm!: FormGroup;
  public esInsert: boolean = false;
  public nomDocumento: boolean = false;
  public arregloProveedores: any = [];
  public empresa: number = 0;
  public empleado: number = 0;
  public objEnviar: any = [];
  public arregloDispersion : any = [];
  public arregloTimbrado : any = [];

  @Input() public datos:any;
  @Output() salida = new EventEmitter<any>();

  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private admintimbradoDispersion: AdminDispercionTimbradoService) 
  { }

  ngOnInit(): void {
    
    

    this.admintimbradoDispersion.getObtenerProveedores(this.datos.centrocClienteXproveedorId).subscribe(datos => {
        this.arregloProveedores = datos.datos;
        this.admintimbradoDispersion.getCatProveDispersion(true).subscribe(datos => this.arregloDispersion  = datos.datos);

        this.admintimbradoDispersion.getCatProveTimbrado(true).subscribe(datos => this.arregloTimbrado  = datos.datos);
    
        this.myForm = this.createForm(this.arregloProveedores);
      
    });


  }


  public createForm(obj: any) {
    

    return this.formBuild.group({

      empresa: [obj.centrocClienteId.nombre],
      dipersion: [obj.proveedorDispersionId.proveedorDispersionId],
      timbrado:[obj.proveedorTimbradoId.proveedorTimbradoId]

    });

  }



  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }
  


  public enviarPeticion(){
    
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    let mensaje =  "¿Deseas actualizar los proveedores?";
    //let mensaje = this.datos.esInsert? "¿Deseas guardar el documento" : "¿Deseas actualizar el documento?";/
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
      
        if(valor){
          
          
          let  obj = this.myForm.getRawValue();
            this.objEnviar = {
              clienteXproveedorId: this.arregloProveedores.centrocClienteXproveedorId,
              clienteId: this.arregloProveedores.centrocClienteId.centrocClienteId,
              dispersionId: obj.dipersion,
              timbradoId: obj.timbrado
            };
                  
          
          this.salida.emit({type:"guardar",datos:this.objEnviar});
        }
      });
  }


}
