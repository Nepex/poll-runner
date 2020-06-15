// Angular
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// App
import { AlertMessage } from '../shared/alert-messages/alert-messages.component';
import { Credentials } from '../api/session/credentials';
import { Session } from '../api/session/session';
import { SessionService } from '../api/session/session.service';
import { SubmittableFormGroup } from '../shared/submittable-form-group/submittable-form-group';
import { Router } from '@angular/router';

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

    constructor(public router: Router, private sessionService: SessionService) {}

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
