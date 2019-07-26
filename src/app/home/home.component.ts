import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

//Models
import { ActivityTimer } from '../shared/models/activity-timer';
import { User } from '../shared/models/user';

//Services
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  selectedDate;
  pickerDate; 
  timers: ActivityTimer[] = [];
  
  //Modal Properties
  addingNewActivity: Boolean;
  display: String = 'none';
  modalTitle: String;
  modalActivity: ActivityTimer = new ActivityTimer();

  constructor(private router: Router, private userService: UserService) { 
    if (!this.userService.currentUserValue) { 
      this.router.navigate(['/login']);
    }
    else{
      this.currentUser = this.userService.currentUserValue;
    }
  }

  ngOnInit() {
    this.selectedDate = moment().format('YYYY-MM-DD');
    this.timers.push({date: this.selectedDate, description: 'did nothing', time: 40, name: 'idk', username: 'srad1292'});

  }

  changeDate() {
    this.selectedDate = this.pickerDate;
    //Call route to get activities for this date
  }

  openActivityModal(activity, index) {
    if(activity) {
      this.addingNewActivity = false;
      this.modalTitle = `Edit Activity: ${activity.name}`;
      this.modalActivity = {...activity};
    }
    else {
      this.addingNewActivity = true;
      this.modalTitle = 'Add New Activity'
      this.modalActivity = new ActivityTimer();
    }
    

    this.display='block'; 
  }

  cancelModal(){
    this.display='none'; 
  }

  saveActivity() {
    this.modalActivity.date = this.selectedDate;
    this.modalActivity.username = this.currentUser.uid;
    //This is only for new, will need to update for edit
    this.timers.push(this.modalActivity);
    this.display='none'; 
  }

}
