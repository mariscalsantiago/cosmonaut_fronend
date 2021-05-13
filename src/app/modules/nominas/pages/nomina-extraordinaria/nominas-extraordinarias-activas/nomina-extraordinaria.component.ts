import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominasService } from '../../../services/nominas.service';
import { CalculosService } from 'src/app/shared/services/calculos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-nomina-extraordinaria',
  templateUrl: './nomina-extraordinaria.component.html',
  styleUrls: ['./nomina-extraordinaria.component.scss']
})
export class NominaExtraordinariaComponent implements OnInit {

  public  cargando:boolean = false;

  public arreglo:any = [];
  public arregloPersonas:any = [];

  constructor(private ventana:VentanaemergenteService,private router:Router,
    private modalPrd:ModalService,private nominaPrd:NominasService,
    private empleadoPrd:EmpleadosService, private calculoPrd:CalculosService, private usuariSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

    this.cargando = true;
    let objenviar = 
    {
      clienteId: this.usuariSistemaPrd.getIdEmpresa()
    }
    this.calculoPrd.getConsultaNominaExtraordinaria(objenviar).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos.datos;

      for(let item of this.arreglo){
          item["inicial"] = item.nominaExtraordinaria.total == undefined;
      }
    })


      this.arregloPersonas = this.nominaPrd.arregloEmpleado;



      this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
        this.nominaPrd.saveEmpleado(datos.datos);
      });

  }

  public agregar(){
      this.ventana.showVentana(this.ventana.nuevanominaextraordinaria).then(valor =>{
        
        if(valor.datos){
            this.agregarNuevaNomina();
        }
      });
  }

  public calcularNomina(item:any){
  
    this.modalPrd.showMessageDialog(this.modalPrd.question,"Importante","No has calculado el promedio de variables para este bimestre. Si continuas, tomaremos el promedio del bimestre anterior.").then((valor)=>{
       if(valor){
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        let objEnviar = {
          nominaXperiodoId: item.nominaOrdinaria.nominaXperiodoId,
          clienteId: this.usuariSistemaPrd.getIdEmpresa(),
          usuarioId: this.usuariSistemaPrd.getUsuario().idUsuario
        }
        this.calculoPrd.calcularNominaExtraordinariaAguinaldo(objEnviar).subscribe(datos =>{
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.router.navigate(['/nominas/nomina'],{ state: { datos: datos } });
        });


       }
    });
      
  }

  /*public continuar(item:any){
    this.modalPrd.showMessageDialog(this.modalPrd.loading,"Recalculando la nómina");
    setTimeout(() => {
      item.inicial = false;
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.router.navigate(['/nominas/nomina']);
    }, 4000);
  }*/

  public continuar(item:any){
    this.router.navigate(['/nominas/nomina'], { state: { datos: item } });
  }


  public agregarNuevaNomina(){
      this.modalPrd.showMessageDialog(this.modalPrd.loading);

      this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
        setTimeout(() => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          let objEnviar = {inicial:true};
          this.nominaPrd.save(objEnviar);
          this.nominaPrd.saveEmpleado(datos.datos);
        }, 2000);
      });

    
  }
}
