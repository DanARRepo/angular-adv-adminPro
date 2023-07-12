import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit{

  public profileForm!:FormGroup;
  public user!:User;
  public uploadedImage!:File;
  public tempImage:any = null;

  constructor(
    // private fb: FormBuilder,
    private userService: UserService,
    private fileUploadService: FileUploadService
  ) {
    this.user = userService.user;
  }

  ngOnInit(): void {

    this.profileForm = new FormGroup({
      name: new FormControl(this.user.name, [Validators.required]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email])
    })

  }

  updateProfile() {
    // console.log(this.profileForm.value);
    this.userService.updateUser( this.profileForm.value ).subscribe({
      next: (resp:any) => {
        const { name, email } = resp.user;
        this.user.name = name;
        this.user.email = email

        Swal.fire('Saved', 'Changes have been saved', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');        
      }
    })
  }

  changeImage( file:File ) {
    this.uploadedImage = file;

    if (!file) return this.tempImage = null;

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.tempImage = reader.result;
    }
  }

  uploadImage() {
    this.fileUploadService.updateImage(this.uploadedImage, 'users', this.user.uid! )
      .then( (img) => {
        this.user.image = img
        Swal.fire('Saved', 'Updated user image', 'success');
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'Unable to upload image', 'error'); 
      })
  }

}
