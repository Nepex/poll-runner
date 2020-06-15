// Angular
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

// App
import { SessionService } from './api/session/session.service';

// Service for redirecting away from URLs if user is not authenticated
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private sessionService: SessionService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.sessionService.isAuthenticated()) {
            this.router.navigate(['/'], {
                queryParams: {
                    redirect: state.url
                }
            });
            return;
        }

        return true;
    }
}
