import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//models
import { User } from '../shared/models/user';

//Services
import { UserService } from '../shared/services/user.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  errorMessage: String;
  isLoading: boolean = false;
  newUser: User = new User;  
  triedRegistration: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
) { 
    // redirect to home if already logged in
    if (this.userService.currentUserValue) { 
        this.router.navigate(['/home']);
    }
}

  ngOnInit() {
  }

  /**
   * Uses data in registration form to hit the backend to try
   * to create a new user.  Goes to the login page on success.
   */
  submitRegistration() {
    this.errorMessage = '';        
    this.triedRegistration = true;
    if(!this.isValidUser()) { return; }

    this.isLoading = true;

    this.userService.register(this.newUser)
      .subscribe(
          (data: any) => {
              this.isLoading = false;
              this.router.navigate(['/login']);
          },
          error => {
              this.isLoading = false;
              const message = (error.error || {}).message || error.message || error.statusText || 'Unknown Error Has Occured';
              this.errorMessage = `Error: ${message}`;
          }
      );
  }

  /**
   * Checks that the first name, username, and password fields have data
   */
  isValidUser(): boolean{
      return (!!this.newUser.first_name && !!this.newUser.uid && !!this.newUser.password);
  }

}
