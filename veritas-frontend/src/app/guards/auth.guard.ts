import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // Chamamos o GPS (Router)
  const router = inject(Router);
  
  // Olhamos na gaveta do navegador se o Crachá (Token) está lá
  const token = localStorage.getItem('token');
  
  if (token) {
    // Pode passar!
    return true;
  } else {
    // Sem crachá? Chuta para a tela de login!
    router.navigate(['/login']);
    return false;
  }
};
