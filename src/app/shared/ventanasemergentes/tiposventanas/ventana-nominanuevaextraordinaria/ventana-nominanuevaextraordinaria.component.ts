import { DatePipe } from '@angular/common';
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

  public monedaPeso: number = 1;
  public arregloTipoNominas: any = [];
  public arregloCuentasBancarias: any = [];
  public arregloCompanias: any = [];
  public arregloEmpleados: any = [];
  public arregloMonedas: any = [];

  public mostrarAlgunosEmpleados: string = "";
  public seleccionarUsuariosCheck: boolean = false;
  public objEnviar: any = [];
  public tiponomina: number = 2;

  public empleadoEnviar: any = [];
  public arreglogruponominas:any = [];



  constructor(private modalPrd: ModalService, private grupoNominaPrd: GruponominasService,
    private usuariosPrd: UsuarioSistemaService, private formbuilder: FormBuilder,
    private usuarioSistemaPrd: UsuarioSistemaService, private nominaAguinaldoPrd: NominaaguinaldoService,
    private catalogosPrd: CatalogosService, private cuentasBancariasPrd: CuentasbancariasService,
    private companiasPrd: SharedCompaniaService, private empleadosPrd: EmpleadosService,private gruponominaPrd: GruponominasService) { }

  ngOnInit(): void {
    this.myForm = this.creandoForm();
    this.gruponominaPrd.getAll(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.arreglogruponominas = datos.datos);

    this.catalogosPrd.getTiposNomina(true).subscribe(datos => {
      this.arregloTipoNominas = datos.datos;    
    });
    this.cuentasBancariasPrd.getCuentaFuncion(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloCuentasBancarias = datos.datos);
    this.catalogosPrd.getMonedas(true).subscribe(datos => this.arregloMonedas = datos.datos);


    

    if(this.usuariosPrd.esCliente()){
      
      this.companiasPrd.getAllEmp(this.usuariosPrd.getIdEmpresa()).subscribe(datos => {
          //this.arregloCompanias = datos.datos;
          this.myForm.controls.centrocClienteId.setValue(datos.datos.razonSocial);
      });
    }else{
      this.companiasPrd.getEmpresaById(this.usuariosPrd.getIdEmpresa()).subscribe(datos =>{
        //this.arregloCompanias = [datos.datos];
        this.myForm.controls.centrocClienteId.setValue(datos.datos.razonSocial);
      
      });
    }

    this.suscripciones();

    this.empleadosPrd.getEmpleadosAguinaldoByEmpresa(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloEmpleados = datos.datos
      for (let item of this.arregloEmpleados) {
        item["nombre"] = item.personaId?.nombre + " " + item.personaId?.apellidoPaterno+" "+(item.personaId?.apellidoMaterno|| '');
      }
    });

  }

  public suscripciones() {
      this.myForm.controls.seleccionarempleados.valueChanges.subscribe(valor =>{
         this.mostrarAlgunosEmpleados = valor;
         this.myForm.controls.grupoNomina.setValue("");
      });
  }




  public creandoForm() {


    return this.formbuilder.group(
      {
        clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
        usuarioId: this.usuarioSistemaPrd.getUsuario().usuarioId,
        nombreNomina: [, [Validators.required]],
        monedaId: [this.monedaPeso, [Validators.required]],
        centrocClienteId: [, [Validators.required]],
        tipoNominaId: [this.tiponomina],
        clabe: [, [Validators.required]],
        seleccionarempleados: ["1",[Validators.required]],
        personaId: [],
        grupoNomina:[]
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
        let obj = this.myForm.getRawValue();
        

        let temp = null;
        if(obj.seleccionarempleados == "3"){
          temp = [];
              for(let item of this.empleadoEnviar){
              
                temp.push({
                  fecha_contrato:new DatePipe("es-MX").transform(item.fechaContrato,"yyyy-MM-dd"),
                  persona_id:item.personaId.personaId,
                  cliente_id:this.usuarioSistemaPrd.getIdEmpresa()});
            }  
        }

        this.objEnviar = {
          clienteId: obj.clienteId,
          usuarioId: obj.usuarioId,
          nombreNomina: obj.nombreNomina,
          cuentaBancoId: obj.clabe,
          todos: obj.seleccionarempleados == '1' || obj.seleccionarempleados == '2',
          monedaId: obj.monedaId,
          empleados: temp,
          tipoNominaId:obj.tipoNominaId,
          grupoNominaId:obj.grupoNomina
        };
        this.guardarNomina();
      }

    });
  }


  public guardarNomina() {
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    
    this.nominaAguinaldoPrd.crearNomina(this.objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
        if(datos.resultado){
          this.salida.emit({
            type: "guardar", datos: datos
          });
        }
      })
      
    });

  }


  public get f() {
    return this.myForm.controls;
  }

  public clonar(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }


  public recibirEtiquetas(evento: any) {
    
    this.empleadoEnviar = evento;

  }

}
