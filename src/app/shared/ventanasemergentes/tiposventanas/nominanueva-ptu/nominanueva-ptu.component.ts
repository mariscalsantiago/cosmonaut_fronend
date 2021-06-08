import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/services/cuentasbancarias/cuentasbancarias.service';
import { UsuarioService } from 'src/app/modules/usuarios/services/usuario.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';

@Component({
  selector: 'app-nominanueva-ptu',
  templateUrl: './nominanueva-ptu.component.html',
  styleUrls: ['./nominanueva-ptu.component.scss']
})
export class NominanuevaPtuComponent implements OnInit {

  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true },
    { tab: false, form: false, disabled: false, seleccionado: false },
    { tab: false, form: false, disabled: false, seleccionado: false }];
  @Output() salida = new EventEmitter();

  public valor:string = "1";
  public cargandoIcon:boolean = false;
  public arregloMonedas: any = [];
  public cuentasBancarias: any = [];
  public arregloCompanias:any = [];
  public arregloareas:any = [];

  public arregloEmpleados:any = [];

  public myForm!: FormGroup;
  constructor(private formbuilder: FormBuilder, private modal: ModalService, private cuentasBancariasPrd:CuentasbancariasService,
    private catalogosPrd:CatalogosService,private usuariosPrd:UsuarioSistemaService,
    private companiasPrd: SharedCompaniaService,private areasPrd:SharedAreasService,
    private empleadosPrd: EmpleadosService,private nominaPrd:NominaptuService) { }
 
  ngOnInit(): void {

    this.catalogosPrd.getMonedas(true).subscribe(datos => this.arregloMonedas = datos.datos);
    this.cuentasBancariasPrd.getAllByEmpresa(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.cuentasBancarias = datos.datos);

    this.companiasPrd.getAllEmp(this.usuariosPrd.getIdEmpresa()).subscribe(datos => {

      this.arregloCompanias = datos.datos;

      if (this.usuariosPrd.getRol() == "ADMINEMPRESA") {
        this.arregloCompanias = [(this.usuariosPrd.getDatosUsuario().centrocClienteId)]
      }
    });



    this.areasPrd.getAreasByEmpresa(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.arregloareas = datos.datos);

    this.empleadosPrd.getEmpleadosCompania(this.usuariosPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloEmpleados = datos.datos
      for (let item of this.arregloEmpleados) {
        item["nombre"] = item.personaId?.nombre + " " + item.personaId?.apellidoPaterno;
      }
    });

    this.myForm = this.createEtapa1();
  }

  public createEtapa1() {
    return this.formbuilder.group({
      nombre: ['', Validators.required],
      bancoId:['',Validators.required],
      monedaId:['',Validators.required],
      centrocClienteId:['',Validators.required],
      fechaInicio:['',Validators.required],
      fechaFin:['',Validators.required],
    });
  }

  public backTab(index: number) {
    
    switch(index){
      case 0:
        this.activado[0].form = true;
        this.activado[0].seleccionado = true;
        this.activado[0].tab = true;
        this.activado[1].tab = false;
        this.activado[2].tab = false;
        this.activado[1].form = false;
        this.activado[2].form = false;
        break;
        case 1:
          this.activado[1].form = true;
          this.activado[1].seleccionado = true;
          this.activado[1].tab = true;
          this.activado[0].tab = false;
          this.activado[2].tab = false;
          this.activado[0].form = false;
          this.activado[2].form = false;

        break;
        case 3:
          this.activado[2].form = true;
          this.activado[2].seleccionado = true;
          this.activado[2].tab = true;
          this.activado[0].tab = false;
          this.activado[1].tab = false;
          this.activado[0].form = false;
          this.activado[1].form = false;
        break;
    }

  }


  public enviarEtapa1() {

    if (this.myForm.invalid) {

      this.modal.showMessageDialog(this.modal.error);
      Object.values(this.myForm.controls).forEach(controls => {
        controls.markAsTouched();
      });;
      return;
    }


    this.modal.showMessageDialog(this.modal.warning,"¿Deseas guardar la nòmina?").then(valor =>{
      if(valor){

        let obj = this.myForm.value;

        let objEnviar = {
          clienteId: this.usuariosPrd.getIdEmpresa(),
          usuarioId: this.usuariosPrd.getUsuario().idUsuario,
          nombreNomina: obj.nombre,
          cuentaBancoId: obj.bancoId,
          monedaId: obj.monedaId,
          fecIniPeriodo: obj.fechaInicio,
          fecFinPeriodo: obj.fechaFin
        };


        this.modal.showMessageDialog(this.modal.loading);
        this.nominaPrd.crearNomina(objEnviar).subscribe(datos =>{
          this.modal.showMessageDialog(this.modal.loadingfinish);
          this.cambiarTab({type:"etapa1",datos:true});
        });

          
      }
    });

  }

  public get f(){
    return this.myForm.controls;
  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  public cambiarTab(obj:any){
    
    for(let item of this.activado){
        item.form = false;
        item.seleccionado = false;
    }



    switch(obj.type){
      case "etapa1":
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        this.activado[1].tab = true;
        this.activado[0].seleccionado = true;
        break;
        case "etapa2":
          this.activado[2].form = true;
          this.activado[2].seleccionado = true;
          this.activado[2].tab = true;
          this.activado[1].tab = true;
        break;
    }
  }


  public seleccionarItem(){
    this.cambiarTab({type:"etapa2",datos:true});
  }

  public abrirArchivo()
  {


  }

  public recibirEtiquetas(obj:any){

  }

  

}
