import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Pega o crachá da gaveta
  const token = localStorage.getItem('token');

  let headers = req.headers
    .set('bypass-tunnel-reminder', 'true')
    .set('ngrok-skip-browser-warning', 'true');

  // Se tiver crachá, faz uma cópia da carta (req) e grampeia o crachá nela
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const requisicaoClonada = req.clone({ headers });

  // Manda a carta grampeada seguir viagem
  return next(requisicaoClonada);
};
