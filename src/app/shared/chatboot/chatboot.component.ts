import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatboot',
  templateUrl: './chatboot.component.html',
  styleUrls: ['./chatboot.component.scss']
})
export class ChatbootComponent implements OnInit {
  public scrolly: string = '250px';
  public tamanio: number = 0;
  public modalWidth: string = "300px";

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;

    if (this.tamanio < 600) {

      this.modalWidth = "60%";

    } else {
      this.modalWidth = "300px";

    }
  }

  constructor() { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
  }

}
