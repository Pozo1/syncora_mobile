# Diário de Sprint 1 — Definição do dicionário e do problema
**Período:** Semana 1
**Grupo / tema:** Grupo 3 — Aho-Corasick para compatibilidade musical no Syncora

**Equipe:** Grupo 3
**Integrantes:** Rodrigo Pozo Griecco, Gabriel Nascimento
**Scrum Master do Sprint:** Gabriel Nascimento
**Repositório GitHub:** https://github.com/Pozo1/syncora_mobile

> Esta sprint **só define o problema e o dicionário de padrões**: caso de uso, dicionário v1, formato do texto de entrada e rascunho do critério de score. **Não há** construção do trie, função de falha nem busca — isso é Sprint 2 e 3.

### Contrato desta sprint

| | Artefato | Quem usa depois |
|---|---|---|
| **Entra** | Enunciado do projeto (nada de sprint anterior) | — |
| **Sai** | Canvas de kickoff (caso de uso, decisão apoiada, ganho esperado vs. busca ingênua) | Sprints seguintes |
| **Sai** | Dicionário de padrões v1 (gêneros/artistas/tags) fechado | Sprint 2 **é obrigada a usar este dicionário** |
| **Sai** | Formato do texto de entrada definido + dados de exemplo (Spotify real ou mock) | Sprint 2 e 3 |
| **Sai** | Rascunho do critério de score de compatibilidade | Sprint 3 |

**Não sai daqui:** trie, função de falha, busca, benchmark.

---

## 1. Canvas de kickoff

| Pergunta | Resposta |
|---|---|
| Qual é o caso de uso (que decisão de match o autômato apoia)? | Calcular a afinidade musical entre usuários buscando múltiplos padrões (gêneros, artistas, tags) simultaneamente nos dados de seus perfis. O autômato apoia a decisão de quais usuários devem ser sugeridos como "matches" na rede social Syncora. |
| Qual é o ganho esperado do Aho-Corasick em relação à busca ingênua (complexidade)? | Redução drástica do tempo de processamento. A busca ingênua (padrão a padrão) tem custo O(n·m), o que estrangularia o servidor. O Aho-Corasick fará a varredura de todos os termos em tempo linear O(n + m + z), numa única passagem. |
| A API do Spotify será usada de fato ou os dados serão simulados (mock)? Por quê? | Inicialmente usaremos dados simulados (mock). Isso nos permite isolar o algoritmo e provar a corretude matemática do autômato (Trie e failure links) sem sofrer com gargalos de rede, latência ou limites de requisição (rate limits) da API real nesta fase de construção. |

- [x] Caso de uso descrito com clareza
- [x] Ganho esperado (O(n+m+z) vs. O(n·m)) explicado em palavras simples
- [x] Decisão sobre API real vs. mock justificada

## 2. Dicionário de padrões v1

- [x] Lista fechada de padrões (gêneros, artistas e/ou tags) definida
- [x] Critério de inclusão dos padrões justificado (relevância para compatibilidade musical)
- [x] Tamanho do dicionário registrado (quantidade de padrões)

**Dicionário de padrões v1:**

O dicionário inicial foi fechado em exatamente **20 padrões**. O critério de inclusão focou em gêneros musicais amplos e artistas de topo globais para garantir uma alta probabilidade de intersecção (colisão) nos dados de teste, o que é vital para validar a eficácia do autômato.
Lista: `["pop", "rock", "indie", "jazz", "funk", "eletronica", "sertanejo", "mpb", "trap", "hip hop", "the weeknd", "taylor swift", "drake", "bad bunny", "dua lipa", "kendrick lamar", "arctic monkeys", "anitta", "matue", "djavan"]`

## 3. Formato do texto de entrada

- [x] Fonte do texto definida (playlists, bio, histórico de faixas concatenado) e como ele será obtido
- [x] Estrutura do texto (string única, lista de strings etc.) definida
- [x] Pelo menos 3 exemplos de texto de entrada (reais via Spotify ou mock) coletados

**Formato definido e exemplos de texto de entrada:**

