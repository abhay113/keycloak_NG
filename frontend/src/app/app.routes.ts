import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Home/Home.component';
import { AuthGuard } from './Guard/auth.guard';
import { AuthComponent } from "./Components/Auth/Auth.component";

export const routes: Routes = [
    { path: "auth", component: AuthComponent },
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: "auth" }, 
];
