import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Home/Home.component';
import { AuthGuard } from './Guard/auth.guard';
import { AuthComponent } from "./Components/Auth/Auth.component";
import { Data_TableComponent } from './Components/Data_Table/Data_Table.component';

export const routes: Routes = [
    { path: "auth", component: AuthComponent },
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "data", component: Data_TableComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: "auth" },
];
