import { Injectable } from '@angular/core';

export type Morador = {
  nome: string;
  bloco: string;
  apartamento: string;
  codigo: string;
};

export type Chamado = {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  gravidade: number;
  status: 'aberto' | 'resolvido';
  criadoPor: string;
  excluidoPor?: string;
  perfilCriador: string;
};

@Injectable({ providedIn: 'root' })
export class CondominioStore {
  readonly moradores: Morador[] = [];
  readonly chamados: Chamado[] = [
    { id: 1, titulo: 'Lâmpada quebrada no corredor', descricao: 'A lâmpada do corredor está queimada.', categoria: 'Manutenção', gravidade: 4, status: 'aberto', criadoPor: 'sindico@veritas.com', perfilCriador: 'sindico' },
    { id: 2, titulo: 'Vazamento de água', descricao: 'Há um vazamento de água próximo à garagem.', categoria: 'Manutenção', gravidade: 9, status: 'aberto', criadoPor: 'sindico@veritas.com', perfilCriador: 'sindico' },
    { id: 3, titulo: 'Portão da garagem', descricao: 'O portão precisou de manutenção.', categoria: 'Segurança', gravidade: 8, status: 'resolvido', criadoPor: 'sindico@veritas.com', perfilCriador: 'sindico' },
  ];
  readonly chamadosExcluidos: Chamado[] = [];
  private proximoCodigo = 1;
  private proximoChamadoId = 4;

  cadastrarMorador(nome: string, bloco: string, apartamento: string): Morador {
    const apartamentoJaCadastrado = this.moradores.some(
      (morador) =>
        morador.bloco.toLocaleLowerCase() === bloco.toLocaleLowerCase() &&
        morador.apartamento.toLocaleLowerCase() === apartamento.toLocaleLowerCase(),
    );

    if (apartamentoJaCadastrado) {
      throw new Error('Já existe um morador cadastrado neste bloco e apartamento.');
    }

    const codigo = `MOR-${String(this.proximoCodigo++).padStart(3, '0')}`;
    const morador = { nome, bloco, apartamento, codigo };
    this.moradores.push(morador);
    return morador;
  }

  codigoExiste(codigo: string): boolean {
    return this.moradores.some((morador) => morador.codigo === codigo.trim().toUpperCase());
  }

  removerMorador(morador: Morador): boolean {
    const indice = this.moradores.indexOf(morador);
    if (indice === -1) return false;

    this.moradores.splice(indice, 1);
    return true;
  }

  criarChamado(titulo: string, descricao: string, categoria: string, gravidade: number, criadoPor: string, perfilCriador: string): void {
    this.chamados.push({ id: this.proximoChamadoId++, titulo, descricao, categoria, gravidade, status: 'aberto', criadoPor, perfilCriador });
  }
}
