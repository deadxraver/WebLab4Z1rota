import { inject, Inject } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { CanActivateFn, Router } from "@angular/router";

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isLoggedIn()) {
        router.navigate(['/graph'])
        return false;
    } else {
        return true
    }
}
