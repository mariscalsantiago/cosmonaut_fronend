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

    let objCompany = history.state.data == undefined ? {} : history.state.data;

    this.myForm = this.createForm((objCompany));
  }


  public createForm(obj: any) {
    return this.formBuilder.group({

      nombreCompania: [obj.nombreCompania,[Validators.required]],
      razonSocial: [obj.razonSocial,[Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      rfc: [obj.rfc,[Validators.required]],
      estatus: [obj.estatus,[Validators.required]],

    });
  }

  public subirarchivos(){

  }

  
  public enviarPeticion() {


    this.modal = true;

    let obj = this.myForm.value;


return;
    
        this.companyPrd.save(obj).subscribe(datos =>{
             alert(datos.message);
      });
    
    


  }


  public recibir($evento:any){
     this.modal = false;
     if($evento){
        console.log("enviar la petición");
     }
  }




}