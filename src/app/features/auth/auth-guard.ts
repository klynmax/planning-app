import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "./login/services/auth-service";

export const authGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAutenticate()) {
    return true
  }

  authService.logout(false);

  // Criar depois uma página pra dizer que o cara não está autorizada a acessar esta rota.
  return router.createUrlTree(['/login']);
}
