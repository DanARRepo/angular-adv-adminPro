import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UserService } from 'src/app/services/user.service';

declare const google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  formSubmitted = false;

  loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: [ '', Validators.required ],
    remember: [false]
  });

  constructor( 
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '609293959917-72cssi7fpj806fgvtr8s98kjar52acr8.apps.googleusercontent.com',
      callback: (response:any) => this.ngZone.run(() => this.handleCredentialResponse(response))
    });

    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response:any ) {
    this.userService.loginGoogle( response.credential ).subscribe({
      next: (resp:any) => {
        this.router.navigateByUrl('/');
      }
    });
  }

  login() {
    this.userService.login((this.loginForm.value as LoginForm)).subscribe({
      next: (resp:any) => {
        if ( this.loginForm.get('remember')?.value ) {
          localStorage.setItem('email', (this.loginForm.get('email')?.value as string) );
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/');
      },
      error: (err:any) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
  }

}
