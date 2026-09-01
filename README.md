# Veritas - Sistema de Gestão de Condomínios

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django&logoColor=white)
![Django REST](https://img.shields.io/badge/Django_REST_Framework-red?logo=django&logoColor=white)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)

## Sobre o Projeto
O **Veritas** é uma plataforma moderna e segura de gestão condominial desenvolvida para a feira MostraTech. O objetivo do sistema é modernizar a comunicação entre síndicos e moradores, digitalizando a abertura de chamados de manutenção e garantindo segurança no registro de residentes através de um sistema de convites automatizados.

## Funcionalidades Principais
- **Segurança Reforçada:** Autenticação via tokens JWT (JSON Web Tokens).
- **Cadastro por Convite:** Moradores só podem se cadastrar se possuírem o `codigo_registro` único e aleatório gerado pelo Síndico para o seu respectivo apartamento.
- **Login Facilitado:** O sistema utiliza o CPF do morador como identificador único (Username), facilitando o acesso para idosos e pessoas com pouca familiaridade tecnológica.
- **Controle de Acesso (RBAC):** Sistema de permissões customizadas onde rotas sensíveis são protegidas pela permissão `IsSindico`. Moradores comuns só visualizam seus próprios chamados.
- **Tradução Nativa:** Mensagens de validação e erros totalmente traduzidas para PT-BR.

## Tecnologias Utilizadas
- **Backend:** Python, Django, Django REST Framework
- **Banco de Dados:** SQLite (Desenvolvimento)
- **Frontend (Em breve):** Angular, TypeScript

## Como Rodar o Projeto Localmente

Siga os passos abaixo para testar o backend do projeto na sua máquina:

1. **Clone o repositório:**
```bash
git clone https://github.com/[SEU_USUARIO]/veritas.git
cd veritas
```

2. **Crie e ative o Ambiente Virtual:**
```bash
python -m venv venv
# No Windows:
venv\Scripts\activate
```

3. **Instale as dependências:**
```bash
pip install django djangorestframework djangorestframework-simplejwt
```

4. **Aplique as Migrações do Banco de Dados:**
```bash
python manage.py migrate
```

5. **Crie um Superusuário (Síndico):**
```bash
python manage.py createsuperuser
```

6. **Rode o Servidor:**
```bash
python manage.py runserver
```

Acesse a API em `http://127.0.0.1:8000/api/` e o Painel de Controle em `http://127.0.0.1:8000/admin/`.

## Autor
Desenvolvido por **André (Equipe Veritas)** para a MostraTech.
Entre em contato: [Seu LinkedIn ou Email]
