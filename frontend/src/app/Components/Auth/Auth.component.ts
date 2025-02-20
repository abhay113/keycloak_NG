import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { KeycloakOperationService } from "../../Services/keycloak.service";

@Component({
  selector: "app-auth",
  template: "",
  standalone: true,
})
export class AuthComponent implements OnInit {
  constructor(private keycloakService: KeycloakOperationService, private router: Router) {}

  async ngOnInit() {
    const loggedIn = await this.keycloakService.isLoggedIn();
    if (!loggedIn) {
      await this.keycloakService.login();
    } else {
      console.log("User is already logged in");
      await this.keycloakService.getToken();
      this.router.navigate(["/home"]);
    }
  }
}
