import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: [
  ]
})
export class PromisesComponent implements OnInit {

  ngOnInit(): void {

    this.getUsers().then( users => {
      console.log( users );
    });

    // const promesa = new Promise( ( resolve, reject ) => {

    //   if ( false) {
    //     resolve('Nice');
    //   } else {
    //     reject('uy');
    //   }
    // });

    // promesa.then( (msg) => {
    //   console.log(msg);
    // }).catch( err => console.log('Something wrong', err) );

    // console.log('fin del init');

  }

  getUsers() {

    return new Promise( resolve => {
      fetch('https://reqres.in/api/users')
        .then( res => res.json() )
        .then( body => resolve (body.data) )
    });
    
  }

}
