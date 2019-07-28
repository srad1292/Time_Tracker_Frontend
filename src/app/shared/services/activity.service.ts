import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ActivityTimer } from '../models/activity-timer';

@Injectable({
    providedIn: 'root',
})

export class ActivityService {

    private serverData = JSON;
    private activitiyData = JSON;
    private activitiyUrl = 'http://127.0.0.1:8000/activity';  // URL to web api


    constructor( private http: HttpClient ) { }

    getActivitiesByDate(date: string, user: string): Observable<ActivityTimer[]> {
        return this.http.get<ActivityTimer[]>(`${this.activitiyUrl}/${date}/for/${user}`);
    }

    getAllActivities(user: string): Observable<ActivityTimer[]> {
        return this.http.get<ActivityTimer[]>(`${this.activitiyUrl}/${user}`);
    }

    createActivity(activity: ActivityTimer) {
        return this.http.post<ActivityTimer>(`${this.activitiyUrl}`, { activity });
    }

    updateActivity(activity: ActivityTimer) {
        return this.http.put<ActivityTimer>(`${this.activitiyUrl}`, { activity });
    }

    deleteActivity(activity: ActivityTimer) {
        const id = activity['_id'];
        return this.http.delete(`${this.activitiyUrl}/${id}`);
    }




}