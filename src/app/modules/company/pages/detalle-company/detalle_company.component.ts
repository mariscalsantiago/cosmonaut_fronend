import { DatePipe } from '@angular/common';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { UsuarioService } from 'src/app/modules/usuarios/services/usuario.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { VersionesService } from 'src/app/shared/services/versiones/versiones.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-detalle-company',
  templateUrl: './detalle-company.component.html',
  styleUrls: ['./detalle-company.component.scss']
})
export class DetalleCompanyComponent implements OnInit {
  @ViewChild("nombre") nombre: any;

  public myFormcomp!: FormGroup;
  public arreglo: any = [];
  public contacto: boolean = false;
  public listcontacto: boolean = false;
  public compania: boolean = true;
  public companiaprincipal: boolean = true;
  public insertar: boolean = false;

  public objcont: any;
  public fechaAlta: string = "";
  public cargando: Boolean = false;
  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public objCompany: any;
  public submitEnviado: boolean = false;
  public imagen: any = undefined;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public cargandoImg:boolean = false;

  public arregloVersiones:any = [];
  public arregloVersionesInicial:any = [];

  public versionEmpresa={
    versionCosmonautXclienteId:undefined
  };


  constructor(private formBuilder: FormBuilder, private companyPrd: CompanyService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private usuariosPrd: UsuarioService,private modalPrd:ModalService,private versionesPrd:VersionesService,
    private authUsuariosPrd:UsuariosauthService,private usuariosSistemaPrd:UsuarioSistemaService,public configuracionPrd:ConfiguracionesService) {
  }

