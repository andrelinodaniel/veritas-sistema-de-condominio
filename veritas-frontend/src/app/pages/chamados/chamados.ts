import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { API_CONFIG } from '../../config';

// Interface que espelha o que o Django retorna em GET /api/chamados/
export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: string;       
  categoria?: string;
  prioridade?: string;
  foto?: string;
  autor: any;
  created_at: string;
}

@Component({
  selector: 'app-chamados',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  styleUrls: ['./chamados.css'],
  templateUrl: './chamados.html',
})
export class Chamados implements OnInit {
  chamados: Chamado[] = [];
  mensagemSucesso = '';
  mensagemErro = '';
  telaChamados = 'lista'; // 'lista' | 'novo' | 'detalhe'
  chamadoSelecionado: Chamado | null = null;
  novoStatusSelecionado: string = '';
  novaPrioridadeSelecionada: string = '';
  filtroStatus = 'todos';
  // Variáveis do formulário de novo chamado
  categorias = ['Manutenção', 'Limpeza', 'Segurança', 'Reclamação', 'Sugestão', 'Outros'];
  categoriaSelecionada = '';
  fotoSelecionada = ''; // Apenas para mostrar o nome no HTML
  fotoArquivoSelecionado: File | null = null; // O arquivo real para enviar pro back

  get perfil(): string {
    return this.isSindico ? 'sindico' : 'morador';
  }

  isSindico = false;
  usuarioLogado = '';

  // --- Controle de Modais ---
  modalAberto = false;
  acaoPendente = '';
  chamadoParaConfirmar: Chamado | null = null;
  // --------------------------

