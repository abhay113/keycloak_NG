import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";

@Injectable({ providedIn: "root" })
export class KeycloakOperationService {
    constructor(private readonly keycloak: KeycloakService) { }

    async isLoggedIn(): Promise<boolean> {
        return await this.keycloak.isLoggedIn();
    }

    async login(): Promise<void> {
        await this.keycloak.login();
    }

    async logout(): Promise<void> {
        await this.keycloak.logout();
        localStorage.removeItem("token"); // Remove token on logout
    }

    async getUserProfile(): Promise<any> {
        const profile = await this.keycloak.loadUserProfile();
        console.log("User profile:", profile);
        return profile;
    }


    async getToken(): Promise<string | null> {
        try {
            const token = await this.keycloak.getToken();
            console.log("Fetched Token:", token); 
            if (token) {
                localStorage.setItem("token", token);
                console.log("Token stored in localStorage:", localStorage.getItem("token"));
            }
            return token;
        } catch (error) {
            console.error("Error fetching token:", error);
            return null;
        }
    }
}
