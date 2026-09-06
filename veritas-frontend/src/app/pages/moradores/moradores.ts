import { Component, inject } from '@angular/core';
import { CondominioStore, Morador } from '../../condominio.store';

@Component({
  selector: 'app-moradores',
  standalone: true,
  imports: [],
  styleUrls: ['./moradores.css'],
  templateUrl: './moradores.html',
})
export class Moradores {
  private readonly store = inject(CondominioStore);
  moradores: Morador[] = this.store.moradores;
  codigoGerado = '';
  erroCadastro = '';
  mensagemSucesso = '';
  mostrarModalConfirmacao = false;
  mostrarModalExclusao = false;
  moradorParaExcluir: Morador | null = null;
  nomePendente = '';
  blocoPendente = '';
  apartamentoPendente = '';

  confirmarCadastro(nome: string, bloco: string, apartamento: string) {
    if (nome.trim() === '' || bloco.trim() === '' || apartamento.trim() === '') {
      this.erroCadastro = 'Preencha nome, bloco e apartamento.';
      this.codigoGerado = '';
      return;
    }
    const apartamentoJaCadastrado = this.moradores.some(
      (morador) =>
        morador.bloco.trim().toLowerCase() === bloco.trim().toLowerCase() &&
        morador.apartamento.trim() === apartamento.trim(),
    );

    if (apartamentoJaCadastrado) {
      this.erroCadastro = 'Já existe um morador cadastrado neste bloco e apartamento.';
      this.codigoGerado = '';
      return;
    }

    this.erroCadastro = '';
    this.mensagemSucesso = '';
    this.nomePendente = nome.trim();
    this.blocoPendente = bloco.trim();
    this.apartamentoPendente = apartamento.trim();
    this.mostrarModalConfirmacao = true;
  }

  cadastrarMorador(nome: string, bloco: string, apartamento: string) {
    if (nome.trim() === '' || bloco.trim() === '' || apartamento.trim() === '') {
      this.erroCadastro = 'Preencha nome, bloco e apartamento.';
      return;
    }

    this.erroCadastro = '';
    const morador = this.store.cadastrarMorador(nome.trim(), bloco.trim(), apartamento.trim());
    this.codigoGerado = morador.codigo;
  }
  cancelarConfirmacao() {
    this.mostrarModalConfirmacao = false;
    this.nomePendente = '';
    this.blocoPendente = '';
    this.apartamentoPendente = '';
  }

  confirmarCadastroFinal(
    nomeInput: HTMLInputElement,
    blocoInput: HTMLInputElement,
    apartamentoInput: HTMLInputElement,
  ) {
    this.cadastrarMorador(this.nomePendente, this.blocoPendente, this.apartamentoPendente);

    this.mostrarModalConfirmacao = false;
    this.nomePendente = '';
    this.blocoPendente = '';
    this.apartamentoPendente = '';

    nomeInput.value = '';
    blocoInput.value = '';
    apartamentoInput.value = '';
  }

  pedirExclusao(morador: Morador) {
    this.moradorParaExcluir = morador;
    this.mostrarModalExclusao = true;
  }

  cancelarExclusao() {
    this.mostrarModalExclusao = false;
    this.moradorParaExcluir = null;
  }

  confirmarExclusao() {
    if (this.moradorParaExcluir === null) return;

    const nome = this.moradorParaExcluir.nome;
    if (this.store.removerMorador(this.moradorParaExcluir)) {
      this.codigoGerado = '';
      this.erroCadastro = '';
      this.mensagemSucesso = `${nome} foi excluído do cadastro.`;
    }

    this.cancelarExclusao();
  }
}
