// Angular
import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

// App
import { ActivePoll } from '../api/active-poll/active-poll';
import { ActivePollService } from '../api/active-poll/active-poll.service';
import { Poll } from '../api/poll/poll';
import { PollService } from '../api/poll/poll.service';
import { User } from '../api/user/user';
import { UserService } from '../api/user/user.service';

// User/admin dashboard
@Component({
    selector: 'pr-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    // Subs
    loadingRequest: Observable<User>;
    adminDataRequest: Observable<[User[], ActivePoll[], Poll[]]>;
    userDataRequest: Observable<ActivePoll[]>;

    // Data stores
    user: User;
    users: User[];
    polls: Poll[];
    activePolls: ActivePoll[];

    constructor(private userService: UserService, private pollService: PollService, private activePollService: ActivePollService) { }

    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res;

            this.getData();
        })
    }

    getData(): void {
        if (this.user.is_admin) {
            this.adminDataRequest = forkJoin(this.userService.getUsers(), this.activePollService.getActivePolls(), this.pollService.getPolls());

            this.adminDataRequest.subscribe(res => {
                this.users = res[0];
                this.activePolls = res[1];
                this.polls = res[2];
                this.adminDataRequest = null;

                // splice admin account
                for (let i = 0; i < this.users.length; i++) {
                    if (this.user.id === this.users[i].id) {
                        this.users.splice(i, 1);
                        break;
                    }
                }

                console.log(this.activePolls);
            });
        } else {
            this.userDataRequest = this.userService.getActivePollsByUserId(this.user.id);

            this.userDataRequest.subscribe(res => {
                this.activePolls = [];

                // only display incomplete polls for users
                for (let i = 0; i < res.length; i++) {
                    if (res[i].status !== 'completed') {
                        continue;
                    }

                    this.activePolls.push(res[i]);
                }

                this.userDataRequest = null;
            });
        }
    }
}
