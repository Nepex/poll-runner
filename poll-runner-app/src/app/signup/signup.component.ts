// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// App
import { AlertMessage } from '../shared/alert-messages/alert-messages.component';
import { Credentials } from '../api/session/credentials';
import { Session } from '../api/session/session';
import { SessionService } from '../api/session/session.service';
import { SubmittableFormGroup } from '../shared/submittable-form-group/submittable-form-group';
import { User } from '../api/user/user';
import { UserService } from '../api/user/user.service';

// Page for creating new users
@Component({
    selector: 'pr-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
    // Subs
    loadingRequest: Observable<User | Session>;

    // UI
    messages: AlertMessage[];

    // Forms
    userRegex: RegExp = /^[a-zA-Z0-9]*$/;
    emailRegex: RegExp = /^[^@]+@[^@]+\.[^@]+$/;
    signUpForm: SubmittableFormGroup = new SubmittableFormGroup({
        first_name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        last_name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]),
        passwordConfirm: new FormControl('', [Validators.required])
    });

    constructor(private userService: UserService, private sessionService: SessionService,
        private router: Router) { }

    createUser(): void {
        this.messages = [];
        this.signUpForm['submitted'] = true;

        if (!this.signUpForm.valid || this.loadingRequest) {
            return;
        }

        if (this.signUpForm.value.password !== this.signUpForm.value.passwordConfirm) {
            this.messages.push({ message: 'Passwords do not match', type: 'alert-danger' });
            return;
        }

        const body: User = {
            first_name: this.signUpForm.value.first_name,
            last_name: this.signUpForm.value.last_name,
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password
        };

        this.loadingRequest = this.userService.create(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;
            this.messages.push({ message: 'Account created! Redirecting to dashboard', type: 'alert-success' });

            this.signUpForm.reset();
            
            // comment this and function if you want to turn off auto login after signup
            this.logUserIn(body);
        }, err => {
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;

            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'alert-danger' });
            });
        });
    }

    logUserIn(body: User): void {
        if (this.loadingRequest) {
            return;
        }

        const credentials: Credentials = {
            email: body.email,
            password: body.password
        };

        this.loadingRequest = this.sessionService.login(credentials);

        this.loadingRequest.subscribe(res => {
            setTimeout(() => {
                this.loadingRequest = null;
                this.router.navigateByUrl('/dashboard');
            }, 500);
        }, err => {
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'alert-danger' });
            });
        });
    }
}
