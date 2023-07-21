import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent {

  public uploadedImage!:File;
  public tempImage:any = null;

  constructor( 
    public modalImageService:ModalImageService,
    public fileUploadService:FileUploadService
  ) {}

  closeModal() {
    this.tempImage = null;
    this.modalImageService.closeModal();
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

    const id = this.modalImageService.id;
    const type = this.modalImageService.type;

    this.fileUploadService.updateImage(this.uploadedImage, type, id )
      .then( (img) => {
        Swal.fire('Saved', 'Updated user image', 'success');
        this.modalImageService.newImage.emit(img);
        this.closeModal();
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'Unable to upload image', 'error'); 
      })
  }

}
