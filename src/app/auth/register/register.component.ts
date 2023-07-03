import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { RegisterForm } from 'src/app/interfaces/register-form.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  formSubmitted = false;

  registerForm = this.fb.group({
    name: [ 'Dr Sexo', Validators.required ],
    email: [ 'sexo@gmail.com', [Validators.required, Validators.email] ],
    password: [ '123456', Validators.required ],
    password2: [ '123456', Validators.required ],
    terms: [ false, Validators.required ],
  }, {
    validators: this.samePasswords('password', 'password2')
  });

  constructor( 
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
    ) {}

  createUser() {
    this.formSubmitted = true;
    console.log( this.registerForm );

    if (this.registerForm.invalid) return;

    this.userService.createUser( (this.registerForm.value as RegisterForm) ).subscribe({
      next: () => {
        this.router.navigateByUrl('/')
      },
      error: (err:any) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
  }

  invalidField( field:string ): boolean {
    if ( this.registerForm.get(field)?.invalid && this.formSubmitted ) {
      return true
    } else { 
      return false;
    }
  }

  invalidPassword() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if ( (pass1 !== pass2)  && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  acceptTerms() {
    return !this.registerForm.get('terms')?.value && this.formSubmitted;
  }

  samePasswords( passName1:string, passName2:string ) {
    return (FormGroup: AbstractControl): ValidationErrors | null => {
      const pass1Control: FormControl = FormGroup.get(passName1) as FormControl;
      const pass2Control: FormControl = FormGroup.get(passName2) as FormControl;
 
      if (pass1Control.value !== pass2Control.value) {
        pass2Control.setErrors({ isNotEqual: true });
        return { isNotEqual: true };
      } else {
        pass2Control?.setErrors(null);
        return null;
      }
    };
  }

}
