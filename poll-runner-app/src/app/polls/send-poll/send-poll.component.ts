// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormArray } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';

// NPM
import * as moment from 'moment';

// App
import { ActivePoll } from 'src/app/api/active-poll/active-poll';
import { ActivePollService } from 'src/app/api/active-poll/active-poll.service';
import { AlertMessage } from 'src/app/shared/alert-messages/alert-messages.component';
import { Poll } from 'src/app/api/poll/poll';
import { PollService } from 'src/app/api/poll/poll.service';
import { User } from 'src/app/api/user/user';
import { UserService } from 'src/app/api/user/user.service';
import { SubmittableFormGroup } from 'src/app/shared/submittable-form-group/submittable-form-group';

// Page for sending polls
@Component({
    selector: 'pr-send-poll',
    templateUrl: './send-poll.component.html',
    styleUrls: ['./send-poll.component.css']
})
export class SendPollComponent implements OnInit {
    // Subs
    loadingRequest: Observable<[Poll[], User[], User]>;
    createActivePollsRequest: Observable<ActivePoll[]>;

    // Data stores
    polls: Poll[];
    users: User[];
    user: User;
    selectedUser: string = '';

    // UI
    messages: AlertMessage[];
    usersToDisplay: User[] = [];

    // Forms
    sendPollsForm: SubmittableFormGroup = new SubmittableFormGroup({
        poll_id: new FormControl('', [Validators.required]),
    });

    constructor(private pollService: PollService, private userService: UserService, private activePollService: ActivePollService) { }

    // Gets current user, all users, and all polls
    ngOnInit(): void {
        this.loadingRequest = forkJoin(this.pollService.getPolls(), this.userService.getUsers(), this.userService.getUser());

        this.loadingRequest.subscribe(res => {
            this.polls = res[0];
            this.users = res[1];
            this.user = res[2];

            // remove current user
            for (let i = 0; i < this.users.length; i++) {
                if (this.user.id === this.users[i].id) {
                    this.users.splice(i, 1);
                    break;
                }
            }

            this.loadingRequest = null;
        });
    }

    // Adds user to recipient list
    addUser(): void {
        if (!this.selectedUser) {
            return;
        }

        for (let i = 0; i < this.users.length; i++) {
            if (this.selectedUser === this.users[i].id) {
                // don't allow multiples of same user
                if (this.usersToDisplay.indexOf(this.users[i]) > -1) {
                    return;
                }

                this.usersToDisplay.push(this.users[i]);
                break;
            }
        }
    }

    // Removes user from recipient list
    removeUser(id: string): void {
        for (let i = 0; i < this.usersToDisplay.length; i++) {
            if (id === this.usersToDisplay[i].id) {
                this.usersToDisplay.splice(i, 1);
                break;
            }
        }
    }

    // Attempts to create active poll (sends poll to all users selected)
    createActivePolls(): void {
        this.messages = [];

        if (!this.sendPollsForm.valid || this.loadingRequest || this.createActivePollsRequest) {
            this.messages.push({ message: 'Please select a poll', type: 'alert-danger' });
            return;
        }

        if (this.usersToDisplay.length === 0) {
            this.messages.push({ message: 'Please select user(s) to send to by clicking "Add Selected User"', type: 'alert-danger' });
            return;
        }

        let body: ActivePoll[] = [];
        let responses: boolean[] = [];

        // populate blank responses
        for (let i = 0; i < this.polls.length; i++) {
            if (this.sendPollsForm.value.poll_id === this.polls[i].id) {
                for (let j = 0; j < this.polls[i].questions.length; j++) {
                    responses.push(null);
                }
                break;
            }
        }

        // populate polls to be sent
        for (let i = 0; i < this.usersToDisplay.length; i++) {
            body.push({
                poll_id: this.sendPollsForm.value.poll_id,
                user_id: this.usersToDisplay[i].id,
                responses: responses,
                last_updated: moment().format()
            });
        }

        this.createActivePollsRequest = this.activePollService.create(body);

        this.createActivePollsRequest.subscribe(res => {
            this.messages.push({ message: 'Polls sucessfully sent', type: 'alert-success' });
            this.sendPollsForm.controls.poll_id.setValue('');
            this.selectedUser = '';
            this.usersToDisplay = [];
            this.createActivePollsRequest = null;
        });
    }
}
