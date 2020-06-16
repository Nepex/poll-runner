// Angular
import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from 'src/app/shared/alert-messages/alert-messages.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
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

    constructor(private pollService: PollService, private userService: UserService, private router: Router, private modalService: NgbModal) { }

    ngOnInit(): void {
        this.loadingRequest = forkJoin(this.pollService.getPolls(), this.userService.getUser());

        this.loadingRequest.subscribe(res => {
            this.polls = res[0];
            this.user = res[1];

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

    confirmPollDelete(poll: Poll) {
        const modalRef = this.modalService.open(ConfirmationModalComponent);
        modalRef.componentInstance.message = 'Are you sure you want to delete ' + poll.poll_name + '?';

        modalRef.result.then((result) => {
            this.deletePoll(poll.id);
        }, (reason) => { });
    }

    deletePoll(id: string): void {
        this.messages = [];
        this.deleteRequest = this.pollService.delete(id);

        this.deleteRequest.subscribe(res => {
            this.deleteRequest = null;
            this.messages.push({ message: 'Poll successfully deleted', type: 'alert-success' });
            this.refreshPolls();
        });
    }

    viewPoll(poll: Poll): void {
        this.router.navigate(['/view-poll'], { queryParams: { id: poll.id } });
    }
}
