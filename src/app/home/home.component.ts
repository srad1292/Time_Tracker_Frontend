import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

import * as moment from 'moment';

//Models
import { ActivityTimer } from '../shared/models/activity-timer';
import { User } from '../shared/models/user';

//Services
import { ActivityService } from '../shared/services/activity.service';
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
  loadingActivities: boolean = false;
  deletingActivity: boolean = false;

  //Modal Properties
  addingNewActivity: Boolean;
  display: String = 'none';
  modalTitle: String;
  modalActivity: ActivityTimer = new ActivityTimer();
  tickingTime: number = 0;
  activityIndex: number;
  savingActivity: boolean = false;
  source = timer(1000, 1000);
  ticker; 
  ticking: boolean = false;

  constructor(private activityService: ActivityService, private router: Router, private userService: UserService) { 
    if (!this.userService.currentUserValue) { 
      this.router.navigate(['/login']);
    }
    else{
      this.currentUser = this.userService.currentUserValue;
    }
  }

  ngOnInit() {
    this.selectedDate = moment().format('YYYY-MM-DD');
    this.pickerDate = moment().format('YYYY-MM-DD');
    this.getActivitiesForDate();
  }

  changeDate() {
    this.selectedDate = this.pickerDate;
    this.getActivitiesForDate();
  }

  getActivitiesForDate() {
    this.loadingActivities = true;
    this.activityService.getActivitiesByDate(this.selectedDate, this.currentUser.uid).subscribe(
      (data: any) => {
        this.loadingActivities = false;
        this.timers = data['activities'] || [];
      },  
      error => {
        this.loadingActivities = false;
        this.timers = [];
        console.log('Error: ', error);
      }
    );
  }


  deleteActivity(activity, index) {
    this.activityIndex = index;
    this.deletingActivity = true;
    this.activityService.deleteActivity(activity).subscribe(
      (data: any) => {
        this.deletingActivity = false;
        if(data.message && data.message === 'ok') {
          //Clear out the rating on the front end
          this.timers.splice(index, 1);
        }
      },  
      error => {
        this.deletingActivity = false;
        console.log('delete error: ', error);
      }
    );
  }

  openActivityModal(activity, index) {
    if(activity) {
      this.activityIndex = index;
      this.addingNewActivity = false;
      this.modalTitle = `Edit Activity: ${activity.name}`;
      this.modalActivity = {...activity};
      this.tickingTime = activity.time;
    }
    else {
      this.addingNewActivity = true;
      this.modalTitle = 'Add New Activity'
      this.modalActivity = new ActivityTimer();
      this.tickingTime = 0;
    }
    
    this.display='block'; 
  }

  cancelModal(){
    this.display='none'; 
  }

  saveActivity() {
    this.modalActivity.date = this.selectedDate;
    this.modalActivity.username = this.currentUser.uid;
    this.modalActivity.time = this.tickingTime;
    this.savingActivity = true;
    console.log('Modal To Save: ', this.modalActivity);
    // This is only for new, will need to update for edit
    if(this.addingNewActivity) {
      this.activityService.createActivity(this.modalActivity).subscribe(
        (data: any) => {
          this.savingActivity = false;
          if(data.recordId) {
            this.modalActivity['_id'] = data.recordId;
            this.timers.push(this.modalActivity);
            this.display='none'; 
          }
          else {
            console.log('no id came for some reason');
          }
          
        },
        error => { 
          this.savingActivity = false;
          console.log('save error: ', error);
        },
      );
      
    }
    else {
      this.activityService.updateActivity(this.modalActivity).subscribe(
        (data: any) => {
          this.savingActivity = false;
          this.timers[this.activityIndex] = {...this.modalActivity};
          this.display='none'; 
        },
        error => { 
          this.savingActivity = false;
          console.log('update error: ', error);
        }
      );
      
    }

    
  }

  toggleTimer() {
    if(this.ticking) {
      this.ticking = false;
      this.ticker.unsubscribe();
    }
    else {
      this.ticking = true;
      this.ticker = this.source.subscribe(val => this.tickingTime += 1);
    }
  }

  resetTimer() {
    this.ticking = false;
    this.ticker.unsubscribe();
    this.tickingTime = this.addingNewActivity ? 0 : this.timers[this.activityIndex].time;
  }

}
