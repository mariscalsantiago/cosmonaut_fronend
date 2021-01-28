import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detallegruponomina',
  templateUrl: './detallegruponomina.component.html',
  styleUrls: ['./detallegruponomina.component.scss']
})
export class DetallegruponominaComponent implements OnInit {

  public modal:boolean = false;
  public strTitulo:string = "";
  public iconType:string = "";
  public strsubtitulo:string = "";

  public myForm!:FormGroup;



  constructor(private formbuilder:FormBuilder) { }

  ngOnInit(): void {

    this.myForm = this.crearForm({});
  }

  public crearForm(obj:any){

    return this.formbuilder.group({});
  }


  public recibir($event:any){

  }

  public enviarPeticion(){
       
  }

  public cancelar(){
    
  }

}