  private apiUrl = `${API_CONFIG.baseUrl}chamados/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    // Verifica se o usuário logado é síndico a partir do token
    this.isSindico = this.authService.isSindico;
    this.usuarioLogado = localStorage.getItem('username') || '';
    this.carregarChamados();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  carregarChamados(): void {
    this.http.get<Chamado[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (dados) => {
        this.chamados = dados;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar chamados do servidor.';
      }
    });
  }

  // --- Contagens ---
  quantidadeAbertos(): number {
    return this.chamados.filter(c => c.status === 'aberto').length;
  }

  quantidadeAbertosDoMorador(): number {
    return this.chamadosDoMorador().filter(c => c.status === 'aberto').length;
  }

  chamadosDoMorador(): Chamado[] {
     return this.chamados;
  }

  chamadosFiltrados(): Chamado[] {
    let lista = this.perfil === 'morador' ? this.chamadosDoMorador() : this.chamados;
    if (this.filtroStatus !== 'todos') {
      lista = lista.filter(c => c.status === this.filtroStatus);
    }
    return this.ordenarPorUrgencia(lista);
  }

  // --- Criar chamado (POST para o Django) ---
  adicionarChamado(tituloInput: HTMLInputElement, descricaoInput: HTMLTextAreaElement): void {
    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (titulo === '' || titulo.length > 30 || descricao === '') {
      this.mensagemSucesso = '';
      this.mensagemErro = 'Informe um título de até 30 caracteres e descreva o problema.';
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('status', 'aberto');
    if (this.categoriaSelecionada) {
      formData.append('categoria', this.categoriaSelecionada);
    }
    if (this.fotoArquivoSelecionado) {
      formData.append('foto', this.fotoArquivoSelecionado);
    }

    this.http.post(this.apiUrl, formData, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Chamado criado com sucesso!';
        this.mensagemErro = '';
        tituloInput.value = '';
        descricaoInput.value = '';
        this.categoriaSelecionada = '';
        this.fotoSelecionada = '';
        this.fotoArquivoSelecionado = null;
        this.telaChamados = 'lista';
        this.carregarChamados(); // Recarrega a lista do Django
      },
      error: () => {
        this.mensagemErro = 'Erro ao criar chamado.';
      }
    });
  }

  abrirNovoChamado(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.telaChamados = 'novo';
  }

  cancelarNovoChamado(): void {
    this.mensagemErro = '';
    this.telaChamados = 'lista';
  }

  selecionarChamado(chamado: Chamado): void {
    this.chamadoSelecionado = chamado;
    this.novoStatusSelecionado = chamado.status;
    this.novaPrioridadeSelecionada = chamado.prioridade || '';
    this.telaChamados = 'detalhe';
  }

  fecharDetalhe(): void {
    this.chamadoSelecionado = null;
    this.telaChamados = 'lista';
  }

  selecionarNovoStatus(status: string): void {
    this.novoStatusSelecionado = status;
  }

  selecionarNovaPrioridade(prioridade: string): void {
    this.novaPrioridadeSelecionada = prioridade;
  }

  salvarAlteracaoStatus(): void {
    if (!this.isSindico || !this.chamadoSelecionado) return;

    const body = {
      status: this.novoStatusSelecionado,
      prioridade: this.novaPrioridadeSelecionada
    };

    this.http.patch(`${this.apiUrl}${this.chamadoSelecionado.id}/`, body, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Chamado atualizado com sucesso!';
        this.carregarChamados();
        this.fecharDetalhe();
      },
      error: () => {
        this.mensagemErro = 'Erro ao atualizar chamado.';
      }
    });
  }

  // --- Resolver chamado (PATCH no Django, muda status) ---
  resolver(chamado: Chamado): void {
    if (!this.isSindico || chamado.status !== 'aberto') return;

    this.http.patch(`${this.apiUrl}${chamado.id}/`, { status: 'concluido' }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Chamado marcado como concluído.';
        this.carregarChamados();
      },
      error: () => {
        this.mensagemErro = 'Erro ao resolver chamado.';
      }
    });
  }

  // --- Excluir chamado (DELETE no Django) ---
  removerChamado(chamado: Chamado): void {
    this.http.delete(`${this.apiUrl}${chamado.id}/`, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Chamado excluído.';
        if (this.chamadoSelecionado === chamado) {
          this.chamadoSelecionado = null;
        }
        this.carregarChamados();
      },
      error: () => {
        this.mensagemErro = 'Erro ao excluir chamado.';
      }
    });
  }

  podeAlterar(chamado: Chamado): boolean {
     return this.isSindico || (chamado.autor && chamado.autor.username === this.usuarioLogado);
  }

  // --- Modal Confirmacao ---
  pedirConfirmacao(acao: string, chamado: Chamado) {
    if (!this.podeAlterar(chamado) || (acao === 'resolver' && !this.isSindico)) return;
    this.acaoPendente = acao;
    this.chamadoParaConfirmar = chamado;
    this.modalAberto = true;
  }

  cancelarConfirmacao() {
    this.modalAberto = false;
    this.acaoPendente = '';
    this.chamadoParaConfirmar = null;
  }

  confirmarAcao() {
    if (this.chamadoParaConfirmar === null) return;
    if (this.acaoPendente === 'resolver') {
      this.resolver(this.chamadoParaConfirmar);
    }
    if (this.acaoPendente === 'excluir') {
      this.removerChamado(this.chamadoParaConfirmar);
    }
    this.cancelarConfirmacao();
  }

  // --- Métodos de UI Formulário ---
  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
  }

  selecionarPrioridade(p: string | number) {
    this.novaPrioridadeSelecionada = p.toString();
  }

  selecionarFoto(input: HTMLInputElement) {
    if (input.files && input.files[0]) {
      this.fotoArquivoSelecionado = input.files[0];
      this.fotoSelecionada = input.files[0].name;
    } else {
      this.fotoArquivoSelecionado = null;
      this.fotoSelecionada = '';
    }
  }

  ajustarAlturaDescricao(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  ordenarPorUrgencia(lista: Chamado[]): Chamado[] {
    // Por enquanto, backend não tem campo de urgencia, vamos só retornar a lista revertida (mais novos primeiro)
    return [...lista].reverse();
  }

  voltarParaChamados(): void {
    this.telaChamados = 'lista';
  }
}
