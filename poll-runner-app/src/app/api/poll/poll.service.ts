// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// App
import { environment } from '../../../environments/environment';
import { Poll } from './poll';

// Service for poll management
@Injectable()
export class PollService {
    private apiUrl = `${environment.apiBaseUrl}/polls`;

    constructor(private http: HttpClient) { }

    public getPolls(): Observable<Poll[]> {
        const url = `${this.apiUrl}`;

        const req = this.http.get<Poll[]>(url).pipe(map(res => res));

        return req;
    }

    // public create(user: User): Observable<User> {
    //     const url = `${this.apiUrl}`;

    //     const req = this.http.post<User>(url, user).pipe(map(res => res));

    //     return req;
    // }
}
