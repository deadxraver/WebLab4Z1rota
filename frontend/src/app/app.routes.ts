import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { Graph } from './auth/graph/graph.component';
import { authGuard } from './guards/app.guard';
import { guestGuard } from './guards/guest.guard';


export const routes: Routes= [
    
    {path: "", redirectTo: "login", pathMatch: 'full'},
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [guestGuard]
    
    },
    { 
        path: 'register', 
        component: RegisterComponent, 
        canActivate: [guestGuard]
    },
    

    {
        path: 'graph',
        component: Graph,
        canActivate: [authGuard]
    }


]