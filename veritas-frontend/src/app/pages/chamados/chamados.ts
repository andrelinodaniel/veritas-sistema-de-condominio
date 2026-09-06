import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chamado, CondominioStore } from '../../condominio.store';

@Component({
  selector: 'app-chamados',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  styleUrls: ['./chamados.css'],
  templateUrl: './chamados.html',
})
export class Chamados {
  private readonly store = inject(CondominioStore);
  mensagemSucesso = '';
  mensagemErro = '';
  @Input() perfil = '';
  @Input() usuarioLogado = '';
  @Output() telaMudou = new EventEmitter<string>();
  modalAberto = false;
  acaoPendente = '';
  chamadoParaConfirmar: Chamado | null = null;
  chamadoSelecionado: Chamado | null = null;
  telaChamados = 'lista';
  categoriaSelecionada = 'Manutenção';
  prioridadeSelecionada = 5;
  fotoSelecionada = '';
  readonly categorias = ['Manutenção', 'Barulho', 'Segurança', 'Limpeza', 'Portaria', 'Outro'];
  chamados = this.store.chamados;
  chamadosExcluidos = this.store.chamadosExcluidos;

  resolver(chamado: Chamado) {
    if (this.perfil !== 'sindico' || chamado.status !== 'aberto') return;
    chamado.status = 'resolvido';
    this.mensagemSucesso = 'Chamado marcado como resolvido.';
  }

  quantidadeAbertos() {
    return this.chamados.filter((chamado) => chamado.status === 'aberto').length;
  }
  adicionarChamado(
  tituloInput: HTMLInputElement,
  descricaoInput: HTMLTextAreaElement,
  ) {
  const titulo = tituloInput.value;
  const descricao = descricaoInput.value;
  const gravidade = this.prioridadeSelecionada;

  if (
    titulo.trim() === '' ||
    titulo.trim().length > 30 ||
    descricao.trim() === '' ||
    gravidade < 1 ||
    gravidade > 10
  ) {
    this.mensagemSucesso = '';
    this.mensagemErro =
      'Informe um título de até 30 caracteres e descreva o problema.';
    return;
  }

  this.mensagemSucesso = 'Chamado criado com sucesso.';
  this.mensagemErro = '';

  this.store.criarChamado(
    titulo.trim(),
    descricao.trim(),
    this.categoriaSelecionada,
    gravidade,
    this.usuarioLogado,
    this.perfil
  );

  tituloInput.value = '';
  descricaoInput.value = '';
  this.fotoSelecionada = '';
  this.ajustarAlturaDescricao(descricaoInput);
  this.telaChamados = 'lista';
  this.telaMudou.emit('lista');
  }

  abrirNovoChamado() {
    if (this.perfil !== 'morador') return;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.telaChamados = 'novo';
    this.telaMudou.emit('novo');
  }

  cancelarNovoChamado() {
    this.mensagemErro = '';
    this.fotoSelecionada = '';
    this.telaChamados = 'lista';
    this.telaMudou.emit('lista');
  }

  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
  }

  selecionarPrioridade(prioridade: number) {
    this.prioridadeSelecionada = prioridade;
  }

  selecionarFoto(input: HTMLInputElement) {
    const arquivo = input.files?.[0];
    this.fotoSelecionada = arquivo?.name ?? '';
  }
  ordenarPorUrgencia(chamados: Chamado[]): Chamado[] {
  return [...chamados].sort((a, b) => b.gravidade - a.gravidade);
  }

  ajustarAlturaDescricao(descricaoInput: HTMLTextAreaElement) {
    descricaoInput.style.height = 'auto';
    descricaoInput.style.height = `${descricaoInput.scrollHeight}px`;
  }

  selecionarChamado(chamado: Chamado) {
    this.chamadoSelecionado = chamado;
  }

  removerChamado(chamado: Chamado) {
    if (!this.podeAlterar(chamado)) return;
    const indice = this.chamados.indexOf(chamado);

    if (indice === -1) {
      return;
    }

    const chamadoRemovido = this.chamados.splice(indice, 1)[0];

    if (chamadoRemovido) {
      chamadoRemovido.excluidoPor = this.perfil;
      this.chamadosExcluidos.push(chamadoRemovido);

      if (this.chamadoSelecionado === chamadoRemovido) {
        this.chamadoSelecionado = null;
      }
    }
  }

  confirmarAcao() {
    if (this.chamadoParaConfirmar === null) {
      return;
    }

    if (this.acaoPendente === 'resolver') {
      this.resolver(this.chamadoParaConfirmar);
    }

    if (this.acaoPendente === 'excluir') {
      this.removerChamado(this.chamadoParaConfirmar);
    }

    this.cancelarConfirmacao();
  }
  abrirHistorico() {
    this.telaChamados = 'historico';
  }

  voltarParaChamados() {
    this.telaChamados = 'lista';
  }
  recuperarChamado(chamado: Chamado) {
    const indice = this.chamadosExcluidos.indexOf(chamado);
    if (indice === -1 || this.perfil !== 'sindico') return;
    const chamadoRecuperado = this.chamadosExcluidos.splice(indice, 1)[0];

    if (chamadoRecuperado) {
      delete chamadoRecuperado.excluidoPor;
      this.chamados.push(chamadoRecuperado);
    }
  }

  chamadosDoMorador() {
    return this.chamados.filter((chamado) => chamado.criadoPor === this.usuarioLogado);
  }
  quantidadeAbertosDoMorador() {
    return this.chamadosDoMorador().filter((chamado) => chamado.status === 'aberto').length;
  }
  historicoDoSindico() {
    return this.chamadosExcluidos.filter((chamado) => chamado.excluidoPor === 'sindico');
  }
  pedirConfirmacao(acao: string, chamado: Chamado) {
    if (!this.podeAlterar(chamado) || (acao === 'resolver' && this.perfil !== 'sindico')) return;
    this.acaoPendente = acao;
    this.chamadoParaConfirmar = chamado;
    this.modalAberto = true;
  }

  cancelarConfirmacao() {
    this.modalAberto = false;
    this.acaoPendente = '';
    this.chamadoParaConfirmar = null;
  }

  podeAlterar(chamado: Chamado): boolean {
    return this.perfil === 'sindico' || chamado.criadoPor === this.usuarioLogado;
  }
}
