import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { User } from 'src/app/models/user.model';

import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchService } from 'src/app/services/search.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription, delay } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit, OnDestroy {

  public from:number = 0;
  public totalUsers:number = 0;
  public tableUsers:User[] = [];
  public tempUsers:User[] = [];
  public loading:boolean = true;

  public imgSub!:Subscription;

  constructor( 
    private userService: UserService,
    private searchService: SearchService,
    private modalImageService: ModalImageService
  ) {}

  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.imgSub = this.modalImageService.newImage
    .pipe( delay(100) )
    .subscribe({ next: () => this.loadUsers() });
  }

  loadUsers() {
    this.loading = true;
    this.userService.loadUsers(this.from).subscribe({
      next: ({ total, users }) => {
        this.totalUsers = total;
        if ( users.length !== 0 ) {
          this.tableUsers = users;
          this.tempUsers = users;
        }
        this.loading = false;
      }
    });
  }

  //TODO: Repair/improve pagination method
  changePage( value:number ) {
    this.from += value;

    if ( this.from < 0 ) {
      this.from = 0;
    } else if ( this.from > this.totalUsers ) {
      this.from -= value;
    }

    this.loadUsers();
  }

  searchTerms( terms:string ) {

    if ( terms.length === 0 ) {
      return this.tableUsers = this.tempUsers;
    }

    this.searchService.search( 'users', terms ).subscribe({
      next: (results:any) => {
        this.tableUsers = results;
      }
    })
  }

  deleteUser( user:User ) {

    if ( user.uid === this.userService.uid ) {
      return Swal.fire('Error', 'You cannot erase yourself', 'error');
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser( user ).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              `the user ${user.name} has been deleted.`,
              'success'
            );
            this.loadUsers();
          }
        });
      }
    });
  }

  changeRole( user:User ) {
    this.userService.saveUser( user ).subscribe({
      next: (resp) => console.log(resp)
    });
  }

  openModal( user:User ) {
    this.modalImageService.openModal('users', user.uid!, user.image );
  }

}
