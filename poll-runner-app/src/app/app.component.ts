// Angular
import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'pr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0,
        display: 'none'
      })),
      transition('show => hide', [
        animate('.25s')
      ]),
    ]),
  ],
})
export class AppComponent implements OnDestroy {
  isLoadingRoute: boolean;
  routerSub: Subscription;

  constructor(private router: Router) {
    this.routerSub = this.router.events.subscribe((event: Event) => {
      this.isLoadingRoute = true;
      this._navigationInterceptor(event);
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  private _navigationInterceptor(event: Event): void {
    if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
      // timeout so loads aren't jarring/too flashy
      setTimeout(() => {
        this.isLoadingRoute = false;
      }, 250);
    }
  }
}
