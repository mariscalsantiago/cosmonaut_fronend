import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

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
    private modalPrd:ModalService,private empleadoPrd:EmpleadosService) { }

  ngOnInit(): void {

    this.cargando = true;

   
  }

  public agregar(){
      this.ventana.showVentana(this.ventana.nuevanominaptu).then(valor =>{
        
        if(valor.datos){
            
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


  
}