  ngOnInit(): void {  
    
    
    this.objCompany = history.state.datos == undefined ? {} : history.state.datos;
    this.compania = true;

    this.cargandoImg = true;
    
    this.versionesPrd.getVersiones(true).subscribe(datos => {
      
      this.arregloVersionesInicial = datos.datos;

      for(let item of this.arregloVersionesInicial){
        if (item.versionCosmonautId == 1)
            continue;
            this.arregloVersiones.push(item);
      } 
    
    });
   

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      if (!this.insertar) {

      

        this.companyPrd.getEmpresaById(this.objCompany.centrocClienteId).subscribe(datos => {
          this.cargandoImg = false;
          this.imagen = datos.datos?.imagen;
          
        });
        this.listaContacto();
        this.listcontacto = true;
      }else{
        this.cargandoImg = false;
      }

      if(this.objCompany.centrocClienteId != undefined){
      this.authUsuariosPrd.getVersionByEmpresa(this.objCompany.centrocClienteId).subscribe(datos =>{
        
        this.myFormcomp.controls.versioncosmonaut.setValue(datos.datos.versionCosmonautId?.versionCosmonautId);
        this.versionEmpresa = datos.datos;
        
    });
    }     
    });
    if(this.objCompany.multiempresa && this.myFormcomp){
      this.myFormcomp.controls.rfc.setValidators([]);
      this.myFormcomp.controls.rfc.updateValueAndValidity();
    } 
   this.myFormcomp = this.createFormcomp((this.objCompany));
   if(this.objCompany.multiempresa){
    this.myFormcomp.controls.rfc.setValidators([Validators.pattern(ConfiguracionesService.regexRFC)]);
    this.myFormcomp.controls.rfc.updateValueAndValidity();
   }



  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormcomp(obj: any) {
    
    

    let datePipe = new DatePipe("en-MX");
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      razonSocial: [obj.razonSocial, [Validators.required]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern(ConfiguracionesService.regexRFC)]],
      fechaAlta: [{ value: ((this.insertar) ? datePipe.transform(new Date(), 'dd/MM/yyyy') : obj.fechaAlta), disabled: true }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? "true" : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      centrocClienteId: obj.centrocClienteId,
      multiempresa: obj.multiempresa,
      versioncosmonaut:['',Validators.required]

    });
  }

  public subirarchivos() {

  }


  public verdetallecont(obj: any) {

    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['company', 'detalle_contacto', tipoinsert], { state: { datos: obj, empresa: this.objCompany,modificaEmpresa:true } });
    this.cargando = false;



  }



  public listaContacto() {


    


    let objEnviar: any = {

      centrocClienteId: {
        centrocClienteId: this.objCompany?.centrocClienteId
      },
      tipoPersonaId: {
        tipoPersonaId: 2
      }
    }

    this.cargando = true;
    this.usuariosPrd.filtrar(objEnviar).subscribe(datos => {
      this.arreglo = datos.datos;
      let columnas: Array<tabla> = [
        new tabla("personaId", "ID contacto"),
        new tabla("nombrecompleto", "Nombre contacto"),
        new tabla("emailCorporativo", "Correo empresarial"),
        new tabla("contactoInicialTelefono", "Teléfono"),
        new tabla("fechaAltab", "Fecha de registro en el sistema")
      ]



      


      if (this.arreglo !== undefined){
        for (let item of this.arreglo){
          item.nombrecompleto = `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno == undefined ? '':item.apellidoMaterno}`;
          item.fechaAltab = new DatePipe("es-MX").transform(item.fechaAlta, 'dd-MMM-y');
        }
      }

      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;


    });
  }

  public enviarPeticioncomp() {
    
    this.submitEnviado = true;
    if (this.myFormcomp.invalid) {     
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let mensaje = this.insertar ? "¿Deseas registrar el cliente?" : "¿Deseas actualizar los datos del cliente?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{

      if(valor){
        let obj = this.myFormcomp.value;
        obj = {
          ...obj,
          imagen: this.imagen  
        };

        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        if (this.insertar) {
          

          this.companyPrd.save(obj).subscribe(datos => {

            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

            if(datos.resultado){
              
            let objVersionEnviar = {
              centrocClienteId:datos.datos.centrocClienteId,
              versionId:obj.versioncosmonaut
            };
            this.authUsuariosPrd.guardarVersionsistema(objVersionEnviar).subscribe(datosVersion =>{
              if(!datosVersion.resultado){
                    this.modalPrd.showMessageDialog(datosVersion.resultado,datosVersion.mensaje);
              }
            });

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
              .then(()=> {
                this.compania = !datos.resultado;
                this.contacto = true;
                if (datos.resultado) {
                  this.objCompany = datos.datos;
                  this.cancelarcomp();
                  this.routerPrd.navigate(['company', 'detalle_contacto', "nuevo"], { state: { datos: undefined, empresa: this.objCompany } })
                }


              });

            }
           

          });

        } else {

          this.companyPrd.modificar(obj).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

            if(datos.resultado){
            let objEnviar =   {
                versionCosmonautXclienteId: this.versionEmpresa.versionCosmonautXclienteId,
                versionId: obj.versioncosmonaut,
                centrocClienteId: obj.centrocClienteId
                }

                if(!Boolean(objEnviar.versionCosmonautXclienteId)){
                  delete objEnviar.versionCosmonautXclienteId;
                  this.authUsuariosPrd.guardarVersionsistema(objEnviar).subscribe(datosVersion =>{
                    if(!datosVersion.resultado){
                          this.modalPrd.showMessageDialog(datosVersion.resultado,datosVersion.mensaje);
                    }
                  });

                }else{
                  this.authUsuariosPrd.actualizarVersionsistema(objEnviar).subscribe(valordatos =>{
                    if(!valordatos.resultado){
                        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
                    }
                  });
                }

               
            }

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
            this.listcontacto = true;
            this.compania = false;

          });
        }
      }

    });

  }

  public cancelarcomp() {
    this.routerPrd.navigate(['/company']);
  }

  get f() { return this.myFormcomp.controls; }


  public recibirImagen(imagen: any) {
    this.imagen = imagen;
    
  }


  public recibirTabla(obj: any) {
    

    switch(obj.type){
      case "editar":
        this.verdetallecont(obj.datos);
      break;
      case "filaseleccionada":
          
        break;
    }
  }


  public cambiarMultiempresa(){
    this.objCompany.multiempresa = this.myFormcomp.controls.multiempresa.value;
    if(this.myFormcomp.controls.multiempresa.value){
      this.myFormcomp.controls.rfc.setValidators([ Validators.pattern(ConfiguracionesService.regexRFC)]);
    }else{
      this.myFormcomp.controls.rfc.setValidators([Validators.required, Validators.pattern(ConfiguracionesService.regexRFC)]);
      
    }
    this.myFormcomp.controls.rfc.updateValueAndValidity();
  }


}
