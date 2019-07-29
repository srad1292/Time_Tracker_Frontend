import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { GraphsComponent } from './graphs/graphs.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'graphs', component: GraphsComponent },
  { path: 'history', component: ActivityHistoryComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})

export class AppRoutingModule { }
