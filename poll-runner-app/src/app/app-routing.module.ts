// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App
import { AuthGuard } from './auth-guard.service';
import { AuthGuardAdmin } from './auth-guard-admin.service';
import { CreatePollComponent } from './polls/create-poll/create-poll.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PollListComponent } from './polls/poll-list/poll-list.component';
import { SendPollComponent } from './polls/send-poll/send-poll.component';
import { SignUpComponent } from './signup/signup.component';
import { TakePollComponent } from './polls/take-poll/take-poll.component';
import { ViewPollComponent } from './polls/view-poll/view-poll.component';

export const routes: Routes = [
  // public
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'take-poll', component: TakePollComponent },


  // private
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // admin
  { path: 'poll-list', component: PollListComponent, canActivate: [AuthGuardAdmin] },
  { path: 'create-poll', component: CreatePollComponent, canActivate: [AuthGuardAdmin] },
  { path: 'view-poll', component: ViewPollComponent, canActivate: [AuthGuardAdmin] },
  { path: 'send-poll', component: SendPollComponent, canActivate: [AuthGuardAdmin] }

  // path doesn't exist
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
