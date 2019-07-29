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
  
  //Form Properties
  dateRangeError: boolean = false;
  endDate: string;
  graphChoice: string;
  graphOptions: object[];
  startDate: string;
 
  //Graph display/input properties
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

  /**
   * Create the options for the dropdown in the graph form
   */
  setGraphOptions() {
    this.graphOptions = [
      {label: 'Bar: Time Per Day', value: 'timePerDay'},
      {label: 'Bar: Time Per Activity', value: 'timePerActivity'},
      {label: 'Pie: Percentage Per Activity', value: 'percentPerActivity'}
    ];

    this.graphChoice = 'timePerDay';
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
        this.allActivities = (data['activities'] || []).sort((a, b) => ('' + b.date).localeCompare(a.date));
        this.loadingActivities = false;
      },
      error => {
        this.loadingActivities = false;
        this.allActivities = [];
      }
    );
  }

  /**
   * Checks that there's no range error for the date inputs.
   * Then, calls the appropriate method to create the input
   * values needed to create the appropriate graph component
   */
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

  /**
   * 
   * @param {labelAttr: string} - The ActivityTimer attribute that will be used as labels/bars/pie slices 
   * @param {title: string} - The title to display for the graph 
   * @param {type: string} - What type of graph or chart to create 
   */
  setupValuesPerX(labelAttr, title, type) {
    let times = [];
    let attrValues = [];

    this.allActivities.forEach(activity => {
      if( (!this.startDate || ('' + activity.date).localeCompare(this.startDate) >= 0) && (!this.endDate || ('' + activity.date).localeCompare(this.endDate) <= 0) ) { 
        let index = attrValues.findIndex(attr => attr === activity[labelAttr]);
        //attribute value already looked at
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

    //The labels/bars/slices for the graph we will create
    this.labels = attrValues;
    //The value for each label in the labels array
    this.values = times;
    this.graphTitle = title;
    this.graphType = type;
  }





}
