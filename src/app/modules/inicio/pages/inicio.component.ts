import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public valor: any;

  constructor(private modalPrd: ModalService, private ventana: VentanaemergenteService) { }

  ngOnInit(): void {
  }


  public alerta() {

    // fetch("https://firebasestorage.googleapis.com/v0/b/cuentas-ffc8b.appspot.com/o/comprobantes%2Fpdf.1619461041452?alt=media&token=7bfb671f-8179-46b4-aedf-f881533f2d38",
    // {mode:"no-cors"}).then((dato)=>{

    //   let aux = dato;
    //   
    //   aux.blob().then((b)=>{
    //     

    //     let elemento = document.createElement("a")
    //     elemento.href = URL.createObjectURL(b);
    //     elemento.setAttribute("download", "archivo.pdf");
    //     elemento.click()

    //   })

    // })
   
  }


  public vermodal(){
    this.ventana.showVentana(this.ventana.timbrado,{ventanaalerta:true});
  }

  public vermodal2(){
    this.ventana.showVentana(this.ventana.timbrado);
  }


  


}
