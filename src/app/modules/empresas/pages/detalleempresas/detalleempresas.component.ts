import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';





@Component({
  selector: 'app-detalleempresas',
  templateUrl: './detalleempresas.component.html',
  styleUrls: ['./detalleempresas.component.scss']
})




export class DetalleempresasComponent implements OnInit {

  public titulo:string = "";
  public modulo: string = "";
  public subModulo: string = "";
  public arreglocompany: any = [];
  public id_empresa: number = 0;

  constructor(public configuracionPrd:ConfiguracionesService, private routerPrd: Router, private CanRouterPrd:ActivatedRoute,
    private usuariosSistemaPrd:UsuarioSistemaService, private companiaPrd:SharedCompaniaService
    ) {

    
   }

  ngOnInit(): void {
    
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    let mm:any = document.getElementById("navegadorTabs");
    mm.scrollLeft = this.configuracionPrd.getScrollCompany(mm.scrollLeft);
    mm.addEventListener('scroll', ()=> {
      
      mm.scrollLeft = this.configuracionPrd.getScrollCompany(mm.scrollLeft);
    })

    this.CanRouterPrd.params.subscribe(datos =>{
      this.id_empresa = datos["id"];
    });
    this.companiaPrd.getEmpresaById(this.id_empresa).subscribe(datos => {
      this.arreglocompany = datos.datos;
      this.titulo = this.arreglocompany.razonSocial?.toUpperCase();

    });



  }

  public getConfiguracion(){
   
    
  }

  public cancelar(){
    this.routerPrd.navigate(['/listaempresas']);  
  }

}
