import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  ngOnInit() {
    this.btnClass = `btn ${ this.btnClass }`
  }

  @Input('valor') progressBar: number = 20;
  @Input() btnClass: string = 'btn-primary';

  @Output() outputValue: EventEmitter<number> = new EventEmitter();

  changeProgressValue(value:number) {
    if ( this.progressBar >= 100 && value >= 0) {
      this.outputValue.emit(100);
      return this.progressBar = 100;
    }

    if ( this.progressBar <= 0 && value < 0) {
      this.outputValue.emit(0);
      return this.progressBar = 0;
    }

    this.progressBar = this.progressBar + value;
    this.outputValue.emit( this.progressBar );
  }

  onChange( newValue: number ) {
    
    if ( newValue >= 100 ) {
      this.progressBar = 100;
    } else if ( newValue <= 0 ) {
      this.progressBar = 0;
    } else {
      this.progressBar = newValue;
    }

    this.outputValue.emit( this.progressBar );
    
  }
}
