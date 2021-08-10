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
  public razonSocial : string ="";
  public empleado: number = 0;
  public objEnviar: any = [];
  public arregloDispersion : any = [];
  public arregloTimbrado : any = [];
  public idDispersion : number = 0;
  public idTimbrado : number = 0;

  @Input() public datos:any;
  @Output() salida = new EventEmitter<any>();

  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private admintimbradoDispersion: AdminDispercionTimbradoService) 
  { }

  ngOnInit(): void {
    
    

    this.admintimbradoDispersion.getObtenerProveedores(this.datos.centrocClienteXproveedorId).subscribe(datos => {
        this.arregloProveedores = datos.datos;
        this.admintimbradoDispersion.getCatProveDispersion(true).subscribe(datos => this.arregloDispersion  = datos.datos);

        this.admintimbradoDispersion.getCatProveTimbrado(true).subscribe(datos => this.arregloTimbrado  = datos.datos);
    
        //this.myForm = this.createForm(this.arregloProveedores);
        this.razonSocial = this.arregloProveedores.centrocClienteId?.nombre
        if(this.arregloProveedores.proveedorDispersionId == undefined ){
          this.idDispersion =0;
        }else{
          this.idDispersion = this.arregloProveedores.proveedorDispersionId?.proveedorDispersionId;
        }
        if(this.arregloProveedores.proveedorTimbradoId == undefined ){
          this.idTimbrado =0;
        }else{
          this.idTimbrado = this.arregloProveedores.proveedorTimbradoId?.proveedorTimbradoId;
        }
      
    });


  }


  /* public createForm(obj: any) {
    
    if(obj.proveedorDispersionId == undefined ){
      this.idDispersion =0;
    }else{
      this.idDispersion = obj.proveedorDispersionId?.proveedorDispersionId;
    }
    if(obj.proveedorTimbradoId == undefined ){
      this.idTimbrado =0;
    }else{
      this.idTimbrado = obj.proveedorTimbradoId?.proveedorTimbradoId;
    }
    return this.formBuild.group({
      razonSocial: [obj.centrocClienteId?.nombre],
      dipersion: [this.idDispersion],
      timbrado:[this.idTimbrado]

    });

  } */



  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }
  


  public enviarPeticion(){
    
/*     if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    } */

    let mensaje =  "¿Deseas actualizar los proveedores?";
        
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
      
        if(valor){
          
          
         // let  obj = this.myForm.getRawValue();
            
            this.objEnviar = {
              clienteXproveedorId: this.arregloProveedores.centrocClienteXproveedorId,
              clienteId: this.arregloProveedores.centrocClienteId.centrocClienteId,
              dispersionId: this.idDispersion,
              timbradoId: this.idTimbrado
            };
                  
          
          this.salida.emit({type:"guardar",datos:this.objEnviar});
        }
      });
  }


}
