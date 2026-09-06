import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent], // <-- Importamos o Navbar aqui
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'veritas-frontend';

  // Função que o HTML vai chamar para saber se deve desenhar o menu de navegação ou não
  estaLogado(): boolean {
    // Retorna true se existir um crachá, false se não existir
    return !!localStorage.getItem('token'); 
  }
}
