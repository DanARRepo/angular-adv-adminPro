import { Component, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: [
  ]
})
export class HospitalsComponent implements OnInit {

  public hospitals:Hospital[] = [];
  public tempHospitals:Hospital[] = [];
  public loading:boolean = true;

  public imgSub!:Subscription;

  constructor( 
    private hospitalService:HospitalService,
    private modalImageService:ModalImageService,
    private searchService:SearchService
  ) {}

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadHospitals();
    this.imgSub = this.modalImageService.newImage
    .pipe( delay(300) )
    .subscribe({ next: () => this.loadHospitals() });
  }

  loadHospitals() {
    this.loading = true
    this.hospitalService.loadHospitals().subscribe({
      next: (hospitals) => {
        this.loading = false;
        this.hospitals = hospitals;
        this.tempHospitals = hospitals;
      }
    });
  }

  savechanges( hospital:Hospital ) {
    this.hospitalService.updateHospital( hospital._id!, hospital.name ).subscribe({
      next: () => {
        Swal.fire( 'Updated!', hospital.name, 'success' );
      }
    })
  }

  deleteHospital( hospital:Hospital ) {
    this.hospitalService.deleteHospital( hospital._id! ).subscribe({
      next: () => {
        this.loadHospitals();
        Swal.fire( 'Deleted!', hospital.name, 'success' );
      }
    })
  }

  async openSweetModal() {
    const { value } = await Swal.fire<string>({
      title: 'Create Hospital',
      text: 'Enter the name of the new hospital',
      input: 'text',
      inputPlaceholder: 'Hospital name',
      showCancelButton: true,
    });

    if ( value!?.trim().length > 0 ) {
      this.hospitalService.createHospital( value! ).subscribe({
        next: (resp:any) => {
          this.hospitals.push( resp.hospital );
        }
      });
    }
    
  }

  openModal(hospital: Hospital) {
    this.modalImageService.openModal('hospitals', hospital._id!, hospital.image);
  }

  searchTerms( term:string ) {
    if ( term.length === 0 ) {
      return this.hospitals = this.tempHospitals;
    }

    this.searchService.search('hospitals', term).subscribe({
      next: (results) => {        
        this.hospitals = results
      }
    });
  }

}
