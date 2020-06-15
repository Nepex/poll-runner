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
import { SignUpComponent } from './signup/signup.component';

export const routes: Routes = [
  // public
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },


  // private
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // admin
  { path: 'poll-list', component: PollListComponent, canActivate: [AuthGuardAdmin] },
  { path: 'create-poll', component: CreatePollComponent, canActivate: [AuthGuardAdmin] },

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
