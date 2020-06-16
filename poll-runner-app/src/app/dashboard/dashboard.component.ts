// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';

// NPM
import * as _ from 'underscore';

// App
import { ActivePoll } from '../api/active-poll/active-poll';
import { ActivePollService } from '../api/active-poll/active-poll.service';
import { Poll } from '../api/poll/poll';
import { PollService } from '../api/poll/poll.service';
import { SubmittableFormGroup } from '../shared/submittable-form-group/submittable-form-group';
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
    pollsTaken: number = 0;
    selectedPoll: Poll;
    activePolls: ActivePoll[];
    selectedActivePolls: ActivePollsWithUser[] = [];
    individualResults: ActivePollsWithUser;

    // Forms
    pollDataForm: SubmittableFormGroup = new SubmittableFormGroup({
        poll_id: new FormControl('', []),
        user_id: new FormControl('', []),
    });

    // Chart
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;
    view: number[] = [400, 300];

    colorScheme = {
        domain: ['#5AA454', '#A10A28']
    };

    data: any = [];

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

                for (let i = 0; i < this.activePolls.length; i++) {
                    if (this.activePolls[i].status === 'completed') {
                        this.pollsTaken++;
                    }
                }

                // select first poll
                if (this.polls.length > 0) {
                    this.pollDataForm.controls.poll_id.setValue(this.polls[0].id);
                    this.loadPollData();
                }
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

    loadPollData(): void {
        this.pollDataForm.controls.user_id.setValue('');
        this.selectedActivePolls = [];
        this.selectedPoll = null;
        this.individualResults = null;

        let data = [];

        if (this.pollDataForm.value.poll_id === '') {
            return;
        }

        // find poll
        for (let i = 0; i < this.polls.length; i++) {
            if (this.pollDataForm.value.poll_id === this.polls[i].id) {
                this.selectedPoll = this.polls[i];
            }
        }

        // push questions
        for (let i = 0; i < this.selectedPoll.questions.length; i++) {
            data.push({
                question: this.selectedPoll.questions[i],
                chartData: [{ name: 'Yes', value: 0 }, { name: 'No', value: 0 }]
            });
        }

        // find poll completions
        for (let i = 0; i < this.activePolls.length; i++) {
            if (this.pollDataForm.value.poll_id === this.activePolls[i].poll_id) {
                if (this.activePolls[i].status === 'completed') {
                    this.selectedActivePolls.push(this.activePolls[i]);
                }
            }
        }

        // push responses -- loops through data array of questions, responses array on completed polls should be the same length
        // so each responses index should match up with the selected question
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < this.selectedActivePolls.length; j++) {
                if (this.selectedActivePolls[j].responses[i]) {
                    data[i].chartData[0].value++;
                }

                if (!this.selectedActivePolls[j].responses[i]) {
                    data[i].chartData[1].value++;
                }
            }
        }

        this.data = data;
    }

    loadUserData(): void {
        this.selectedActivePolls = [];
        this.individualResults = null;

        if (this.pollDataForm.value.user_id === '') {
            return;
        }

        // push polls
        for (let i = 0; i < this.activePolls.length; i++) {
            if ((this.pollDataForm.value.user_id === this.activePolls[i].user_id) && (this.pollDataForm.value.poll_id === this.activePolls[i].poll_id)) {
                this.selectedActivePolls.push(this.activePolls[i]);
            }
        }

        // add user data
        for (let i = 0; i < this.users.length; i++) {
            if (this.pollDataForm.value.user_id === this.users[i].id) {
                for (let j = 0; j < this.selectedActivePolls.length; j++) {
                    this.selectedActivePolls[j].first_name = this.users[i].first_name;
                    this.selectedActivePolls[j].last_name = this.users[i].last_name;
                    this.selectedActivePolls[j].email = this.users[i].email;
                }
            }
        }

        // sort by date
        this.selectedActivePolls = _.sortBy(this.selectedActivePolls, function (o) { return o.last_updated; });
    }

    viewIndividualResults(pollResults: ActivePollsWithUser): void {
        this.individualResults = pollResults;
    }
}

class ActivePollsWithUser extends ActivePoll {
    first_name?: string;
    last_name?: string;
    email?: string;
}