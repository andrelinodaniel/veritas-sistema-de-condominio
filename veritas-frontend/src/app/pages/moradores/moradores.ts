import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API_CONFIG } from '../../config';

export interface UsuarioBackend {
  id: number;
  first_name: string;
  last_name: string;
  cpf: string;
  telefone: string;
  is_sindico: boolean;
  endereco: {
    bloco: string;
    numero: string;
    codigo_registro: string;
  };
}

@Component({
  selector: 'app-moradores',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./moradores.css'],
  templateUrl: './moradores.html',
})
export class Moradores implements OnInit {
  moradores: UsuarioBackend[] = [];
  codigoGerado = '';
  erroCadastro = '';
  mensagemSucesso = '';
  mostrarModalExclusao = false;
  moradorParaExcluir: UsuarioBackend | null = null;

  private apiUrlUsuarios = `${API_CONFIG.baseUrl}usuarios/`;
  private apiUrlEnderecos = `${API_CONFIG.baseUrl}enderecos/`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarMoradores();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  carregarMoradores(): void {
    this.http.get<UsuarioBackend[]>(this.apiUrlUsuarios, { headers: this.getHeaders() }).subscribe({
      next: (dados) => {
        // Filtrar apenas quem não é síndico para mostrar na lista de moradores
        this.moradores = dados.filter(u => !u.is_sindico);
      },
      error: () => {
        this.erroCadastro = 'Erro ao carregar lista de moradores.';
      }
    });
  }

  cadastrarEndereco(bloco: string, apartamento: string): void {
    if (bloco.trim() === '' || apartamento.trim() === '') {
      this.erroCadastro = 'Preencha bloco e apartamento para gerar o código.';
      this.codigoGerado = '';
      return;
    }

    const body = {
      bloco: bloco.trim(),
      numero: apartamento.trim()
    };

    this.http.post<any>(this.apiUrlEnderecos, body, { headers: this.getHeaders() }).subscribe({
      next: (resposta) => {
        this.codigoGerado = resposta.codigo_registro;
        this.mensagemSucesso = '';
        this.erroCadastro = '';
      },
      error: () => {
        this.erroCadastro = 'Erro ao gerar o endereço. Verifique se ele já existe.';
        this.codigoGerado = '';
        this.mensagemSucesso = '';
      }
    });
  }

  pedirExclusao(morador: UsuarioBackend) {
    this.moradorParaExcluir = morador;
    this.mostrarModalExclusao = true;
  }

  cancelarExclusao() {
    this.mostrarModalExclusao = false;
    this.moradorParaExcluir = null;
  }

  confirmarExclusao() {
    if (this.moradorParaExcluir === null) return;

    this.http.delete(`${this.apiUrlUsuarios}${this.moradorParaExcluir.id}/`, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.mensagemSucesso = `${this.moradorParaExcluir?.first_name} foi excluído do sistema.`;
        this.codigoGerado = '';
        this.erroCadastro = '';
        this.carregarMoradores();
        this.cancelarExclusao();
      },
      error: () => {
        this.erroCadastro = 'Erro ao excluir o morador.';
        this.cancelarExclusao();
      }
    });
  }
}
