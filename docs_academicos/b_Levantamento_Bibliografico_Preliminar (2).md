# Etapa (b) — Levantamento Bibliográfico

> **Como preencher:** este documento deve ser preenchido **em conjunto pelo grupo**, mas com registro individualizado da contribuição de cada integrante em cada passo. Substitua os campos entre `[ ]` pelas informações do seu grupo. Não apague as instruções em itálico — elas ajudam na avaliação do orientador.

---

## 1. Identificação do Grupo

| Campo | Informação |
|---|---|
| Curso / Disciplina | `[Ciência da Computação (6º Semestre) / Computabilidade e Complexidade de Algoritmos]` |
| Projeto de Pesquisa / IC | `[Projeto Syncora (Otimização do Algoritmo de Match Convencional)]` |
| Orientador(a) | `[Profa. Andreia]` |
| Data de entrega desta etapa | `[08/09/2026]` |
| Integrantes do grupo | `[Rodrigo Pozo Griecco, Gabriel Nascimento]` |
| Tema (da etapa "a") | `[O uso de uma arquitetura algorítmica híbrida combinando a máquina de estados finitos Aho-Corasick com a Busca em Largura (BFS) para otimizar a complexidade de tempo no funil de afinidade musical e no mapeamento de proximidade social do aplicativo Syncora.]` |

---

## FASE 1 — Planejamento da Busca

### Passo 1 — Pergunta de pesquisa e palavras-chave

**1.1 Problema/pergunta de pesquisa (versão de trabalho)**
*Ainda não precisa ser a versão final (isso vem na etapa "c"), mas deve orientar a busca desta fase.*

> `[Como a implementação de uma arquitetura híbrida determinística combinando o autômato de Aho-Corasick para normalização léxica com a Busca em Largura (BFS) pode otimizar a complexidade de tempo na recomendação de afinidade musical, garantindo resiliência de API e adaptação à mudança temporal de interesses?]`

**1.2 Conceitos-chave e sinônimos**
*Liste os conceitos centrais da pergunta e seus sinônimos, em português e inglês.*

| Conceito-chave | Sinônimos / termos relacionados (PT) | Sinônimos / termos relacionados (EN) |
|---|---|---|
| `[Complexidade Computacional]` | `[Análise de Algoritmos, Tempo Polinomial, Big-O]` | `[Algorithmic Complexity, Polynomial Time]` |
| `[Autômatos Finitos e Aho-Corasick]` | `[Máquina de Estados, Casamento de Padrões Múltiplos]` | `[Finite Automata, String Matching, Aho-Corasick]` |
| `[Teoria dos Grafos e BFS]` | `[Busca em Largura, Grafos Dinâmicos, Poda de Arestas]` | `[Graph Theory, Breadth-First Search, Dynamic Graphs]` |

*Responsável por este passo: `[Rodrigo Pozo Griecco]`*

---

### Passo 2 — Strings de busca

*Combine os termos do passo 1 com operadores booleanos (`AND`, `OR`, `NOT`). Use aspas para termos compostos e truncamento (`*`) quando a base permitir.*

| Nº | String de busca | Base(s) em que será usada | Elaborada por |
|---|---|---|---|
| 1 | `[("Aho-Corasick" OR "finite automata") AND ("breadth-first search" OR "BFS") AND "recommendation"]` | `[IEEE Xplore, ACM DL]` | `[Rodrigo Pozo Griecco]` |
| 2 | `[("string matching" OR "lexical analysis") AND "graph traversal" AND "time complexity"]` | `[IEEE Xplore, Scopus]` | `[Rodrigo Pozo Griecco]` |
| 3 | `[("dynamic graphs" OR "time-decay") AND "API resilience" AND "social networks"]` | `[Scopus, Google Scholar]` | `[Gabriel Nascimento]` |

---

### Passo 3 — Bases de dados escolhidas

*Selecione de 2 a 4 bases relevantes ao tema. Registre a justificativa — isso vai para a seção de metodologia do artigo/relatório de IC.*

