import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasbancariasService } from 'src/app/modules/empresas/services/cuentasbancarias/cuentasbancarias.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';

import { GruponominasService } from '../../services/gruponominas.service';

@Component({
  selector: 'app-detallegruponomina',
  templateUrl: './detallegruponomina.component.html',
  styleUrls: ['./detallegruponomina.component.scss']
})
export class DetallegruponominaComponent implements OnInit {

  public modal:boolean = false;
  public strTitulo:string = "";
  public iconType:string = "";
  public strsubtitulo:string = "";

  public myForm!:FormGroup;

  public submitInvalido:boolean = false;
  public esInsert:boolean = false;
  public id_empresa:number = 0;
  public activadoISR:boolean = false;

  public arregloEsquemaPago:any = [];
  public arregloCuentasBancarias:any = [];
  public arregloMonedas:any = [];
  public arreglocompany:any = [];



  constructor(private formbuilder:FormBuilder,private activeprd:ActivatedRoute,
    private routerPrd:Router,private grupoNominaPrd:GruponominasService,
    private catalogosPrd:CatalogosService,private cuentasBancariasPrd:CuentasbancariasService,
    private companiaPrd:SharedCompaniaService) { }

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


      this.cuentasBancariasPrd.getAllByEmpresa(this.id_empresa).subscribe(datos => this.arregloCuentasBancarias = datos.datos);
    });

    let obj:any = {
      esquemaPagoId:{},
      monedaId:{},
      centrocClienteId:{},
      clabe:{},
      periodicidadPagoId:{},
      basePeriodoId:{},
      periodoAguinaldoId:{}
    }

    this.myForm = this.crearForm(obj);
    
    if(!this.esInsert){
      obj = history.state.data;
      if(obj == undefined){
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
          return;
      }else{
        this.grupoNominaPrd.getGroupNomina(obj.id).subscribe(datos =>{  
          this.myForm = this.crearForm(datos.datos);
  
        });;
  
      }
    }


    this.catalogosPrd.getEsquemaPago().subscribe(datos => this.arregloEsquemaPago = datos.datos);
    this.catalogosPrd.getMonedas().subscribe(datos => this.arregloMonedas = datos.datos);

    this.companiaPrd.getAllCompany().subscribe(datos => this.arreglocompany = datos.datos);

    

  }

  public crearForm(obj:any){

    if(!this.esInsert){
      obj.maneraCalcularSubsidio = obj.maneraCalcularSubsidio == "P"?"periodica":"diaria";
      obj.esAutomatica = `${obj.esAutomatica}`
      obj.clabe.clabe = `${obj.clabe.clabe}`
    }
    
    return this.formbuilder.group({

      nombre:[obj.nombre,[Validators.required]],
      esquemaPagoId:[obj.esquemaPagoId.esquemaPagoId,[Validators.required]],
      monedaId:[obj.monedaId.monedaId,[Validators.required]],
      centrocClienteId:[obj.centrocClienteId.centrocClienteId,[Validators.required]],
      clabe:[obj.clabe.clabe,[Validators.required]],
      periodicidadPagoId:[obj.periodicidadPagoId.periodicidadPagoId,[Validators.required]],
      basePeriodoId:[obj.basePeriodoId.basePeriodoId,[Validators.required]],
      periodoAguinaldoId:[obj.periodoAguinaldoId.periodoAguinaldoId,[Validators.required]],
      isrAguinaldoReglamento:obj.isrAguinaldoReglamento,
      maneraCalcularSubsidio:[obj.maneraCalcularSubsidio,[Validators.required]],
      esAutomatica:[obj.esAutomatica,[Validators.required]],
      grupoNominaId:obj.grupoNominaId

    });
  }


  public recibir($event: any) {


    this.modal = false;


    if (this.iconType == "warning") {


      if ($event) {

        let obj = this.myForm.value;

        let subsidio = obj.maneraCalcularSubsidio == "periodica"?"P":"D";

        let peticion:any = {
          nombre:obj.nombre,
          esAutomatica:obj.esAutomatica,
          maneraCalcularSubsidio:subsidio,
          esquemaPagoId:{esquemaPagoId:obj.esquemaPagoId},
          monedaId:{monedaId:obj.monedaId},
          centrocClienteId:{centrocClienteId:obj.centrocClienteId},
          clabe:{clabe:obj.clabe},
          periodicidadPagoId:{periodicidadPagoId:obj.periodicidadPagoId},
          basePeriodoId:{basePeriodoId:obj.basePeriodoId},
          periodoAguinaldoId:{periodoAguinaldoId:obj.periodoAguinaldoId},
          isrAguinaldoReglamento:obj.isrAguinaldoReglamento,

        };

    


       
        if (this.esInsert) {

          peticion.centrocClienteId.centrocClienteId = this.id_empresa;


          this.grupoNominaPrd.save(peticion).subscribe(datos => {
            console.log("Esto despues de guardar");
            console.log(datos);

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.strsubtitulo = datos.mensaje
            this.modal = true;

          });
        } else {

          peticion.grupoNominaId = obj.grupoNominaId;
          peticion.esActivo = true;

          this.grupoNominaPrd.modificar(peticion).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.strsubtitulo = datos.mensaje
            this.modal = true;

          });

        }

      }


    } else {
      this.modal = false;

      if (this.iconType == "success") {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
      }
    }
  }


  public enviarPeticion(){



    if (!this.myForm.valid) {

      this.strTitulo = "Campos inválidos, Favor de verificar";
      this.strsubtitulo = "Algunos campos son incorrectos.";
      this.iconType = "error";
      this.modal = true;
      this.submitInvalido = true;

      return;
    }


    this.iconType = "warning";
    this.strTitulo = (this.esInsert) ? "¿Deseas registrar el usuario?" : "¿Deseas actualizar el usuario?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.modal = true;

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

}
