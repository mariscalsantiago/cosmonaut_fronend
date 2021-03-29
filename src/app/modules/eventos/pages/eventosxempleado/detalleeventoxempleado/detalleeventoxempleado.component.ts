import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from '../../../../empleados/services/empleados.service';

@Component({
  selector: 'app-detalleeventoxempleado',
  templateUrl: './detalleeventoxempleado.component.html',
  styleUrls: ['./detalleeventoxempleado.component.scss']
})
export class DetalleeventoxempleadoComponent implements OnInit {

  public myForm!:FormGroup;
  public submitEnviado:boolean = false;
  public arregloIncidenciaTipo:any = [];
  public arregloEmpleados:any = [];

  constructor(private modalPrd:ModalService,private catalogosPrd:CatalogosService,private formbuilder:FormBuilder,private usuarioSistemaPrd:UsuarioSistemaService,
    private empleadosPrd:EmpleadosService,private router:Router) { }

  ngOnInit(): void {

    this.myForm = this.createForms({});
    this.catalogosPrd.getTipoIncidencia(true).subscribe(datos => this.arregloIncidenciaTipo = datos.datos);;
    let objenviar =  {
      centrocClienteId: {
          centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
      esActivo:"true"
  }

    this.empleadosPrd.filtrar(objenviar).subscribe(datos => this.arregloEmpleados = datos.datos);

  }

  public createForms(obj:any){
     return this.formbuilder.group({
      tipoIncidenciaId:['',[Validators.required]],
      idPersona:['',[Validators.required]]
     });
  }


  public get f(){
    return this.myForm.controls;
  }

  public enviarPeticion(){

    this.submitEnviado = true;
    if(this.myForm.invalid){
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

  }


  public cancelar(){
    this.router.navigate(['/eventos/eventosxempleado']);
  }

  public abrirArchivo(){
    
  }

}
