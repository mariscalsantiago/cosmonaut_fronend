import { Component, OnInit } from '@angular/core';
import { SharedPoliticasService } from '../../../../../../../shared/services/politicas/shared-politicas.service';
import { ActivatedRoute } from '@angular/router';
import { InfoDetalle } from '../../../../../../../core/data/infodetalle';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  public idEmpleado!: number;
  public informacion = new  InfoDetalle;
  constructor(private politicasPrd: SharedPoliticasService,private router: ActivatedRoute,) {
  }

  ngOnInit() {
  this.router.params.subscribe(params => {
    this.idEmpleado = params["id"];
   this.politicasPrd.getPoliticasByPersona(this.idEmpleado).toPromise()
   .then(datos => {this.informacion = datos['datos']; 
   }).catch(error => {
   })
 })
  }

}
