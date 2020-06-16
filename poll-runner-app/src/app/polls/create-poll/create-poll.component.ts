// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// App
import { AlertMessage } from 'src/app/shared/alert-messages/alert-messages.component';
import { Poll } from 'src/app/api/poll/poll';
import { PollService } from 'src/app/api/poll/poll.service';
import { SubmittableFormGroup } from 'src/app/shared/submittable-form-group/submittable-form-group';
import { User } from 'src/app/api/user/user';
import { UserService } from 'src/app/api/user/user.service';

// Page for creating polls
@Component({
    selector: 'pr-create-poll',
    templateUrl: './create-poll.component.html',
    styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {
    // Subs
    userRequest: Observable<User>
    createPollRequest: Observable<Poll>;

    // Data stores
    user: User;

    // UI
    messages: AlertMessage[];

    // Forms
    pollForm: SubmittableFormGroup = new SubmittableFormGroup({
        poll_name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        questions: new FormArray([]),
    });
    pollFormQuestions: FormArray;


    constructor(private userService: UserService, private pollService: PollService, public router: Router) { }

    ngOnInit(): void {
        this.userRequest = this.userService.getUser();

        this.userRequest.subscribe(res => {
            this.user = res;
            this.userRequest = null
        });


        this.addQuestion();

        this.pollFormQuestions = (<any>this.pollForm.controls).questions;

    }

    addQuestion(): void {
        let questions = this.pollForm.get('questions') as FormArray;

        questions.push(new SubmittableFormGroup({
            question: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
        }));
    }

    removeQuestion(idx): void {
        let questions = this.pollForm.get('questions') as FormArray;

        questions.removeAt(idx);
    }

    createPoll(): void {
        this.messages = [];
        this.pollForm['submitted'] = true;

        if (!this.pollForm.valid || this.createPollRequest) {
            return;
        }

        const body: Poll = {
            poll_name: this.pollForm.value.poll_name,
            questions: []
        };

        for (let i = 0; i < this.pollForm.value.questions.length; i++) {
            body.questions.push(this.pollForm.value.questions[i].question);
        }

        if (body.questions.length === 0) {
            this.messages.push({ message: 'Polls need questions', type: 'alert-danger' });
            return;
        }

        this.createPollRequest = this.pollService.create(body);

        this.createPollRequest.subscribe(res => {
            this.createPollRequest = null;
            this.pollForm['submitted'] = false;
            this.messages.push({ message: 'Poll created! Redirecting...', type: 'alert-success' });

            setTimeout(() => {
                this.pollForm.reset();
                this.router.navigateByUrl('/poll-list');
            }, 500);

        }, err => {
            this.createPollRequest = null;
            this.pollForm['submitted'] = false;

            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'alert-danger' });
            });
        });
    }
}
