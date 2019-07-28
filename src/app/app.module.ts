import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

//Components
import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

//Modules
import { AppRoutingModule } from './app-routing.module';

//Pipes
import { SecondsToTimePipe } from './shared/pipes/secondsToTime.pipe';

//Services 
import { ActivityService } from './shared/services/activity.service';
import { UserService } from './shared/services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    ActivityHistoryComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    SecondsToTimePipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  providers: [ActivityService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
