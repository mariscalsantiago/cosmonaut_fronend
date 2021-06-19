import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-nomina-ptu',
  templateUrl: './nomina-ptu.component.html',
  styleUrls: ['./nomina-ptu.component.scss']
})
export class NominaPTUComponent implements OnInit {
  
  public  cargando:boolean = false;

  public arreglo:any = [];
  public arregloPersonas:any = [];

  public esRegistrar:boolean = false;
  public esCalcular:boolean = false;
  public esConsultar:boolean = false;
  public esConcluir:boolean = false;
  public esDispersar:boolean = false;
  public esEliminar:boolean = false;
  public esTimbrar:boolean = false;
  public esDescargar:boolean = false;

  constructor(private ventana:VentanaemergenteService,private router:Router,
    private modalPrd:ModalService,private empleadoPrd:EmpleadosService,private usuariSistemaPrd:UsuarioSistemaService,
    private nominaPtuPrd:NominaptuService,private configuracionesPrd:ConfiguracionesService) { }

    ngOnInit(): void {
    
      this.traerListaNomina();
      this.establecerPermisos();
    }


    public establecerPermisos(){
      this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
      this.esCalcular = this.configuracionesPrd.getPermisos("Calcular");
      this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
      this.esConcluir = this.configuracionesPrd.getPermisos("Concluir");
      this.esDispersar = this.configuracionesPrd.getPermisos("Dispersar");
      this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
      this.esTimbrar = this.configuracionesPrd.getPermisos("Timbrar");
      this.esDescargar = this.configuracionesPrd.getPermisos("Descargar");
    }
  
  
    public traerListaNomina(){
    
      this.cargando = true;
      let objenviar =
      {
        clienteId: this.usuariSistemaPrd.getIdEmpresa()
      }
      this.nominaPtuPrd.getListaNominas(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        for (let item of this.arreglo) {
          item["inicial"] = item.nominaPtu.total == undefined;
        }
      });
    }
  
    public agregar() {
      this.ventana.showVentana(this.ventana.nuevanominaptu).then(valor => {
  
        if (valor.datos) {
          //this.arreglo = this.arreglo == undefined ? [] : this.arreglo;
          
        //  this.arreglo.push({ nominaPtu: { ...valor.datos.datos },inicial:true });
          
        this.traerListaNomina();
          
        }
      });
    }
  
    public calcularNomina(item: any) {
  
  
  
      this.modalPrd.showMessageDialog(this.modalPrd.question, "Importante", "No has calculado el promedio de variables para este bimestre. Si continuas, tomaremos el promedio del bimestre anterior.").then((valor) => {
        if (valor) {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          let objEnviar = {
            nominaXperiodoId: item.nominaPtu.nominaXperiodoId,
            clienteId: this.usuariSistemaPrd.getIdEmpresa(),
            usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
          }
          this.nominaPtuPrd.calcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,"No se encontraron empleados a los cuales calcular el PTU.").then(()=>{
              
              if(datos.resultado){
                
                this.router.navigate(['/nominas/nomina'], { state: { datos: {nominaPtu:item.nominaPtu} } });
              }else{

                
                this.ventana.showVentana(this.ventana.nuevanominaptu,{datos:{editar:true,datos:item.nominaPtu}}).then(valor => {
  
                  if (valor.datos) {
                    //this.arreglo = this.arreglo == undefined ? [] : this.arreglo;
                    
                  //  this.arreglo.push({ nominaPtu: { ...valor.datos.datos },inicial:true });
                    
                  this.traerListaNomina();
                    
                  }
                });
              }
            });
            
          });
  
  
        }
      });
  
  
    }
  
    public continuar(item: any) {
  
      this.router.navigate(['/nominas/nomina'], { state: { datos: item } });
    }
  

    public eliminar(obj: any, indice: number) {
      this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas eliminar la nómina?").then(valor => {
        if (valor) {
          let objEnviar = {
            nominaXperiodoId: obj.nominaXperiodoId,
            usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
          };
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.nominaPtuPrd.eliminar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.arreglo.splice(indice, 1)
              }
            });
          });
        }
      });
  
    }
}
