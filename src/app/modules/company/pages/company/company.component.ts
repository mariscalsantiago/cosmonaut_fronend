import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {


  public cargando:Boolean = false;

  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;

     

  /*
    Directivas de filtros
  */


  public id_company:number = 1;



  /*
  
    Resultados desplegados en un array

  */

  public arreglo:any = [];

  constructor(private routerPrd:Router,private companyProd:CompanyService) { }

  ngOnInit(): void {
    this.cargando = true;

    /*let datos = {
      "data": [
        {
            "centrocClienteId": 13,
            "rfc": "SOOJ890306GR2",
            "razonSocial": "ASG",
            "emailCorp": "jcsolorioortega@advisoryservicesg.tech",
            "esActivo": true,
            "nombre": "ASG",
            "fechaAlta": "2021/01/14"
        },
        {
            "centrocClienteId": 12,
            "rfc": "SOOJ890306GR1",
            "razonSocial": "ASG",
            "emailCorp": "jcsolorio@advisoryservicesg.tech",
            "esActivo": true,
            "nombre": "ASG",
            "fechaAlta": "2021/01/13"
        },
        {
            "centrocClienteId": 2,
            "rfc": "SOOJ890306GR9",
            "razonSocial": "ASG",
            "emailCorp": "jsolorio@advisoryservicesg.tech",
            "esActivo": true,
            "fechaAlta": "2021/01/10"
        },
        {
            "centrocClienteId": 3,
            "rfc": "SOOJ890306GR8",
            "razonSocial": "ASG CA de CV",
            "emailCorp": "jsolorio@advisoryservicesg.tech",
            "esActivo": false,
            "fechaAlta": "2021/01/10"
        },
        {
            "centrocClienteId": 4,
            "curp": "SOOJ890306",
            "rfc": "SOOJ890306GR6",
            "razonSocial": "ASG CV",
            "emailCorp": "jsolorio@advisoryservicesg.tech",
            "esActivo": false,
            "registroPatronal": "Si",
            "fechaAlta": "2021/01/10"
        },
        {
            "centrocClienteId": 5,
            "curp": "SOOJ890306",
            "rfc": "SOOJ890306GR5",
            "razonSocial": "ASG CV",
            "fechaConstitucion": 1610085600000,
            "emailCorp": "jsolorio@advisoryservicesg.tech",
            "esActivo": false,
            "registroPatronal": "Si",
            "fechaAlta": "2021/01/10"
        }
    ],
    "result": true,
    "message": "Operación realizada con éxito"
       };
    
       this.cargando = false;
    
       this.arreglo = datos.data;
    
         return;*/

      this.companyProd.getAll().subscribe(datos =>{

        this.arreglo = datos.data;

        this.cargando = false;
      });

  }


  public verdetallecom(obj:any){
    debugger;
    this.cargando = true;
    let tipoinsert = (obj == undefined)? 'nuevo':'modifica';
    this.routerPrd.navigate(['company','detalle_company',tipoinsert],{state:{data:obj}});
    this.cargando = false;
  
  }


  public activarMultiseleccion(){
      this.multiseleccion = true;
  }


  public guardarMultiseleccion(){
    this.multiseleccionloading = true;
      setTimeout(() => {
        this.multiseleccionloading = false;
        this.multiseleccion = false;
      }, 3000);
  }


  public cancelarMulti(){
    this.multiseleccionloading = false;
    this.multiseleccion = false;
  }

}
