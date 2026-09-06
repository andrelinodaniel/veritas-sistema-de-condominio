import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_CONFIG } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Endereço onde o Django está rodando
  private apiUrlToken = `${API_CONFIG.baseUrl}token/`;

  // Injetamos o HttpClient (a ferramenta do Angular para fazer requisições na internet)
  constructor(private http: HttpClient) { }

  // Essa é a função que o botão Entrar vai chamar
  fazerLoginNoDjango(cpf: string, senha: string): Observable<any> {
    
    const pacote = {
      username: cpf, // O Django costuma chamar o campo principal de username, mesmo sendo um CPF
      password: senha
    };

    // Mandamos uma carta registrada (POST) com o pacote dentro
    return this.http.post(this.apiUrlToken, pacote);
  }

  // Descobre se o dono do crachá é síndico
  get isSindico(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // O token JWT tem 3 partes separadas por ponto. A segunda parte tem os dados.
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);
      return payloadJson.is_sindico === true;
    } catch (e) {
      return false;
    }
  }
}
