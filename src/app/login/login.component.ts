import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//Models
import { User } from '../shared/models/user';

//Services
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessage: string;
  password: string = '';
  returnUrl: string;  
  triedLogin: boolean = false;  
  username: string = '';
  user: User;

  constructor(  
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService
  ) {
      // redirect to home if already logged in
      if (this.userService.currentUserValue) { 
          this.router.navigate(['/home']);
      }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Hits the backend to try to login based on the given username and password.
   * If successful it will go to the previously viewed route or to the home page.
   */
  login(){
    this.errorMessage = '';
    this.triedLogin = true;
    if(!this.username || !this.password) { return; }

    this.userService.login(this.username, this.password)
    .subscribe(
        (data) => {
            this.router.navigate([this.returnUrl]);
        },
        error => {
            const message = (error.error || {}).message || error.message || error.statusText || 'An Unknown Error Has Occured';
            this.errorMessage = `Error: ${message}`;
        });
  }

}
