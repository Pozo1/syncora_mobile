# Diário de Sprint 4 — Integração e entrega
**Período:** Semana 5
**Grupo / tema:** Grupo 3 — Aho-Corasick para compatibilidade musical no Syncora

**Equipe:** Grupo 3 — Rodrigo Pozo Griecco, Gabriel Nascimento
**Scrum Master do Sprint:** Gabriel Nascimento
**Repositório GitHub:** [https://github.com/Pozo1/syncora_mobile](https://github.com/Pozo1/syncora_mobile)

> Busca, score e benchmark prontos na Sprint 3. Esta sprint **fecha o projeto**: integração mínima com o Syncora (real ou simulada), documentação técnica e apresentação final. **Não há** sprint seguinte — esta é a entrega.

### Contrato desta sprint

| | Artefato | Origem / destino |
|---|---|---|
| **Entra** | Busca funcionando + score + resultados de benchmark | Sprint 3 — **não refazer os experimentos sem justificar** |
| **Sai** | Integração mínima com backend/dado real (ou simulado) do Syncora | Entrega final |
| **Sai** | Documentação técnica final | Entrega final |
| **Sai** | Apresentação/demo final | Entrega final / mostra |

**Não há sprint seguinte.**

- [x] Confirmei que os números de desempenho apresentados são os da Sprint 3

---

## 1. Integração mínima com o Syncora

- [x] Ponto de integração definido (endpoint, função ou módulo do backend que vai chamar o autômato)
- [x] Fluxo completo funcionando: dados do usuário → texto → busca Aho-Corasick → score de compatibilidade
- [x] Se a integração real não foi viabilizada: versão simulada (mock) funcionando de ponta a ponta, com justificativa

**Descrição da integração (ou do mock) e evidências (link do commit):**

A integração no aplicativo [Syncora Mobile](https://github.com/Pozo1/syncora_mobile) foi implementada conectando o serviço [`src/services/TasteManager.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/services/TasteManager.js) (chamado no fluxo real com o Supabase) e o motor unificado `SyncoraMatchEngine` em [`src/algorithms/testRunner.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/testRunner.js) (que executa o pipeline determinístico de ponta a ponta unindo [`src/algorithms/AhoCorasick.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/AhoCorasick.js) e [`src/algorithms/BFS.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/BFS.js)):

1. **Ponto de Integração no Serviço (`TasteManager.processUserTrack` em [`src/services/TasteManager.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/services/TasteManager.js)):**
   * **Inicialização única (`initAutomaton()`):** Instancia `new AhoCorasick()`, cadastra o dicionário de tags e executa `buildFailureLinks()` apenas uma vez na sessão (`this.isInitialized = true`).
   * **Extração Linear e Fallback Algorítmico:** Recebe `rawText` vindo dos metadados da faixa atual do Spotify do usuário e executa `this.ac.search(rawText.toLowerCase())` em $O(n + z)$. Caso a faixa pertença a um nicho ainda ausente no dicionário fixo, aciona o *Fallback Algorítmico* utilizando o nome do artista principal (`artistName.split(',')[0].trim().toLowerCase()`) como tag do grafo.
   * **Atualização de Arestas e *Time-Decay* no Supabase:** Consulta a tabela `taste_edges` via [`src/services/supabaseClient.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/services/supabaseClient.js), reduz em `-0.1` o `affinity_score` dos gostos que não apareceram na escuta recente e restaura para `1.0` o peso das tags detectadas pelo Aho-Corasick.

2. **Pipeline Completo Ponta a Ponta (`SyncoraMatchEngine` em [`src/algorithms/testRunner.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/testRunner.js) + [`src/algorithms/BFS.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/BFS.js)):**
   * **Fluxo:** `Dados do Usuário (Spotify Text)` $\rightarrow$ `ingestUserSpotifyData()` (varredura `AhoCorasick.search`) $\rightarrow$ `buildUserGraph()` + `MatchBFS.encontrarMatches(usuarioRaizId, 0.5)` (travessia em largura $O(V + E)$ podando arestas com `peso < 0.5`) $\rightarrow$ `calculatePairCompatibility()` (score refinado ordenado para recomendação).
   * **Justificativa do modo simulado/híbrido nos testes E2E:** Como a API do Spotify exige autenticação OAuth interativa de múltiplos usuários simultâneos com músicas tocando ao vivo, o módulo `SyncoraMatchEngine` em [`src/algorithms/testRunner.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/testRunner.js) permite reproduzir de forma determinística no terminal exatamente o mesmo fluxo que roda no app, validando os pares de usuários e a poda temporal sem depender de sessões OAuth ativas durante a correção.

## 2. Testes de ponta a ponta

- [x] Pelo menos 3 pares de usuários testados no fluxo completo, com score final calculado
- [x] Resultados conferidos manualmente (o score faz sentido dado o que os usuários têm em comum?)

**Casos testados e resultados:**

Foram testados 4 pares de usuários no fluxo completo (`node src/algorithms/testRunner.js`), conferindo manualmente cada etapa desde a string de entrada até o score final pós-BFS:

| Caso / Par de Usuários | Texto de Entrada (Dados do Usuário) | Ocorrências Extraídas (`AhoCorasick.search`) | Comportamento da BFS (`limiteDecay = 0.5`) | Score Final e Conferência Manual |
|---|---|---|---|---|
| **Caso 1:** `user1_rodrigo` $\times$ `user4_lucas` | **Rodrigo:** `"user1_data: taylor swift, pop, indie rock, arctic monkeys, rock"`<br>**Lucas:** `"user4_data: arctic monkeys, indie rock, rock, pop, the weeknd, matue"` | **Rodrigo:** `taylor swift`, `pop`, `indie`, `indie rock`, `rock`, `arctic monkeys`<br>**Lucas:** `arctic monkeys`, `indie`, `indie rock`, `rock`, `pop`, `the weeknd`, `matue` | **5 arestas ativas mantidas:** `pop` ($0.9 / 0.8$), `indie` ($1.0 / 1.0$), `indie rock` ($1.0 / 1.0$), `rock` ($1.0 / 0.9$), `arctic monkeys` ($0.9 / 1.0$). | **5,70 pts (71% de compatibilidade)** — Conferido manualmente: $0.85 + 1.00 + 1.00 + 0.95 + 1.90 = 5.70$. O score faz total sentido: ambos ouvem ativamente rock/indie e têm `arctic monkeys` como banda em comum, ficando em 1º lugar no ranking da BFS. |
| **Caso 2:** `user1_rodrigo` $\times$ `user3_mariana` | **Rodrigo:** `"user1_data: taylor swift, pop, indie rock, arctic monkeys, rock"`<br>**Mariana:** `"user3_data: the weeknd, pop, drake, jazz, eletronica, dua lipa, taylor swift, indie"` | **Rodrigo:** `taylor swift`, `pop`, `indie`, `indie rock`, `rock`, `arctic monkeys`<br>**Mariana:** `the weeknd`, `pop`, `drake`, `jazz`, `eletronica`, `dua lipa`, `taylor swift`, `indie` | **3 arestas ativas mantidas:** `taylor swift` ($1.0 / 1.0$), `pop` ($0.9 / 0.9$), `indie` ($1.0 / 0.8$). | **3,80 pts (48% de compatibilidade)** — Conferido manualmente: $2.00 (\text{Taylor Swift}) + 0.90 (\text{pop}) + 0.90 (\text{indie}) = 3.80$. Faz sentido ocupar o 2º lugar: compartilham o eixo pop/indie e uma artista favorita, mas divergem nos demais gêneros. |
| **Caso 3:** `user1_rodrigo` $\times$ `user2_gabriel` | **Rodrigo:** `"user1_data: taylor swift, pop, indie rock, arctic monkeys, rock"`<br>**Gabriel:** `"user2_data: funk, anitta, matue, trap, hip hop, djavan, rock"` | **Rodrigo:** `taylor swift`, `pop`, `indie`, `indie rock`, `rock`, `arctic monkeys`<br>**Gabriel:** `funk`, `anitta`, `matue`, `trap`, `hip hop`, `djavan`, `rock` | **Poda Temporal Ativada:** A única tag em comum (`rock`) possui peso $0.3 < 0.5$ no perfil de Gabriel e é podada pela BFS. | **0,00 pts (0% — Descartado pela BFS)** — Conferido manualmente: como Gabriel não ouve mais rock recentemente (hoje escuta funk, trap e MPB), a poda temporal evita recomendar um match baseado em gosto antigo. |
| **Caso 4:** `user2_gabriel` $\times$ `user4_lucas` | **Gabriel:** `"user2_data: funk, anitta, matue, trap, hip hop, djavan, rock"`<br>**Lucas:** `"user4_data: arctic monkeys, indie rock, rock, pop, the weeknd, matue"` | **Gabriel:** `funk`, `anitta`, `matue`, `trap`, `hip hop`, `djavan`, `rock`<br>**Lucas:** `arctic monkeys`, `indie`, `indie rock`, `rock`, `pop`, `the weeknd`, `matue` | **Dupla Poda Temporal:** `matue` ($w_{\text{Lucas}} = 0.2 < 0.5$) e `rock` ($w_{\text{Gabriel}} = 0.3 < 0.5$) são podados pela BFS. | **0,00 pts (0% — Descartado pela BFS)** — Conferido manualmente: apesar de 2 interseções brutas no histórico, nenhuma está ativa simultaneamente nos dois usuários. |

## 3. Documentação técnica final

- [x] Autômato documentado (trie, função de falha, busca) com diagrama ou pseudocódigo
- [x] Resultados do benchmark da Sprint 3 incluídos
- [x] Limitações conhecidas registradas (ex.: dicionário pequeno, dependência da API do Spotify)

**Link da documentação técnica:** [`README.md`](https://github.com/Pozo1/syncora_mobile/blob/main/README.md), [`src/algorithms/AhoCorasick.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/AhoCorasick.js) e [`src/algorithms/BFS.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/BFS.js) em [https://github.com/Pozo1/syncora_mobile](https://github.com/Pozo1/syncora_mobile).

### 3.1. Funcionamento do Autômato (Trie, Função de Falha e Busca) + Integração BFS

1. **Trie (`addKeyword`):** Árvore de prefixos onde cada estado é uma instância de `TrieNode` contendo um mapa de transições `children` (`goto`), um ponteiro `fail` e uma lista `output`. A inserção de todos os padrões tem custo $O(m)$, onde $m = \sum |p_i|$.
2. **Função de Falha (`buildFailureLinks`):** Executada em largura (BFS) a partir da raiz. Os filhos de profundidade 1 apontam `fail` para `root`. Para cada transição `current --(char)--> child`, o algoritmo percorre os links de falha do pai (`fallback = current.fail`) até encontrar o maior sufixo próprio que também é prefixo na Trie, atribuindo `child.fail` e concatenando as saídas (`child.output = [...child.output, ...child.fail.output]`).
3. **Busca (`search`) + Grafo (`MatchBFS`):** A varredura lê o texto de tamanho $n$ uma única vez em $O(n + z)$, sem retroceder o ponteiro de leitura. As tags extraídas atualizam as arestas com peso temporal e alimentam a `MatchBFS` ($O(V + E)$), que poda arestas com `peso < 0.5`.

**Diagrama da Máquina de Estados (Exemplo de transições `goto` e `fail` com padrões sobrepostos):**

```text
                        [ (ROOT) ]
                /          |          \
             'i'          'r'          'k' / 'p'
             /             |              \
         (indie)*        (rock)*        (kpop)* ===fail===> (pop)*
           |               ^                                 |
          ' '              | fail                      output: ["kpop", "pop"]
           |               |
      (indie rock)* =======+
  output: ["indie rock", "rock"]
```

**Pseudocódigo do Pipeline Completo (Aho-Corasick + BFS Time-Decay):**

```text
FUNÇÃO BuscarEClassificarMatches(usuarioRaiz, textoSpotify, grafoUsuarios, limiteDecay = 0.5):
  // Etapa 1: Busca Aho-Corasick em O(n + z)
  estado <- Automato.root
  ocorrencias <- []
  PARA i DE 0 ATÉ comprimento(textoSpotify) - 1 FAÇA:
    c <- textoSpotify[i]
    ENQUANTO estado != NULO E NÃO existe estado.children[c] FAÇA:
      estado <- estado.fail
    SE estado == NULO ENTÃO estado <- Automato.root
    SENÃO estado <- estado.children[c]
    PARA CADA padrao EM estado.output FAÇA:
      ocorrencias.adicionar({ keyword: padrao, pos: i - comprimento(padrao) + 1 })

  // Etapa 2: Travessia BFS com Poda Temporal em O(V + E) e Score Refinado
  fila <- [usuarioRaiz]
  visitados <- {usuarioRaiz}
  recomendacoes <- []
  ENQUANTO fila não estiver vazia FAÇA:
    atual <- fila.desenfileirar()
    PARA CADA aresta (atual -> vizinho, peso) EM grafoUsuarios[atual] FAÇA:
      SE peso < limiteDecay ENTÃO CONTINUE // Poda de aresta (Time-Decay)
      SE vizinho NÃO está em visitados ENTÃO:
        visitados.adicionar(vizinho)
        fila.enfileirar(vizinho)
        score <- CalcularScoreRefinado(usuarioRaiz, vizinho, limiteDecay)
        SE score > 0 ENTÃO recomendacoes.adicionar({ usuario: vizinho, score: score })

  RETORNAR OrdenarPorMaiorScore(recomendacoes)
```

### 3.2. Resultados do Benchmark (Consolidados da Sprint 3)

| Tamanho do dicionário | Tamanho do texto | Tempo Aho-Corasick | Tempo busca ingênua | Ganho |
|---|---|---|---|---|
| 10 padrões | 1.000 caracteres (~1 KB) | 0,1097 ms | 0,1087 ms | **0,99x** |
| 10 padrões | 10.000 caracteres (~10 KB) | 0,3131 ms | 0,3861 ms | **1,23x** |
| 10 padrões | 100.000 caracteres (~100 KB) | 2,3607 ms | 3,6946 ms | **1,57x** |
| 50 padrões | 1.000 caracteres (~1 KB) | 0,0225 ms | 0,2017 ms | **8,96x** |
| 50 padrões | 10.000 caracteres (~10 KB) | 0,2397 ms | 1,6522 ms | **6,89x** |
| 50 padrões | 100.000 caracteres (~100 KB) | 2,8164 ms | 16,6112 ms | **5,90x** |
| 200 padrões | 1.000 caracteres (~1 KB) | 0,0232 ms | 0,9066 ms | **39,09x** |
| 200 padrões | 10.000 caracteres (~10 KB) | 0,2731 ms | 7,3101 ms | **26,76x** |
| 200 padrões | 100.000 caracteres (~100 KB) | 2,7765 ms | 62,3461 ms | **22,45x** |

### 3.3. Limitações Conhecidas

1. **Dicionário Estático Inicial:** O dicionário carregado em `TasteManager.js` possui tamanho fixo em código; novos artistas ou subgêneros dependem atualmente do *Fallback Algorítmico* (que usa o nome do artista principal quando nenhuma palavra da Trie é encontrada) até que o dicionário passe a ser sincronizado via tabela no banco de dados.
2. **Casamento de Subpalavras Curtas:** Termos curtos como `"pop"` ou `"rap"` podem ser acionados dentro de palavras maiores se não houver verificação de fronteira de palavra (embora em casos como `"kpop"` essa sobreposição seja benéfica).
3. **Dependência da API do Spotify e Tokens OAuth:** Caso o usuário esteja com sessão expirada, modo privado no Spotify ou sem faixas tocadas recentemente, o aplicativo depende das últimas arestas persistidas na tabela `taste_edges` do Supabase.

## 4. Apresentação/demo final

- [x] Roteiro definido (motivação → autômato → benchmark → integração → demo ao vivo)
- [x] Demo preparada mostrando o cálculo de compatibilidade para pelo menos 1 par de usuários

**Resumo do Roteiro e Demo:**
1. **Motivação:** Problema da superficialidade em apps de relacionamento e gargalo de buscas `O(n·m)` sobre dados do Spotify.
2. **Autômato:** Estrutura da Trie, construção dos *failure links* via BFS e busca em passagem única $O(n + m + z)$.
3. **Benchmark:** Comparação experimental da Sprint 3 comprovando ganho de até **39,09x** (200 padrões) e estabilidade em ~`2,78 ms` para textos de 100 KB.
4. **Integração:** Fluxo `Spotify Text -> Aho-Corasick -> TasteManager (Time-Decay) -> MatchBFS -> Score Refinado`.
5. **Demo ao Vivo:** Execução de `node src/algorithms/testRunner.js` demonstrando ao vivo o cálculo de compatibilidade entre `user1_rodrigo` e `user4_lucas` (**5,70 pts / 71%**) e a poda automática de aresta inativa entre `user1_rodrigo` e `user2_gabriel` (**0,00 pts**).

## 5. Scrum

- [x] Atualizações assíncronas semanais registradas
- [x] Board refletindo o backlog, em andamento e concluído

## 6. Diário de bordo (retrospectiva individual)

| Integrante | O que fiz nesta Sprint | Dificuldades | O que pretendo manter/ajustar |
|---|---|---|---|
| **Rodrigo Pozo** | Integrei o autômato Aho-Corasick ao serviço `TasteManager.js` e à travessia `MatchBFS` (`BFS.js`), redigi a documentação técnica final com diagrama de estados, pseudocódigo e limitações, e consolidei os resultados de benchmark da Sprint 3. | Alinhar a lógica de decaimento temporal das arestas (`-0.1` por ciclo inativo) com a nota de corte `limiteDecay = 0.5` da BFS garantindo que falsos positivos fossem eliminados sem perder matches reais. | Manter a separação limpa entre a camada algorítmica (`src/algorithms/`) e a camada de serviços (`src/services/`) para a continuidade da Iniciação Científica (ENCIBRAC). |
| **Gabriel Nascimento** | Implementei o motor unificado `SyncoraMatchEngine` em [`src/algorithms/testRunner.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/testRunner.js) para os testes de ponta a ponta, conferi manualmente os scores dos 4 pares de usuários e estruturei o roteiro da demonstração ao vivo. | Calibrar a normalização do score refinado (Artista `2.0` vs. Gênero `1.0`) para que os casos de teste refletissem fielmente tanto a alta sintonia quanto a poda por *Time-Decay*. | Levar a metodologia de desenvolvimento incremental por sprints (modelo -> autômato -> benchmark -> integração) para os próximos projetos do curso. |

---

## Rubrica de avaliação — Sprint 4 (nota de 0 a 4,0)

| Critério | Peso | O que caracteriza nota máxima | Nota atribuída | Observações |
|---|---|---|---|---|
| Integração mínima | 1,0 | Fluxo completo funcionando (real ou mock justificado) | | |
| Testes de ponta a ponta | 0,5 | Casos testados e conferidos manualmente | | |
| Documentação técnica final | 1,0 | Autômato e benchmark documentados; limitações registradas | | |
| Apresentação final / Scrum + diário | 1,0 | Demo funcional; board e diário atualizados | | |
| **Nota final da Sprint 4** | **4,0** | | **___ / 4,0** | |
