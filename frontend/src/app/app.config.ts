import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { KeycloakService, KeycloakBearerInterceptor } from "keycloak-angular";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { initializeKeycloak } from "./init/keycloak.init.factory";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AuthInterceptor } from "./Interceptor/check-auth.interceptor";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    KeycloakService,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: {} },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideHttpClient(
      withInterceptorsFromDi() // tell httpClient to use interceptors from DI
    ),
  ],
};