import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Variáveis para controlar o que aparece na tela
  telaAtual = 'perfil'; // Pode ser 'perfil' ou 'login'
  perfil_selecionado = ''; // Guarda se clicou em 'morador' ou 'sindico'
  erroLogin = ''; // Mensagem vermelha de erro se a senha estiver errada

  // Função chamada quando clica no botão do perfil (Morador ou Síndico)
  escolherPerfil(perfil: string) {
    this.perfil_selecionado = perfil;
  }

  // Função chamada quando clica em "Continuar para login"
  ir_paralogin() {
    this.telaAtual = 'login';
  }

  // Função para voltar caso desista do login
  voltarParaPerfil() {
    this.telaAtual = 'perfil';
    this.perfil_selecionado = '';
    this.erroLogin = '';
  }

  // Função que será chamada quando clicar em Entrar
  fazerLogin(cpf: string, senha: string) {
    if (cpf.trim() === '' || senha.trim() === '') {
      this.erroLogin = 'Preencha os campos para realizar o login.';
      return; // Para a execução da função aqui
    } 

    this.erroLogin = '';
    
    // TODO: Aqui chamaremos o Motoboy (AuthService) para ir no Django!
    console.log(`Tentando logar como ${this.perfil_selecionado} com CPF: ${cpf}`);
  }
}
