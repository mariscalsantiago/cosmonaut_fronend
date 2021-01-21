import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {


  public cargando: Boolean = false;

  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public numeroitems: number = 2;
  public arreglotemp = [];
  public arreglopaginas:Array<any> = [];




  /*
    Directivas de filtros
  */


  public id_company: number = 0;
  public idUsuario: any = null;
  public nombre: string = "";
  public apellidoPat: string = "";
  public apellidoMat: string = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: any = null;




  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown:boolean = false;

  constructor(private routerPrd: Router, private usuariosPrd: UsuarioService) { }

  ngOnInit(): void {

    this.tamanio =  window.screen.width;


    this.cargando = true;




    this.usuariosPrd.getAllUsers().subscribe(datos => {
      this.arreglotemp = datos.data;
      this.cargando = false;
      this.paginar();
    });

    this.usuariosPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.data);

  }


  public verdetalle(obj: any) {


    let tipoinsert = (obj == undefined) ? 'new' : 'update';

    this.routerPrd.navigate(['usuarios', 'detalle_usuario', tipoinsert], { state: { data: obj, company: this.arregloCompany } });
    this.cargando = false;


  }


  public activarMultiseleccion() {
    this.multiseleccion = true;
  }


  public guardarMultiseleccion() {
    this.multiseleccionloading = true;
    setTimeout(() => {
      this.multiseleccionloading = false;
      this.multiseleccion = false;
    }, 3000);
  }


  public cancelarMulti() {
    this.multiseleccionloading = false;
    this.multiseleccion = false;
  }


  public filtrar() {



    this.cargando = true;

    if (this.id_company != 0) {
      this.usuariosPrd.getByCompany(this.id_company).subscribe(datos => {
        this.arreglo = datos.data;
        this.cargando = false;
      });
    } else {
      let objConstruir = {
        tipoPersonaId: 3,
        representanteLegalCentrocClienteId: null,
        personaId: this.idUsuario == 0 ? null : this.idUsuario,
        nombre: this.nombre,
        apellidoPat: this.apellidoPat,
        apellidoMat: this.apellidoMat,
        emailCorp: this.correoempresarial
      };


      this.usuariosPrd.filtrar(objConstruir).subscribe(datos => {
        this.arreglo = datos.data;
        this.cargando = false;
        console.log("Se dispara el filtrar");
        console.log(datos);
      });

    }






  }



  public paginar(){

    this.arreglopaginas = [];

    if(this.arreglotemp != undefined){
        let paginas = this.arreglotemp.length / this.numeroitems;
        

        let primero = true;
        paginas = Math.ceil(paginas);
        
        for(let x = 1; x <=paginas; x++){
           
           this.arreglopaginas.push({numeropagina:(x-1)*2,llavepagina:((x-1)*2)+this.numeroitems,mostrar:x,activado:primero});
           primero = false;
        }

        this.arreglo = this.arreglotemp.slice(0,this.numeroitems);
        console.log(this.arreglotemp);

    }

  }


  public paginacambiar(item:any){
    

    this.arreglo = this.arreglotemp.slice(item.numeropagina,item.llavepagina);
    


    for(let item of this.arreglopaginas){
        item.activado = false;
    }

    item.activado = true;
      

  }

  public cambia(){

    this.paginar();

  }






}








