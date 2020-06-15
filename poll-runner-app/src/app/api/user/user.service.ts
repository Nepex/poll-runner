// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// App
import { environment } from '../../../environments/environment';
import { User } from './user';

// Service for creating, searching, and updating users
@Injectable()
export class UserService {
    private apiUrl = `${environment.apiBaseUrl}/users`;

    constructor(private http: HttpClient) { }

    public getUser(): Observable<User> {
        const url = `${this.apiUrl}/me`;

        const req = this.http.get<User>(url).pipe(map(res => res));

        return req;
    }

    public getById(id: string): Observable<User> {
        const url = `${this.apiUrl}/${id}`;

        const req = this.http.get<User>(url);

        return req;
    }

    public create(user: User): Observable<User> {
        const url = `${this.apiUrl}`;

        const req = this.http.post<User>(url, user).pipe(map(res => res));

        return req;
    }
}
