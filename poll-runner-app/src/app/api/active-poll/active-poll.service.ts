// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// App
import { environment } from '../../../environments/environment';
import { ActivePoll } from './active-poll';

// Service for active poll management
@Injectable()
export class ActivePollService {
    private apiUrl = `${environment.apiBaseUrl}/active-polls`;

    constructor(private http: HttpClient) { }

    // public getPolls(): Observable<Poll[]> {
    //     const url = `${this.apiUrl}`;

    //     const req = this.http.get<Poll[]>(url).pipe(map(res => res));

    //     return req;
    // }

    // public getById(id: string): Observable<Poll> {
    //     const url = `${this.apiUrl}/${id}`;

    //     const req = this.http.get<Poll>(url);

    //     return req;
    // }

    public create(polls: ActivePoll[]): Observable<ActivePoll[]> {
        const url = `${this.apiUrl}`;

        const req = this.http.post<ActivePoll[]>(url, polls).pipe(map(res => res));

        return req;
    }

    // public delete(id: string): Observable<Poll> {
    //     const url = `${this.apiUrl}/${id}`;

    //     const req = this.http.delete<Poll>(url).pipe(map(res => res));

    //     return req;
    // }
}
