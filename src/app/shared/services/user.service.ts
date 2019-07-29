import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//Models
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {

    private userUrl = 'http://127.0.0.1:8000/user';  // URL to web api
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('timeTrackerCurrentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /**
     * Hits the backend to check if there is a user with a matching 
     * username and password combination and if so they will be given
     * a token that we check to make sure exists.
     * 
     * @param {username: string} - The username provided 
     * @param {password: string} - The password provided 
     */
    public login(username: string, password: string) {
        return this.http.post<any>(`${this.userUrl}/authenticate`, { username, password })
            .pipe(
                map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('timeTrackerCurrentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                    return user;
                })
            );
    }

    /**
     * remove user from local storage to log user out
     */
    public logout(): void {
        localStorage.removeItem('timeTrackerCurrentUser');
        this.currentUserSubject.next(null);
    }

    public register(user: User) {
        return this.http.post<User>(`${this.userUrl}/register`, { user });
    }

}