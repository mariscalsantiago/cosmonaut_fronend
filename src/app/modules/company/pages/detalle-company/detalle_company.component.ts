import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-detalle-company',
  templateUrl: './detalle-company.component.html',
  styleUrls: ['./detalle-company.component.scss']
})
export class DetalleCompanyComponent implements OnInit {

  public myForm!: FormGroup;
  public modal:boolean = false;

  constructor(private formBuilder: FormBuilder, private companyPrd: CompanyService, private routerActivePrd: ActivatedRoute) { }

  ngOnInit(): void {

    let objUsuario = history.state.data == undefined ? {} : history.state.data;

    this.myForm = this.createForm((objUsuario));
  }


  public createForm(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre,[Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno,[Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      curp: [obj.curp],
      correoEmpresarial: [obj.correoEmpresarial,[Validators.required,Validators.email]],
      correoPersonal: [obj.correoPersonal,[Validators.required,Validators.required]],
      telefono: [obj.telefono,[Validators.required]],
      fechaRegistro: [obj.fechaRegistro,[Validators.required]],
      idTipoUsuario:[obj.idTipoUsuario,[Validators.required]],
      idCompañia:[obj.idCompañia,[Validators.required]],
      status:[obj.status,[Validators.required]],
      id: obj.id


    });
  }

  public subirarchivos(){

  }

  
  public enviarPeticion() {


    this.modal = true;

    let obj = this.myForm.value;


return;
    
        //this.usuariosPrd.save(obj).subscribe(datos =>{
          //   alert(datos.message);
        //});
    
    


  }


  public recibir($evento:any){
     this.modal = false;
     if($evento){
        console.log("enviar la petición");
     }
  }




}