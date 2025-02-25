import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";

@Injectable({ providedIn: "root" })
export class KeycloakOperationService {
    constructor(private readonly keycloak: KeycloakService) {

    }
    async initKeycloak(): Promise<void> {
        const authenticated = await this.keycloak.isLoggedIn();
        console.log("user is logged in init keycloak");

        if (authenticated) {
            console.log("storing token exp");

            this.storeTokenExpiry();
            console.log("checkig exp");

            this.checkTokenExpiry();
        }
    }

    async isLoggedIn(): Promise<boolean> {
        return await this.keycloak.isLoggedIn();
    }

    async login(): Promise<void> {
        await this.keycloak.login();
        const refreshToken = this.keycloak.getKeycloakInstance().refreshToken || "";

        //localStorage.setItem("refreshToken", refreshToken);
    }

    async logout(): Promise<void> {
        await this.keycloak.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.clear(); // Remove token on logout
    }

    async getUserProfile(): Promise<any> {
        const profile = await this.keycloak.loadUserProfile();
        // console.log("User profile:", profile);
        return profile;
    }


    async getToken(): Promise<string | null> {
        try {

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                console.log(" refresh token found already.");
                const refreshToken = this.keycloak.getKeycloakInstance().refreshToken || "";
                console.log("this is new refresh token : ", refreshToken);

            }
            else {
                console.log("No refresh token found. refresh token not found in local storage");
                const refreshToken = this.keycloak.getKeycloakInstance().refreshToken || "";
                localStorage.setItem("refreshToken", refreshToken);
                console.log("this refresh token stored by getToken method : ", refreshToken);
            }
            const token = await this.keycloak.getToken();
            if (token) {
                localStorage.setItem("token", token);
                console.log("Token stored in localStorage by getToken method : ", token);
            }
            return token;
        } catch (error) {
            console.error("Error fetching token:", error);
            return null;
        }
    }

    async refreshToken(): Promise<string | null> {
        try {
            const refreshed = await this.keycloak.updateToken(30);
            if (refreshed) {
                const newToken = await this.keycloak.getToken();
                localStorage.setItem('token', newToken);
                console.log(" token stored in localStorage by refreshstorage method :", newToken);
                return newToken;
            }
            return null;
        } catch (error) {
            console.error(" Token refresh failed:", error);
            return null;
        }
    }

    private checkTokenExpiry(): void {
        const expiryTime = localStorage.getItem('token_expiry');
        if (expiryTime) {
            const currentTime = Date.now();
            const timeLeft = parseInt(expiryTime) - currentTime;

            if (timeLeft <= 0) {
                alert("session timeout !")
                this.logout();
            } else {
                console.log("token is about to expire ", timeLeft / 1000, " seconds left !");
                // setTimeout(() => this.checkTokenExpiry(), timeLeft);
            }
        }
    }
    private storeTokenExpiry(): void {
        const refreshTokenParsed = this.keycloak.getKeycloakInstance().refreshTokenParsed;
        console.log("this is the parsed token", refreshTokenParsed);
        const tokenExpiry = localStorage.getItem("token_expiry");
        if (tokenExpiry) {
            console.log("expiry time already exists");
            return;
        }
        else {
            if (refreshTokenParsed) {
                console.log("stored expiry time in the localstorage");
                const expiryTime = (refreshTokenParsed.exp || 1) * 1000; // Convert to milliseconds
                localStorage.setItem('token_expiry', expiryTime.toString());
            }
        }
    }
}
