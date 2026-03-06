# Movie Glass

Movie Glass é um recomendador de filmes e séries baseado nas preferências do usuário, com foco em experiência visual premium, interface inspirada em Liquid Glass e duas formas de descoberta: modo guiado e modo por texto livre com IA.

O projeto foi construído com Next.js e integra três serviços principais:

- **Ollama** para interpretar o texto do usuário em filtros estruturados
- **TMDB** para buscar filmes, séries e detalhes das obras
- **Resend** para envio de feedbacks por e-mail

## Demo do conceito

O usuário pode:

- Escolher preferências manualmente em uma interface guiada
- Descrever em linguagem natural o que quer assistir
- Receber recomendações visualmente organizadas
- Abrir um modal com detalhes da mídia
- Enviar sugestões, bugs ou feedbacks pelo formulário

---

## Funcionalidades

### Descoberta em modo guiado

Permite selecionar:

- tipo de mídia: filme, série ou ambos
- até 3 gêneros desejados
- clima da obra
- ritmo narrativo
- período de lançamento
- até 2 gêneros a evitar

### Descoberta por texto livre com IA

O usuário escreve algo como:

> “Quero uma série de suspense, inteligente, com clima sombrio e que não seja muito lenta.”

A IA interpreta esse texto e converte para um objeto de filtros estruturados, usado depois pela busca na TMDB.

### Busca e ranking de resultados

- consulta obras usando a API da TMDB
- normaliza os dados da resposta
- aplica ranking interno por compatibilidade
- exibe cards com nota, ano, tipo e gêneros

### Modal de detalhes

Ao clicar em um card, o usuário vê:

- capa ou backdrop
- sinopse
- gêneros
- idioma original
- duração
- status
- temporadas e episódios no caso de séries
- link para homepage oficial, quando existir

### Feedback por e-mail

O projeto possui um formulário integrado à Resend para receber:

- sugestões de melhoria
- relatos de bugs
- feedback geral

---

## Stack utilizada

### Front-end

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

### Back-end no próprio projeto

- **Route Handlers do App Router** do Next.js

### Integrações

- **Ollama** para interpretação de prompt
- **TMDB API** para dados de mídia
- **Resend** para envio de e-mail

---

## Arquitetura do projeto

A aplicação usa o App Router do Next.js e separa a lógica em camadas:

### Interface

Arquivos em `src/components` e `src/app`

- seções da homepage
- formulários
- cards
- modal
- componentes visuais reutilizáveis

### Lógica de domínio

Arquivos em `src/lib`

- conversão de filtros guiados
- interpretação do prompt
- integração com Ollama
- integração com TMDB
- ranking dos resultados
- cliente Resend

### Tipagem

Arquivos em `src/types`

- filtros
- mídia
- contratos de request/response

### Dados estáticos

Arquivos em `src/data`

- listas de gêneros
- moods
- ritmos
- janelas de lançamento

### Rotas de API

Arquivos em `src/app/api`

- `/api/interpret`
- `/api/discover`
- `/api/details/[mediaType]/[id]`
- `/api/feedback`

---

## Estrutura de pastas

```text
src/
  app/
    api/
      details/[mediaType]/[id]/route.ts
      discover/route.ts
      feedback/route.ts
      interpret/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    home/
    layout/
    ui/
  data/
    options.ts
  lib/
    filters.ts
    interpret.ts
    ollama.ts
    ranking.ts
    resend.ts
    tmdb.ts
  types/
    filters.ts
    media.ts
```

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto.

### Exemplo

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:3b

TMDB_API_READ_TOKEN=seu_token_tmdb

