// Angular
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

// App
import { SessionService } from './session/session.service';

// Intercepts HTTP requests and adds required headers (for all calls from services.module)
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private sessionService: SessionService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth information if user is authenticated
        if (this.sessionService.isAuthenticated()) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.sessionService.getToken()}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
                }
            });
        }

        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, err => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 && this.sessionService.isAuthenticated()) {
                    this.sessionService.logout();
                }
            }
        }));
    }
}
