import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)

  return inject(UserService).validateToken()
    .pipe(
      tap( isAuthenticated => {
        if ( !isAuthenticated ) router.navigateByUrl('/login');
      })
    )
};
