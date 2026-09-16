# HabitFlow - Rastreador de Hábitos Pessoais

Aplicativo pessoal desenvolvido com **React**, **Tailwind CSS** e **Firebase** (Authentication e Cloud Firestore), projetado para atender aos requisitos da disciplina de Desenvolvimento Híbrido.

---

## 🎯 Requisitos Atendidos

| Requisito | Como foi implementado |
| :--- | :--- |
| **Autenticação** | Cadastro, login e logout com **Firebase Authentication** (Email/Senha), com persistência de sessão e tratamento de erros amigável. |
| **Persistência** | Dados salvos no **Cloud Firestore** com sincronização em tempo real (`onSnapshot`). |
| **Dados Privados** | Cada hábito gravado recebe o `userId` do usuário autenticado. Consultas e regras de segurança (`firestore.rules`) garantem isolamento total de dados entre usuários. |
| **CRUD Mínimo** | **CRUD Completo**: Criar hábitos, Listar com filtros e busca, Atualizar/Concluir e Excluir. |
| **Interface Funcional** | Telas de Login, Cadastro e Dashboard moderno, responsivo (mobile-first) com métricas de progresso. |

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior instalada).

### 2. Clonar / Acessar a pasta do projeto
No terminal, entre na pasta do projeto:
```bash
cd trabalho01
```

### 3. Instalar dependências
```bash
npm install
```

---

## 🔥 Configuração do Firebase Console (Passo a Passo)

Para que a autenticação e o banco de dados funcionem, configure um projeto gratuito no Firebase:

### Passo 1: Criar o Projeto
1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Clique em **"Adicionar projeto"** (ou "Criar projeto").
3. Digite o nome do projeto (ex: `habitflow-app`) e clique em **Continuar**.
4. Desative o Google Analytics (opcional) e clique em **Criar projeto**.

### Passo 2: Ativar o Firebase Authentication
1. No menu lateral esquerdo, clique em **Criação** > **Authentication**.
2. Clique em **Começar**.
3. Na aba **Método de login**, selecione **E-mail/senha**.
4. Ative a primeira opção (**E-mail/senha**) e clique em **Salvar**.

### Passo 3: Ativar o Cloud Firestore
1. No menu lateral esquerdo, clique em **Criação** > **Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Escolha o local do servidor (ex: `southamerica-east1` em São Paulo ou `us-central1`) e clique em **Avançar**.
4. Selecione **Iniciar no modo de teste** (ou modo de produção) e clique em **Criar**.
5. Vá na aba **Regras** do Firestore no console e cole o conteúdo do arquivo `firestore.rules` deste repositório:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /habits/{habitId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
6. Clique em **Publicar**.

### Passo 4: Obter as credenciais da Web App
1. No menu lateral, clique na **engrenagem** ⚙️ ao lado de "Visão geral do projeto" > **Configurações do projeto**.
2. Na aba **Geral**, desça até a seção "Seus aplicativos" e clique no ícone da Web (**`</>`**).
3. Insira o apelido do app (ex: `HabitFlow Web`) e clique em **Registrar app**.
4. Você verá o bloco `firebaseConfig` com as chaves:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seu-app.firebaseapp.com",
  projectId: "seu-app",
  storageBucket: "seu-app.firebasestorage.app",
  messagingSenderId: "123456789...",
  appId: "1:123456789:web:..."
};
```

---

## 🔐 Configurando as Variáveis de Ambiente (`.env`)

Crie ou edite o arquivo `.env` na raiz do projeto preenchendo as chaves obtidas no Firebase Console:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-app
VITE_FIREBASE_STORAGE_BUCKET=seu-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:...
```

---

## ▶️ Iniciando o Servidor de Desenvolvimento

Execute no terminal:
```bash
npm run dev
```

Abra o navegador no endereço exibido no terminal (geralmente `http://localhost:5173`).

---

## 📁 Estrutura de Arquivos

```
trabalho01/
├── src/
│   ├── components/
│   │   ├── FirebaseBanner.jsx    # Alerta visual caso o .env não esteja configurado
│   │   ├── HabitCard.jsx         # Card de hábito (toggle, edição, exclusão)
│   │   ├── HabitModal.jsx        # Modal para criar e editar hábitos
│   │   ├── Navbar.jsx            # Cabeçalho com dados da sessão e logout
│   │   └── StatsOverview.jsx     # Resumo e barra de progresso dos hábitos
│   ├── contexts/
│   │   └── AuthContext.jsx       # Provedor global de estado de autenticação
│   ├── pages/
│   │   ├── Dashboard.jsx         # Tela principal com hábitos em tempo real
│   │   ├── Login.jsx             # Tela de login com validação
│   │   └── Register.jsx          # Tela de cadastro com validação
│   ├── services/
│   │   ├── firebase.js           # Inicialização segura do SDK Firebase v11
│   │   └── habitsService.js      # Funções de CRUD no Firestore vinculadas ao UID
│   ├── App.jsx                   # Roteamento condicional (Auth vs Dashboard)
│   ├── index.css                 # Importação do Tailwind CSS v4
│   └── main.jsx                  # Ponto de entrada React
├── firestore.rules               # Regras de segurança de isolamento por usuário
├── .env.example                  # Modelo de variáveis de ambiente
├── package.json
└── README.md
```

---

## 🧪 Como Testar o Isolamento de Dados (Para Avaliação)

1. **Cadastrar Usuário A**:
   - Abra a aplicação e cadastre uma conta (ex: `usuarioA@teste.com`).
   - Crie 2 hábitos (ex: *"Ler 15 minutos"* e *"Tomar 2L de água"*).
2. **Realizar Logout**:
   - Clique no botão **"Sair"** no topo da página.
3. **Cadastrar Usuário B**:
   - Cadastre uma nova conta (ex: `usuarioB@teste.com`).
   - Observe que a lista está vazia: nenhum dado do Usuário A é visível para o Usuário B.
   - Cadastre um hábito exclusivo (ex: *"Treino de pernas"*).
4. **Voltar ao Usuário A**:
   - Faça logout e entre novamente com `usuarioA@teste.com`.
   - Confirme que apenas os hábitos do Usuário A aparecem.
