import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CondominioStore } from '../../condominio.store';

@Component({
  selector: 'app-cadastro-morador',
  standalone: true,
  imports: [],
  styleUrls: ['./cadastro-morador.css'],
  templateUrl: './cadastro-morador.html',
})
export class CadastroMorador {
  private readonly store = inject(CondominioStore);
  @Output() voltarLogin = new EventEmitter<void>();
  erroCadastro = '';
  cadastroConcluido = '';
  telaAtual = 'perfil';

  finalizarCadastro(
    nome: string,
    sobrenome: string,
    telefone: string,
    cpf: string,
    codigo: string,
    senha: string,
    confirmarSenha: string,
  ) {
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

    if (!/^[A-Z0-9]+-[A-Z0-9]{4}$/i.test(codigo.trim())) {
      this.erroCadastro = 'Use o código no formato A42-WJHS (fornecido pelo síndico).';
      this.cadastroConcluido = '';
      return;
    }

    if (!this.store.codigoExiste(codigo)) {
      this.erroCadastro = 'Código de acesso inválido ou ainda não liberado pelo síndico.';
      this.cadastroConcluido = '';
      return;
    }

    if (senha.length < 6 || senha.length > 8) {
      this.erroCadastro = 'A senha deve ter entre 6 e 8 caracteres.';
      this.cadastroConcluido = '';
      return;
    }

    if (senha !== confirmarSenha) {
      this.erroCadastro = 'As senhas não são iguais.';
      this.cadastroConcluido = '';
      return;
    }

    this.erroCadastro = '';
    this.cadastroConcluido = 'Cadastro concluído com sucesso. Você já pode entrar no sistema.';
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
  this.voltarLogin.emit();
}
}
