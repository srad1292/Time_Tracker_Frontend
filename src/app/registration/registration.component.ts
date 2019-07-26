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

  newUser: User = new User;
  isLoading: boolean = false;
  errorMessage: String;

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

  submitRegistration() {
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

}
