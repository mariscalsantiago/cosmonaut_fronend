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

      this.usuariosPrd.getByCompany(this.id_company).subscribe(datos =>{
        this.arreglo = datos.data;

        this.cargando = false;
      });

  }


  public verdetalle(obj:any){
    
    this.routerPrd.navigate(['usuarios','detalle_usuario'],{state:{data:obj}});
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
