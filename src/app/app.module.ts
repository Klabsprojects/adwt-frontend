import { NgModule, APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { FakeAPIService } from './_fake/fake-api.service';
import { AuthInterceptor } from './auth.interceptor';

import { provideRouter, Router } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import Swal from 'sweetalert2';


// ✅ Keycloak initializer
function initializeKeycloak(keycloak: KeycloakService, authService: AuthService) {
  return () => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has('code')) {
      const code = searchParams.get('code')!;
      console.log('🔑 Auth Code from URL:', code);

      // Exchange auth code for token
      authService.getTokenFromCode(code).subscribe({
        next: (tokenResponse: any) => {
          console.log('✅ Token Response:', tokenResponse);
          if (tokenResponse?.access_token) {
            localStorage.setItem('access_token', tokenResponse.access_token);
          }
        },
        error: (err: any) => {
          console.error('❌ Token exchange failed:', err);
        }
      });
    }

    // Initialize Keycloak
    return keycloak.init({
      config: {
        url: 'http://74.208.113.233:8081',
        realm: 'klabs',
        clientId: 'adwt-client'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      }
    });
  };
}

// function appInitializer(authService: AuthService) {
//   return () => {
//     return new Promise<void>((resolve) => {
//       const params = new URLSearchParams(window.location.search);
//       const authCode = params.get('code');

//       if (authCode) {
//         console.log('Auth code detected:', authCode);
//         authService.getTokenFromCode(authCode).subscribe({
//           next: (token) => {
//             console.log('Token response:', token,token.access_token);
//             const decoded = decodeJwt(token.access_token);
//             console.log('Decoded JWT:', decoded);
//             sessionStorage.setItem('user_data',decoded.roleId);
//             if(decoded.roleId == 3){

//             }
//             else{

//             }
            
//             resolve();
//           },
//           error: (err) => {
//             console.error('Error exchanging token:', err);
//             resolve();
//           }
//         });
//       } else {
//         console.log('No auth code, checking existing token...');
//         authService.getUserByToken().subscribe({
//           next: () => resolve(),
//           error: () => resolve()
//         });
//       }
//     });
//   };
// }


function appInitializer(authService: AuthService) {
  const router = inject(Router);

  return () => {
    return new Promise<void>((resolve) => {
      const params = new URLSearchParams(window.location.search);
      const authCode = params.get('code');

      if (authCode) {
        console.log('Auth code detected:', authCode);
        authService.getTokenFromCode(authCode).subscribe({
          next: (token) => {
            // console.log('Token response:', token, token.access_token);
            sessionStorage.setItem('isSSOLogin', 'true');
            sessionStorage.setItem('id_token', token.id_token);
            const decoded = decodeJwt(token.access_token);
            decoded.token = token.access_token;
            // console.log('Decoded JWT:', decoded);

            sessionStorage.setItem('user_data', JSON.stringify(decoded));

            
            if (decoded.role == 3) {
              router.navigate(['/widgets-examples/VmcmeetingComponent']); 
            } else {
              router.navigate(['/widgets-examples/fir-list']);     
            }
            resolve();
          },
          error: (err) => {
            console.error('❌ Error exchanging token:', err);
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Unable to login. Please try again.',
            }).then(() => {
              router.navigate(['/login']);
            });

            resolve();
          }
        });
      } else {
        console.log('No auth code, checking existing token...');
        authService.getUserByToken().subscribe({
          next: () => resolve(),
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Session Expired',
              text: 'Please login again.',
            }).then(() => {
              router.navigate(['/login']);
            });
            resolve();
          }
        });
      }
    });
  };
}


function decodeJwt(token: string) {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

export const appConfig: ApplicationConfig = {
  providers: [
    KeycloakService,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AuthService]
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbDropdownModule,
    NgxPaginationModule,
    NgbPaginationModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
