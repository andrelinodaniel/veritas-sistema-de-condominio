import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // <-- Importamos as ferramentas de link do Angular
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  constructor(private router: Router) {}

  // Função para deslogar (Rasgar o crachá e voltar pro login)
  fazerLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
