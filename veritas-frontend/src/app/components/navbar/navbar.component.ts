import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // <-- Importamos as ferramentas de link do Angular
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  constructor(private router: Router, public authService: AuthService) {}

  // Função para deslogar (Rasgar o crachá e voltar pro login)
  fazerLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
