
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { FormValidationMsgsComponent } from './form-validation-msgs/form-validation-msgs.component';
import { HeaderComponent } from './header/header.component';
import { OffClickDirective } from './off-click-directive/off-click-directive';

@NgModule({
    declarations: [
        AlertMessagesComponent,
        FormValidationMsgsComponent,
        HeaderComponent,
        OffClickDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule
    ],
    exports: [
        AlertMessagesComponent,
        FormValidationMsgsComponent,
        HeaderComponent,
        OffClickDirective
    ],
    providers: [],
    entryComponents: [
    ]
})
export class SharedModule { }
