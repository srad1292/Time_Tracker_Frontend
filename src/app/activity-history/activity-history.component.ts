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
  allActivities: ActivityTimer[];
  organizedActivities: object[];
  loadingActivities: boolean = false;
  activityIndex: number = -1;
  deletingId: string;
  deletingActivity: boolean = false;

  showFilterForm: boolean = false;
  filterToggleText: string = "Show Form"; 
  startDate: string;
  endDate: string;
  dateRangeError: boolean = false;
  descriptionSubstring: string;

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

  organizeActivitiesByDate(activitiesToOrganize) {
    let lastDate = '';
    this.organizedActivities = [];

    this.organizedActivities = (activitiesToOrganize || []).reduce((days, activity) => {
      if(activity.date === lastDate) {
        days[days.length-1].activities.push(activity);
      }
      else {
        days.push({date: activity.date, activities: [activity]});
        lastDate = activity.date;
      }
      return days;
    }, [])
    
  }

  //going to deal with this on another branch
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

    this.organizeActivitiesByDate(filteredActivities);
  }
    

}