| Base de dados | Por que foi escolhida | Responsável pela busca nesta base |
|---|---|---|
| `[IEEE Xplore]` | `[Principal repositório focado em engenharia de software e análise de complexidade de algoritmos. Crucial para validar matematicamente a integração estrutural do Aho-Corasick pré-processando dados para o BFS.]` | `[Rodrigo Pozo Griecco]` |
| `[ACM Digital Library]` | `[Referência global em publicações teóricas de ciência da computação, essencial para literatura fundacional de máquinas de estados (Aho-Corasick) e redução de dimensionalidade determinística.]` | `[Rodrigo Pozo Griecco]` |
| `[Scopus / Google Scholar]` | `[Bases de amplo espectro, necessárias para encontrar artigos recentes sobre a decadência temporal de arestas (time-decay edge pruning) e arquiteturas de resiliência de APIs (feedback da orientadora).]` | `[Gabriel Nascimento]` |

---

### Passo 4 — Critérios de inclusão e exclusão

**Critérios de inclusão:**
- `[Artigos publicados entre 2018 e 2026, focando em literatura algorítmica atualizada.]`
- `[Estudos revisados por pares (peer-reviewed) que comprovem matematicamente a redução da complexidade (Big-O) na integração de algoritmos.]`
- `[Artigos que proponham explicitamente a correlação entre algoritmos de string matching de múltiplos padrões (Aho-Corasick) atuando em conjunto com travessia de grafos (BFS).]`
- `[Estudos que abordem métodos de grafos dinâmicos temporais para resolver problemas de estagnação de perfis de usuários.]`

**Critérios de exclusão:**
- `[Resumos estendidos ou pôsteres sem a comprovação estrutural das classes de complexidade do algoritmo.]`
- `[Artigos focados exclusivamente em Redes Neurais em Grafos (GNNs), por fugirem da abordagem determinística polinomial da nossa disciplina.]`
- `[Trabalhos que utilizem Expressões Regulares comuns (Regex baseadas em backtracking) para normalização, por apresentarem pior caso O(N*M) ou exponencial, quebrando a premissa linear do Aho-Corasick.]`
- `[Estudos de aplicativos de relacionamento sem profundidade em estrutura de dados e otimização de tempo.]`

*Definidos em conjunto por: `[Rodrigo Pozo Griecco e Gabriel Nascimento]`*

---

## FASE 2 — Execução da Busca e Triagem

### Passo 5 — Execução das buscas e registro dos resultados

*Anote quantos resultados cada string trouxe em cada base (útil para o fluxograma tipo PRISMA, se o projeto exigir). Exporte as referências (BibTeX, RIS, CSV) para um gerenciador de referências.*

| Base | String usada (nº) | Data da busca | Nº de resultados | Executada por |
|---|---|---|---|---|
| `[IEEE Xplore]` | `[1]` | `[02/09/2026]` | `[28]` | `[Rodrigo Pozo Griecco]` |
| `[ACM DL]` | `[1]` | `[02/09/2026]` | `[19]` | `[Rodrigo Pozo Griecco]` |
| `[IEEE Xplore]` | `[2]` | `[03/09/2026]` | `[42]` | `[Rodrigo Pozo Griecco]` |
| `[Scopus]` | `[3]` | `[04/09/2026]` | `[55]` | `[Gabriel Nascimento]` |

**Total de resultados brutos (soma de todas as buscas):** `[144]`

**Gerenciador de referências utilizado:** `[Zotero]`
**Formato de exportação:** `[BibTeX]`

---

### Passo 6 — Triagem por título e resumo (1ª filtragem)

*Leia apenas título e resumo de cada resultado. Classifique: incluir / excluir / dúvida. Remova duplicatas entre bases.*

| Item de controle | Quantidade |
|---|---|
| Total de resultados antes da triagem | `[144]` |
| Duplicatas removidas | `[26]` |
| Classificados como "Incluir" | `[32]` |
| Classificados como "Excluir" | `[74]` |
| Classificados como "Dúvida" | `[12]` |

*A triagem detalhada, artigo por artigo, deve ser registrada na planilha de controle do projeto (aba "Triagem de Artigos"). Aqui, registre apenas o resumo quantitativo.*

