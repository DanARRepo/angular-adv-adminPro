import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

import { Doctor } from 'src/app/models/doctor.model';
import { Hospital } from 'src/app/models/hospital.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [
  ]
})
export class SearchComponent implements OnInit {
  
  public users:User[] = [];
  public doctors:Doctor[] = [];
  public hospitals:Hospital[] = [];

  constructor( 
    private activatedRoute:ActivatedRoute,
    private searchService:SearchService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: ({ term }) => this.globalSearch(term)
    });
  }

  globalSearch( term:string ) {
    this.searchService.globalSearch(term).subscribe({
      next: (resp:any) => {
        this.users = resp.users;
        this.doctors = resp.doctors;
        this.hospitals = resp.hospitals;
      }
    });
  }

}
