import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Interface que espelha o que o Django retorna em GET /api/chamados/
export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: string;       // 'aberto' | 'em_andamento' | 'concluido'
  autor: any;
  created_at: string;
}

@Component({
  selector: 'app-chamados',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./chamados.css'],
  templateUrl: './chamados.html',
})
export class Chamados implements OnInit {
  chamados: Chamado[] = [];
  mensagemSucesso = '';
  mensagemErro = '';
  telaChamados = 'lista';
  chamadoSelecionado: Chamado | null = null;

  // Saber se ├® s├¡ndico para mostrar/esconder bot├Áes
  isSindico = false;
  usuarioLogado = '';

  private apiUrl = 'http://localhost:8000/api/chamados/';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Verifica se o usu├írio logado ├® s├¡ndico (guardado no login)
    this.isSindico = localStorage.getItem('is_sindico') === 'true';
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
     // O backend j├í filtra para o morador, mas por seguran├ºa
     return this.chamados;
  }

  // --- Criar chamado (POST para o Django) ---
  adicionarChamado(tituloInput: HTMLInputElement, descricaoInput: HTMLTextAreaElement): void {
    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (titulo === '' || titulo.length > 30 || descricao === '') {
      this.mensagemSucesso = '';
      this.mensagemErro = 'Informe um t├¡tulo de at├® 30 caracteres e descreva o problema.';
      return;
    }

    const body = { titulo, descricao, status: 'aberto' };

    this.http.post(this.apiUrl, body, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Chamado criado com sucesso!';
        this.mensagemErro = '';
        tituloInput.value = '';
        descricaoInput.value = '';
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
  }

  // --- Resolver chamado (PATCH no Django, muda status) ---
  resolver(chamado: Chamado): void {
    if (!this.isSindico || chamado.status !== 'aberto') return;

    this.http.patch(`${this.apiUrl}${chamado.id}/`, { status: 'concluido' }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Chamado marcado como conclu├¡do.';
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
        this.mensagemSucesso = 'Chamado exclu├¡do.';
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

  voltarParaChamados(): void {
    this.telaChamados = 'lista';
  }
}
