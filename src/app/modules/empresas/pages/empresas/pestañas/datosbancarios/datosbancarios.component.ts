import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/services/cuentasbancarias/cuentasbancarias.service';


@Component({
  selector: 'app-datosbancarios',
  templateUrl: './datosbancarios.component.html',
  styleUrls: ['./datosbancarios.component.scss']
})
export class DatosbancariosComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosempresa:any;
  

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;
  public habcontinuar: boolean = false;
  public habGuardar: boolean = false;
  public actguardar: boolean = false;

  constructor(private formBuilder: FormBuilder,private cuentasPrd:CuentasbancariasService,
    private catalogosPrd:CatalogosService,private routerPrd:Router) { }

  ngOnInit(): void {

    let obj = {};
    this.myForm = this.createForm(obj);

  }

  public createForm(obj: any) {

    return this.formBuilder.group({
      cuentaStp: [obj.cuentaStp, [Validators.required,Validators.pattern('[0-9]+')]],
      clabeStp: [obj.clabeStp, [Validators.required,Validators.pattern(/^\d{18}$/)]],
    
    });

  }


  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);
  }

  public activar(){
     
    if(!this.actguardar){
    this.habGuardar= true;
    this.actguardar= true;
    }else{
    this.habGuardar = false;
    this.actguardar= false;
    }
  }

  public activarCont(){
    this.habcontinuar = true;
  }

  public enviarFormulario() {
     
    this.submitEnviado = true;
    
    if(!this.habcontinuar){
    if (this.myForm.invalid) {
      
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o inválidos";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    this.alerta.iconType = "warning";

  }else{
    this.enviado.emit({
      type:"bancosCont"
    });
    
    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas continuar?";
    this.alerta.iconType = "warning";
    this.habcontinuar = false;
  }
}

public verdetalle(obj:any){

  this.enviado.emit({
    type:"cuentas"
  }); 

}

  public get f() {
    return this.myForm.controls;
  }


  ngOnChanges(changes: SimpleChanges) {
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      

      let obj = this.myForm.value;
      let objenviar = 
          {
 
            usaStp: true,
            cuentaStp: obj.cuentaStp, 
            clabeStp: obj.clabeStp,
            nclCentrocCliente: {
              centrocClienteId: this.datosempresa.centrocClienteEmpresa
            }
          
      }

      this.cuentasPrd.save(objenviar).subscribe(datos =>{

        this.alerta.iconType = datos.resultado ? "success" : "error";

        this.alerta.strTitulo = datos.mensaje;
        //this.alerta.strsubtitulo = datos.mensaje
        this.alerta.modal = true;
        this.enviado.emit({
          type:"cuentasBancarias"
        });
        if(datos.resultado){
          this.habcontinuar= true;
          this.habGuardar=false;
          
        }
      });
     }

  }

}
