import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasbancariasService } from 'src/app/modules/empresas/services/cuentasbancarias/cuentasbancarias.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

import { GruponominasService } from '../../services/gruponominas.service';

@Component({
  selector: 'app-detallegruponomina',
  templateUrl: './detallegruponomina.component.html',
  styleUrls: ['./detallegruponomina.component.scss']
})
export class DetallegruponominaComponent implements OnInit {
  @ViewChild("nombre") public nombre!:ElementRef;

  public myForm!:FormGroup;

  public submitInvalido:boolean = false;
  public esInsert:boolean = false;
  public id_empresa:number = 0;
  public activadoISR:boolean = false;

  public arregloEsquemaPago:any = [];
  public arregloCuentasBancarias:any = [];
  public arregloMonedas:any = [];
  public arreglocompany:any = [];
  public arregloPeriocidadPago:any = [];
  public arregloBasePeriodos:any = [];
  public arregloCatPeriodosAguinaldo:any = [];
  public obj:any = [];
  public ajustedeisr:boolean = false;
  public empresaRazon: string = '';



  constructor(private formbuilder:FormBuilder,private activeprd:ActivatedRoute,
    private routerPrd:Router,private grupoNominaPrd:GruponominasService,
    private catalogosPrd:CatalogosService,private cuentasBancariasPrd:CuentasbancariasService,
    private companiaPrd:SharedCompaniaService,private usuariosSistemaPrd:UsuarioSistemaService,
    private modalPrd:ModalService) { }

  ngOnInit(): void {

    
    this.activeprd.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      } else {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
      }


      this.cuentasBancariasPrd.getCuentaFuncion(this.id_empresa).subscribe(datos => this.arregloCuentasBancarias = datos.datos);



    });

    this.companiaPrd.getEmpresaById(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.arreglocompany = datos.datos;
      this.empresaRazon = this.arreglocompany.razonSocial;

      this.obj = {
        esquemaPagoId:{},
        monedaId:{},
        centrocClienteId:{},
        clabe:{},
        periodicidadPagoId:{},
        basePeriodoId:{},
        periodoAguinaldoId:{}
      }
  
      this.myForm = this.crearForm(this.obj);

    

    
    if(!this.esInsert){
      
      this.obj = history.state.data;
      
      if(this.obj == undefined){
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
          return;
      }else{
        this.grupoNominaPrd.getGroupNomina(this.obj.id).subscribe(datos =>{  
          this.myForm = this.crearForm(datos.datos);
  
        });;
  
      }
    }

    });


    //this.catalogosPrd.getEsquemaPago(true).subscribe(datos => this.arregloEsquemaPago = datos.datos);
    this.catalogosPrd.getMonedas(true).subscribe(datos => this.arregloMonedas = datos.datos);
    this.catalogosPrd.getPeriocidadPago(true).subscribe(datos => this.arregloPeriocidadPago = datos.datos);
    this.catalogosPrd.getBasePeriodos(true).subscribe(datos => this.arregloBasePeriodos = datos.datos);
    this.catalogosPrd.getCatPeriodoAguinaldo(true).subscribe(datos => this.arregloCatPeriodosAguinaldo = datos.datos);


    

  }

  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }

  public crearForm(obj:any){

    if(!this.esInsert){
      
      obj.maneraCalcularSubsidio = obj.maneraCalcularSubsidio == "P"?"periodica":"diaria";
      if(obj.ajustarBaseGravableFaltantes){
        this.ajustedeisr = true;
        this.activarISR();
      }
      obj.ajustarBaseGravableFaltantes = obj.ajustarBaseGravableFaltantes ? "true" : "false";

/*       if(obj.periodicidadPagoId?.periodicidadPagoId !== "01" && obj.periodicidadPagoId?.periodicidadPagoId !== "05" ){
        this.ajustedeisr = true;
        this.activarISR();
      } */

    }else{
      //obj.centrocClienteId.centrocClienteId = this.id_empresa;
      obj.maneraCalcularSubsidio = obj.maneraCalcularSubsidio = "periodica";
      obj.ajustarBaseGravableFaltantes = "false";

    }
    
    return this.formbuilder.group({

      nombre:[obj.nombre,[Validators.required]],
      //esquemaPagoId:[obj.esquemaPagoId?.esquemaPagoId,[Validators.required]],
      ajustarBaseGravableFaltantes: [obj.ajustarBaseGravableFaltantes],
      monedaId:[obj.monedaId?.monedaId,[Validators.required]],
      ajustedeisr: [this.ajustedeisr],
      centrocClienteId:[this.empresaRazon,[Validators.required]],
      clabe:[obj.cuentaBancoId?.cuentaBancoId,[Validators.required]],
      periodicidadPagoId:[obj.periodicidadPagoId?.periodicidadPagoId,[Validators.required]],
      basePeriodoId:[obj.basePeriodoId?.basePeriodoId,[Validators.required]],
      periodoAguinaldoId:[obj.periodoAguinaldoId?.periodoAguinaldoId,[Validators.required]],
      esIsrAguinaldoReglamento:obj.esIsrAguinaldoReglamento,
      maneraCalcularSubsidio:[obj.maneraCalcularSubsidio,[Validators.required]],
      pagoComplementario: [obj.pagoComplementario],
      grupoNominaId:obj.grupoNominaId

    });
  }


  public enviarPeticion(){
    

    this.submitInvalido = true;

    if (!this.myForm.valid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;
    }
    let titulo = (this.esInsert) ? "¿Deseas registrar un grupo de nómina?" : "¿Deseas actualizar los datos del grupo de nómina?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{


      if(valor){


        let obj = this.myForm.value;

        let subsidio = obj.maneraCalcularSubsidio == "periodica"?"P":"D";

        let peticion:any = {
          nombre:obj.nombre,
          esAutomatica:obj.esAutomatica,
          maneraCalcularSubsidio:subsidio,
          ajustarBaseGravableFaltantes: obj.ajustarBaseGravableFaltantes,
          monedaId:{monedaId:obj.monedaId},
          pagoComplementario: obj.pagoComplementario,
          centrocClienteId:{centrocClienteId:this.id_empresa},
          periodicidadPagoId:{periodicidadPagoId:obj.periodicidadPagoId},
          basePeriodoId:{basePeriodoId:obj.basePeriodoId},
          periodoAguinaldoId:{periodoAguinaldoId:obj.periodoAguinaldoId},
          esIsrAguinaldoReglamento:obj.esIsrAguinaldoReglamento,
          cuentaBancoId:{
            cuentaBancoId:obj.clabe
          }

        };

        
       
        if (this.esInsert) {
          
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.grupoNominaPrd.save(peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
              }
            });

          });
        } else {
                  
          peticion.grupoNominaId = obj.grupoNominaId;
          peticion.esActivo = true;

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.grupoNominaPrd.modificar(peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
              }
            });

          });

        }

      }


    });


  }

  public cancelar() {
    this.routerPrd.navigate(['/empresa/detalle', this.id_empresa, 'gruposnomina']);
  }

  get f(){
    return this.myForm.controls;
  }


  public activar(obj:any){
    
        this.activadoISR = obj.checked;
  }

  public activarISR(){
        this.activadoISR = true;
  }

}
