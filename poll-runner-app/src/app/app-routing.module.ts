// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App
import { AuthGuard } from './auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

export const routes: Routes = [
  // public
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },


  // private
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

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
