import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o crachá da gaveta
  const token = localStorage.getItem('token');

  // Se tiver crachá, faz uma cópia da carta (req) e grampeia o crachá nela
  if (token) {
    const requisicaoClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Manda a carta grampeada seguir viagem
    return next(requisicaoClonada);
  }

  // Se não tiver crachá, manda a carta normal (ex: a própria requisição de login que não precisa de crachá)
  return next(req);
};
