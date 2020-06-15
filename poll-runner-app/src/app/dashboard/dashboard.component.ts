// Angular
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// App
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

    // Data stores
    user: User;
    
    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res;
        })
    }
}
