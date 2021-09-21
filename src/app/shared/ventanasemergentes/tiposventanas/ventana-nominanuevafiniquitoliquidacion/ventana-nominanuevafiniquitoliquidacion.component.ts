import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-ventana-nominanuevafiniquitoliquidacion',
  templateUrl: './ventana-nominanuevafiniquitoliquidacion.component.html',
  styleUrls: ['./ventana-nominanuevafiniquitoliquidacion.component.scss']
})
export class VentanaNominaNuevaFiniquitoLiquidacionComponent implements OnInit {
  public myForm!: FormGroup;
  @Output() salida = new EventEmitter<any>();
  @ViewChild("fechafin") fechafin!: ElementRef;

  public arregloTipoNominas: any = [];
  public arregloCuentasBancarias: any = [];
  public arregloCompanias: any = [];
  public arregloEmpleados: any = [];
  public arregloMonedas: any = [];

  public mostrarAlgunosEmpleados: boolean = false;
  public seleccionarUsuariosCheck: boolean = false;
  public objEnviar: any = [];

  public arregloempleadosSeleccionados: any = null;



  constructor(private modalPrd: ModalService, private grupoNominaPrd: GruponominasService,
    private usuariosPrd: UsuarioSistemaService, private formbuilder: FormBuilder,
    private usuarioSistemaPrd: UsuarioSistemaService, private nominafiniquitoPrd: NominafiniquitoliquidacionService,
    private catalogosPrd: CatalogosService, private cuentasBancariasPrd: CuentasbancariasService,
    private companiasPrd: SharedCompaniaService, private empleadosPrd: EmpleadosService) { }

  ngOnInit(): void {


    this.myForm = this.creandoForm();

    this.suscripciones();


    this.catalogosPrd.getTiposNomina(true).subscribe(datos => this.arregloTipoNominas = datos.datos);
    this.cuentasBancariasPrd.getCuentaFuncion(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloCuentasBancarias = datos.datos);
    this.catalogosPrd.getMonedas(true).subscribe(datos => this.arregloMonedas = datos.datos);
  

    if(this.usuarioSistemaPrd.esCliente()){
      this.companiasPrd.getAllEmp(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
          this.arregloCompanias = datos.datos;
      });
    }else{
      this.companiasPrd.getEmpresaById(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos =>{
        this.arregloCompanias = [datos.datos];
      });
    }


    this.empleadosPrd.getEmpleadosFiniquitoByEmpresa(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloEmpleados = datos.datos;
      for (let item of this.arregloEmpleados) {
        item["nombre"] = item.personaId?.nombre + " " + item.personaId.apellidoPaterno+" "+(item.personaId.apellidoPaterno|| '');
      }
    });

  }

  public suscripciones() {
    this.f.todos.valueChanges.subscribe(valor => {
      this.mostrarAlgunosEmpleados = valor == "false";
    });
  }

  public creandoForm() {


    return this.formbuilder.group(
      {
        clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
        usuarioId: this.usuarioSistemaPrd.getUsuario().usuarioId,
        fecXReportes: [, [Validators.required]],
        nombreNomina: [, [Validators.required]],
        monedaId: [],
        centrocClienteId: [, Validators.required],
        cuentaBancoId: [, [Validators.required]],
        todos: ["true", Validators.required],
        personaId: []
      }
    );
  }


  public cancelar() {
    this.salida.emit({ type: "cancelar" });
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
        
        if (obj.todos == "false") {
          temp = [];
          for (let item of this.arregloempleadosSeleccionados) {
            temp.push({
                fecha_contrato: new DatePipe("es-MX").transform(item.fechaContrato, "yyyy-MM-dd"),
                persona_id: item.personaId.personaId,
                cliente_id: this.usuarioSistemaPrd.getIdEmpresa()
            });
          }
        }

        this.objEnviar = {
          clienteId: obj.clienteId,
          usuarioId: obj.usuarioId,
          nombreNomina: obj.nombreNomina,
          cuentaBancoId: obj.cuentaBancoId,
          todos: obj.todos == "true",
          monedaId: obj.monedaId,
          empleados: temp,
          fecXReportes:obj.fecXReportes,
          tipoNominaId:3
        };

        this.guardarNomina();
      }

    });
  }


  public guardarNomina() {
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.nominafiniquitoPrd.crearNomina(this.objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

      this.salida.emit({
        type: "guardar", datos: datos
      });
    });

  }


  public get f() {
    return this.myForm.controls;
  }

  public clonar(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }


  public recibirEtiquetas(obj: any) {

    this.arregloempleadosSeleccionados = obj;
    

  }

}
