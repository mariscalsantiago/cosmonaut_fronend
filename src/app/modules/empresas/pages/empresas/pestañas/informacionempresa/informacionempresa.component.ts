import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosempresaService } from 'src/app/modules/empresas/services/datosempresa/datosempresa.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

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
  public curpFinal: string = "";
  public idNivel: number = 5 ;
  public cargando: Boolean = false;
  


  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private empresaPrd: DatosempresaService,private routerPrd:Router, private modalPrd:ModalService) { }

  ngOnInit(): void {
    debugger;
    this.obj = this.datosempresamod.datosempresaObj
    if(this.datosempresa.insertar){
      this.obj = {
        regimenfiscalId: {},
        actividadEconomicaId: {}
      };
    }
   
    this.myform = this.createForm(this.obj);
    this.catalogosPrd.getRegimenFiscal().subscribe(datos => this.arregloregimen = datos.datos);
    this.catalogosPrd.getActividadEconomica(this.idNivel).subscribe(datos => this.arregloactividad = datos.datos);

  }


  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }

  public recibirImagen(imagen:any){
    this.imagen = imagen;
  }
  public createForm(obj: any) {
    debugger;
    if(!this.datosempresa.insertar){
      
      obj.certext='Certificado de sello digital cargado';
      obj.keytext='Llave de certificado de sello digital cargado';

    }
    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      razonSocial: [obj.razonSocial,[Validators.required]],
      actividadEconomicaId: [obj.actividadEconomicaId?.actividadEconomicaId,[Validators.required]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern('^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})?$')]],
      curpInv: [obj.curp,[Validators.required,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      curp: [obj.curp,Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      regimenfiscalId: [obj.regimenfiscalId?.regimenfiscalId,[Validators.required]],
      centrocClienteId: obj.centrocClienteId,
      tieneCurp: [obj.tieneCurp],
      cer: [obj.cer, [Validators.required]],
      certext: obj.certext,
      key: [obj.key, [Validators.required]],
      keytext: obj.keytext,
      contrasenia: [obj.contrasenia, [Validators.required]],
      esActivo: [{ value: (this.datosempresa.insertar) ? true : obj.esActivo, disabled: this.datosempresa.insertar }, [Validators.required]],
 
    });
  }



  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);

  }


  public enviarFormulario() {
    
    this.submitEnviado = true;
    let noesRFC: boolean = (this.myform.controls.regimenfiscalId.value == null || this.myform.controls.regimenfiscalId.value == 606 || this.myform.controls.regimenfiscalId.value == 612 || this.myform.controls.regimenfiscalId.value == 621);

    if (this.myform.invalid) {
      let invalido: boolean = true;
      if (!noesRFC) {
        for (let item in this.myform.controls) {

          if (item == "curpInv")
            continue;

          if (this.myform.controls[item].invalid) {
            invalido = true;
            break;
          }
          invalido = false;
        }
      }

      if (invalido) {
        this.mostrarMessage();
        return;
      }
    }
 
    this.alerta.modal = true;
    this.alerta.strTitulo = (this.datosempresa.insertar) ? "¿Deseas registrar la empresa" : "¿Deseas actualizar la empresa?";

    this.alerta.iconType = "warning";

  }

  public mostrarMessage() {
    this.alerta.modal = true;
    this.alerta.strTitulo = "Campos obligatorios o inválidos";
    this.alerta.iconType = "error";
  }

  public get f() {
    return this.myform.controls;
  }


  ngOnChanges(changes: SimpleChanges) {
     debugger;
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      let obj = this.myform.value;
      if(obj.curpInv != null){
          this.curpFinal = obj.curpInv;
      }else{
        this.curpFinal = obj.curp
      }
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
           imagen:this.imagen,
           curp : this.curpFinal,        
           cer:obj.cer,
           key:obj.key,
           contrasenia:obj.contrasenia,
           esActivo:obj.esActivo
        }
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
      if(this.datosempresa.insertar){  
        this.empresaPrd.save(objenviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.alerta.iconType = datos.resultado ? "success" : "error";
          this.alerta.strTitulo = datos.mensaje;
          this.alerta.modal = true;

          if(datos.resultado){
          this.datosempresa.centrocClienteEmpresa = datos.datos.centrocClienteId;
        }

      });

    }else{

        objenviar.centrocClienteId = obj.centrocClienteId;

        this.empresaPrd.modificar(objenviar).subscribe(datos =>{
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
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
    debugger;
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
          console.log("CER",this.arrayBufferToBase64(datos))
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
