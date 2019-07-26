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
  title = 'Time-Tracker-Frontend';
  userNavExpanded: boolean = false;
  currentUser: User;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  toggleUserNav() {
    this.userNavExpanded = !this.userNavExpanded;
  }
}