A fonte do texto será o histórico de faixas e gêneros do usuário. Para o autômato rodar de forma otimizada, a estrutura será uma **string única concatenada** contendo todas as tags em sequência, separadas por vírgula.

*   *Exemplo 1 (Mock):* "user1_data: taylor swift, pop, indie, arctic monkeys, rock"
*   *Exemplo 2 (Mock):* "user2_data: funk, anitta, matue, trap, hip hop, djavan"
*   *Exemplo 3 (Mock):* "user3_data: the weeknd, pop, drake, jazz, eletronica, dua lipa"

## 4. Rascunho do critério de score de compatibilidade

- [x] Regra inicial de como as ocorrências de padrões viram um score de compatibilidade (ex.: contagem de padrões em comum)
- [x] Regra registrada como rascunho, a ser refinada na Sprint 3 com dados reais das ocorrências

**Rascunho do critério de score:**

A regra inicial de pontuação será linear e aditiva: cada padrão (gênero ou artista do dicionário) que o autômato localizar em comum nos textos de dois usuários diferentes somará +1 ponto de compatibilidade. O *score* final de afinidade entre eles será a soma total dessas intersecções diretas.

## 5. Scrum

- [x] Papéis definidos (Product Owner = docente; Scrum Master do sprint; Development Team)
- [x] Board criado (GitHub Projects ou Trello) com To do / Doing / Done
- [x] Backlog inicial com pelo menos 3 user stories

**User stories do backlog inicial:**
1. Como desenvolvedor, quero estruturar o dicionário de padrões em um array para consumi-lo na construção da árvore Trie (Fase 1 do autômato).
2. Como testador, quero gerar 3 mocks concatenados de texto de entrada para validar se as ocorrências disparam corretamente no estado final.
3. Como engenheiro de software, quero documentar o Canvas de Kickoff justificando a redução de complexidade algorítmica para embasar a proposta.

**Link do board:** [Board no GitHub Projects](https://github.com/users/Pozo1/projects/3)

## 6. Diário de bordo (retrospectiva individual)

| Integrante | O que fiz nesta Sprint | Dificuldades | O que pretendo manter/ajustar |
|---|---|---|---|
| Rodrigo Pozo | Estruturei o Canvas de Kickoff, formalizei o escopo do problema e documentei a matemática do ganho esperado de complexidade. | Lidar com a abstração inicial de não codificar a API real do Spotify e focar apenas no mock textual. | Manter a documentação baseada em mock para focar na precisão algorítmica do Aho-Corasick antes da integração. |
| Gabriel Nascimento | Criei o dicionário de padrões v1, defini a estrutura da string de entrada e formulei o rascunho inicial do score de afinidade. | Selecionar um conjunto de palavras-chave que gerassem intersecções consistentes para os futuros testes de colisão. | Manter o escopo do dicionário fechado em 20 padrões exatos para a próxima sprint. |

## 7. Evidências gerais

- Link do canvas: [Ver Seção 1 deste próprio documento](#1-canvas-de-kickoff)
- Link do dicionário v1: [Ver código-fonte (testRunner.js)](./src/algorithms/testRunner.js)
- Link dos exemplos de texto de entrada: [Ver mock de dados (testRunner.js)](./src/algorithms/testRunner.js)
- Link do board: [Board da Sprint 1 no GitHub Projects](https://github.com/users/Pozo1/projects/3)

## Rubrica de avaliação — Sprint 1 (nota de 0 a 4,0)

| Critério | Peso | O que caracteriza nota máxima | Nota atribuída | Observações |
|---|---|---|---|---|
| Canvas de kickoff | 0,5 | Caso de uso e ganho esperado claros; decisão API/mock justificada | | |
| Dicionário de padrões v1 | 1,0 | Lista fechada, critério de inclusão justificado | | |
| Formato do texto de entrada e dados de exemplo | 1,0 | Fonte definida, estrutura clara, exemplos coletados | | |
| Rascunho do critério de score | 1,0 | Regra inicial coerente com o objetivo de compatibilidade | | |
| Scrum + diário de bordo | 0,5 | Papéis, board, backlog e diário reflexivo de todos | | |
| **Nota final da Sprint 1** | **4,0** | | **___ / 4,0** | |