import { Component } from '@angular/core';
import { ServerSentEventService } from './shared/services/nominas/server-sent-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cosmonaut-front';


  constructor(){
    
  }

  public esconder(){
    let mm:any = document.getElementById("ventanaEmergente");
    mm.style.display = "none"
  }
}
