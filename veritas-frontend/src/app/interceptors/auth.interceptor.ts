import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o crachá da gaveta
  const token = localStorage.getItem('token');
  
  // Pega o GPS (Router) para poder mudar de página se der erro
  const router = inject(Router);

  let headers = req.headers;

  // Se tiver crachá, faz uma cópia da carta (req) e grampeia o crachá nela
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const requisicaoClonada = req.clone({ headers });

  // Manda a carta e fica de olho na resposta
  return next(requisicaoClonada).pipe(
    catchError((erro: HttpErrorResponse) => {
      // Se o Django devolver erro 401 (Não Autorizado / Token Vencido)
      if (erro.status === 401) {
        localStorage.removeItem('token'); // Joga fora o crachá vencido
        router.navigate(['/login']);      // Manda o usuário de volta pro login
      }
      return throwError(() => erro);
    })
  );
};
