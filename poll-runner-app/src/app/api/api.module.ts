// Angular
import { AuthInterceptor } from './auth-interceptor';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// NPM
import { NgxWebstorageModule } from 'ngx-webstorage';

// App
import { SessionService } from './session/session.service';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        NgxWebstorageModule.forRoot()
    ],
    exports: [
    ],
    providers: [
        SessionService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
})
export class ApiModule {}
