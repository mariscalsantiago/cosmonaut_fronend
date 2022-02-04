import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ContratocolaboradorService } from '../../services/contratocolaborador.service';
import { EmpleadosService } from '../../services/empleados.service';
import { ObservadorEmpleadosService } from '../../services/observador-empleados.service';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {


  public cargandoIcon: boolean = false;
  public esKiosko: boolean = false;

  public empleado: any = {};
  public idEmpleado: number = -1;
  public porcentaje: any = { porcentaje: 0 };

  public elEmpleado: any = {
    url: "assets/imgs/usuario.png"
  };

  constructor(private routerCan: ActivatedRoute,
    private empleadosPrd: EmpleadosService, private reportesPrd: ReportesService,
    private empledoContratoPrd: ContratocolaboradorService, private ventana: VentanaemergenteService,
    private modalPrd: ModalService, public configuracionPrd: ConfiguracionesService,
    private router: Router,
    private usuariosSistemaPrd: UsuarioSistemaService,private cambioFotoPerfil:ObservadorEmpleadosService,
    private contratoColaboradorPrd:ContratocolaboradorService) { }

  ngOnInit(): void {
    
    this.routerCan.params.subscribe(params => {
      this.esKiosko = this.router.url.includes("/kiosko/perfil");



      
      
      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      if (!this.esKiosko) {
        this.empleado = {esActivo:true};
        this.idEmpleado = params["id"];
       
        this.traerInfoBasica();

        this.seguirProceso();

      } else {
        this.empleadosPrd.getPersonaByCorreo(this.usuariosSistemaPrd.usuario.correo, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
          if (!datos.resultado) {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          } else {

            this.idEmpleado = datos.datos.personaId;

            this.traerInfoBasica();
            this.router.navigate([`/kiosko/perfil/${this.idEmpleado}/personal`]);
            this.seguirProceso();
          }
        });

      }




    });
  }

  public traerInfoBasica(){
    this.empleadosPrd.getEmpleadoById(this.idEmpleado).subscribe(datos => {
this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      if (datos.datos?.url !== undefined) {

        this.elEmpleado.url = datos.datos?.url;
        
      }

    });
  }


  public seguirProceso() {
    
    this.empledoContratoPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {
      this.empleado = datos.datos;
    });

    this.empleadosPrd.getPorcentajeavance(this.idEmpleado).subscribe(datos => {
      this.porcentaje = datos;
    });
  }





  public iniciarDescarga() {

    this.cargandoIcon = true;



    this.empledoContratoPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {


      let fechacontrato = datos.datos?.fechaContrato;





      let objenviar = {
        fechaContrato: fechacontrato,
        "centrocClienteId": {
          "centrocClienteId": datos.datos.centrocClienteId.centrocClienteId
        },
        "personaId": {
          "personaId": datos.datos.personaId.personaId
        }

      }

      this.reportesPrd.getReportePerfilPersonal(objenviar).subscribe(archivo => {
        this.cargandoIcon = false;
        this.reportesPrd.crearArchivo(archivo.datos, `${datos.datos.personaId.rfc}_${datos.datos.personaId.nombre.replace(" ", "_")}_${datos.datos.personaId.apellidoPaterno}`, "pdf");
      });


    });



  }


  public subirFotoperfil() {
    this.ventana.showVentana(this.ventana.fotoperfil, { ventanaalerta: true }).then(valor => {
      if (valor.datos != "" && valor.datos != undefined) {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.empleadosPrd.getEmpleadoById(this.idEmpleado).subscribe(datos => {
          let objEnviar = {
            ...datos.datos,
            imagen: valor.datos
          }

          this.empleadosPrd.update(objEnviar).subscribe(actualizado => {
              if(actualizado.resultado){
                this.modalPrd.showMessageDialog(actualizado.resultado, actualizado.mensaje);
                this.cambioFotoPerfil.setFotoPerfil(true);
                this.ngOnInit();
              }else{
                this.modalPrd.showMessageDialog(actualizado.resultado,"No se puede subir/actualizar foto. Completar los datos del perfil del usuario para completar la acción");
              }

          });
        });
      }
    });
  }


  public activarEmpleado() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas reactivar el empleado?").then(valor => {
      if (valor) {


        this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.contratoColaboradorPrd.verEstatusReactivarEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.empleado.personaId.personaId).subscribe(vv =>{
            if(vv.resultado){
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              let isInsertar: boolean = false;
              let fechaContrato = { ...this.empleado };
              //delete fechaContrato.fechaContrato;
              this.router.navigate(['empleados/empleado'], { state: { datos: this.empleado.personaId, insertar: isInsertar,reactivarEmpleado:true, reactivarCuenta: true, contrato: fechaContrato } });
            }else{
              this.modalPrd.showMessageDialog(vv.resultado,vv.mensaje);
            }
          });
      }
    });
  }


  public navegando(item: string) {
   if(!this.esKiosko){
    this.router.navigate([`/empleados/${this.idEmpleado}/${item}`]); 
   }else{
    this.router.navigate([`/kiosko/perfil/${this.idEmpleado}/${item}`]); 
   }

   
  }


}
