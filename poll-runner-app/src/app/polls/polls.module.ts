
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';

// App
import { ApiModule } from '../api/api.module';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { PollListComponent } from './poll-list/poll-list.component';
import { SendPollComponent } from './send-poll/send-poll.component';
import { SharedModule } from '../shared/shared.module';
import { TakePollComponent } from './take-poll/take-poll.component';
import { ViewPollComponent } from './view-poll/view-poll.component';

@NgModule({
    declarations: [
        CreatePollComponent,
        PollListComponent,
        SendPollComponent,
        TakePollComponent,
        ViewPollComponent
    ],
    imports: [
        ApiModule,
        CommonModule,
        FormsModule,
        MomentModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        NgbModule
    ],
    exports: [
    ],
    providers: [],
    entryComponents: [
    ]
})
export class PollsModule { }
