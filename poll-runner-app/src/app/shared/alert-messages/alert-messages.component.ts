// Angular
import { Component, Input } from '@angular/core';

// Error and success message display component
@Component({
    selector: 'pr-alert-messages',
    template:
    `<div class="text-center" style="padding-top: 10px; padding-bottom: 10px;" *ngFor="let m of messages">
        <div class="alert {{ m.type }}" *ngIf="m">
            
            <div style="position: relative; margin-left: auto; margin-right: auto;">
            <p style="position: absolute;">
                <i class="fa fa-times" style="cursor: pointer; position: absolute; top: -9px; left: 179px; font-size: 11px;" (click)="close(m)"></i>
            </p>
                {{ m.message }}
            </div>

        </div>        
    </div>`
})
export class AlertMessagesComponent {
    // UI
    @Input() messages: AlertMessage[];

    close(m: AlertMessage): void {
        for (let i = 0; i < this.messages.length; i++) {
            if (m.message === this.messages[i].message) {
                this.messages.splice(i, 1);
            }
        }
    }
}

export class AlertMessage {
    message: string;
    type: string; // accepts 'alert-success' and 'alert-danger'
}
