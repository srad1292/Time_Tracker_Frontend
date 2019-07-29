import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Models
import { ActivityTimer } from '../shared/models/activity-timer';
import { User } from '../shared/models/user';

//Services
import { ActivityService } from '../shared/services/activity.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss']
})
export class ActivityHistoryComponent implements OnInit {

  currentUser: User;

  //Activity loading/details Properties
  allActivities: ActivityTimer[];
  deletingActivity: boolean = false;  
  deletingId: string;
  loadingActivities: boolean = false;  
  organizedActivities: object[];

  //Filter Form Properties
  dateRangeError: boolean = false;
  descriptionSubstring: string;
  endDate: string;
  filterToggleText: string = "Show Form"; 
  showFilterForm: boolean = false;
  startDate: string;
  
  constructor(private activityService: ActivityService, private router: Router, private userService: UserService) { 
    if (!this.userService.currentUserValue) { 
      this.router.navigate(['/login']);
    }
    else{
      this.currentUser = this.userService.currentUserValue;
    }
  }
  

  ngOnInit() {
    this.getAllActivitiesForUser();
  }

  /**
   * Use the ActivityService to hit the backend to
   * retrieve all activities for the current user
   * then calls method to organize them for displaying
   */
  getAllActivitiesForUser() {
    this.loadingActivities = true;
    this.activityService.getAllActivities(this.currentUser.uid).subscribe(
      (data: any) => {
        this.allActivities = (data['activities'] || []).sort((a, b) => ('' + b.date).localeCompare(a.date));;
        this.organizeActivitiesByDate(this.allActivities);
        this.loadingActivities = false;
      },
      error => {
        this.loadingActivities = false;
        this.allActivities = [];
        console.log('get error: ', error);
      }
    );
  }

  /**
   * Takes in a list of Activity Timers and sets class variable to
   * the organized data for display.  Data is organized as such
   * [{date: String, activities: ActivityTimer[]}]
   * 
   * @param { activitiesToOrganize: ActivityTimer[] } - The list of ActivityTimers to organize
   */
  organizeActivitiesByDate(activitiesToOrganize) {
    let lastDate = '';
    this.organizedActivities = [];
    //Organize Timers by date: [{date: String, activities: ActivityTimer[]}]
    this.organizedActivities = (activitiesToOrganize || []).reduce((days, activity) => {
      if(activity.date === lastDate) {
        //Still the same date, just add to the time
        days[days.length-1].activities.push(activity);
      }
      else {
        //New date, so create a new object to add to the list
        days.push({date: activity.date, activities: [activity]});
        lastDate = activity.date;
      }
      return days;
    }, [])
    
  }

  /**
   * Takes in an activity and then hits the backend to delete the activity 
   * 
   * @param {activity: ActivityTimer} - The activity we will be deleting
   */
  deleteActivity(activity) {
    this.deletingId = activity['_id'];
    this.deletingActivity = true;
    
    this.activityService.deleteActivity(activity).subscribe(
      (data: any) => {
        this.deletingActivity = false;
        if(data.message && data.message === 'ok') {
          //Clear out the rating on the front end
          this.allActivities = this.allActivities.filter(activity => activity['_id'] !== this.deletingId);
          this.filterHistory();
        }
      },  
      error => {
        this.deletingActivity = false;
        console.log('delete error: ', error);
      }
    );
  }

  /**
   * Shows/Hides the filter form and updates the button text as well
   */
  toggleHistoryFilter(){
    if(this.showFilterForm) {
      this.filterToggleText = 'Show Form';
      this.showFilterForm = false;
    }
    else {
      this.filterToggleText = 'Hide Form';
      this.showFilterForm = true;
    }
  }

  /**
   * Uses the filter form data to filter the activities by 
   * some range of dates and/or activities with a description
   * that contains the text that the user is searching
   */
  filterHistory() {
    if(this.startDate && this.endDate && (('' + this.startDate).localeCompare(this.endDate) > 0)){
      this.dateRangeError = true;
    }

    const filteredActivities = this.allActivities.filter(activity => {
      return (
        (!this.descriptionSubstring || (activity.description || '').toLowerCase().includes(this.descriptionSubstring.toLowerCase())) &&
        (!this.startDate || ('' + activity.date).localeCompare(this.startDate) >= 0) &&
        (!this.endDate || ('' + activity.date).localeCompare(this.endDate) <= 0)
      ); 
        
    });
    //Call the organize method to organize the filtered activities for display
    this.organizeActivitiesByDate(filteredActivities);
  }
    

}
