import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {


  public cargando:Boolean = false;

  constructor(private routerPrd:Router) { }

  ngOnInit(): void {
  }


  public verdetalle(){

    this.cargando = true;
    setTimeout(() => {
      
      
      this.routerPrd.navigate(['usuarios','detalle_usuario']);
      this.cargando = false;


    }, 2000);

  }

}
