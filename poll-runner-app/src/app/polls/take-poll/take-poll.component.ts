// Angular
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';

// NPM
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from 'src/app/shared/alert-messages/alert-messages.component';
import { ActivePoll } from 'src/app/api/active-poll/active-poll';
import { ActivePollService } from 'src/app/api/active-poll/active-poll.service';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { Poll } from 'src/app/api/poll/poll';
import { PollService } from 'src/app/api/poll/poll.service';
import { SubmittableFormGroup } from 'src/app/shared/submittable-form-group/submittable-form-group';

// Page for taking selected poll
@Component({
    selector: 'pr-take-poll',
    templateUrl: './take-poll.component.html',
    styleUrls: ['./take-poll.component.css']
})
export class TakePollComponent implements OnInit {
    // Subs
    loadingRequest: Observable<[Poll, ActivePoll]>;
    updateActivePollRequest: Observable<ActivePoll>;

    // Data stores
    activePollId: string;
    pollId: string;
    userId: string;
    fromEmail: string;

    poll: Poll;
    activePoll: ActivePoll;

    // UI
    activePollFormQuestions: FormArray;
    messages: AlertMessage[];

    // Forms
    activePollForm: SubmittableFormGroup = new SubmittableFormGroup({
        questions: new FormArray([]),
    });

    constructor(private activePollService: ActivePollService, private pollService: PollService, private activatedRoute: ActivatedRoute,
        private modalService: NgbModal, private router: Router) { }

    // Gets required fields off url params to get data needed
    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.activePollId = params['id'];
            this.userId = params['user_id'];
            this.pollId = params['poll_id'];
            this.fromEmail = params['fromEmail'];

            this.getData();
        });

        this.activePollFormQuestions = (<any>this.activePollForm.controls).questions;
    }

    // Grabs the active poll and the poll - sets active to 'viewed'
    getData(): void {
        this.loadingRequest = forkJoin(this.pollService.getById(this.pollId), this.activePollService.getById(this.activePollId));

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.poll = res[0];
            this.activePoll = res[1];

            this.addQuestions();

            if (this.activePoll.status === 'not_viewed') {
                this.updateActivePoll('viewed');
            }
        })
    }

    // Pushes all questions/responses from poll/active poll to form
    addQuestions(): void {
        let questions = this.activePollForm.get('questions') as FormArray;

        for (let i = 0; i < this.activePoll.responses.length; i++) {
            questions.push(new SubmittableFormGroup({
                question: new FormControl(this.poll.questions[i], []),
                response: new FormControl(this.activePoll.responses[i], []),
            }));
        }
    }

    // After any question is answered - updates the poll, save progress
    // Param status comes from view ('in_progress')
    updateActivePoll(status: string): void {
        if (this.updateActivePollRequest) {
            return;
        }

        let body: ActivePoll = {
            id: this.activePollId,
            poll_id: this.pollId,
            user_id: this.userId,
            responses: [],
            status: status,
            last_updated: moment().format()
        };

        for (let i = 0; i < this.activePollForm.value.questions.length; i++) {
            body.responses.push(this.activePollForm.value.questions[i].response);
        }

        this.updateActivePollRequest = this.activePollService.update(body);

        this.updateActivePollRequest.subscribe(res => {
            this.updateActivePollRequest = null;
        });
    }

    // Attempts to send/complete the active poll when submit is clicked
    sendActivePoll(): void {
        this.messages = [];

        if (this.updateActivePollRequest) {
            return;
        }

        let body: ActivePoll = {
            id: this.activePollId,
            poll_id: this.pollId,
            user_id: this.userId,
            responses: [],
            status: 'completed',
            last_updated: moment().format()
        };

        for (let i = 0; i < this.activePollForm.value.questions.length; i++) {
            if (this.activePollForm.value.questions[i].response === null) {
                this.messages.push({ message: 'Please finish the poll', type: 'alert-danger' });
                return;
            }
            body.responses.push(this.activePollForm.value.questions[i].response);
        }

        this.updateActivePollRequest = this.activePollService.update(body);

        this.updateActivePollRequest.subscribe(res => {
            const modalRef = this.modalService.open(ConfirmationModalComponent);
            modalRef.componentInstance.message = 'We\'ve received your answers! Thanks for taking our poll!';
            modalRef.componentInstance.type = 'message';

            modalRef.result.then((result) => {
                if (this.fromEmail === 'true') {
                    let win = window.open(null, "_self");
                    win.close();
                } else {
                    this.router.navigateByUrl('/dashboard');
                }
            }, (reason) => { });
            this.updateActivePollRequest = null;
        });
    }
}
