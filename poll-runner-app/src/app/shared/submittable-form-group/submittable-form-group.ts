// Angular
import { FormGroup } from "@angular/forms";

// Adds submitted property to formgroups
export class SubmittableFormGroup extends FormGroup {
    // UI
    submitted: boolean;
}