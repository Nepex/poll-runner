// Angular
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// App
import { ApiModule } from './api/api.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';
import { AuthGuardAdmin } from './auth-guard-admin.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PollsModule } from './polls/polls.module';
import { SharedModule } from './shared/shared.module';
import { SignUpComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    ApiModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    PollsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [AuthGuard, AuthGuardAdmin],
  bootstrap: [AppComponent]
})
export class AppModule { }
