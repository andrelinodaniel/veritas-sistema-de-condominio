import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
  mostrarModalConfirmacao = false;
  mostrarModalExclusao = false;
  moradorParaExcluir: UsuarioBackend | null = null;
  
  // Como o cadastro do morador é feito pela própria página de login,
  // essa tela de Moradores (vista pelo síndico) servirá principalmente 
  // para listar os moradores e excluir.
  // O síndico não cria o morador, ele só cria o endereço/código de acesso.
  // Mas se quiseremos manter a tela, focamos na listagem e exclusão.

  private apiUrl = 'http://localhost:8000/api/usuarios/';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarMoradores();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  carregarMoradores(): void {
    this.http.get<UsuarioBackend[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (dados) => {
        // Filtrar apenas quem não é síndico para mostrar na lista de moradores
        this.moradores = dados.filter(u => !u.is_sindico);
      },
      error: () => {
        this.erroCadastro = 'Erro ao carregar lista de moradores.';
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

    this.http.delete(`${this.apiUrl}${this.moradorParaExcluir.id}/`, { headers: this.getHeaders() }).subscribe({
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
