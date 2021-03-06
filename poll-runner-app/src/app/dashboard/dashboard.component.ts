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
    userDataRequest: Observable<[ActivePoll[], Poll[]]>;

    // Data stores
    user: User;
    users: User[];
    polls: Poll[];
    pollsTaken: number = 0;
    selectedPoll: Poll;
    activePolls: ActivePollsExtra[];
    selectedActivePolls: ActivePollsExtra[] = [];
    individualResults: ActivePollsExtra;

    // UI
    page: number = 1;
    pageSize: number = 10;

    // Forms
    pollDataForm: SubmittableFormGroup = new SubmittableFormGroup({
        poll_id: new FormControl('', []),
        user_id: new FormControl('', []),
    });

    // Chart
    data: ChartData[] = [];
    gradient: boolean = true;
    view: number[] = [400, 300];
    colorScheme: ChartColors = { domain: ['#5AA454', '#A10A28'] };

    constructor(private userService: UserService, private pollService: PollService, private activePollService: ActivePollService) { }

    // Get current user
    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res;

            this.getData();
        })
    }

    // Get data to organize for chart/user/poll views
    getData(): void {
        if (this.user.is_admin) {
            // get admin view
            this.adminDataRequest = forkJoin(this.userService.getUsers(), this.activePollService.getActivePolls(), this.pollService.getPolls());

            this.adminDataRequest.subscribe(res => {
                this.users = res[0];
                this.activePolls = res[1];
                this.polls = res[2];
                this.adminDataRequest = null;

                // sort alphabetically
                this.users = _.sortBy(this.users, function (o) { return o.last_name; });
                this.polls = _.sortBy(this.polls, function (o) { return o.poll_name; });

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
            // get user view
            this.userDataRequest = forkJoin(this.userService.getActivePollsByUserId(this.user.id), this.pollService.getPolls());

            this.userDataRequest.subscribe(res => {
                this.activePolls = [];
                this.polls = res[1];

                // only display incomplete polls for users
                for (let i = 0; i < res[0].length; i++) {
                    if (res[0][i].status === 'completed') {
                        continue;
                    }

                    this.activePolls.push(res[0][i]);
                }

                // add poll names
                for (let i = 0; i < this.activePolls.length; i++) {
                    for (let j = 0; j < this.polls.length; j++) {
                        if (this.activePolls[i].poll_id === this.polls[j].id) {
                            this.activePolls[i].poll_name = this.polls[j].poll_name;
                        }
                    }
                }

                this.activePolls = _.sortBy(this.activePolls, function (o) { return o.last_updated; }).reverse();

                this.userDataRequest = null;
            });
        }
    }

    // Organize and display selected poll data for charts
    loadPollData(): void {
        this.pollDataForm.controls.user_id.setValue('');
        this.selectedActivePolls = [];
        this.selectedPoll = null;
        this.individualResults = null;

        let data: ChartData[] = [];

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

        // push responses
        // data = array of questions for selected poll and chart
        // each completed active poll should have the same number of responses as questions in data, so loop through and add responses
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < this.selectedActivePolls.length; j++) {
                // yes responses
                if (this.selectedActivePolls[j].responses[i]) {
                    data[i].chartData[0].value++;
                }

                // no responses
                if (!this.selectedActivePolls[j].responses[i]) {
                    data[i].chartData[1].value++;
                }
            }
        }

        this.data = data;
    }

    // Organize and display selected user's poll data for a list
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

        // sort by dates, most recent
        this.selectedActivePolls = _.sortBy(this.selectedActivePolls, function (o) { return o.last_updated; }).reverse();
    }

    // Organize and display selected user and poll completed data
    viewIndividualResults(pollResults: ActivePollsExtra): void {
        this.individualResults = pollResults;
    }
}

class ActivePollsExtra extends ActivePoll {
    first_name?: string;
    last_name?: string;
    email?: string;
    poll_name?: string;
}

class ChartData {
    question: string;
    chartData: { name: string, value: number }[];
}

class ChartColors {
    domain: string[];
}