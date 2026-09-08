import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router'; // O Router é o "GPS" que muda a página da URL

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  erroLogin = ''; 
  perfilSelecionado = 'morador';

  // 1. Injetamos o Motoboy na portaria e também o GPS (Router)
  constructor(private authService: AuthService, private router: Router) {}

  selecionarPerfil(perfil: string) {
    this.perfilSelecionado = perfil;
    this.erroLogin = ''; // Limpa os erros se o usuário mudar de aba
  }

  fazerLogin(cpf: string, senha: string) {
    if (cpf.trim() === '' || senha.trim() === '') {
      this.erroLogin = 'Preencha os campos para realizar o login.';
      return; 
    } 

    this.erroLogin = '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // 2. Chamando o Motoboy para ir no Django
    this.authService.fazerLoginNoDjango(cpfLimpo, senha).subscribe({
      next: (resposta) => {
        // Caminho Feliz! O Django gostou da senha e devolveu o Crachá (Token).
        // Guardamos o crachá na gaveta mágica do navegador:
        localStorage.setItem('token', resposta.access);
        
        // E usamos o GPS para levar o usuário pra página principal
        console.log('Login feito com sucesso! Bem-vindo.');
        
        if (resposta.is_sindico) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/chamados']);
        }
      },
      error: (erro) => {
        // Caminho Triste! Senha errada ou Django desligado.
        this.erroLogin = 'CPF ou senha incorretos. Tente novamente.';
      }
    });
  }
}
