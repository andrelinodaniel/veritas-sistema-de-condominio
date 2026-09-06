import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChamadosComponent } from './pages/chamados/chamados.component';
import { MoradoresComponent } from './pages/moradores/moradores.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Redireciona a raiz (/) para o login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rota pública
  { path: 'login', component: LoginComponent },
  
  // Rotas Privadas (Protegidas pelo Guarda-Costas)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'chamados', 
    component: ChamadosComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'moradores', 
    component: MoradoresComponent,
    canActivate: [authGuard] 
  },

  // Se digitar qualquer url que não existe, joga pro login
  { path: '**', redirectTo: 'login' }
];
