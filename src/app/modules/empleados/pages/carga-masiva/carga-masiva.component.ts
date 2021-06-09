import { Component, ElementRef, OnInit, ViewChild , Input, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { EmpleadosService } from '../../services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { tabla } from 'src/app/core/data/tabla';
import { truncate } from 'fs';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent implements OnInit {

  public myForm!: FormGroup;
  public arreglo: any = [];
  public insertar: boolean = false;

  public cargando: Boolean = false;
  public submitEnviado: boolean = false;
  public cargandoIcon: boolean = false;
  public idEmpresa: number = 0;
  public fileName: string = "";
  public arregloTipoCarga: any  = [];
  public idEmpleado : number = 0;
  public listaErrores : boolean = false;
  public fromEmpleado : boolean = true;
  public estusEmpleado : boolean = false;
  
  public obj: any = [];

  @Input() public datos:any;
  @ViewChild("documento") public inputdoc!: ElementRef;
  @Output() salida = new EventEmitter<any>();

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };


  constructor(private formBuilder: FormBuilder, private routerActivePrd: ActivatedRoute, private reportesPrd: ReportesService,
    private routerPrd: Router,private modalPrd:ModalService,private usuarioSistemaPrd:UsuarioSistemaService,
    private catalogosPrd:CatalogosService, private EmpleadosService:EmpleadosService) {
  }

  ngOnInit(): void {

    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.obj = history.state.datos == undefined ? {} : history.state.datos;

      
    this.catalogosPrd.getTipoCarga(true).subscribe(datos => this.arregloTipoCarga = datos.datos);
    
      this.myForm = this.createFormcomp((this.obj));


  }


  public crearTabla(datos:any){
    
    this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("nombreCompleto", "Nombre de empleado"),
      new tabla("numeroEmpleado", "Número de empleado"),
      new tabla("estatus", "Estatus carga")
    ]


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }
  

    if(this.arreglo !== undefined){
      for(let item of this.arreglo){

        item.nombreCompleto = item.nombre + " " + item.apellidoPaterno+" "+(item.apellidoMaterno == undefined ? "":item.apellidoMaterno);

        item.estatus = item.esCorrecto? "Exitoso":"Error";
          
      }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }

  public createFormcomp(obj: any) {
    
    return this.formBuilder.group({

      documento: [obj.documento,[Validators.required]],
      nombre: [obj.nombre],
      tipoCargaId: [obj.tipoCargaId]

    });
  }

  public filtrar(){
    debugger;
    if(this.idEmpleado != 0){
      if(this.idEmpleado == 1){
        this.estusEmpleado = true;
      }else{
        this.estusEmpleado = false;
      }
    
      this.cargando = true;
    
      this.EmpleadosService.getFiltroCargaMasiva(112,this.estusEmpleado).subscribe(datos =>{
          this.crearTabla(datos);
      });
    }else{
      this.cargando = true;
      
      this.EmpleadosService.getListaCargaMasiva(112).subscribe(datos => {
                       
        this.crearTabla(datos);
      });
    }

  }

  public iniciarDescarga(){
    debugger;
    let obj = this.myForm.value;
    if(obj.tipoCargaId == '0' || obj.tipoCargaId == undefined){
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Debe seleccionar un formato a cargar");
    }else{

        debugger;
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

          let objEnviar : any = {
            
              idEmpresa: this.idEmpresa,
              tipoCargaId: obj.tipoCargaId
            

          }
          
            this.reportesPrd.getTipoFormatoEmpleado(objEnviar).subscribe(archivo => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
              const downloadLink = document.createElement("a");
              if(obj.tipoCargaId == 1){
                this.fileName = `${"Formato carga masiva Empleados"}.xlsx`;
              }
              else if(obj.tipoCargaId == 2){
                this.fileName = `${"Formato carga masiva Ex-empleados"}.xlsx`;
              }
              else if(obj.tipoCargaId == 3){
                this.fileName = `${"Formato carga masiva Empleados con pago complementario"}.xlsx`;
              }
      
              downloadLink.href = linkSource;
              downloadLink.download = this.fileName;
              downloadLink.click();
            });

    }

  }

  public descargarEmpleados(){
    debugger;
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

  
        this.reportesPrd.getDescargaListaEmpleadosErroneos(112).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Empleados-Erroneos"}.xlsx`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        });
  
  }

  public abrirDoc() {
    debugger;
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputdoc.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.myForm.controls.nombre.setValue(this.inputdoc.nativeElement.value);
          this.myForm.controls.documento.setValue(this.arrayBufferToBase64(datos));
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

  public enviarPeticion() {
    debugger;
    
      if (this.myForm.invalid) {
        Object.values(this.myForm.controls).forEach(control => {
          control.markAsTouched();
        });
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
  
      }
  
      let mensaje = "¿Deseas realizar esta carga masiva de empleados?";
      
      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
        
          if(valor){
            
            let  obj = this.myForm.getRawValue();

              let objEnviar : any = 
            /*{
                centrocClienteId: this.idEmpresa,
                tipoCargaId: obj.tipoCargaId,
                archivo: obj.documento
            };*/
            
            {
              centrocClienteId: 112,
              tipoCargaId: 1,
              archivo: "UEsDBBQABgAIAAAAIQASGN7dZAEAABgFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADElM9uwjAMxu+T9g5VrlMb4DBNE4XD/hw3pLEHyBpDI9Ikig2Dt58bYJqmDoRA2qVRG/v7fnFjD8frxmYriGi8K0W/6IkMXOW1cfNSvE+f8zuRISmnlfUOSrEBFOPR9dVwugmAGWc7LEVNFO6lxKqGRmHhAzjemfnYKOLXOJdBVQs1Bzno9W5l5R2Bo5xaDTEaPsJMLS1lT2v+vCWJYFFkD9vA1qsUKgRrKkVMKldO/3LJdw4FZ6YYrE3AG8YQstOh3fnbYJf3yqWJRkM2UZFeVMMYcm3lp4+LD+8XxWGRDko/m5kKtK+WDVegwBBBaawBqLFFWotGGbfnPuCfglGmpX9hkPZ8SfhEjsE/cRDfO5DpeX4pksyRgyNtLOClf38SPeZcqwj6jSJ36MUBfmof4uD7O4k+IHdyhNOrsG/VNjsPLASRDHw3a9el/3bkKXB22aGdMxp0h7dMc230BQAA//8DAFBLAwQUAAYACAAAACEAtVUwI/QAAABMAgAACwAIAl9yZWxzLy5yZWxzIKIEAiigAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKySTU/DMAyG70j8h8j31d2QEEJLd0FIuyFUfoBJ3A+1jaMkG92/JxwQVBqDA0d/vX78ytvdPI3qyCH24jSsixIUOyO2d62Gl/pxdQcqJnKWRnGs4cQRdtX11faZR0p5KHa9jyqruKihS8nfI0bT8USxEM8uVxoJE6UchhY9mYFaxk1Z3mL4rgHVQlPtrYawtzeg6pPPm3/XlqbpDT+IOUzs0pkVyHNiZ9mufMhsIfX5GlVTaDlpsGKecjoieV9kbMDzRJu/E/18LU6cyFIiNBL4Ms9HxyWg9X9atDTxy515xDcJw6vI8MmCix+o3gEAAP//AwBQSwMEFAAGAAgAAAAhAEqppmH6AAAARwMAABoACAF4bC9fcmVscy93b3JrYm9vay54bWwucmVscyCiBAEooAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALySzWrEMAyE74W+g9G9cZL+UMo6eymFvbbbBzCxEodNbGOpP3n7mpTuNrCkl9CjJDTzMcxm+zn04h0jdd4pKLIcBLram861Cl73T1f3IIi1M7r3DhWMSLCtLi82z9hrTk9ku0AiqThSYJnDg5RUWxw0ZT6gS5fGx0FzGmMrg64PukVZ5vmdjL81oJppip1REHfmGsR+DMn5b23fNF2Nj75+G9DxGQvJiQuToI4tsoJp/F4WWQIFeZ6hXJPhw8cDWUQ+cRxXJKdLuQRT/DPMYjK3a8KQ1RHNC8dUPjqlM1svJXOzKgyPfer6sSs0zT/2clb/6gsAAP//AwBQSwMEFAAGAAgAAAAhACNz49dzAgAAuwYAAA8AAAB4bC93b3JrYm9vay54bWyMlVtP2zAUx98n7TtkVl4hl9LCqraotKUXoEOIwWNlErex8CWyXUq//Y4TUpehaX45sXP8+/tc7KR3+c5Z8EaUplL0UXIao4CITOZUbPro9+P1yQUKtMEix0wK0kd7otHl4Pu33k6q1xcpXwMQELqPCmPKbhTprCAc61NZEgGetVQcG5iqTaRLRXCuC0IMZ1Eax52IYypQrdBVPhpyvaYZGctsy4kwtYgiDBsIXxe01I0az3zkOFav2/Ikk7wEiRfKqNlXoijgWXe+EVLhFwZpvyftRhmGX6Q5zZTUcm1OQSqqg/ySbxJHSVKnPOitKSNPddkDXJZLzO0uDAUMazPJqSF5H3VgKnfk0wu1La+2lIE3OTtLYxQNDq24VwHIGqLuFX3D2R6WoAB6SWr1x4Lq54+uoSAna7xl5hHa1QQC69utNE2tpm3tEyU77eTtNHh/piKXuz762YKjsm9mMN5VjmeamwKELtLzw7sZoZvCQDpn7Sre6Ei8Og6wSfUMRFWGMTZST3jJ4LhI6Gjlm9uMUaC6FAZqnic2ymOqoHlO4DQdVqfVyTVQ18Z1gKsUo2ZvKAUVJLdVgkiOZh/x1PgQDerBj3AYJl0waS86Wvxv8sqRV5YE0/ZERw4dWXQUpi1PdOzQsUXBJJ7oxKETi07Clm+u1w69tigY34CnDp1adBr6VmnmyJklZ96tmTtybsm5N7lw5MKSi/Dcs7o3jryx5E3oW6FbR95a8tabvHPknSXvvGu7dOTSkmDizn8zXTys7ofTyWq4HM1+PaziVYIGn691dYv+0jm+TnATM8wy+KbZh7399bej+e8M/gAAAP//AwBQSwMEFAAGAAgAAAAhAFCaawO8AwAA0g0AAA0AAAB4bC9zdHlsZXMueG1s7FdLj9s2EL4X6H8QeNfqYclrG5aD2F4BAdIggLdAr7REyUT4ECh6a6fof++QkiymWWedbdFDWx0sckx+881wHtTyzYkz74molkqRoeguRB4RhSypqDP082Puz5DXaixKzKQgGTqTFr1Z/fjDstVnRnYHQrQHEKLN0EHrZhEEbXEgHLd3siEC/qmk4ljDVNVB2yiCy9Zs4iyIw3AacEwF6hAWvLgFhGP16dj4heQN1nRPGdVni4U8Xize1UIqvGdA9RQluBiw7eQreE4LJVtZ6TuAC2RV0YJ8zXIezANAWi0rKXTrFfIodIbiXrBatp+9J8zAexEKVstCMqk8DU4ADlYiMCfdig1mdK+oWVZhTtm5E8dGYP3Wr+MUrDDCwKjsFDt6wlGPqvcZyvMwiqeTeyMele2waHdE0epZdT2yfbWggTJ2Me3emAaC1RJcrIkSOUy8fvx4bsAwAdHQEbTrXlhdK3yO4vT2Da1ktDQs6o11Z29mnG4ftomFcZgZN93C4vs4X6EQhpvNfP5aCldAc/v8zaCbfDKZ2FAJnnOW9Rmc/F6qEvLfDetOtFoyUmkIKUXrg3lr2cDvXmoNybJalhTXUmBmwnTY4e6EugElIkOclPTI4TC7zBgiNjSPNdmo6bXcvMdyspRe2DK5qAH6A/ub1XTGPm9rbzS4sCCM7Yyxv1QXP0Zg8KnyxJHnXL8rMwSV1STzMISA7Yedz7qJ8aWL1mE7sLNXwXqn6oJ/jVQE/HpSMfJGUiAfdnu4adj5w5HvicptXTcVrpPmYJszA6RxtrYhNs7fMloLTtwNH5XUpNBdFwIboVB2S7yDVPQzgJsKW8AeopBpWJoWruRXhZtHcrIUjBNP1XX3O5Ym/xlL03+hpcn8lpx6IXwhWv5PCVOc+uSfuoEC8i+T39wEriTydyftS3nqkJp8k9Q/XJH+VGuaS+nymCw+EVvrB9tsNYf67TSJL1rEpdh75uKWoQ+mrDLH6/sjZZqKZ9oDYJanseHYXqrN1de2oosW8GJJKnxk+vHyZ4bG8U+2PUMm9as+0iepLUSGxvF7cweIpqZfQ5V930LDhrd3VDRDvz2s7+fbhzz2Z+F65icTkvrzdL3102Sz3m7zeRiHm9+dm/hfuIfb7wXI2ChZtAxu66o3tie/G2UZciYdfXvbANou93k8Dd+mUejnkzDykyme+bPpJPXzNIq302T9kOapwz19HfcoDKKo+9gx5NOFppwwKoazGk7IlcIhwfQbRgTDSQTjx9jqDwAAAP//AwBQSwMEFAAGAAgAAAAhAPfsbqmqBwAA2CoAABgAAAB4bC93b3Jrc2hlZXRzL3NoZWV0Mi54bWyMmltv2lgUhd9Hmv+AeG/wMb5GSaoGTJq0QdVoLs8OcRJUwMi4t38/Z5MW77XtJfUt+Ms+xut8Phfji7fft5vR16o5rOvd5didBeNRtVvVj+vd8+X4n78Xb7Lx6NCWu8dyU++qy/GP6jB+e/XnHxff6ubz4aWq2pFvYXe4HL+07f58MjmsXqpteTir99XOk6e62Zat/9g8Tw77piofj0XbzSQMgmSyLde78WsL583vtFE/Pa1X1bxefdlWu/a1kabalK3//oeX9f7wq7Xt6nea25bN5y/7N6t6u/dNPKw36/bHsdHxaLs6v33e1U35sPHX/d1F5epX28cPvea361VTH+qn9sw3N3n9ov1rzif5xLd0dfG49lcgsY+a6uly/M6dL12QjCdXF8eE/l1X3w7q75EE/lDXnwXcPl6OA/nXSe9/F8fAPzWjh/JQzerNf+vH9sX3rO/Yx+qp/LJpu4PZWRomcRLGJ/ZX/e19tX5+aX1FdBafvs28bMuri6b+NvK95LwS+1L63J27yF/KSo6+84d92cF//noVXEy++m+3+smuNXPIZpqFyOaaTZEVmkXIFprFyG40S5C91yxFdqtZhuxOsxzZB7h2E8xHgCaZe4AmmiXALpuJ76RTT4XDPeUPn3rKmeiuAZrsZgBNeHOAJr0CoIlvAdDkd6NhaPJ7D9DkdwvQ5HcH0Lj1AaBJ6CNAk9A9QJPQEmCXEPTZdLDPrv3hU5+FJr8ZQJPfXMOpya8AaPJbADT53QA0+d0BNPl9AGjy+wjQ5HcP0Bi2BNglBOFGw+H6w6dwpya/mYaRyW8O0ORXADT5LQCa/G4AmvzuAFr/AFr/ABL//GQwMLpf+8OniCLrH0Drn4ax9Q+g9Q+g9Q+g9Q+gye8eoMlvCbDLDyxKhiPyh08RxcbOGUCT3xygya/QMDH5LQCa/O4A2vkDIJk/0uEL9YdPF5qYdGcATbpzgMbOAqDJbwHQTr8ATX5LDdMuP+hRWeX2lzTX/vDpQlO7bgFoFy4A7coFoF26ALR2AiR25sPX4g9312LtBGjtBGjt1DCzdgI0+S0BdvlBv8iydahj5PjpajKT7wypCXiO1CRcIDWKLpDaGQgpmYLc8PL5Wo53l2QnIaC5nYWQ2mkIqZ2HkJool0i7KLGXhteZ106vd3K7lkRqBwOkdjRAaoRdIu2ixC9NFlpOryNcYKKeGdzLGqt7YSPupY2YxU1WMX4vptb1QS9vxL3AEffcRszkJqsHp6dVF/TsBuzsIgGrnR1IDGZDyfCsPXN6InSut8tEbAaTpanuMkfXuol0qrbMM6fnJud6XYK41yWIWZd0cxueW88lztlx3QG2+66lwV2X4HV3cxGeW4/9LjR3SeEQ9+4SxOQuCbupA84tx7vdb2jHf4N7OzisJmvosBvj8dy4ozfjViFl6qvZhQxitZXDPX83GOO5YZM9tQNXiNiuFg1mzxu6MRXPDePa1NxERYjYLnoMJsuesBsV9bkLOd6FOrU3kcHkJpJHZD/XIdg4DFx267iUMvWkhSw+w25kwsZh6InssCdlqnEy7IXDQ08hx1W1vccMZvfY8NhShDB4RL0ORcw6dHjwKEK4/aNehyImHTodHh0KOa5isbcgYrWbxUc4w7d/MYX7O7YdajDp0Onw/V3I8e6bx7ZDDSYdOlWLokjNVEsBqnUyz03VygTL4SaMSY9P1eoBy+E+UntrjF3N8FgOd0rMlFC7XSyHWyUm68mp2kNiOdiudvD45dW2DcvB54TMtJHaKEG5gK7jEiJVpDYlWA7KJmTcj9QGAMtBSvWsAJ/KMesisC4h1kXMOgHq2ol1EbNOgConc33ErBOgytkTSWZdBNYlxLqIWSegOzt77hEx6wSocmJdzKwToMqJdTGzToAqJ9bFzDoBqpyMdTGzToAqJ9bFzDoBqpxYFzPrBKhy9pSWWReDdSmxLmbWCVBnJ9bFzDoBXbl6HgT3e8ysE6DKiXUJs06AKifWJcw6AaqcWJcw6wSocmJdwqwToMqJdQmzToAqZ0+umXUJWJcR6xJmnQB1dmJdwqwToMqJdQmzTkBXrp6O4VN7Zl0C1uXEupRZJ0CdnViXMusEqHL2JJ5Zl4J1ObEuZdYJUGcn1qXMOgGqnFiXMusEqHJiXcqsE6DKiXUps06AKifWpcw6Aady/zbL6Wd/sC5l1glQ5cS6jFknQJUT6zJmnQBVTqzLmHUCVDmxLmPWCVDlxLqMWSdAlRPrMmadAFVOrMuYdQJUObEuY9YJUOXEuoxZJ6ArV49K8fcsZl0G1qlHqVCeM+sEqLMT63JmnQBVTqzLmXUCVDmxLmfWCVDlxLqcWSdAlbNf35h1OVjniHU5s06AOjuxLmfWCVDlxLqcWSegK1dPg1EbZl0O1oXsaXHAtPM/w8D56a+FTDwXgHkhMc8FTL0jUQmwn2YCJp8TohpgvxQETD8nRDVA/HMBE/BIVAPEQHkJ8fSbK2zmj0Q1YB18fRnx9VXB43uJn5q6rVbyaubo+FleHfQvLe7L5+q+bJ7Xu8NoUz35FoMzr2fz+t7h8e+23h+P+mt5qNu23v769OLfIK3824bBmY/zqfbt//wgL0Oe3km9+h8AAP//AwBQSwMEFAAGAAgAAAAhAIzwlMKgBgAAkBoAABMAAAB4bC90aGVtZS90aGVtZTEueG1s7FlPixs3FL8X+h3E3B3/mxnbS7zBHtvZNrtJyDopOWpt2aOsZmRm5N2YECjJsVAoTUsvhd56KG0DCfSSfpptU9oU8hX6pBl7pLXcTdMNpCVrWGY0v/f09N7T7+nPxUt3I4aOSJJSHred6oWKg0g84mMaT9vOzeGg1HRQKnA8xozHpO0sSOpc2n7/vYt4S4QkIgjk43QLt51QiNlWuZyOoBmnF/iMxPBtwpMIC3hNpuVxgo9Bb8TKtUrFL0eYxg6KcQRqhyCDxgRdm0zoiDjbS/V9Bn3EIpUNI5bsS+Ukl9Gw48OqRKSLNGAJOsKs7UBPY348JHeFgxhOBXxoOxX155S3L5bxVi7ExAZZTW6g/nK5XGB8WFN9JtODVaeu67l+Z6VfAZhYx/Ubfb/vr/QpAB6NYKSZLbpOr9vq9rwcq4GyR4vuXqNXrxp4TX99zeaOJ38GXoEy/e4afjAIwIsGXoEyvGfxSaMWuAZegTK8v4ZvVDo9t2HgFShkND5cQ1c8vx4sR7uCTDjbscJbnjto1HLlBQqyYZVdsosJj8WmXIvwHZ4MACCBDAsaI7GYkQkeQR4HmNGDhKJdOg0h8WY45ik0V2qVQaUO/+XPVU/KI3iLYE1a2gWWpGtN0h6UjhI6E23nQ9DqaJCXz75/+ewJevns8cmDpycPfjp5+PDkwY+ZLkNwB8dTXfDFt5/9+fXH6I8n37x49IUdn+r4X3/45JefP7cDYbCFF55/+fi3p4+ff/Xp7989ssA7CT7Q4UMakRRdJcfoBo9gbMoLpuXkIPlnEsMQU0MCh6DborovQgN4dYGZDdclpvNuJUAwNuDl+R3D1v0wmQtq6flKGBnAPc5ZlydWB1yRfWkeHs7jqb3zZK7jbmB8ZOs7wLER2v58BsxKbSqDkBhmXmc4FnhKYiKQ/MYPCbGM7jalhl/36CjhKZ8IdJuiLqZWlwzpgZFIhdAOjSAuC5uBEGrDN3u3UJcz26h75MhEwoTAzGL8kDDDjZfxXODIpnKII6Y7fBeL0Gbk/iIZ6bh+KiDSU8I46o9JmtpkriUwXi3oV4Bc7GHfY4vIRCaCHtp07mLOdWSPHwYhjmZWm2kc6tgP0kNIUYyuc2GD73Fzhsh3iAOON4b7FiVGuM8mgpvAq7pJRYLIL/PEEsvLhJvzccEmmCiWAdo32Dyi8ZnUforUvXeknlWl06TeSah1au2covJNuP8ggffwPL5OYM6sF7B3/P2Ov53/PX9vmsvnz9oFUQOHF6t1tXaPNi7dJ5SxfbFgZDdVq/cUytN4AI1qW6H2lqut3CyEx3yjYOCmCVYyKOHiIyrC/RDPYIlfVZvWaZqrnqZoxlNY+atmtSkmp3Sr/cM82uPjbMdarcrdaUYeKRZFe8VbtcNuQ2Rov1Hswlbq1b52qnbLSwOk7D8xQuvMNKJuMaKxbIQo/J0RamTnYkXLYkVTql+GahnFlSvAtFVUYP2EYNXVdjw3OwmATRVmZCzjlB0KLKMrg3Oukd7kTKZnACwmlhlQRLolbd04PDm6LNVeIdKGEVq6mUZoaRhiOJRR5yl5CDMvnWesW0VIDfOkK5azoTCj0XwTsZYkcoobWKwzBYvRcdvx6x6cj43wrO1MYOcPj9EMcieV617MpnCANhJJNuFfh1lmSSp6OA0zhyvSydggooIkiNGo7cjhr7KBxYpDlG3VGhDCW2tcC2jlbTMOgm4GmUwmZCT0sGst0tPZKzB8NgusX5X464OlJJ9DuPfD8TE6YPPkBoYU8xpV6cAxTeEAqJp5c0zhRHNFZEX+nSpMOe3qR4oqh7J2zGYhziuKTuYZXJHoyhz1tvKB9paPGRy67sKDqSyw/7rqnl2qpec00ixqpsEqsmrayfTNFXnNqqKIGlZl1K22DWnBda0l10GiWqvEGVX3FQqCZlrRmWGatHidhiVn562maee4INA84W/w26pGWD3xupUf5E5nrSwQy3WlSnx1+aHfTvCDO0AePTgHnjORqlDC3UOCYdGXnSRntAFT5K7I14jwhOYJbTv3Kl7HDWpeUKo0vX7JrbuVUtPr1Esdz6tX+1610uvW7kNhEWFU9bKLlwGcR7FFfv2i2teuYKLlkduFEY/KXF2tlJXh6gqmWjOuYLLrFDSUNywOokA69/zaoFVvdf1Sq94ZlNxet1lqBX631PODRm/QC7xma3DfQUcK7Hbqgev3myW/GgQl169I85utUsOt1Tpuo9Psu537+TIGRp7RR+4LcK+ya/svAAAA//8DAFBLAwQUAAYACAAAACEAb/BHmLQIAADpKQAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbKxaW3OqSBB+36r9Dxbvq8IAXko9hRpj7iYm5vJGFBPqoLiAycn++u1hGKWbiZUYXwLp60zP1z3NOK1ffxZB6c2LYj9ctjW9XNVK3nIazvzlS1u7ux38U9dKceIuZ24QLr229uHF2q/O33+13sPod/zqeUkJLCzjtvaaJKtmpRJPX72FG5fDlbcEzjyMFm4C/0YvlXgVee4sVVoEFaNatSsL119qwkIz+oqNcD73p14/nK4X3jIRRiIvcBMYf/zqr2JpbTH9irmFG/1er/6ZhosVmHj2Az/5SI1qpcW0efKyDCP3OYB5/9FNdyptp/8UzC/8aRTG4Twpg7mKGGhxzo1KowKWOq00DqOo0wrXSeAvvVFUitcLGNBH1wvC97ZW1SqdVmUjNvNhxnyZSpE3b2uO3nSGNhdJJSa+9x7n3kuJ+zz2Am+aeDNYV63E1+s5DH9zwRMgVWEIK3fplT7GK5h1WzO0UhKuzr150vOCABwwreROE//NG4FYW3sOkyRccH6KiARI8yj8z1umY0hd8cFxm0T4Xzngc307JT4OOb384AcpYCAYz27s9cLg3p8lrzADAObMm7vrINkS6+WaYVu2YW14N+H70PNfXmE+ulm2uLtpGEBg4G9p4XOIw8q6f0RIMtOszGxm1HVuZ7qOYZbSKfwfBoG7ikUQhTVhB8KV2oHne2bnO+oQ3FQdnlLdLn9/FGZmBp7SjL6HGRh5Ohp4/mQ0dmYGnj8ZTS0zA8/MjAGr/+WVgYqVTgaeUn2vFW5kduAp7ewTW45cgTiehQIq35qPLqHGX36yPLoEHX/ZB7S6hBt/+VFsdYk4/rJXUCTW9C3YrL2WWZdw4y97RUUCTt8iDopPXbfNalqbvoxcXUKOv2RDMatlvdaw67VvFSeJOQ60zJC1T30xZLnkL3JE9b3q5aZg5lC8Tz4ZEsX8RUJnr7lJNBtbNLNvRVmCmG8cEjn7BUei2ciVzr3mJMFsbMFs6WXTYt/c3SSmjS2m2XeKsCGhzF8kcPaZEfcqdspc+cwHOU4+eIMGa/jlPGMSi/wlV332MbXZyHM1tfb9gDMJRv6y3W6+XkQqos9Jm8G+m7idVhS+l6CnhrDF0JRBh643ufG0N4JFEdHadEvQDk65uMPl2xogGnqoGKhvHaPWaFXeoFmbZjJdKcMbIq7Uo4Q+JRxRwoASjilhSAknlHBKCWeUAB2nmI0c6YVievUqnt4lVbqihBElXFPCDSWMKeGWEu4oYUIJ95TwQAmPqunpeHpPVMnZrLmMkrNZ4RwK6ga24xRW3Sksu1NYd6ew8E628jCsLeTqjDjL0AD1MYfL+kaoAmjfQB6yugB5c1O9ipDn8uIDaAP5ukkgr5KxsExPJWNjmb6QgWKRm2sNyxyp7GynmmbcQCVD0vRYIdMgWB+qZAhgTlQyBAynink1yBqeqeyQOJ+r7JA4X6jskDhfqmRInK9UMiTOI5UMifN1UYZVSZxvivNiVRLnscoOifOtSobE+U4lQ+I8UcmQON+rZEicH1QyJM6PKhkS5yeVDImz4yiEdBJop6sSIpF2slTNpyF0SKTkKHKV6bQuZcmKLZFgO1m2YiESbUeRrkwn4XayfK2lByn5mge28zVP7uao0DASqy7mkiD1MZdE54ilvQGrGiYtTViPBOwYc0mkhphLQnQifBq6WTPrzDYJzk6xMgnduVCmez2uxBgBV3kmXYoR9kbGci28mUwvZDnSMwjGb7FVEtq7PNekKY1VieH7PJeYfcjzbKL4iIJAwveUoQDqHc1Dfn643eMo2DH0KMp7O2PkADJ5X0o9ZpCk5AFLjwHT5hbQxzULzQXyZ24toLYCmmdVigF5O0+TJFEXc0kS9TCXDKuPuWS5j0zRnDesGuEMsB4J/THmktAPMZeg+iTz+VkCYmWCsjPMJTA73236QrBNo6ETs5fILGFe5Zm6QTd3pGoR4Fx/6vIm45iWTbdw5K9KwneL/RHdO8wlUJkgLqPZjbhE9QEbJih7zHMZActTtiqWIr+xVbJ3ItybhfzGunS7BOCn352fwMzJoF9IdGy1sL8Kq1QLI97aDhXlPnwPq3IffSYXtlfEtQgYephLoNnHXLLcR1YaILNm10loB0jPpLmPuDb9FsBc+hUgfNqWadD1PMWKBH5nmEvgdy7MfranX2QzteD8inyl583SfLjKM3WdhG+ER0Tgd525ZIzusOO8nk2TGxml+/od4pLATzCMaG7vNPywk/u4k/skZlrYuVFkae5289xiZu906ACslTu3mgxg3pxIHKtFhngptxhB2QunBqrsRYcJNploF3Np9mIuzV7MpdlriybEtuknxwDpFbIXH37Q7MVcmr3C56etM1amGYy5NIN3m74QbJPVaG90iczSjLnCTkmSjnbqXmc+Tb1GVvUm41jQSOB6Mt5p8RZxGe3Ld+pOsC5N7zyXNuZ5XqExx2Ahh3xinrpq4945WAfhvpjfeFXoHtsXbguduZqM4U6XyjlWa8Gth/wZ4DYxRcqLGxPiCHzhRS8ev84Qww/56yW06byKbKibmxTiYgKhX+hNOF+FAkToj3DzAk5Miww4NW3y400FZ8hvaxjpR/t2TJ3WDA7qJ27gw5PfX5GDhJ9XKa+UfKzgV47AjxO4lhHABZFu4C5/i+N9ccFiwJoDvVrVQZffulkHrt559Wczb+m0KhtKq4Kd7uHokjUv1Y66h3V0xZpXake9wzoaseZI7ah/WEdj1hyrHR0d1tEta96qHQ0O6+iONe/Ujo4P62jCmhO1o+FhHd2z5r3a0clhHT0wKDDKhD09rKNH1nxUOzo7rCPHYbw2Kud0fmBXXXDVVbu6OLCrHrjqqV1d7nRFai3cQ1u5L96FG734UO0DuEvHL+KVInFjDd7gBl5KEZft0tdXuDPpwW+swJ2HYSJeYYvhlsZesl6VwsiHu5DpFtLWVmGURK6fpHvN5pJm538AAAD//wMAUEsDBBQABgAIAAAAIQBdQS0Cyg4AACwyAAAUAAAAeGwvc2hhcmVkU3RyaW5ncy54bWzEW0tz28gRvm+V/8OUDqlNlcci+KZjOwuCIAmJIBiA1Nq+pCByTEEFYhg8VLZvOeZn+LgHH1J728qNfyzfAJQlo0FKzsZJldalxTzQ6On++uvu0Ys/v9+E7EbESSCjlyfas9oJE9FSroJo/fJkMR/y7glLUj9a+aGMxMuTDyI5+fOrJz+8SJKUYW2UvDy5StPt89PTZHklNn7yTG5FhJF3Mt74Kf43Xp8m21j4q+RKiHQTntZrtfbpxg+iE7aUWZS+PGm08d4sCv6WCWP/ROucvHqRBK9epK9sbmfXIn5xmr56caoeFY+1WptHcnMZi3p5qN3lfuSHASQnq7jGDRmlsZ9KthIMv1z615JtZczSQGy2kgXRSqQi3gSRv5J0vb7O/GSJ3UWUiqQ8Xud17mUiXMmE/WhFyzD7ILDjOhYJniRi908/xLYJ1MxCn72L/eUy2P0aMQvShMyP093nZRZK1msq8SaW5/6x/I5Wh2/jTFz6fRGJd8EykEQDGvcCKvru7zgHtsaq2A/Jrrym8TMZ46t9ZgfJRrKxjP24cvdhcE1U02nxqWNbU52Z3sw0LH1CJTCuBA6ZPu/rU902X5cHxnycnzA54BbXB7YzJRu1GnwkYnUySns3+MWvPKJKE/Bjn8lL/HN3/sR+6rzvX/vMwPnDwqOATGjwBj/LLoP8lIl8zTqfyTBQh+wfFG9KVFvnb2XkszCAtasPyy0HVoxzZJGMU6rRLq/V89Pcn+EsNxhqrXbwPqWvq0GNcQZfGGWwhhBfHFdownwnlmlwUyEtjtNwcJ5zooBGl1uRwobdpzRYkk3bvYOeqxT7gOce8dtG+dyYlxFIafImn4lIgaHyUeIh7bLfkSntxztRg1/AufzLkB5eq7tX/0WlATf4zP+wpR6Mb9SnTt/VPar2Fq/eq9Pkk2BF0VWp4qC2FUzGMIzya7DE32wFAgEFF3hsEmwKtwC8CAA3UNCTy0Cs/JVImCEROQDLwY2fsFksVxmQUUbUhbTChWA9zCxiEznIhjqG6wLLNI2gY5PPYz9K3imkWFIXbvJ+/0JneyN2yxL0OrlmfPh4ANHLw50utLBNqzRQpdAEsQ2hyGcFpJPduHEV+FuKYm3evq9RC2CwxkchJN1Xqp5Awb7So9JwcBOENGTl+tx9Vu6YhxzxgeLznToPyNn6WqUIeQCnKH9zVajx9Olcnw5MotyuxvUVQi/RQ+0gMChNVGl2KSO2hOqWQYr/VIwNIgRLKg4O7Cq4ynz8UPV3Ku0WeyfimkJEh9eajwyibeWtZ6ZrWHOHmFiXz8AYlNz5yQm8T25wQBSTetw1jYXrOVqV7LYEfCsrVSeLTRTv2StDMZ6tv85Z0BXcGUHlstKre9wIsv0W9u6X98GSIH6Xd++raQlZFYgqAkbDb+s+Rg6CDGZCRR97fYOYIUJaETyAEjR29CAoHC+L1WvV9yqV0b2VrF+p5T4FLCRXtlJoo4IlGRKGAhxTb3iLuLiWH4n8Pd67r48xTi9nUkQZXRjBmUXOX4MVVeN1XXFefBXZSb3yy2fB2cl5ryR4LXTCxHsoSLBYhHtLuKPBZY0rxwqDDWXRNa7V7n+hYrHKUokhc+u1SR62+bT6I9o1bjhTbzGZOy6xZ7wRPwW3yv35KUOqkSjPfoqvSYOYsvUaH2RAxTUd0bgGqLkLSTJFPKIWx61pH96lE810uDsm05V84t0R7gkbxY+Dd916Y5VkYF2Rf50hRSFvqHMNvO6WXzLJjvAVfKA1nZuubhiWMzUJK6jzucWsSN7kMEN8sMU9CZCoIJd1PspEHIsKhTe41oCTrsQmCj7u7UsyT2zhKfmhVXyRbQ1NkitATUPYOeIzXlNxMPUiCK8kTQwbfAzIC+mh39O+K9bBRlB20eCe4cwtHdh8Ts4cwKFDn8hsqDI1rblPR9k2A3RL1iCfitCgslKKn1iLF7rmqAoKarm9VKgAzgJEB1OlKmjxA0ittWATFzTT0hDhESz36Ekkb3M7WF5Jf7n7FClocZYgetQ685jmWeXl4LPbWIKebCqF7QC4gEYVp4zgO7RcmyCI1kaSddTRtC6f+h9AsAkRw4iiye7cPK3AJg2pTw5OlcWDHp9m4kayiQDoECX1+HxsMtd5o08UeST2AybKZ4VtKLRhBOHqOGr/vU9DGwaQHruWoU+Z+Xrmmh6l+FDyQCR+HMtQ5Z4xnC4KqGnUQfdQOwhpPqdBLzZFuk7nEA7U6/wvwIHdL6lPkQCDc+f8TUVoU9zmoDHUG9gT5BEAyFxJU0uc+4zZjjvSSfJfb3LPj9gkC5A/yFQmu8/lI8KUPsoG1PzrADugTSipWpA5mWzmuMymeVW9Dd2o2E5e1IabjcjTDp+j3FQBAPUOH5iLuWeMia3Xu1i08bMwqMgCMGi45sCaM29heR5dDJsM/fcoV1ERQVHezk2DhLZGDdwDaB1nH5WrW+ucxu/LDpPQvyHZHVboi7kztMiZNDT+Jlv6KWCjrAwM9XXXmOhviC03UO+AF6SigvBiDKWFme7OdduhK/Mc2HDYsMqUG+r4QS6sC/rRyE+NuYJGkpI02vxnfQLod0k5o9HhUyAU/WxUOVTkNXS7SCPJx/cUCBnObEYjXxPa7BvM0GfWnNbQmhpf9L1KfEFxKWdP+c7lNzZRb3Am597P+sgk8jaRuVvVy1pIhnVqWM0c6s91xyGRu9nhM32kz50Bcf5mlw8d90wfOIAwImEPSrOdvjWxdJcGwha4nDMd7P5BoosypCncgBxqC3jrOiO8i0iCQmH+vQynh4Ny6domtwyag7QAFCAHA3NCvrsFMBhb0zFFJhRsbevtYuxUHhuAW0UL5gyZgfVUkr2tMI8wCvBlLPXMIQm5bY2PrZmj/Bt8hQ1N5NrUmNp1nsOh0SdcBxXAvk2eNuEGHnYkA0BJfbIg+NNuc9ObuwtjvnCrT70NTLT61OtQw78wDeQB5FVQxx/APv5EZO7AcUB1IUh5TUfjCJ+uNZmwyZupQYh7p85hB1UV6A7cRp9UlKZROFtMEZDJq0C99NnQJarotJUxDhfQBLFGxFijzw4BECpKTj5G3tXj3jnKKBaRogtu2D8UUVBjebsAmSBq6AJ384ELcsBdEOMFMMkDJpXF6AI9+uwW8MhoC9jC+s6EUosuQGQxAR4b54yaYBfEA645qQikXeCIpUrMCwJl3R4fDyzmmSPomWBMDwzLrSg79ZALnusT8mk9QGqfnc2qGUevgeILAM2m68BF5rOyKnqokpkTE3ITz+rBURB7DAAjWQU9VJ9yr8vxnfb8DVmC2O5RPNRqNX6+8BBXygsU/fcQwA+RS1ReFlN9RGFS8WVnVuSXzLQVNVWAgwSJASMZeLYDAKAEHgWOiXL7uT6gssBiJpTgot9noWRI3fv0q75gp9l5VivvOQgEKl2u/84XpKTjymtaThlzGzwNpCsiHBSsZdCt19r15pgywmLwzSIfdM9GtVZZlJUS5TL+iXz27+pLfv+uI+lKqf7v8wT1VfSF0eBNRHwjTl4NUf5HXzP/F+XoYL37lyrwP2fDvCGclxuLUVQQkEUJ+Yw9+cHETFVifCfQi8h7AM+Rv4BzXubFlESEIq8w+TH6xOjSbfNaglrZR4lAPnbyLEbSHzN9K0JURbHMDFEiVk1fVMxi1ZqM8Vhti5LqrBjO4q0qIyMzRlal5gXRjaqpSsya7n7Dfvk3eWKd4TfV0PDD52ziY2oaZ0u1Lm/tRndzk2JuXpsP91vuPu33NCQqK3jRRulUdYiw22Exi8lonCToWe1nFs8OyVyl6oP75x3j50xXfWOUDpcyQEGmKC3eljme/OAhu0CbmF3GGcoelu15RyQm4aHdou5qwzAqKrwjHBttVRmyos+PSwOH/He0eG13a0jGNfuMeOf9QWPyelprlwSutvrNOhftpyuZ4mZD+Ax1ZFySKN1YuJ20P1o1qTylqGqRywmP6Uw/suKsIXaiBb3v94gE7bqKlkird9s/VrcBIqnMmJbSbxtlygXhB0+Z90x/9hQlxSQN0qzoucBYlIviSsHutzANtqF4yore8l15jxX9tv02lF70HnUGSCX75nO05pU/3yFHzKJMOany6u/or9/igt/kMPdkXmaqH3wMDgoVHHTnsmpxV8KP6SWXMVp3yNhX4mN5gZ1fUInowMQanfdatU69blnd8qqxaY8KjxsbE9d1a+UZ1U61LqT7a6PT/Wl92K3WV6rTqKQlMfV33BioFqkICyN1g0YSQFSD/+OgcBzq96HkG00Tke0C1ZeioXPE2OZB7mcqUoW43nUsmt5ePELZb/cJN5aO2fD+CtKRFxcUI2/m3rVRQDByzgG8yWlHpliHOiJU4/EM7ISh3o+yqGp07vkJnu93UXev9u1RFddvPw2wplpMRefiiETf5NB7xnLQSb+nw/faDRptXZkAnv1495kUCUe7XzfU2Ud+vKyajFJLrVZr1Dv2iAbWe4OujY4a4ei4Lwi2s0Yk+Xg/jpbBJN4UU45EUQ3h62BrBNUWFWiYLeKlspQwZ2dT1ej6HQHMr7yGpev6cPio4FVx6McC2SNi3d7Mju7yfyO5cJjHwsyegh50lztfLW51HnHTb6K+X0jSf8vvC9ajevBwKjQbjuz7PSHARIcImUXZrfYXKwrSdrn7lFTwb1MhPcmHByL1wcv3DYKvIJOk4Whp51cT1MWT8uBd0CmP3FPHbbBhP8rLMFhjP2Qe5IYsOnjqpuTRObdJIC7BqKtK8pGzcalZzS6L+CX4qGbJRt0Nlk9++NG5k5FQr90vOYk4KqM7NLDLsS9VnOOBKYdI7/FlB/jP1/kmzXFo9vofvUaEGXJKuv3XMb4oLXytZ2ILOX48oKKiK/vApDLQPDD9i6j7298PiLmvmwR5e/2WipSNhgLYI2W+dZuH9HCbGD4wD73SFfAhxBWPlbLzYxZKuN9xR9vTv0efxT2C9pDQpEzxwIIyYD8wHTcuUomoBoRX8PbA7Dw8HwG6ItcrT8jj/rFVxZ8l4N3J7lf8FUES3JW1iGeUg/BBiU/x1x6v/g0AAP//AwBQSwMEFAAGAAgAAAAhAAJ8nDI1AQAAUQIAABEACAFkb2NQcm9wcy9jb3JlLnhtbCCiBAEooAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJySy07DMBBF90j8Q+R94jxQAStJJUBdUQmJIhA7y56mFvFDtiHt3+MkbUilrljO3Oszd0Yul3vZRj9gndCqQlmSoggU01yopkJvm1V8hyLnqeK01QoqdACHlvX1VckMYdrCi9UGrBfgokBSjjBToZ33hmDs2A4kdUlwqCButZXUh9I22FD2RRvAeZousARPOfUU98DYTER0RHI2Ic23bQcAZxhakKC8w1mS4T+vByvdxQeDMnNK4Q8m7HSMO2dzNoqTe+/EZOy6LumKIUbIn+GP9fPrsGosVH8rBqguOSPMAvXa1iWeF+FwLXV+HW68FcAfDkG/0ONsiDtCgEchABnjnpT34vFps0J1nuZZnC7itNhk96TIyc3tZz/y7H0faGzI4+B/E0+AMff5J6h/AQAA//8DAFBLAwQUAAYACAAAACEA5ODhQ+8BAABBBQAAEAAIAWRvY1Byb3BzL2FwcC54bWwgogQBKKAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACclN9u2jAUxu8n7R2s3BeHrt0m5KRiQJv1LwLaW+TaJ8SbY0e2iWBvs2fZi9UhKg0dsqbdHZ/fyZfPRz6HXGxKiWowVmiVRP1eHCFQTHOhVkn0uLg8+Roh66jiVGoFSbQFG12kHz+QqdEVGCfAIi+hbBIVzlUDjC0roKS257HyJNempM4fzQrrPBcMxpqtS1AOn8bxZwwbB4oDP6n2glGrOKjd/4pyzRp/9mmxrbzhlAyrSgpGnb9leieY0VbnDk02DCTBXUi8uzmwtRFum8YEd49kzqiEkRdOcyotEPyWIBnQpmlTKoxNSe0GNTCnDbLil2/bWYSeqYXGThLV1AiqnLfVlLWHXSwr60ya6R/UIg6I/fkt2Vpqgn1dy3Zh95NuLM7S012BD4KFrdaMqpW2iGmFlC6fjb/PP/+nf378R41Ce3Hv4LAlC+Ek2Id8So070qH+l26Ldg7bBrVmx9RpOykr6dusbdfp3nMhOAcVQMMA+xZgowAbB9gkwC4D7CrAsgD7HmDXAXYTYLcBdhdg90fZ9Ww5HV5NlsP7UfYwW8bLfrfs4PG8ey63Qv20j9VC+4cAr+N3mCTzghrgfmL347lPkMxPnpGNyKjw7x74a83foFkWT+1GTPvnvfhT7PdAJ0fw2+5LXwAAAP//AwBQSwECLQAUAAYACAAAACEAEhje3WQBAAAYBQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQC1VTAj9AAAAEwCAAALAAAAAAAAAAAAAAAAAJ0DAABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQBKqaZh+gAAAEcDAAAaAAAAAAAAAAAAAAAAAMIGAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc1BLAQItABQABgAIAAAAIQAjc+PXcwIAALsGAAAPAAAAAAAAAAAAAAAAAPwIAAB4bC93b3JrYm9vay54bWxQSwECLQAUAAYACAAAACEAUJprA7wDAADSDQAADQAAAAAAAAAAAAAAAACcCwAAeGwvc3R5bGVzLnhtbFBLAQItABQABgAIAAAAIQD37G6pqgcAANgqAAAYAAAAAAAAAAAAAAAAAIMPAAB4bC93b3Jrc2hlZXRzL3NoZWV0Mi54bWxQSwECLQAUAAYACAAAACEAjPCUwqAGAACQGgAAEwAAAAAAAAAAAAAAAABjFwAAeGwvdGhlbWUvdGhlbWUxLnhtbFBLAQItABQABgAIAAAAIQBv8EeYtAgAAOkpAAAYAAAAAAAAAAAAAAAAADQeAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWxQSwECLQAUAAYACAAAACEAXUEtAsoOAAAsMgAAFAAAAAAAAAAAAAAAAAAeJwAAeGwvc2hhcmVkU3RyaW5ncy54bWxQSwECLQAUAAYACAAAACEAAnycMjUBAABRAgAAEQAAAAAAAAAAAAAAAAAaNgAAZG9jUHJvcHMvY29yZS54bWxQSwECLQAUAAYACAAAACEA5ODhQ+8BAABBBQAAEAAAAAAAAAAAAAAAAACGOAAAZG9jUHJvcHMvYXBwLnhtbFBLBQYAAAAACwALAMYCAACrOwAAAAA="
            }


            this.modalPrd.showMessageDialog(this.modalPrd.loading);

                this.EmpleadosService.saveCargaMasiva(objEnviar).subscribe(datos => {
    
                this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    
                this.modalPrd.showMessageDialog(datos.resultado,datos.datos)
                  .then(()=> {
                     if (!datos.resultado) {
                      debugger;
                      this.listaErrores = true;
                      this.fromEmpleado = false;
                      this.cargando = true;
                                                            //this.idEmpresa
                      this.EmpleadosService.getListaCargaMasiva(112).subscribe(datos => {
                       
                      this.crearTabla(datos);
                    });
                  } else{
                    this.routerPrd.navigate(['/empleados']);
                  }  
                  });
              });     

          }
        });

  }

  public agregar(){
    this.fromEmpleado = true;
    this.listaErrores = false;

  }


  public cancelarcomp() {
    this.routerPrd.navigate(['/empleados']);
  }

  get f() { return this.myForm.controls; }


}
