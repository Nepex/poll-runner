// Angular
import { Directive, Output, EventEmitter, ElementRef } from '@angular/core';

// Directive that emits when an element is clicked off of
@Directive({
    selector: '[offClick]',
    host: {
        '(document:click)': 'onClick($event)',
    }
})

export class OffClickDirective {
    // Component Outputs
    @Output('offClick') offClicked: EventEmitter<{}> = new EventEmitter();

    constructor(private elementRef: ElementRef) {
    }

    onClick($event): void {
        $event.stopPropagation();

        if (!this.elementRef.nativeElement.contains($event.target))
            this.offClicked.emit({});
    }
}