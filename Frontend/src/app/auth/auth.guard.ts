import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router, CanMatchFn } from "@angular/router";
import { paths } from "../app.routes";

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) return true;

  return router.parseUrl(paths.LOGIN);
};
