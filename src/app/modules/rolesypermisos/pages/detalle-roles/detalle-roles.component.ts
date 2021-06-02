import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detalle-roles',
  templateUrl: './detalle-roles.component.html',
  styleUrls: ['./detalle-roles.component.scss']
})
export class DetalleRolesComponent implements OnInit {

  public myForm!:FormGroup;
  public arreglopintar:any =[false];

  constructor() { }

  ngOnInit(): void {
  }


  public cancelar(){

  }

  public enviarPeticion(){

  }

  public cambiarStatus(numero:number){
      this.arreglopintar[numero] = !this.arreglopintar[numero];
  }

}
