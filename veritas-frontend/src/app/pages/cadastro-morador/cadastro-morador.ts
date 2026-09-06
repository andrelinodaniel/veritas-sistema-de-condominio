import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-morador',
  standalone: true,
  imports: [],
  styleUrls: ['./cadastro-morador.css'],
  templateUrl: './cadastro-morador.html',
})
export class CadastroMorador {
  erroCadastro = '';
  cadastroConcluido = '';

  constructor(private http: HttpClient, private router: Router) {}

  finalizarCadastro(
    nome: string,
    sobrenome: string,
    telefone: string,
    cpf: string,
    codigo: string,
    senha: string,
    confirmarSenha: string,
  ) {
    // --- Validações básicas no front (antes de incomodar o Django) ---
    if (
      nome.trim() === '' ||
      sobrenome.trim() === '' ||
      telefone.trim() === '' ||
      cpf.trim() === '' ||
      codigo.trim() === '' ||
      senha === '' ||
      confirmarSenha === ''
    ) {
      this.erroCadastro = 'Preencha todos os campos.';
      this.cadastroConcluido = '';
      return;
    }

    const cpfNumeros = cpf.replace(/\D/g, '');
    const telefoneNumeros = telefone.replace(/\D/g, '');

    if (!this.cpfValido(cpfNumeros)) {
      this.erroCadastro = 'Informe um CPF válido.';
      this.cadastroConcluido = '';
      return;
    }

    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      this.erroCadastro = 'Informe um telefone com DDD.';
      this.cadastroConcluido = '';
      return;
    }

    if (senha.length < 8) {
      this.erroCadastro = 'A senha deve ter no mínimo 8 caracteres.';
      this.cadastroConcluido = '';
      return;
    }

    if (/^\d+$/.test(senha)) {
      this.erroCadastro = 'A senha não pode conter apenas números.';
      this.cadastroConcluido = '';
      return;
    }

    if (senha !== confirmarSenha) {
      this.erroCadastro = 'As senhas não são iguais.';
      this.cadastroConcluido = '';
      return;
    }

    // --- Monta o objeto para enviar pro Django (POST /api/usuarios/) ---
    const dadosCadastro = {
      first_name: nome.trim(),
      last_name: sobrenome.trim(),
      cpf: cpfNumeros,
      telefone: telefoneNumeros,
      codigo_registro: codigo.trim(),   // O Django valida se esse código existe no banco!
      password: senha,
    };

    this.erroCadastro = '';

    // --- Envia para a API do Django ---
    this.http.post('http://localhost:8000/api/usuarios/', dadosCadastro).subscribe({
      next: () => {
        this.cadastroConcluido = 'Cadastro concluído com sucesso! Você já pode entrar no sistema.';
        this.erroCadastro = '';
      },
      error: (erro) => {
        this.cadastroConcluido = '';
        // O Django retorna os erros dentro do corpo da resposta
        console.error('Erro detalhado do Django:', erro.error);
        if (erro.error?.codigo_registro) {
          this.erroCadastro = 'Código de acesso inválido ou não cadastrado pelo síndico.';
        } else if (erro.error?.cpf || erro.error?.username) {
          this.erroCadastro = 'Já existe um usuário com esse CPF.';
        } else if (typeof erro.error === 'object') {
          // Pega a primeira mensagem de erro que o Django enviou
          const primeiroErro = Object.values(erro.error)[0];
          if (Array.isArray(primeiroErro)) {
            this.erroCadastro = primeiroErro[0];
          } else {
            this.erroCadastro = 'Erro ao cadastrar. Verifique os dados.';
          }
        } else {
          this.erroCadastro = 'Erro ao se comunicar com o servidor.';
        }
      }
    });
  }

  private cpfValido(cpf: string): boolean {
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcularDigito = (tamanho: number): number => {
      const soma = cpf
        .slice(0, tamanho)
        .split('')
        .reduce((total, digito, indice) => total + Number(digito) * (tamanho + 1 - indice), 0);
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    return calcularDigito(9) === Number(cpf[9]) && calcularDigito(10) === Number(cpf[10]);
  }

  voltarParaLogin() {
    this.router.navigate(['/login']);
  }
}