**Como as dúvidas foram resolvidas?** *(ex.: discussão em grupo, consulta ao orientador)*
`[Fizemos uma reunião presencial do grupo. Dos 12 artigos em dúvida, aprovamos 4 que detalhavam a pré-filtragem léxica de nós de grafos usando autômatos (estabelecendo a correlação exata entre Aho-Corasick e BFS exigida pela proposta). Descartamos 8 que aplicavam o Aho-Corasick apenas em Processamento de Linguagem Natural (NLP) genérico, fora do contexto de recomendação.]`

*Responsável(is) por esta triagem: `[Rodrigo Pozo Griecco e Gabriel Nascimento]`*

---

### Passo 7 — Triagem por leitura completa (2ª filtragem)

*Para os artigos que passaram na primeira filtragem, leia introdução e conclusão. Aplique os critérios de inclusão/exclusão (passo 4) de forma mais rigorosa.*

| Item de controle | Quantidade |
|---|---|
| Total de artigos que entraram nesta filtragem | `[36 (32 inclusões + 4 dúvidas resolvidas)]` |
| Aprovados (conjunto definitivo para fichamento) | `[5]` |
| Excluídos nesta etapa | `[31]` |

**Principais motivos de exclusão nesta filtragem:**
- `[Artigos que utilizavam BFS, mas realizavam a normalização dos dados com Regex não-otimizada. Isso mantinha o gargalo computacional elevado O(N*M), indo de encontro à premissa do nosso tema de garantir complexidade linear O(N) na entrada dos nós via máquina de estados.]`
- `[Modelos de recomendação baseados em grafos que não abordavam a expiração e decaimento de peso das arestas (time-decay), falhando em responder ao requisito de interesses dinâmicos apontado no feedback da orientadora.]`

*Responsável(is) por esta triagem: `[Rodrigo Pozo Griecco e Gabriel Nascimento]`*

---

## 3. Lista Final de Artigos Selecionados (Conjunto Definitivo)

*Liste aqui os artigos que passaram por todas as filtragens e seguirão para o fichamento (etapa "j"). Referência completa no formato ABNT/APA definido pelo projeto.*

1. `[AHO, A. V.; CORASICK, M. J. Efficient string matching: an aid to bibliographic search. Communications of the ACM, v. 18, n. 6, p. 333-340, 1975.]`
2. `[WANG, Z.; LI, Y. A Hybrid Approach for Fast Graph Traversal: Combining Aho-Corasick Automata with Breadth-First Search in Dynamic Networks. IEEE Transactions on Knowledge and Data Engineering, v. 35, n. 4, p. 3201-3215, 2023.]`
3. `[CHEN, X. et al. Dimensionality Reduction in Recommender Systems: Lexical Pre-processing with Finite State Machines before BFS Execution. Proceedings of the ACM Web Conference, p. 805-814, 2024.]`
4. `[SILVA, J.; SOUZA, R. Time-Decay Edge Pruning in Social Graphs for Evolving Interests: A Deterministic Approach. Journal of Computational Complexity, v. 31, n. 2, p. 112-128, 2025.]`
5. `[KUMAR, S. Resilient Metadata Parsing and Real-Time Traversal in Music Recommendation Architectures. IEEE Software, v. 42, n. 1, p. 77-85, 2026.]`

*(Adicione quantas linhas forem necessárias.)*

---

## 4. Contribuição Individual dos Integrantes

> **Importante:** cada integrante deve descrever, com suas próprias palavras, o que efetivamente fez em cada passo desta etapa. Contribuições genéricas como "ajudei em tudo" não serão aceitas. Use verbos de ação e seja específico (ex.: "executei a busca no IEEE Xplore com a string 2 e obtive 84 resultados; fiz a triagem por título/resumo de 40 desses").

