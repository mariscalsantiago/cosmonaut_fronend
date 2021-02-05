import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {




  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  public cargando: Boolean = false;
  public tipoguardad:boolean = false;
  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public numeroitems: number = 5;
  public arreglotemp:any = [];
  public arreglopaginas: Array<any> = [];




  /*
    Directivas de filtros
  */


  public id_company: number = 0;
  public idUsuario: any = "";
  public nombre: string = "";
  public apellidoPat: string = "";
  public apellidoMat: string = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: number = 0;

  public modal:boolean = false;
  public strTitulo:string = "";
  public strsubtitulo:string = "";
  public iconType:string = "";




  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;

  constructor(private routerPrd: Router, private usuariosPrd: UsuarioService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;


    this.cargando = true;




    this.usuariosPrd.getAllUsers().subscribe(datos => {
      this.arreglotemp = datos.datos;
      this.cargando = false;
      this.paginar();
    });

    this.usuariosPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.datos);

  }





  public verdetalle(obj: any) {


    if(obj == undefined){

      this.routerPrd.navigate(['usuarios', 'detalle_usuario', "agregar"], { state: { company: this.arregloCompany } });

    }else{

      this.routerPrd.navigate(['usuarios', 'detalle_usuario', "actualizar",obj.personaId], { state: {  company: this.arregloCompany } });
    }


  }


  public activarMultiseleccion() {
    this.multiseleccion = true;


    let temp = [];


    for (let item of this.arreglotemp) {
      let obj: any = {};
      for (let llave in item) {
        obj[llave] = item[llave];
      }
      temp.push(obj);
    }

    this.arreglo = temp;






  }


  

  public guardarMultiseleccion(tipoguardad:boolean) {
  

    this.tipoguardad = tipoguardad;

   this.modal = true;
   this.strTitulo = `¿Deseas ${tipoguardad?"activar":"desactivar"} estos usuarios?`;
   this.strsubtitulo = `Una vez ${tipoguardad?"activados":"desactivados"} estos usuarios apareceran disponibles en el sistema`;
   this.iconType = "warning";


   
  }


  public cancelarMulti() {
    this.multiseleccionloading = false;
    this.multiseleccion = false;
    this.paginar();
  }


  public filtrar() {




    this.cargando = true;

    let fechar = "";

    if (this.fechaRegistro != undefined || this.fechaRegistro != null) {

      if (this.fechaRegistro != "") {


        let arre = this.fechaRegistro.split('-');
        fechar = arre[2] + "/" + arre[1] + "/" + arre[0];

      }

    }

    let actboo: string = "";

    if (this.activo == 1) {
      actboo = "true";
    } else if (this.activo == 2) {
      actboo = "false";
    }


    let peticion = {
      personaId: this.idUsuario,
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPat,
      apellidoMaterno: this.apellidoMat,
      fechaAlta: fechar,
      emailCorporativo: this.correoempresarial,
      activo: "",
      centrocClienteId: {
        centrocClienteId: (this.id_company) == 0 ? "" : this.id_company
      },
      tipoPersonaId: {
        tipoPersonaId: 3
      }
    }


    


    this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      this.arreglotemp = datos.datos;
      if(this.arreglotemp != undefined ){
        for(let item of this.arreglotemp)
        {
          item["centrocClienteId"] = {
            nombre:item["razonSocial"]
          }
        }
      }
      this.paginar();
      this.cargando = false;
    });








  }



  public paginar() {

    this.arreglopaginas = [];

    if (this.arreglotemp != undefined) {
      let paginas = this.arreglotemp.length / this.numeroitems;


      let primero = true;
      paginas = Math.ceil(paginas);

  
      for (let x = 1; x <= paginas; x++) {

        this.arreglopaginas.push({ numeropagina: (x - 1) * this.numeroitems, llavepagina: ((x - 1) * this.numeroitems) + this.numeroitems, mostrar: x, activado: primero });
        primero = false;
      }

      this.arreglo = this.arreglotemp.slice(0, this.numeroitems);
      console.log(this.arreglotemp);

    }

  }


  public paginacambiar(item: any) {
    this.arreglo = this.arreglotemp.slice(item.numeropagina, item.llavepagina);
    for (let item of this.arreglopaginas) {
      item.activado = false;
    }

    item.activado = true;


  }

  public cambia() {

    this.paginar();

  }


  public seleccionarTodosBool(input: any) {
    for (let item of this.arreglo)
      item.esActivo = input.checked;
  }


  public verificaDisponibilidad(){

    let variable:boolean = false;
    
    for(let item of this.arreglotemp){

      if(item["esActivo"]){

        variable = true;
        break;
      }

      variable = false;

    }
    

    return variable;
  }



  public recibir($evento:any){

    this.modal = false;

    if(this.iconType == "warning"){
      if($evento){
        let arregloUsuario = [];
  
        for(let item of this.arreglotemp){
     
         if(item["esActivo"]){
     
           arregloUsuario.push({personaId:item["personaId"],activo:this.tipoguardad});
     
         }
        }

        this.usuariosPrd.modificarListaActivos(arregloUsuario).subscribe(datos =>{
          console.log(datos);

          this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.strsubtitulo = datos.mensaje
            this.modal = true;
            
            let item2:any;
            for( item2 of this.arreglotemp){
                item2["esActivo"] = false;
            }
          
        });
  
  
      }
    }else{

    }


  }

 



}








