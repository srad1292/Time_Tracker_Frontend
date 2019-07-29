import { Component } from '@angular/core';
import { Router } from '@angular/router';

//Models
import { User } from './shared/models/user';

//Services
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Time Tracker';
  userNavExpanded: boolean = false;
  currentUser: User;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.currentUser.subscribe(x => this.currentUser = x);
  }

  /**
   * Uses UserService to logout and then goes to the login page
   */
  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Shows or hides the dropdown when clicking on username
   */
  toggleUserNav() {
    this.userNavExpanded = !this.userNavExpanded;
  }
}
