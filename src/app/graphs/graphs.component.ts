import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


//Models
import { ActivityTimer } from '../shared/models/activity-timer';
import { User } from '../shared/models/user';

//Services
import { ActivityService } from '../shared/services/activity.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {

  currentUser: User;
  allActivities: ActivityTimer[];
  organizedActivities: object[];
  loadingActivities: boolean = false;
  graphOptions: object[];
  startDate: string;
  endDate: string;
  graphChoice: string;
  dateRangeError: boolean = false;

  labels: any[];
  values: any[];
  graphTitle: string = '';
  graphType: string = '';

  constructor(private activityService: ActivityService, private router: Router, private userService: UserService) { 
    if (!this.userService.currentUserValue) { 
      this.router.navigate(['/login']);
    }
    else{
      this.currentUser = this.userService.currentUserValue;
    }
  }
  
  ngOnInit() {
    this.setGraphOptions();
    this.getAllActivitiesForUser();
  }

  setGraphOptions() {
    this.graphOptions = [
      {label: 'Bar: Time Per Day', value: 'timePerDay'},
      {label: 'Bar: Time Per Activity', value: 'timePerActivity'},
      {label: 'Pie: Percentage Per Activity', value: 'percentPerActivity'}
    ];

    this.graphChoice = 'timePerDay';
  }

  getAllActivitiesForUser() {
    this.loadingActivities = true;
    this.activityService.getAllActivities(this.currentUser.uid).subscribe(
      (data: any) => {
        this.allActivities = (data['activities'] || []).sort((a, b) => ('' + b.date).localeCompare(a.date));
        this.loadingActivities = false;
      },
      error => {
        this.loadingActivities = false;
        this.allActivities = [];
      }
    );
  }


  createGraph() {
    this.graphTitle = '';
    this.graphType='';

    if(this.startDate && this.endDate && (('' + this.startDate).localeCompare(this.endDate) > 0)){
      this.dateRangeError = true;
    }

    else {
      this.dateRangeError = false;
      switch(this.graphChoice) {
        case 'timePerDay':
          this.setupValuesPerX("date", "Time Spent Per Day", "bar");
          break;
        case 'timePerActivity':
          this.setupValuesPerX("name", "Time Spent Per Activity", "bar");
          break;
        case 'percentPerActivity':
          this.setupValuesPerX("name", "Percent Spent Per Activity", "pie");
          break;
        default:
          break;
      }
    }
  }

  setupValuesPerX(labelAttr, title, type) {
    let times = [];
    let attrValues = [];

    this.allActivities.forEach(activity => {
      if( (!this.startDate || ('' + activity.date).localeCompare(this.startDate) >= 0) && (!this.endDate || ('' + activity.date).localeCompare(this.endDate) <= 0) ) { 
        let index = attrValues.findIndex(day => day === activity[labelAttr]);
        //day already looked at
        if(index >= 0) {
          times[index] += activity.time;
        }
        //new
        else {
          attrValues.push(activity[labelAttr]);
          times.push(activity.time);
        }
      }
    });

    this.labels = attrValues;
    this.values = times;
    this.graphTitle = title;
    this.graphType = type;
  }





}
