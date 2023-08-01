import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: [
  ]
})
export class DoctorsComponent implements OnInit, OnDestroy {

  public loading:boolean = true;
  public tempDoctors:Doctor[] = [];
  public doctors:Doctor[] = [];

  public imgSub!:Subscription;

  constructor(
    private doctorService:DoctorService,
    private modalImageService:ModalImageService,
    private searchService:SearchService
  ) {}

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.imgSub = this.modalImageService.newImage
    .pipe( delay(300) )
    .subscribe({ next: () => this.loadDoctors() });
  }

  loadDoctors() {
    this.loading = true;
    
    this.doctorService.loadDoctors().subscribe({
      next: (doctors) => {
        this.loading = false;
        this.doctors = doctors;
        this.tempDoctors = doctors
      }
    });
  }

  openModal( doctor:Doctor ) {
    this.modalImageService.openModal('doctors', doctor._id!, doctor.image);
  }

  search( term:string ) {
    if ( term.length === 0 ) {
      return this.doctors = this.tempDoctors;
    }

    this.searchService.search('doctors', term).subscribe({
      next: (results) => {
        this.doctors = results
      }
    }); 
  }

  deleteDoctor( doctor:Doctor ) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor( doctor._id! ).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              `the user ${doctor.name} has been deleted.`,
              'success'
            );
            this.loadDoctors();
          }
        });
      }
    });
  }
}
