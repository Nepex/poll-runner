
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { FormValidationMsgsComponent } from './form-validation-msgs/form-validation-msgs.component';
import { HeaderComponent } from './header/header.component';
import { OffClickDirective } from './off-click-directive/off-click-directive';

@NgModule({
    declarations: [
        AlertMessagesComponent,
        ConfirmationModalComponent,
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
        ConfirmationModalComponent,
        FormValidationMsgsComponent,
        HeaderComponent,
        OffClickDirective
    ],
    providers: [],
    entryComponents: [
        ConfirmationModalComponent
    ]
})
export class SharedModule { }
