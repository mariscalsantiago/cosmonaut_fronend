import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosempresaService } from 'src/app/modules/empresas/services/datosempresa/datosempresa.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-informacionempresa',
  templateUrl: './informacionempresa.component.html',
  styleUrls: ['./informacionempresa.component.scss']
})
export class InformacionempresaComponent implements OnInit {
  @ViewChild("nombre") public nombre!:ElementRef;

  @ViewChild("key") public inputkey!:ElementRef;
  @ViewChild("cer") public inputcer!:ElementRef;

  @Output() enviado = new EventEmitter();
  @Output() enviandouser = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosempresa:any;
  @Input() datosempresamod:any;

  public obj:any ={};



  public myform!: FormGroup;

  public submitEnviado: boolean = false;

  public arregloregimen: any = [];
  public arregloactividad: any = [];
  public imagen:any = undefined;

  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private empresaPrd: DatosempresaService,private routerPrd:Router) { }

  ngOnInit(): void {
    
    this.obj = this.datosempresamod.datosempresaObj
    if(this.datosempresa.insertar){
      this.obj = {
        regimenfiscalId: {},
        actividadEconomicaId: {}
      };
    }
   
    this.myform = this.createForm(this.obj);
    this.catalogosPrd.getRegimenFiscal().subscribe(datos => this.arregloregimen = datos.datos);
    this.catalogosPrd.getActividadEconomica().subscribe(datos => this.arregloactividad = datos.datos);

  }


  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }

  public recibirImagen(imagen:any){
    this.imagen = imagen;
  }
  public createForm(obj: any) {
    
    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      razonSocial: [obj.razonSocial,[Validators.required]],
      actividadEconomicaId: [obj.actividadEconomicaId?.actividadEconomicaId,[Validators.required]],
      rfc: [obj.rfc,[Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      curp: [obj.curp,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      regimenfiscalId: [obj.regimenfiscalId.regimenfiscalId,[Validators.required]],
      calculoAutoPromedioVar: obj.calculoAutoPromedioVar,
      horasExtrasAuto: obj.horasExtrasAuto,
      centrocClienteId: obj.centrocClienteId,
      cer:obj.cer,
      key:obj.key,
      contrasenia:obj.contrasenia
 
    });
  }



  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);

  }


  public enviarFormulario() {
 
    this.submitEnviado = true;
    if (this.myform.invalid) {
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o inválidos";
      //this.alerta.strsubtitulo = "Hay campos inválidos o sin rellenar, favor de verificar";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = (this.datosempresa.insertar) ? "¿Deseas registrar la empresa" : "¿Deseas actualizar la empresa?";
    //this.alerta.strsubtitulo = "Esta apunto de guardar una empresa";
    this.alerta.iconType = "warning";

  }

  public get f() {
    return this.myform.controls;
  }


  ngOnChanges(changes: SimpleChanges) {
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      let obj = this.myform.value;
      let objenviar:any = {
           nombre : obj.nombre,
           razonSocial : obj.razonSocial,
           rfc : obj.rfc ,
           regimenfiscalId:{
            regimenfiscalId: obj.regimenfiscalId
            },
           centroCostosCentrocClienteId: {
            centrocClienteId: this.datosempresa.centrocClienteId
           },
           actividadEconomicaId: {
            actividadEconomicaId: obj.actividadEconomicaId
           },
           esActivo: true,
           imagen:this.imagen,
           curp : obj.curp,
           horasExtrasAuto:obj.horasExtrasAuto,
           calculoAutoPromedioVar: obj.calculoAutoPromedioVar,
           cer:obj.cer,
           key:obj.key,
           contrasenia:obj.contrasenia
        }

      if(this.datosempresa.insertar){  

      this.empresaPrd.save(objenviar).subscribe(datos => {
        let resultado = datos.resultado;
        let mensaje = datos.mensaje;
        if(resultado){

          this.datosempresa.centrocClienteEmpresa = datos.datos.centrocClienteId;
        }
        this.alerta.iconType = resultado ? "success" : "error";
        this.alerta.strTitulo = mensaje;
        //this.alerta.strsubtitulo = mensaje
        this.alerta.modal = true;

      });

    }else{
        

        objenviar.centrocClienteId = obj.centrocClienteId;

        this.empresaPrd.modificar(objenviar).subscribe(datos =>{
          let resultado = datos.resultado;
          let mensaje = datos.mensaje;
          this.alerta.iconType = resultado? "success":"error";
          this.alerta.strTitulo = mensaje;
          //this.alerta.strsubtitulo = mensaje
          this.alerta.modal = true;

        });
      }

    }

  }


  public abrirCer(){
    let input = document.createElement("input");
    input.type="file";
    input.accept = ".cer";

    input.click();

    input.onchange = ()=>{
      let imagenInput:any =input.files;
      this.inputcer.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

       let archivo: File = imagenInput[item];

       archivo.arrayBuffer().then(datos => {
          this.myform.controls.cer.setValue(this.arrayBufferToBase64(datos));
       });


     }
    }
  }

  public abrirKey(){
    let input = document.createElement("input");
    input.type="file";
    input.accept = ".key";

    input.click();

    input.onchange = ()=>{
       let imagenInput:any =input.files;
       this.inputkey.nativeElement.value = imagenInput![0].name;
       for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
           this.myform.controls.key.setValue(this.arrayBufferToBase64(datos));
        });


      }

    }
  }

  public arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
