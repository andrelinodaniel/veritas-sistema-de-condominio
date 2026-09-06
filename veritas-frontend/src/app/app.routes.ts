import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Chamados } from './pages/chamados/chamados';
import { Moradores } from './pages/moradores/moradores';
import { CadastroMorador } from './pages/cadastro-morador/cadastro-morador';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Redireciona a raiz (/) para o login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rota pública
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroMorador },
  
  // Rotas Privadas (Protegidas pelo Guarda-Costas)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'chamados', 
    component: Chamados,
    canActivate: [authGuard] 
  },
  { 
    path: 'moradores', 
    component: Moradores,
    canActivate: [authGuard] 
  },

  // Se digitar qualquer url que não existe, joga pro login
  { path: '**', redirectTo: 'login' }
];
