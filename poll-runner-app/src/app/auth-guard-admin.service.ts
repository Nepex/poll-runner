// Angular
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

// App
import { SessionService } from './api/session/session.service';
import { UserService } from './api/user/user.service';

// Service for redirecting away from URLs if user is not authenticated
@Injectable()
export class AuthGuardAdmin implements CanActivate {
    constructor(private router: Router, private sessionService: SessionService, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.sessionService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        const srcPromise: Promise<boolean> = this.userService.getUser().toPromise().then(usr => {
            return usr.is_admin;
        });

        return from(srcPromise);
    }
}
