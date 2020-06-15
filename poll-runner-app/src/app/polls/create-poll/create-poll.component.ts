// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

// App
import { AlertMessage } from 'src/app/shared/alert-messages/alert-messages.component';
import { SubmittableFormGroup } from 'src/app/shared/submittable-form-group/submittable-form-group';
import { User } from 'src/app/api/user/user';
import { UserService } from 'src/app/api/user/user.service';

// Page for listing polls
@Component({
    selector: 'pr-create-poll',
    templateUrl: './create-poll.component.html',
    styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {
    // Subs
    loadingRequest: Observable<User>

    // Data stores
    user: User;

    // UI
    messages: AlertMessage[];

    // Forms
    pollForm: SubmittableFormGroup = new SubmittableFormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        questions: new FormArray([]),
    });
    pollFormQuestions: FormArray;


    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => { this.user = res; });

        this.pollFormQuestions = (<any>this.pollForm.controls).questions;

        this.addQuestion();
    }

    addQuestion(): void {
        let questions = this.pollForm.get('questions') as FormArray;

        questions.push(new SubmittableFormGroup({
            question: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        }));
    }

    removeQuestion(idx) {
        let questions = this.pollForm.get('questions') as FormArray;

        questions.removeAt(idx);
    }

    createPoll(): void {
        let body = {
            name: this.pollForm.value.name,
            questions: []
        };

        for (let i = 0; i < this.pollForm.value.questions.length; i++) {
            body.questions.push(this.pollForm.value.questions[i].question);
        }

        // api call
    }
}
