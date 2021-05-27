import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';


@Component({
  selector: 'app-abc-admincatalogos',
  templateUrl: './abc-admincatalogos.component.html',
  styleUrls: ['./abc-admincatalogos.component.scss']
})
export class ABCAdminCatalogosComponent implements OnInit {


  public cargando: Boolean = false;
  public tipoguardad: boolean = false;
  public myForm!: FormGroup;

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;
  public insertar: boolean= false;
  public detCatalogos: any = [];
  public activaClave : boolean= false;
  public inactivaClave : boolean= false;
  public submitEnviado:boolean = false;


  public arreglotabla: any = {
    columnas: [],
    filas: []
  };



  constructor(private routerPrd: Router, private adminCatalogosPrd: AdminCatalogosService,
    private routerActivePrd: ActivatedRoute, private modalPrd: ModalService, private formBuilder: FormBuilder) { 

      this.routerActivePrd.params.subscribe(datos => {
        this.insertar = (datos["tipoinsert"] == 'nuevo');
  
      });
    }

  ngOnInit(): void {
    debugger;

    this.detCatalogos = history.state.datos == undefined ? {} : history.state.datos;
    let objdetrep = history.state.data == undefined ? {} : history.state.data;

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.clave();
    this.myForm = this.createForm((objdetrep));


  }


  public createForm(obj: any) {
    
    return this.formBuilder.group({

      codBanco: [obj.codBanco],
      nombreCorto: [obj.nombreCorto, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],


    });
  }

  public clave(){
    if(this.insertar){
      this.activaClave = true;
    }else{
      this.inactivaClave = true;

    }

  }

  public redirect(obj: any) {
    this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
  }


  public enviarPeticion() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }
    const titulo = (this.insertar) ? "¿Deseas agregar un nuevo registro al catálogo?" : "¿Deseas actualizar los datos del catalogo?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){

        let obj = this.myForm.value;

        let objEnviar: any = {
          areaId: obj.areaId,
          centrocClienteId: "",
          nclPuestoDto: [
            {
              descripcion: obj.puesto,
              nombreCorto: obj.puesto,
              centrocClienteId: ""
            }
          ]
        }

        if (this.insertar) {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.save(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });

        } else {

          let objEnviarMod: any = {
            areaId: obj.areaId,
            descripcion: "",
            nombreCorto: "",
            centrocClienteId: "",
            nclPuestoDto:
              [{
                puestoId: "",
                descripcion: obj.puesto,
                nombreCorto: obj.puesto,
                centrocClienteId: "",
              }]
          }
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.modificar(objEnviarMod).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });
        }
      }
    });
  }
}

