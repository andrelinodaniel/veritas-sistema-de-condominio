import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface DashboardData {
  total_moradores: number;
  chamados_abertos: number;
  chamados_andamento: number;
  chamados_concluidos: number;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getEstatisticas(): Observable<DashboardData> {
    // MOCK: Simulação temporária dos dados do Django
    // Quando o Login estiver pronto, trocamos por: 
    // return this.http.get<DashboardData>('http://localhost:8000/api/dashboard/');
    const dadosFalsos: DashboardData = {
      total_moradores: 48,
      chamados_abertos: 5,
      chamados_andamento: 3,
      chamados_concluidos: 27
    };
    return of(dadosFalsos);
  }
}


