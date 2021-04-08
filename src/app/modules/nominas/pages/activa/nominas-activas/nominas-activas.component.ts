import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private ventana:VentanaemergenteService,private router:Router,
    private modalPrd:ModalService,private nominaPrd:NominasService) { }

  ngOnInit(): void {

    this.cargando = true;

      this.nominaPrd.getAllNominas().subscribe(datos =>{
        this.cargando = false;
        this.arreglo = datos;
        console.log(this.arreglo.length,"este es el arreglo que se trae");
      });
  }

  public agregar(){
      this.ventana.showVentana(this.ventana.nuevanomina).then(valor =>{
        console.log("Esta es la respuesta de la ventana",valor);
      });
  }

  public calcularNomina(){


    this.modalPrd.showMessageDialog(this.modalPrd.question,"Importante","No has calculado el promedio de variables para este bimestre. Si continuas, tomaremos el promedio del bimestre anterior.").then((valor)=>{
       if(valor){
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        setTimeout(() => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.router.navigate(['/nominas/nomina']);
        }, 4000);
       }
    });


      
  }

}
