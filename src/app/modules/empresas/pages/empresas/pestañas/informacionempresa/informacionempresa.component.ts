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
      centrocClienteId: obj.centrocClienteId
      
 
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
    this.alerta.strsubtitulo = "Esta apunto de guardar una empresa";
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
           cer:"MIIFuzCCA6OgAwIBAgIUMzAwMDEwMDAwMDA0MDAwMDI0MzQwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWRpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMTkwNjE3MTk0NDE0WhcNMjMwNjE3MTk0NDE0WjCB4jEnMCUGA1UEAxMeRVNDVUVMQSBLRU1QRVIgVVJHQVRFIFNBIERFIENWMScwJQYDVQQpEx5FU0NVRUxBIEtFTVBFUiBVUkdBVEUgU0EgREUgQ1YxJzAlBgNVBAoTHkVTQ1VFTEEgS0VNUEVSIFVSR0FURSBTQSBERSBDVjElMCMGA1UELRMcRUtVOTAwMzE3M0M5IC8gWElRQjg5MTExNlFFNDEeMBwGA1UEBRMVIC8gWElRQjg5MTExNk1HUk1aUjA1MR4wHAYDVQQLExVFc2N1ZWxhIEtlbXBlciBVcmdhdGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCN0peKpgfOL75iYRv1fqq+oVYsLPVUR/GibYmGKc9InHFy5lYF6OTYjnIIvmkOdRobbGlCUxORX/tLsl8Ya9gm6Yo7hHnODRBIDup3GISFzB/96R9K/MzYQOcscMIoBDARaycnLvy7FlMvO7/rlVnsSARxZRO8Kz8Zkksj2zpeYpjZIya/369+oGqQk1cTRkHo59JvJ4Tfbk/3iIyf4H/Ini9nBe9cYWo0MnKob7DDt/vsdi5tA8mMtA953LapNyCZIDCRQQlUGNgDqY9/8F5mUvVgkcczsIgGdvf9vMQPSf3jjCiKj7j6ucxl1+FwJWmbvgNmiaUR/0q4m2rm78lFAgMBAAGjHTAbMAwGA1UdEwEB/wQCMAAwCwYDVR0PBAQDAgbAMA0GCSqGSIb3DQEBCwUAA4ICAQBcpj1TjT4jiinIujIdAlFzE6kRwYJCnDG08zSp4kSnShjxADGEXH2chehKMV0FY7c4njA5eDGdA/G2OCTPvF5rpeCZP5Dw504RZkYDl2suRz+wa1sNBVpbnBJEK0fQcN3IftBwsgNFdFhUtCyw3lus1SSJbPxjLHS6FcZZ51YSeIfcNXOAuTqdimusaXq15GrSrCOkM6n2jfj2sMJYM2HXaXJ6rGTEgYmhYdwxWtil6RfZB+fGQ/H9I9WLnl4KTZUS6C9+NLHh4FPDhSk19fpS2S/56aqgFoGAkXAYt9Fy5ECaPcULIfJ1DEbsXKyRdCv3JY89+0MNkOdaDnsemS2o5Gl08zI4iYtt3L40gAZ60NPh31kVLnYNsmvfNxYyKp+AeJtDHyW9w7ftM0Hoi+BuRmcAQSKFV3pk8j51la+jrRBrAUv8blbRcQ5BiZUwJzHFEKIwTsRGoRyEx96sNnB03n6GTwjIGz92SmLdNl95r9rkvp+2m4S6q1lPuXaFg7DGBrXWC8iyqeWE2iobdwIIuXPTMVqQb12m1dAkJVRO5NdHnP/MpqOvOgLqoZBNHGyBg4Gqm4sCJHCxA1c8Elfa2RQTCk0tAzllL4vOnI1GHkGJn65xokGsaU4B4D36xh7eWrfj4/pgWHmtoDAYa8wzSwo2GVCZOs+mtEgOQB91/g==",
           key:"MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS8AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucRFLOMmsAaFNkyWR0dXIAh0CMjE6NpQIMZhQ0HH/4tHgmwh4kCawGjIwERoG6/IH3mCt7u19J5+m6gUEGOJdEMXj976E5lKCd/EG6t6lCq66GE3rgux/nFmeQZvsjLlzPyhe2j+X81LrGudITTjDdgLI0EdbdV9CUJwWbibzrVxjuAVShRh07XPL/DiEw3Wk2+kdy4cfWmMvh0U55p0RKZopNkWuVVSvr3ai7ZNCwHZWDVqkUDpwDDGdyt0kYQ7qoKanIxv/A9wv6ekq0LQ/yLlOcelkxQeb8Glu4RXe+krRvrASw1eBAQ3mvNKpngwF8vtlyoil41PjHUOKALMJtNpywckRRYOk4703ylWIzTfdBlrZ6VmDBjdC5723G1HAx3R/x+o+08++RNiFaN06Ly5QbZZvjnealDfSKz1VKRHWeXggaW87rl4n0SOOWnvabKs4ZWRXTS0dhWK+KD/yYYQypTslDSXQrmyMkpc1Zcb4p9RTjodXxGCWdsR5i5+Ro/RiJvxWwwaO3YW6eaSavV0ROqANQ+A+GizMlxsVjl6G5Ooh6ORdA7jTNWmK44Icgyz6QFNh+J3NibxVK2GZxsQRi+N3HXeKYtq5SDXARA0BsaJQzYfDotA9LFgmFKg9jVhtcc1V3rtpaJ5sab8tdBTPPyN/XT8fA0GxlIX+hjLd3E9wB7qzNR6PZ84UKDxhCGWrLuIoSzuCbr+TD9UCJprsfTu8kr8Pur4rrxm7Zu1MsJRR9U5Ut+O9FZfw4SqGykyTGGh0v1gDG8esKpTW5MKNk9dRwDNHEmIF6tE6NeXDlzovf8VW6z9JA6AVUkgiFjDvLUY5MgyTqPB9RJNMSAZBzrkZgXyHlmFz2rvPqQGFbAtukjeRNS+nkVayLqfQnqpgthBvsgDUgFn03z0U2Svb094Q5XHMeQ4KM/nMWTEUC+8cybYhwVklJU7FBl9nzs66wkMZpViIrVWwSB2k9R1r/ZQcmeL+LR+WwgCtRs4It1rNVkxXwYHjsFM2Ce46TWhbVMF/h7Ap4lOTS15EHC8RvIBBcR2w1iJ+3pXiMeihArTELVnQsS31X3kxbBp3dGvLvW7PxDlwwdUQOXnMoimUCI/h0uPdSRULPAQHgSp9+TwqI0Uswb7cEiXnN8PySN5Tk109CYJjKqCxtuXu+oOeQV2I/0knQLd2zol+yIzNLj5a/HvyN+kOhIGi6TrFThuiVbbtnTtRM1CzKtFGuw5lYrwskkkvenoSLNY0N85QCU8ugjc3Bw4JZ9jNrDUaJ1Vb5/+1GQx/q/Dbxnl+FK6wMLjXy5JdFDeQyjBEBqndQxrs9cM5xBnl6AYs2Xymydafm2qK0cEDzwOPMpVcKU8sXS/AHvtgsn+rjMzW0wrQblWE0Ht/74GgfCj4diCDtzxQ0ggi6yJD+yhLZtVVqmKS3Gwnj9RxPLNfpgzPP01eYyBBi/W0RWTzcTb8iMxWX52MTU0oX9//4I7CAPXn0ZhpWAAIvUmkfjwfEModH7iwwaNtZFlT2rlzeshbP++UCEtqbwvveDRhmr5sMYkl+duEOca5156fcRy4tQ8Y3moNcKFKzHGMenShEIHz+W5KE=",
           contrasenia:"prueba123456"
        }

      if(this.datosempresa.insertar){  

      this.empresaPrd.save(objenviar).subscribe(datos => {
        let resultado = datos.resultado;
        let mensaje = datos.mensaje;
        if(resultado){

          this.datosempresa.centrocClienteId = datos.datos.centrocClienteId;
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
       let imagenInput =input.files;
       this.inputcer.nativeElement.value = imagenInput![0].name;
    }
  }

  public abrirKey(){
    let input = document.createElement("input");
    input.type="file";
    input.accept = ".key";

    input.click();

    input.onchange = ()=>{
       let imagenInput =input.files;
       this.inputkey.nativeElement.value = imagenInput![0].name;
    }
  }
}
