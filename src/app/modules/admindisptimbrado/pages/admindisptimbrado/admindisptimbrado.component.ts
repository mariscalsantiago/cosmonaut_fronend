import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { AdminDispercionTimbradoService } from 'src/app/modules/admindisptimbrado/services/admindisptimbrado.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { CompanyService } from 'src/app/modules/company/services/company.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindisptimbrado',
  templateUrl: './admindisptimbrado.component.html',
  styleUrls: ['./admindisptimbrado.component.scss']
})

export class AdminDispercionTimbradoComponent implements OnInit {

  public empresa: string = "";
  public myForm!: FormGroup;
  public idEmpresa: number = 0;
  public arreglo: any = [];
  public cargandoIcon: boolean = false;
  public cargando: boolean = false;
  public objFiltro: any = [];
  public nombre: string = "";
  public cliente: string = "";
  public empresaFiltro: string = "";
  public aparecemodalito: boolean = false;
  public aparecemodalitoTimbrado: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public tamanio: number = 0;
  public cargandolistatimbres: boolean = false;  
  public arreglotimbres: any = [];
  public arregloCompania: any = [];
  public arreglotimbresProveedores : any = [];
  public arreglotimbresProveedoresTab : any = [];
  public arregloEmpresa : any = [];
  public idEmpresaFiltro : number = 0;
  public idCliente : number = 0;


  public arreglotabla: any = {
    columnas: [],
    filas: []
  }
  public arreglotablaDesglose:any = {
      columnas:[],
      filas:[]
  };

  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;

  public modulo: string = "";
  public subModulo: string = "";

  constructor(private ventana: VentanaemergenteService,private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService,private formBuild: FormBuilder, private admintimbradoDispersion: AdminDispercionTimbradoService,
    public configuracionPrd:ConfiguracionesService, private companyPrd: CompanyService, private router: Router) { }

  ngOnInit() {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();
    
   this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();
   this.establecerPermisos();
   this.companyPrd.getAllSimple().subscribe(datos => this.arregloCompania = datos.datos);
   this.companyPrd.getAllEmpSimple().subscribe(datos => this.arregloEmpresa = datos.datos);
  
   
    this.filtrar();
    let obj: any  = [];
    this.myForm = this.createForm(obj);
  }

  public traerTabla(obj:any) {
    

    this.arreglo = obj.datos;

    const columnas: Array<tabla> = [
      new tabla("clienteId", "ID Cliente"),
      new tabla("cliente", "Cliente"),
      new tabla("empresaId", "ID Empresa"),
      new tabla("empresa", "Empresa"),
      new tabla("rfc", "RFC"),
    ];


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }
 
    
    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }

  public createForm(obj: any) {

     return this.formBuild.group({
  
        empresa: [this.empresa],
        dipersion: [],
        timbrado: [],
  
      });
  
    }

  public traerModal(indice: any) {
    
    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalito = true;



    if (elemento.getBoundingClientRect().y < -40) {
      let numero = elemento.getBoundingClientRect().y;
      numero = Math.abs(numero);

      this.scrolly = numero + 100 + "px";


    } else {

      this.scrolly = "5%";
    }



    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }


    this.cargandolistatimbres = true;
    this.arreglotimbresProveedoresTab =[];
    this.admintimbradoDispersion.getTimbresActivos().subscribe(datos => {
      this.arreglotimbres = datos.datos == undefined ? [] : datos.datos;
      for(let item of this.arreglotimbres){
         for(let itemTimbres of item.contenido){

          this.arreglotimbresProveedores = {
            timbres_disponibles: itemTimbres.timbres_disponibles  
          }
          for(let itemProveedor of item.resultado_servicio){

            this.arreglotimbresProveedores = {
              ...this.arreglotimbresProveedores,
              proveedor: itemProveedor.servicio 
            }
          }  

          this.arreglotimbresProveedoresTab.push(this.arreglotimbresProveedores);
        }
      } 

      this.cargandolistatimbres = false;
    });

  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionPrd.getPermisos("Eliminar");
  }

  public listaEmpresa(){
    
    this.objFiltro = [];
    this.arregloEmpresa = [];

    this.objFiltro = {
      clienteId: this.idCliente

    };

    this.admintimbradoDispersion.proveedoresTimbres(this.objFiltro).subscribe(datos => {

     if(datos.datos !== undefined){
       this.arregloEmpresa = datos.datos;
    }
    
    
  });
  }

  public recibirTabla(obj:any){
    
    if(obj.type == "editar"){
      let datos = obj.datos;
      this.ventana.showVentana(this.ventana.adminTimbradoDispersion,{datos:datos}).then(valor =>{
        if (valor.datos) {

          this.modificarProveedores(valor.datos);
        }
      });
     
    }
  }

  public modificarProveedores(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.admintimbradoDispersion.modificarProveedores(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);

    });
  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public filtrar() {
    
    this.objFiltro = [];
    if(this.idEmpresaFiltro != 0){
      this.objFiltro = {
        ...this.objFiltro,
        empresaId: this.idEmpresaFiltro
      };
    }
    if(this.idCliente != 0){
      this.objFiltro = {
        ...this.objFiltro,
        clienteId: this.idCliente
      };
    }else{
    this.objFiltro = {
      ...this.objFiltro,
      clienteId: null,

    };
    }
    
      this.admintimbradoDispersion.proveedoresTimbres(this.objFiltro).subscribe(datos => {
        
        this.traerTabla(datos);
      });
  
    }

  }



