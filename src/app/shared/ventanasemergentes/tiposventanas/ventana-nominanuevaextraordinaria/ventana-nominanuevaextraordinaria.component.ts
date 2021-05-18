import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';


@Component({
  selector: 'app-ventana-nominanuevaextraordinaria',
  templateUrl: './ventana-nominanuevaextraordinaria.component.html',
  styleUrls: ['./ventana-nominanuevaextraordinaria.component.scss']
})
export class VentanaNominanuevaextraordinariaComponent implements OnInit {

  public myForm!: FormGroup;
  @Output() salida = new EventEmitter<any>();
  @ViewChild("fechafin") fechafin!: ElementRef;


  public arregloTipoNominas:any = [];
  public arregloCuentasBancarias:any =  [];
  public arregloCompanias:any = [];
  public arregloEmpleados:any = [];
  public arregloMonedas:any = [];

  public mostrarAlgunosEmpleados:boolean = false;
  public seleccionarUsuariosCheck:boolean = false;
  public objEnviar: any = []; 
  public tiponomina: number = 0;

  public empleadoEnviar:any = [];

  

  constructor(private modalPrd: ModalService, private grupoNominaPrd: GruponominasService,
    private usuariosPrd: UsuarioSistemaService, private formbuilder: FormBuilder,
    private usuarioSistemaPrd: UsuarioSistemaService, private nominaAguinaldoPrd:NominaaguinaldoService,
    private catalogosPrd:CatalogosService,private cuentasBancariasPrd:CuentasbancariasService,
    private companiasPrd:SharedCompaniaService,private empleadosPrd:EmpleadosService) { }

  ngOnInit(): void {
    
    
  


    this.catalogosPrd.getTiposNomina(true).subscribe(datos => {
      this.arregloTipoNominas = datos.datos
      for(let item of this.arregloTipoNominas){
        if(item.tipoNominaId == 2){
          this.tiponomina = item.tipoNominaId;
          
        }
      }
      this.myForm = this.creandoForm();

    });
    this.cuentasBancariasPrd.getCuentaBancariaByEmpresa(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloCuentasBancarias = datos.datos)
    this.catalogosPrd.getMonedas(true).subscribe(datos => this.arregloMonedas = datos.datos );
    this.companiasPrd.getAllEmp(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {

      this.arregloCompanias = datos.datos;

      if(this.usuarioSistemaPrd.getRol() == "ADMINEMPRESA"){
          this.arregloCompanias = [this.clonar(this.usuarioSistemaPrd.getDatosUsuario().centrocClienteId)]
      }});
      this.suscripciones();

      this.empleadosPrd.getEmpleadosCompania(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
        this.arregloEmpleados = datos.datos
        for(let item of this.arregloEmpleados){
          item["nombre"] = item.personaId?.nombre + " "+item.personaId?.apellidoPaterno;
      }
      
      });
    
  }

  public suscripciones() {
    


  

    /*this.f.fechaIniPeriodo.valueChanges.subscribe(valor => {
      if (this.f.fechaIniPeriodo.valid) {
        this.f.fechaFinPeriodo.enable();
        this.fechafin.nativeElement.min = valor;
      } else {
        this.f.fechaFinPeriodo.disable();
        this.f.fechaFinPeriodo.setValue("");
      }
    });*/


    /*this.f.tipoNominaId.valueChanges.subscribe(valor =>{
     this.seleccionarUsuariosCheck = valor == 2;
     this.mostrarAlgunosEmpleados = valor == 7 || valor == 4;
    });


    this.f.seleccionarempleados.valueChanges.subscribe(valor =>{
      this.mostrarAlgunosEmpleados = valor == "2";
    });*/



  }

  public validarEmpleados(id:any){
    
     if (id == 2){
      this.mostrarAlgunosEmpleados= true;
     }else{
      this.mostrarAlgunosEmpleados= false;

     }
  }


  public creandoForm() {

    return this.formbuilder.group(
      {
        clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
        usuarioId: this.usuarioSistemaPrd.getUsuario().idUsuario,
        //fechaIniPeriodo: [, [Validators.required]],
        //fechaFinPeriodo: [{ value: '', disabled: false }, [Validators.required]],
        nombreNomina: [, [Validators.required]],
        monedaId: [],
        centrocClienteId: [],
        tipoNominaId:[this.tiponomina],
        clabe:[,[Validators.required]],
        seleccionarempleados:["1"],
        personaId:[]
      }
    );
  }


  public cancelar() {
    this.salida.emit({ type: "cancelar" });
  }


  public guardar() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas registrar la nómina?").then(valor => {
      if (valor) {
        this.salida.emit({ type: "guardar", datos: valor });
      }
    });
  }


  public enviarPeticion() {
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas crear la  nómina?").then(valor => {
      if (valor) {
        let  obj = this.myForm.getRawValue();
        
          this.objEnviar = {
            clienteId: obj.clienteId,
            usuarioId: obj.usuarioId,
            nombreNomina: obj.nombreNomina,
            cuentaBancoId: obj.clabe,
            //tipoNominaId: obj.tipoNominaId,
            todos: true,
            monedaId: obj.monedaId,
            empleados: null
          };
        this.guardarNomina();
      }

    });
  }


  public guardarNomina() {
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.nominaAguinaldoPrd.crearNomina(this.objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      
      this.salida.emit({
        type: "guardar", datos: datos
      });
    });

  }


  public get f() {
    return this.myForm.controls;
  }

  public clonar(obj:any){
    return JSON.parse(JSON.stringify(obj));
  }


  public recibirEtiquetas(evento:any){
      this.empleadoEnviar = evento;
      
  }

}
