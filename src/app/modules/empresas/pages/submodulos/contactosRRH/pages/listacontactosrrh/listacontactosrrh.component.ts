import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariocontactorrhService } from '../services/usuariocontactorrh.service';

@Component({
  selector: 'app-listacontactosrrh',
  templateUrl: './listacontactosrrh.component.html',
  styleUrls: ['./listacontactosrrh.component.scss']
})
export class ListacontactosrrhComponent implements OnInit {


  public tamanio:number = 0;
  public cargando:boolean = false;
  public changeIconDown:boolean = false;

  public nombre:any;
  public apellido:any;
  public empresa:any;
  public correoE:string = "";
  public correoP:string = "";
  public id_empresa:number = 0;
  public arreglo:any = [{nombre:"santiago",id:324324,apellido:"mariscal",correoempresa:"santiagomariscal@gmail.com"}];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  constructor(private router:Router,private usuariosPrd:UsuariocontactorrhService,private CanRouterPrd:ActivatedRoute) { }

  ngOnInit(): void {
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{


      this.id_empresa = datos["id"];
      let peticion = {
        representanteLegalCentrocClienteId: {
          centrocClienteId: this.id_empresa
        },
        tipoPersonaId: {
          tipoPersonaId: 4
        }
      }


      this.usuariosPrd.filtrar(peticion).subscribe(datos => {
        this.arreglo = datos.data;
        this.cargando = false;
      });

    });
    
  }


  public filtrar(){

  }


  public verdetalle(obj:any){


    this.router.navigate(['empresa/detalle',this.id_empresa,'contactosrrh','nuevo']);

  }

}
