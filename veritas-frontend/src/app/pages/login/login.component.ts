import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // O Router é o "GPS" que muda a página da URL

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  telaAtual = 'perfil'; 
  perfil_selecionado = ''; 
  erroLogin = ''; 

  // 1. Injetamos o Motoboy na portaria e também o GPS (Router)
  constructor(private authService: AuthService, private router: Router) {}

  escolherPerfil(perfil: string) {
    this.perfil_selecionado = perfil;
  }

  ir_paralogin() {
    this.telaAtual = 'login';
  }

  voltarParaPerfil() {
    this.telaAtual = 'perfil';
    this.perfil_selecionado = '';
    this.erroLogin = '';
  }

  fazerLogin(cpf: string, senha: string) {
    if (cpf.trim() === '' || senha.trim() === '') {
      this.erroLogin = 'Preencha os campos para realizar o login.';
      return; 
    } 

    this.erroLogin = '';
    
    // 2. Chamando o Motoboy para ir no Django
    this.authService.fazerLoginNoDjango(cpf, senha).subscribe({
      next: (resposta) => {
        // Caminho Feliz! O Django gostou da senha e devolveu o Crachá (Token).
        // Guardamos o crachá na gaveta mágica do navegador:
        localStorage.setItem('token', resposta.access);
        
        // E usamos o GPS para levar o usuário pra página principal (Dashboard)
        console.log('Login feito com sucesso! Bem-vindo.');
        // this.router.navigate(['/dashboard']); <-- Ativaremos isso depois que criarmos a Rota!
      },
      error: (erro) => {
        // Caminho Triste! Senha errada ou Django desligado.
        this.erroLogin = 'CPF ou senha incorretos. Tente novamente.';
      }
    });
  }
}
