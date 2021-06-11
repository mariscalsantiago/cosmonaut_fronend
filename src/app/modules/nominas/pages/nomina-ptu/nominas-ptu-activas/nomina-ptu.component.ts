import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
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

  constructor(private ventana:VentanaemergenteService,private router:Router,
    private modalPrd:ModalService,private empleadoPrd:EmpleadosService,private usuariSistemaPrd:UsuarioSistemaService,
    private nominaPtuPrd:NominaptuService) { }

    ngOnInit(): void {
    
      this.traerListaNomina();
  
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
              console.log("datos enviados",datos);
              if(datos.resultado){
                
                this.router.navigate(['/nominas/nomina'], { state: { datos: {nominaPtu:item.nominaPtu} } });
              }else{

                console.log("visualizar ventana emergente");
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
  
}
