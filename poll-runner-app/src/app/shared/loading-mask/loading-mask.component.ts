import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'pr-loading-mask',
    templateUrl: './loading-mask.component.html',
    styleUrls: ['./loading-mask.component.css']
})
export class LoadingMaskComponent {
    @Input() watch: Promise<any>|Observable<any>;
}
