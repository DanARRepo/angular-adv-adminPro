import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.css' ]
})
export class ProgressComponent {
  
  progress1: number = 15;
  progress2: number = 45;

  get getPercent1() {
    return `${ this.progress1 }%`
  }

  get getPercent2() {
    return `${ this.progress2 }%`
  }

}
