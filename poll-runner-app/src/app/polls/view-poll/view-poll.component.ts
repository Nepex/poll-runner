// Angular
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

// App
import { Poll } from 'src/app/api/poll/poll';
import { UserService } from 'src/app/api/user/user.service';
import { User } from 'src/app/api/user/user';
import { PollService } from 'src/app/api/poll/poll.service';

// Page for viewing selected poll
@Component({
    selector: 'pr-view-poll',
    templateUrl: './view-poll.component.html',
    styleUrls: ['./view-poll.component.css']
})
export class ViewPollComponent implements OnInit {
    // Subs
    loadingRequest: Observable<[User, Poll]>;

    // Data stores
    poll: Poll;
    user: User;

    constructor(private userService: UserService, private pollService: PollService, private activatedRoute: ActivatedRoute) { }

    // Gets poll id form url params, attempts to grab poll data
    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            const id = params['id'];

            this.getData(id);
        });
    }

    // Gets poll data by id and current user
    getData(id): void {
        this.loadingRequest = forkJoin(this.userService.getUser(), this.pollService.getById(id));

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res[0];
            this.poll = res[1];
        })
    }
}
