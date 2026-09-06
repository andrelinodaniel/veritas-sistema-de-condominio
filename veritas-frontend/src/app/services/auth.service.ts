import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Endereço onde o Django está rodando
  private url_django = 'http://127.0.0.1:8000/api/token/';

  // Injetamos o HttpClient (a ferramenta do Angular para fazer requisições na internet)
  constructor(private http: HttpClient) { }

  // Essa é a função que o botão Entrar vai chamar
  fazerLoginNoDjango(cpf: string, senha: string): Observable<any> {
    
    const pacote = {
      username: cpf, // O Django costuma chamar o campo principal de username, mesmo sendo um CPF
      password: senha
    };

    // Mandamos uma carta registrada (POST) com o pacote dentro
    return this.http.post(this.url_django, pacote);
  }
}
