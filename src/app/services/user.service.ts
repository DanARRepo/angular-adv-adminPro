import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

import { User } from '../models/user.model';
import { LoadUser } from '../interfaces/load-users.interface';

const base_url = (environment.production) ? environment.prod_url : environment.dev_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user!: User;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.user.role!;
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  saveLocalStorage( token:string, menu:any ) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  validateToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, name, role, image = '', uid } = resp.user;

        this.user = new User(name, email, '', image, google, role, uid);
        this.saveLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError(err => of(false))
    );
  }

  createUser(formData: RegisterForm) {
    return this.http.post(`${base_url}/users`, formData)
      .pipe(
        tap((resp: any) => this.saveLocalStorage(resp.token, resp.menu))
      );
  }

  updateUser(data: { email: string, name: string, role: string }) {
    data = {
      ...data,
      role: this.user.role!
    }
    return this.http.put(`${base_url}/users/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => this.saveLocalStorage(resp.token, resp.menu))
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => this.saveLocalStorage(resp.token, resp.menu))
      );
  }

  logout() {
    localStorage.removeItem('token');

    // TODO: Delete menu
    localStorage.removeItem('menu');

    this.router.navigateByUrl('/login');

    if ( this.user.google ) {
      google.accounts.id.revoke( this.user.email, () => {
        this.router.navigateByUrl('/login');
      });
    }
  }

  loadUsers( from:number = 0 ) {
    const url = `${base_url}/users?from=${from}`;

    return this.http.get<LoadUser>( url, this.headers )
      .pipe(
        map( resp => {
          const users = resp.users.map(
            user => new User(user.name, user.email, '', user.image, user.google, user.role, user.uid)
          );

          return {
            total: resp.total,
            users
          };
        })
      );
  }

  deleteUser( user:User ) {
    const url = `${base_url}/users/${user.uid}`;
    return this.http.delete( url, this.headers );
  }

  saveUser( user:User ) {
    return this.http.put(`${base_url}/users/${user.uid}`, user, this.headers);
  }

}
