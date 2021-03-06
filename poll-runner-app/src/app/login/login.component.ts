// Angular
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// App
import { AlertMessage } from '../shared/alert-messages/alert-messages.component';
import { Credentials } from '../api/session/credentials';
import { Session } from '../api/session/session';
import { SessionService } from '../api/session/session.service';
import { SubmittableFormGroup } from '../shared/submittable-form-group/submittable-form-group';

// Page for logging users in
@Component({
    selector: 'pr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    // Subs
    loadingRequest: Observable<Session>;

    // UI
    messages: AlertMessage[];

    // Forms
    emailRegex: RegExp = /^[^@]+@[^@]+\.[^@]+$/;
    loginForm: SubmittableFormGroup = new SubmittableFormGroup({
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    });

    constructor(public router: Router, private sessionService: SessionService) { }

    // If user is already logged in > go to dashboard
    ngOnInit(): void {
        if (this.sessionService.isAuthenticated) {
            this.router.navigateByUrl('/dashboard');
        }
    }

    // Attempt to log user in
    attemptLogin(): void {
        this.messages = [];
        this.loginForm['submitted'] = true;

        if (!this.loginForm.valid || this.loadingRequest) {
            return;
        }

        const body: Credentials = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        };

        this.loadingRequest = this.sessionService.login(body);

        this.loadingRequest.subscribe(() => {
            this.loadingRequest = null;
            this.loginForm['submitted'] = false;
            this.router.navigateByUrl('/dashboard');
        }, err => {
            this.loadingRequest = null;
            this.loginForm['submitted'] = false;

            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'alert-danger' });
            });
        });
    }
}
