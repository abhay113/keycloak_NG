import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Home/Home.component';
import { AuthGuard } from './Guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '',
    }
];
