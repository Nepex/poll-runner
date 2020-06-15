
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App
import { ApiModule } from '../api/api.module';
import { PollListComponent } from './poll-list/poll-list.component';
import { SharedModule } from '../shared/shared.module';
import { CreatePollComponent } from './create-poll/create-poll.component';

@NgModule({
    declarations: [
        CreatePollComponent,
        PollListComponent
    ],
    imports: [
        ApiModule,
        CommonModule,
        FormsModule,
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
