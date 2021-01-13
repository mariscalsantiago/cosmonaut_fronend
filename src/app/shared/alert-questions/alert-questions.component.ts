import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-questions',
  templateUrl: './alert-questions.component.html',
  styleUrls: ['./alert-questions.component.scss']
})
export class AlertQuestionsComponent implements OnInit {

  @Input() scrollTop:any;

  constructor() { }

  ngOnInit(): void {

    

  }

}
