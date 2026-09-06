import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config';

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
  
  // URL do Django (agora é a rota real!)
  private apiUrl = `${API_CONFIG.baseUrl}dashboard/`;

  constructor(private http: HttpClient) { }

  getEstatisticas(): Observable<DashboardData> {
    // Agora fazemos uma requisição GET real pro seu backend!
    // Como o Interceptor está configurado, o Crachá (Token) vai junto automaticamente.
    return this.http.get<DashboardData>(this.apiUrl);
  }
}


