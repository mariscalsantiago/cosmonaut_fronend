import { Component } from '@angular/core';
import { NominaordinariaService } from './shared/services/nominas/nominaordinaria.service';
import { ServerSentEventService } from './shared/services/nominas/server-sent-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cosmonaut-front';


  constructor(private SSE:ServerSentEventService){
    
  }

  public esconder(){
    let mm:any = document.getElementById("ventanaEmergente");
    mm.style.display = "none"

    this.SSE.verificador.next(true);
    
  }
}
