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
  deletingActivity: boolean = false;
  loadingActivities: boolean = false;
  pickerDate: string;   
  selectedDate: string;
  timers: ActivityTimer[] = [];

  //Modal Properties
  activityIndex: number;  
  addingNewActivity: Boolean;
  display: String = 'none';
  modalTitle: String;
  modalActivity: ActivityTimer = new ActivityTimer();
  savingActivity: boolean = false;
  saveError: string;
  startHours: number;
  startMinutes: number;
  startSeconds: number;
  source = timer(1000, 1000);
  ticker; 
  ticking: boolean = false;
  tickingTime: number = 0;
  
  

  constructor(private activityService: ActivityService, private router: Router, private userService: UserService) { 
    if (!this.userService.currentUserValue) { 
      this.router.navigate(['/login']);
    }
    else{
      this.currentUser = this.userService.currentUserValue;
    }
  }

  /**
   * Sets up date so that component starts on today
   * then calls method to retrieve activities for today
   */
  ngOnInit() {
    this.selectedDate = moment().format('YYYY-MM-DD');
    this.pickerDate = moment().format('YYYY-MM-DD');
    this.getActivitiesForDate();
  }

  /**
   * Sets the day we are viewing to the user choice
   * then calls the method to retrieve activities for that date
   */
  changeDate() {
    this.selectedDate = this.pickerDate;
    this.getActivitiesForDate();
  }

  /**
   * Uses the ActivityService to hit the backend
   * to retrieve all ActivityTimers for the current
   * user for the selected date
   */
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
      }
    );
  }

  /**
   * Takes in an activity and then hits the backend to delete the activity.
   * Uses the index of the activity from the list to show a spinner
   * on that button instead of a trachcan while the request is pending
   * 
   * @param {activity: ActivityTimer} - The activity we want to delete 
   * @param {index: number} - The location of this activity in the timers list 
   */
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
      }
    );
  }

  /**
   * Initializes data for the new activity or
   * sets the values to the activity we are updating
   * and then makes the modal visible 
   * 
   * @param {activity: ActivityTimer} - The activity we want to delete
   * @param {index: number} - The location of this activity in the timers list 
   */
  openActivityModal(activity, index) {
    this.startHours = null;
    this.startMinutes = null;
    this.startSeconds = null;

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

  /**
   * Sets the ticker display to the values given by the user
   * so that if you've already done something for an hour
   * you can start the timer at an hour
   */
  setStartTime() {
    let elapsed = 0;
    if(this.startHours && this.startHours > 0) {
      elapsed += (this.startHours * 3600);
    }
    if(this.startMinutes && this.startMinutes > 0) {
      elapsed += (this.startMinutes * 60);
    }
    if(this.startSeconds && this.startSeconds > 0) {
      elapsed += this.startSeconds;
    }

    this.tickingTime = elapsed;

  }

  /**
   * closes the modal
   */
  cancelModal(){
    this.display='none'; 
  }

  /**
   * Calls the backend to either create a new activity
   * or update an existing one
   */
  saveActivity() {
    this.saveError = '';
    this.modalActivity.date = this.selectedDate;
    this.modalActivity.username = this.currentUser.uid;
    this.modalActivity.time = this.tickingTime;
    this.savingActivity = true;

    //Creating a new ActivityTimer
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
            this.saveError = "Mongo Insert Error";
          }
          
        },
        error => { 
          this.savingActivity = false;
          const message = (error.error || {}).message || error.message || error.statusText || 'Unknown Error Has Occured';
          this.saveError = message;
        },
      );
      
    }
    //Updating an existing ActivityTimer
    else {
      this.activityService.updateActivity(this.modalActivity).subscribe(
        (data: any) => {
          this.savingActivity = false;
          this.timers[this.activityIndex] = {...this.modalActivity};
          this.display='none'; 
        },
        error => { 
          this.savingActivity = false;
          const message = (error.error || {}).message || error.message || error.statusText || 'Unknown Error Has Occured';
          this.saveError = message;
        }
      );
      
    }    
  }

  /**
   * Start or pause the timer.  When running, the 
   * time will increase every second.
   */
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

  /**
   * Sets the timer back to 0 for a new activity
   * or back to the time that the activity we are updating was already set to
   */
  resetTimer() {
    this.ticking = false;
    this.ticker.unsubscribe();
    this.tickingTime = this.addingNewActivity ? 0 : this.timers[this.activityIndex].time;
  }

}
