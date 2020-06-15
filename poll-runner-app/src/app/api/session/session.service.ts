// Angular
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// NPM
import { LocalStorageService } from 'ngx-webstorage';

// App
import { Credentials } from './credentials';
import { environment } from '../../../environments/environment';
import { Session } from './session';

// Service for logging in/out and storing tokens
@Injectable()
export class SessionService {
    public static STORAGE_KEYS = { TOKEN: 'token' };
    public onLogin: EventEmitter<void> = new EventEmitter<void>();
    public onLogout: EventEmitter<void> = new EventEmitter<void>();

    private sessionUrl: string;
    public currentSession: Session;

    constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
        this.sessionUrl = `${environment.apiBaseUrl}/sessions`;
        this.loadStoredSession();
    }

    private loadStoredSession(): void {
        const existingToken = this.localStorageService.retrieve(SessionService.STORAGE_KEYS.TOKEN);

        if (existingToken) {
            this.currentSession = {
                token: existingToken
            };

            this.onLogin.emit();
        }
    }

    public getToken(): string|null {
        return this.currentSession ? this.currentSession.token : null;
    }

    public isAuthenticated(): boolean {
        return this.currentSession && this.currentSession.token ? true : false;
    }

    public login(credentials: Credentials): Observable<Session> {
        if (this.currentSession) {
            throw new Error('already logged in');
        }

        const url = this.sessionUrl + '/auth';
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        const req = this.http.post<{ token: string}>(url, credentials, { headers: headers })
            .pipe(tap(body => {
                this.localStorageService.store(SessionService.STORAGE_KEYS.TOKEN, body.token);

                this.loadStoredSession();

                this.onLogin.emit();
            }));

        return req;
    }

    public logout(): void {
        this.currentSession = null;
        this.localStorageService.clear(SessionService.STORAGE_KEYS.TOKEN);
        this.onLogout.emit();
    }
}
