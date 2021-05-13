import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { NominasService } from '../../../services/nominas.service';
import { CalculosService } from 'src/app/shared/services/calculos.service';


@Component({
  selector: 'app-nomina-dfiniquitoliquidacion-activas',
  templateUrl: './nomina-dfiniquitoliquidacion-activas.component.html',
  styleUrls: ['./nomina-dfiniquitoliquidacion-activas.component.scss']
})
export class NominaDFiniquitoliquidacionActivasComponent implements OnInit {

  public  cargando:boolean = false;

  public arreglo:any = [];
  public arregloPersonas:any = [];

  constructor(private ventana:VentanaemergenteService,private router:Router,
    private modalPrd:ModalService,private nominaPrd:NominasService,
    private empleadoPrd:EmpleadosService, private calculoPrd:CalculosService,private usuariSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {
    debugger;
    this.cargando = true;
    let objenviar = 
    {
      clienteId: this.usuariSistemaPrd.getIdEmpresa()
    }
    this.calculoPrd.getConsultaNominaExtraordinaria(objenviar).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos.datos;

      for(let item of this.arreglo){
          item["inicial"] = item.nominaOrdinaria.total == undefined;
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
          //usuarioId: this.usuariSistemaPrd.getUsuario().idUsuario
        }
        this.calculoPrd.calcularNominaExtraordinaria(objEnviar).subscribe(datos =>{
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.router.navigate(['/nominas/nomina'],{ state: { datos: datos } });
        });


       }
    });
      
  }

  public continuar(item:any){
    this.modalPrd.showMessageDialog(this.modalPrd.loading,"Recalculando la nómina");
    setTimeout(() => {
      item.inicial = false;
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.router.navigate(['/nominas/nomina']);
    }, 4000);
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
