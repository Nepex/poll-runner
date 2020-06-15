// Angular
import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

// App
import { AlertMessage } from 'src/app/shared/alert-messages/alert-messages.component';
import { Poll } from 'src/app/api/poll/poll';
import { PollService } from 'src/app/api/poll/poll.service';
import { User } from 'src/app/api/user/user';
import { UserService } from 'src/app/api/user/user.service';

// Page for listing polls
@Component({
    selector: 'pr-poll-list',
    templateUrl: './poll-list.component.html',
    styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit {
    // Subs
    loadingRequest: Observable<[Poll[], User]>;
    deleteRequest: Observable<Poll>;
    refreshRequest: Observable<Poll[]>;

    // Data stores
    polls: Poll[];
    user: User;

    // UI
    messages: AlertMessage[];

    constructor(private pollService: PollService, private userService: UserService) { }

    ngOnInit(): void {
        this.loadingRequest = forkJoin(this.pollService.getPolls(), this.userService.getUser());

        this.loadingRequest.subscribe(res => {
            this.polls = res[0];
            this.user = res[1];

            console.log(this.polls);

            this.loadingRequest = null;
        });
    }

    refreshPolls(): void {
        this.refreshRequest = this.pollService.getPolls();

        this.refreshRequest.subscribe(res => {
            this.refreshRequest = null;
            this.polls = res;
        });
    }

    deletePoll(poll: Poll): void {
        // need confirm modal
        this.messages = [];
        this.deleteRequest = this.pollService.delete(poll);

        this.deleteRequest.subscribe(res => {
            this.deleteRequest = null;
            this.messages.push({ message: 'Poll successfully deleted', type: 'alert-success' });
            this.refreshPolls();
        });
    }
}
