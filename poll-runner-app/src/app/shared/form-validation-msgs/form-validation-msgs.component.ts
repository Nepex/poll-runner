// Angular
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

// X and checkmarks for invalid/valid inputs
@Component({
    selector: 'pr-form-validation-msgs',
    template:
    `<span *ngIf=" (control.touched || submitted) && (control.errors || control.status === 'INVALID')">
        <span class="form-control-feedback" *ngIf="control.hasError('required') || control.hasError('minlength') || control.hasError('maxlength') || control.hasError('pattern') ||
        control.hasError('match') || control.status === 'INVALID'">
            <i class="fas fa-times"></i>
        </span>
    </span>
    <span *ngIf="(control.touched || submitted) && !control.errors && control.status === 'VALID'">
        <span class="checkmark">&#10003;</span>
    </span>`,
    styleUrls: ['./form-validation-msgs.component.css']
})
export class FormValidationMsgsComponent {
    // UI
    @Input() submitted: boolean;
    @Input() control: FormControl;
    @Input() example: string;
    @Input() showErrorsOnly = false;
}