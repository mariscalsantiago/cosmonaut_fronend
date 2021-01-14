import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {


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

  constructor(private routerPrd:Router,private usuariosPrd:UsuarioService) { }

  ngOnInit(): void {


    this.cargando = true;


  //   let datos = {
  //     "data": [
  //         {
  //             "nombre": "Julio Cesar",
  //             "apellidoPaterno": "Solorio",
  //             "apellidoMaterno": "Ortega",
  //             "curp": "SOOJ890306HDFLRL05",
  //             "correoEmpresarial": "jcsolorio@advisoryservicesg.tech",
  //             "correoPersonal": "julio.solorio@gmail.com",
  //             "telefono": 5555998899,
  //             "fechaRegistro": 1610344800000,
  //             "estatus": true,
  //             "idCompania": 1,
  //             "idTipoUsuario": 1
  //         },
  //         {
  //             "nombre": "Julio Cesar",
  //             "apellidoPaterno": "Solorio",
  //             "apellidoMaterno": "Ortega",
  //             "curp": "SOOJ890306HDFLRL05",
  //             "correoEmpresarial": "jsolorio@advisoryservicesg.tech",
  //             "correoPersonal": "julio.solorio.ortega@gmail.com",
  //             "telefono": 5555998899,
  //             "fechaRegistro": 1610431200000,
  //             "estatus": true,
  //             "idCompania": 1,
  //             "idTipoUsuario": 1
  //         }
  //     ],
  //     "result": true,
  //     "message": "Operación realizada con éxito"
  // };

  // this.cargando = false;

  // this.arreglo = datos.data;

  //   return;

      this.usuariosPrd.getByCompany(this.id_company).subscribe(datos =>{
        this.arreglo = datos.data;

        this.cargando = false;
      });

  }


  public verdetalle(obj:any){
    

    let tipoinsert = (obj == undefined)? 'new':'update';

    this.routerPrd.navigate(['usuarios','detalle_usuario',tipoinsert],{state:{data:obj}});
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