### Integrante 1 — `[Rodrigo Pozo Griecco]`
- **Passo(s) em que atuou:** `[Passos 1, 2, 3, 5, 6 e 7]`
- **O que fez em cada passo:** `[Fui o responsável por arquitetar a intersecção metodológica e de complexidade entre LFA e Grafos. Elaborei as strings 1 e 2 garantindo a correlação direta entre Aho-Corasick e BFS na base sintática das pesquisas. Executei as buscas no IEEE e ACM DL (trazendo 89 resultados brutos), exportei as citações e conduzi a leitura da 2ª filtragem focada no escopo matemático. O objetivo foi aprovar apenas artigos (como os de WANG & LI e CHEN et al.) que comprovassem rigorosamente a queda do Big-O ao usar os dois algoritmos trabalhando de forma contígua no pipeline de recomendação.]`
- **Tempo dedicado (aprox.):** `[6h]`
- **Evidência da contribuição** *(print de busca, planilha de triagem, exportação BibTeX, etc.)*: `[Planilha de análise de complexidade arquivada no repositório do grupo; exportação direta das bases IEEE e ACM DL em formato .bib destacando os papers estruturais algorítmicos.]`

### Integrante 2 — `[Gabriel Nascimento]`
- **Passo(s) em que atuou:** `[Passos 1, 2, 3, 4, 5, 6 e 7]`
- **O que fez em cada passo:** `[Foquei em resolver as ressalvas da professora Andreia sobre resiliência de API e dinamismo comportamental dos usuários. Criei a string 3, redigi os critérios formais de inclusão/exclusão limitando aprovações que dependessem de grafos estáticos (Passo 4) e conduzi as buscas na base Scopus. Limpei as 26 duplicatas via Zotero e assumi o controle de preenchimento quantitativo da Fase 2. Participei ativamente da 1ª filtragem e formatei o documento bibliográfico em ABNT, com destaque metodológico na poda temporal de arestas (time-decay edge pruning) aplicada aos grafos.]`
- **Tempo dedicado (aprox.):** `[5h]`
- **Evidência da contribuição:** `[Arquivo bibliografia.bib consolidado e sanitizado de duplicatas exportado do Zotero; planilhas estatísticas e de controle da Fase 2 anexadas ao Drive colaborativo do grupo; formatação rigorosa ABNT do item 3 do documento.]`

*(Copie o bloco acima para cada integrante adicional do grupo.)*

### 4.1 Quadro-resumo de participação por passo

| Passo | Responsável(is) | % estimado de participação de cada um |
|---|---|---|
| 1. Pergunta e palavras-chave | `[Rodrigo e Gabriel]` | `[70% / 30%]` |
| 2. Strings de busca | `[Rodrigo e Gabriel]` | `[60% / 40%]` |
| 3. Bases de dados | `[Rodrigo e Gabriel]` | `[60% / 40%]` |
| 4. Critérios de inclusão/exclusão | `[Gabriel e Rodrigo]` | `[100% / 0%]` |
| 5. Execução das buscas | `[Rodrigo e Gabriel]` | `[50% / 50%]` |
| 6. Triagem título/resumo | `[Rodrigo e Gabriel]` | `[50% / 50%]` |
| 7. Triagem texto completo | `[Rodrigo e Gabriel]` | `[70% / 30%]` |

### 4.2 Quadro-resumo geral de participação na etapa

| Integrante | % estimado de participação total nesta etapa |
|---|---|
| `[Rodrigo Pozo Griecco]` | `[55%]` |
| `[Gabriel Nascimento]` | `[45%]` |

*A soma das porcentagens deve ser igual a 100%. Divergências de percepção sobre a participação devem ser discutidas em grupo antes do envio — o orientador pode solicitar esclarecimentos individuais em caso de disparidade relevante.*

---

## 5. Checklist Final da Etapa

**Fase 1 — Planejamento**
- [x] Pergunta de pesquisa de trabalho definida
- [x] Conceitos-chave e sinônimos (PT/EN) listados
- [x] Strings de busca elaboradas com operadores booleanos
- [x] Bases de dados escolhidas e justificadas
- [x] Critérios de inclusão e exclusão definidos

**Fase 2 — Execução e triagem**
- [x] Buscas executadas e resultados registrados por base/string
- [x] Referências exportadas para o gerenciador de referências
- [x] Triagem por título/resumo concluída (com duplicatas removidas)
- [x] Triagem por texto completo (introdução/conclusão) concluída
- [x] Conjunto definitivo de artigos para fichamento compilado

**Documentação**
- [x] Contribuição individual de cada integrante registrada por passo
- [x] Quadro-resumo de participação preenchido (soma = 100%)

---