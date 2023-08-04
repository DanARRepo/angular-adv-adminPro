import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { authGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DahsboardComponent } from './dahsboard/dahsboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';

// Maintenance
import { UsersComponent } from './maintenance/users/users.component';
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';
import { DoctorComponent } from './maintenance/doctors/doctor.component';
import { SearchComponent } from './search/search.component';
import { adminGuard } from '../guards/admin.guard';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ authGuard ],
        children: [
            { path: '', component: DahsboardComponent, data: { title: 'Dashboard' } },
            { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Temas' } },
            { path: 'grafica1', component: Grafica1Component, data: { title: 'Grafica #1' } },
            { path: 'profile', component: ProfileComponent, data: { title: 'User profile' } },
            { path: 'progress', component: ProgressComponent, data: { title: 'ProgressBar' } },
            { path: 'promises', component: PromisesComponent, data: { title: 'Promesas' } },
            { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs' } },
            { path: 'search/:term', component: SearchComponent, data: { title: 'Searches' } },
            
            // Maintenance
            { path: 'doctors', component: DoctorsComponent, data: { title: 'Doctors Maintenance' } },
            { path: 'doctor/:id', component: DoctorComponent, data: { title: 'Doctor Maintenance' } },
            { path: 'hospitals', component: HospitalsComponent, data: { title: 'Hospitals Maintenance' } },

            // Admin routes
            { path: 'users', canActivate:[adminGuard], component: UsersComponent, data: { title: 'Users Maintenance' } },

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule { }