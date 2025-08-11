import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocalAuthService } from 'app/core/auth/local-auth.service';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';

@NgModule({
    imports  : [
        HttpClientModule
    ],
    providers: [
        LocalAuthService,
        {
            provide : HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi   : true
        }
    ]
})
export class AuthModule
{
}