RESEND_API_KEY=sua_chave_resend
FEEDBACK_TO_EMAIL=seu_email_destino
FEEDBACK_FROM_EMAIL=Movie Glass <onboarding@resend.dev>
```

### Explicação

#### Ollama

- `OLLAMA_BASE_URL`: URL base da API do Ollama
- `OLLAMA_MODEL`: modelo usado para interpretar o prompt

#### TMDB

- `TMDB_API_READ_TOKEN`: token Bearer de leitura da API da TMDB

#### Resend

- `RESEND_API_KEY`: chave da Resend
- `FEEDBACK_TO_EMAIL`: e-mail que vai receber os feedbacks
- `FEEDBACK_FROM_EMAIL`: remetente usado no envio

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone <url-do-repo>
cd movie-liquidglass-app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o `.env.local`

Crie o arquivo com as variáveis mostradas acima.

### 4. Inicie o Ollama

Verifique se o Ollama está rodando e se o modelo está disponível.

```bash
ollama list
```

Se necessário, rode o modelo:

```bash
ollama run qwen2.5:3b
```

### 5. Rode o projeto

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
```

---

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### O que cada script faz

- `dev`: ambiente de desenvolvimento
- `build`: gera a versão de produção
- `start`: sobe a build de produção localmente
- `lint`: executa o ESLint

---

## Fluxo de funcionamento

### 1. Modo guiado

O formulário guiado cria um estado interno e converte esse estado em `StructuredFilters` usando `buildGuidedFilters`.

### 2. Modo texto livre

O usuário envia um prompt para `/api/interpret`.
Essa rota chama `interpretPromptToFilters`, que:

- envia o prompt ao Ollama
- força resposta em JSON estruturado
- sanitiza e normaliza os filtros
- aplica heurísticas extras de interpretação

### 3. Busca de mídia

Os filtros vão para `/api/discover`, que consulta a TMDB e retorna filmes, séries ou ambos.

### 4. Ranking

Os resultados são ordenados com base em:

- sobreposição de gêneros
- penalização por gêneros a evitar
- palavras-chave
- proximidade do ano desejado
- qualidade de apresentação (nota, popularidade, presença de poster)

### 5. Detalhes

Ao selecionar um item, o frontend chama `/api/details/[mediaType]/[id]` para buscar os detalhes completos da obra.

### 6. Feedback

O formulário envia dados para `/api/feedback`, que usa a Resend para encaminhar o conteúdo ao e-mail configurado.

---

## Design e UX

O projeto foi pensado para funcionar como peça de portfólio, então o foco não foi apenas na funcionalidade, mas também em:

- identidade visual forte
- estética premium
- leitura confortável
- interação fluida entre estados
- sensação moderna no uso

A interface segue uma linha inspirada em **Liquid Glass**, com:

- superfícies translúcidas
- gradientes suaves
- sobreposição de luz
- animações de transição entre modos
- cards visuais para descoberta de conteúdo

---

## Otimizações aplicadas

Durante o desenvolvimento, o projeto passou por ajustes de performance e responsividade.

### Performance

- redução de efeitos visuais caros em telas menores
- remoção de animações desnecessárias em mobile
- carregamento lazy de seções menos prioritárias
- uso de `next/image` para imagens remotas da TMDB
- modal carregado sob demanda
- cancelamento de requests com `AbortController`
- simplificação do CSS global

### Responsividade

- adaptação de grids e paddings para telas menores
- correção do switch entre modos em telas pequenas
- prevenção de overflow horizontal
- melhoria na distribuição dos chips e botões
- ajustes em componentes que encostavam no limite do container

---

## Melhorias futuras

Ideias para evolução do projeto:

- paginação ou carregamento incremental de resultados
- favoritos com persistência local ou banco de dados
- histórico de buscas
- recomendações explicáveis por item
- cache inteligente de respostas da TMDB
- fallback entre mais de um modelo de IA
- autenticação de usuário
- analytics de interações

---

## Autor

**João Borges**

- Portfólio: `https://portfoliojvb.vercel.app/`
- GitHub: `https://github.com/joao-vitorb`
- Instagram: `https://instagram.com/codebyjoao`
- LinkedIn: `https://www.linkedin.com/in/joao-vitor-borges-de-oliveira`
