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

  @Input() public datos:any;
  @Output() salida = new EventEmitter<any>();

  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private admintimbradoDispersion: AdminDispercionTimbradoService) 
  { }

  ngOnInit(): void {
    debugger;
    

    if(this.datos.esInsert){
      this.empresa = this.datos.idEmpresa;
      this.empleado = this.datos.idEmpleado;
    
    }else{

      this.empresa = this.datos.centrocClienteId;
      this.empleado = this.datos.personaId;
    }


    this.admintimbradoDispersion.getObtenerProveedores(this.datos.centrocClienteXproveedorId).subscribe(datos => {
        this.arregloProveedores = datos.datos;
        this.myForm = this.createForm(this.arregloProveedores);
      
    });

    this.myForm = this.createForm(this.arregloProveedores);
  }


  public createForm(obj: any) {
    

    return this.formBuild.group({

      empresa: [obj.centrocClienteId.nombre],
      dipersion: [obj.proveedorDispersionId.descripcion],
      timbrado:[obj.proveedorTimbradoId.descripcion]

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
          debugger;
          
          let  obj = this.myForm.getRawValue();
          
          //if(this.datos.esInsert){
            this.objEnviar = {
              clienteXproveedorId: this.arregloProveedores.centrocClienteXproveedorId,
              clienteId: this.arregloProveedores.centrocClienteId.centrocClienteId,
              dispersionId: this.arregloProveedores.proveedorDispersionId.proveedorDispersionId,
              timbradoId: this.arregloProveedores.proveedorTimbradoId.proveedorTimbradoId
            };
                  
        //}else{

            //this.objEnviar = {
            //cmsArchivoId: this.datos.cmsArchivoId,
            //centrocClienteId: this.empresa,
            //personaId: this.empleado,
            //usuarioId: this.empleado,
            //documentosEmpleadoId: obj.idTipoDocumento,
            //nombreArchivo: obj.nombre,
            //documento: obj.documento
            //};

        //}
          
          this.salida.emit({type:"guardar",datos:this.objEnviar});
        }
      });
  }


}
