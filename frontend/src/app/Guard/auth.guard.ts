import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { KeycloakService } from "keycloak-angular";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(private keycloakService: KeycloakService, private router: Router) { }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const loggedIn = await this.keycloakService.isLoggedIn();
        if (!loggedIn) {
            await this.keycloakService.login(); // Redirects to Keycloak login
            return false;
        }
        return true;
    }
}
