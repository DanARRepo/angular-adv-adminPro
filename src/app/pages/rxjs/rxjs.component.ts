import { Component, OnDestroy } from '@angular/core';
import { Observable, retry, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public internalSubs!:Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe({
    //   next: (value) => console.log('Subs:', value),
    //   error: (err) => console.warn('Error:', err),
    //   complete: () => console.info('Obs terminado')
    // });

    this.internalSubs = this.retornaIntrervalo().subscribe( console.log );

  }

  ngOnDestroy(): void {
    this.internalSubs.unsubscribe();
  }

  retornaIntrervalo(): Observable<number> {

    return interval(500)
            .pipe(
              // take(10),
              map( value => value + 1 ),
              filter( value => ( value % 2 === 0 ) ? true : false )
            );
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>( observer => {

      const intervalo = setInterval( () => {

        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval( intervalo);
          observer.complete();
        }

        if (i === 2) {
          observer.error('i llego al valor de 2');
        }

      }, 1000)
    });
  }

}
