import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominasService } from '../../../services/nominas.service';

@Component({
  selector: 'app-nominas-activas',
  templateUrl: './nominas-activas.component.html',
  styleUrls: ['./nominas-activas.component.scss']
})
export class NominasActivasComponent implements OnInit {


  public  cargando:boolean = false;

  public arreglo:any = [];
  public arregloPersonas:any = [];

  constructor(private ventana:VentanaemergenteService,private router:Router,
    private modalPrd:ModalService,private nominaPrd:NominasService,private empleadoPrd:EmpleadosService) { }

  ngOnInit(): void {

    this.cargando = true;

      this.nominaPrd.getAllNominas().subscribe(datos =>{
        this.cargando = false;
        this.arreglo = datos;
        console.log(this.arreglo.length,"este es el arreglo que se trae");
      });


      this.arregloPersonas = this.nominaPrd.arregloEmpleado;



      this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
        this.nominaPrd.saveEmpleado(datos.datos);
      });

  }

  public agregar(){
      this.ventana.showVentana(this.ventana.nuevanomina).then(valor =>{
        console.log("lado del clienteISDJFIDSJFIJFDJSIFJSDIFJ",valor);
        if(valor.datos){
            this.agregarNuevaNomina();
        }
      });
  }

  public calcularNomina(item:any){


    this.modalPrd.showMessageDialog(this.modalPrd.question,"Importante","No has calculado el promedio de variables para este bimestre. Si continuas, tomaremos el promedio del bimestre anterior.").then((valor)=>{
       if(valor){
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        setTimeout(() => {
          item.inicial = false;
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.router.navigate(['/nominas/nomina']);
        }, 4000);
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
