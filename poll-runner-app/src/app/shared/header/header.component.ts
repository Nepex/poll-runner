// Angular
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { SessionService } from './../../api/session/session.service';
import { User } from '../../api/user/user';

// Header component for base website
@Component({
    selector: 'pr-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    // Component Inputs
    @Input() selectedTab: string;
    @Input() isAdmin: boolean = false;

    // Subs
    loadingRequest: Observable<User>;
    
    // Data Stores
    user: User;

    // UI
    isCollapsed: boolean = true;
    userAuthed: boolean = false;

    constructor(private modal: NgbModal, private sessionService: SessionService) { }

    // Checks if user is authed
    ngOnInit(): void {
        if (this.sessionService.isAuthenticated()) {
            this.userAuthed = true;
        }
    }

    // Attempts to log user out
    logout(): void {
        this.sessionService.logout();
        window.location.reload();
    }
}
