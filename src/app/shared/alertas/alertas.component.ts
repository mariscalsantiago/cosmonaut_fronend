import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {



  constructor() { 

    
  }

  ngOnInit(): void {

    $('#date').combodate();  
  }

}
