# Diário de Sprint 3 — Busca e benchmark
**Período:** Semanas 3–4
**Grupo / tema:** Grupo 3 — Aho-Corasick para compatibilidade musical no Syncora

**Equipe:** Grupo 3 — Rodrigo Pozo Griecco, Gabriel Nascimento
**Scrum Master do Sprint:** Gabriel Nascimento
**Repositório GitHub:** [https://github.com/Pozo1/syncora_mobile](https://github.com/Pozo1/syncora_mobile)

> Trie e função de falha prontos na Sprint 2. Esta sprint implementa a **busca** (goto/fail/output), calcula o **score de compatibilidade** e **compara o desempenho** com a busca ingênua. **Não há** integração com o backend do Syncora — isso é Sprint 4.

### Contrato desta sprint

| | Artefato | Origem / destino |
|---|---|---|
| **Entra** | Trie + função de falha (autômato construído e validado) | Sprint 2 — **mesmo autômato, sem reconstruir do zero** |
| **Entra** | Busca ingênua preparada (baseline) | Sprint 2 |
| **Sai** | Algoritmo de busca (goto/fail/output) funcionando sobre textos de teste | Sprint 4 |
| **Sai** | Cálculo do score de compatibilidade a partir das ocorrências | Sprint 4 |
| **Sai** | Benchmark de desempenho (Aho-Corasick vs. busca ingênua) | Sprint 4 |

**Não sai daqui:** integração com o backend/dado real do Syncora, documentação técnica final.

- [x] Confirmei que o autômato usado é exatamente o da Sprint 2

---

## 1. Implementação da busca

- [x] Algoritmo de busca (transições goto, uso dos failure links, coleta de output) implementado
- [x] Busca testada sobre os textos de exemplo da Sprint 1, retornando padrão + posição de cada ocorrência
- [x] Casos com padrões sobrepostos (um padrão prefixo de outro) testados

**Descrição da implementação e evidências (link do repositório/commit):**

A fase de varredura linear (`search(text)`) foi implementada diretamente sobre a classe `AhoCorasick` em [`src/algorithms/AhoCorasick.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/AhoCorasick.js), mantendo exatamente a mesma estrutura `TrieNode` (`children`, `fail`, `output`) e os métodos `addKeyword(word)` e `buildFailureLinks()` entregues e validados na [Sprint 2](https://github.com/Pozo1/syncora_mobile/blob/main/docs_sprint/Grupo3_Sprint2.md) (commit `04894f7`), sem reconstruir o autômato do zero.

O método `search(text)` percorre o texto de entrada caractere a caractere (índice `i` de `0` até `text.length - 1`), sempre avançando sem realizar *backtracking*:
1. **Transição de Falha (`fail`):** Enquanto o nó atual (`current`) não possui transição `goto` para o caractere lido (`!current.children[char]`) e `current !== null`, o autômato percorre os ponteiros de falha (`current = current.fail`).
2. **Transição `goto`:** Se `current` chegar a `null`, o estado retorna para a raiz (`this.root`); caso contrário, avança pelo filho correspondente (`current = current.children[char]`).
3. **Coleta de `output`:** Sempre que `current.output.length > 0`, o algoritmo percorre todos os padrões armazenados no estado (incluindo os padrões sufixos herdados via `child.output = [...child.output, ...child.fail.output]`) e adiciona ao vetor de resultados o objeto `{ keyword: word, indexEncontrado: i - word.length + 1 }`.

**Teste sobre os textos de exemplo da [Sprint 1](https://github.com/Pozo1/syncora_mobile/blob/main/docs_sprint/Grupo3_Sprint1.md) (Dicionário v1 de 20 padrões):**
* **Exemplo 1 (`"user1_data: taylor swift, pop, indie, arctic monkeys, rock"`):**
  * `{ keyword: "taylor swift", indexEncontrado: 12 }`
  * `{ keyword: "pop", indexEncontrado: 26 }`
  * `{ keyword: "indie", indexEncontrado: 31 }`
  * `{ keyword: "arctic monkeys", indexEncontrado: 38 }`
  * `{ keyword: "rock", indexEncontrado: 54 }`
* **Exemplo 2 (`"user2_data: funk, anitta, matue, trap, hip hop, djavan"`):**
  * `{ keyword: "funk", indexEncontrado: 12 }`
  * `{ keyword: "anitta", indexEncontrado: 18 }`
  * `{ keyword: "matue", indexEncontrado: 26 }`
  * `{ keyword: "trap", indexEncontrado: 33 }`
  * `{ keyword: "hip hop", indexEncontrado: 39 }`
  * `{ keyword: "djavan", indexEncontrado: 48 }`
* **Exemplo 3 (`"user3_data: the weeknd, pop, drake, jazz, eletronica, dua lipa"`):**
  * `{ keyword: "the weeknd", indexEncontrado: 12 }`
  * `{ keyword: "pop", indexEncontrado: 24 }`
  * `{ keyword: "drake", indexEncontrado: 29 }`
  * `{ keyword: "jazz", indexEncontrado: 36 }`
  * `{ keyword: "eletronica", indexEncontrado: 42 }`
  * `{ keyword: "dua lipa", indexEncontrado: 54 }`

**Teste de padrões sobrepostos (prefixo, sufixo e subpalavra):**
Para testar colisões de prefixo e sufixo (`"indie"` prefixo de `"indie rock"` e `"rock"` sufixo de `"indie rock"`; `"pop"` sufixo de `"kpop"` e prefixo de `"pop rock"`; `"trap"` prefixo de `"trap funk"`), executamos a busca sobre a string de teste `"sobreposicao: curto muito indie rock, kpop, pop rock e trap funk nas playlists"`, obtendo todas as 11 ocorrências numa única leitura:
* `"indie"` (pos. `26`), `"indie rock"` (pos. `26`) e `"rock"` (pos. `32` via *failure link*);
* `"kpop"` (pos. `38`) e `"pop"` (pos. `39`, coletado simultaneamente no mesmo nó de saída);
* `"pop"` (pos. `44`), `"pop rock"` (pos. `44`) e `"rock"` (pos. `48` via *failure link*);
* `"trap"` (pos. `55`), `"trap funk"` (pos. `55`) e `"funk"` (pos. `60` via *failure link*).

* **Evidências no repositório:** [`src/algorithms/AhoCorasick.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/AhoCorasick.js) e [`src/algorithms/testRunner.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/testRunner.js).

## 2. Cálculo do score de compatibilidade

- [x] Regra da Sprint 1 aplicada às ocorrências reais encontradas
- [x] Regra refinada se necessário, com justificativa (ex.: pesos diferentes por tipo de padrão)
- [x] Score calculado para pelo menos 3 pares de usuários (reais ou simulados)

**Regra final do score e exemplos calculados:**

1. **Aplicação da Regra da [Sprint 1](https://github.com/Pozo1/syncora_mobile/blob/main/docs_sprint/Grupo3_Sprint1.md) (Linear e Aditiva):** Cada padrão em comum extraído pelo autômato nos textos de dois usuários soma $+1$ ponto ($\text{Score}_{\text{S1}} = |P_A \cap P_B|$).
2. **Refinamento da Regra na Sprint 3 (Pesos por Tipo de Padrão + Poda Temporal BFS em Memória):**
   * **Justificativa semântica (Artista vs. Gênero):** Dois usuários ouvirem exatamente o mesmo **artista** (ex.: `"arctic monkeys"` ou `"taylor swift"`) indica uma compatibilidade muito mais específica do que apenas ouvirem um mesmo macro-gênero amplo (ex.: `"pop"` ou `"rock"`). Por isso, refinamos o peso base para **$W_{\text{artista}} = 2,0$** e **$W_{\text{gênero}} = 1,0$**.
   * **Justificativa algorítmica (União com a Poda Temporal da BFS):** Para preparar a filtragem em grafo de [`src/algorithms/BFS.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/BFS.js), cada ocorrência possui um peso de frescor simulado em memória ($w \in [0,0; 1,0]$). Se o peso do gosto musical em qualquer um dos dois usuários for menor que a nota de corte (`limiteDecay = 0.5`), a aresta é podada (*Edge Pruning*) e não pontua. Para arestas ativas ($w_A \ge 0.5$ e $w_B \ge 0.5$), aplica-se a fórmula:

$$\text{Score}_{\text{Refinado}}(A, B) = \sum_{p \in (P_A \cap P_B), \, w_A(p) \ge 0.5, \, w_B(p) \ge 0.5} W_{\text{tipo}}(p) \times \left(\frac{w_A(p) + w_B(p)}{2}\right)$$

**Exemplos calculados sobre 4 pares de usuários simulados (textos de teste em memória):**
* **`user1_rodrigo`:** `"taylor swift"` ($1.0$), `"pop"` ($0.9$), `"indie"` ($1.0$), `"indie rock"` ($1.0$), `"arctic monkeys"` ($0.9$), `"rock"` ($1.0$).
* **`user2_gabriel`:** `"funk"` ($1.0$), `"anitta"` ($1.0$), `"matue"` ($0.9$), `"trap"` ($1.0$), `"hip hop"` ($0.8$), `"djavan"` ($1.0$), `"rock"` ($0.3$ — gosto antigo inativo).
* **`user3_mariana`:** `"the weeknd"` ($1.0$), `"pop"` ($0.9$), `"drake"` ($0.8$), `"jazz"` ($0.7$), `"eletronica"` ($0.9$), `"dua lipa"` ($1.0$), `"taylor swift"` ($1.0$), `"indie"` ($0.8$).
* **`user4_lucas`:** `"arctic monkeys"` ($1.0$), `"indie rock"` ($1.0$), `"rock"` ($0.9$), `"pop"` ($0.8$), `"the weeknd"` ($0.9$), `"matue"` ($0.2$ — gosto antigo inativo).

| Par Simulado | Padrões em Comum | Score Sprint 1 (Linear) | Padrões Podados ($w < 0.5$) | Memória de Cálculo (Regra Refinada) | Score Final Refinado |
|---|---|---|---|---|---|
| **Par 1:** `user1_rodrigo` $\times$ `user4_lucas` | `"pop"`, `"indie"`, `"indie rock"`, `"rock"`, `"arctic monkeys"` | `5 pts` | Nenhum | `pop` ($1.0 \times 0.85$) + `indie` ($1.0 \times 1.0$) + `indie rock` ($1.0 \times 1.0$) + `rock` ($1.0 \times 0.95$) + `arctic monkeys` ($2.0 \times 0.95$) | **5,70 pts (71%)** |
| **Par 2:** `user1_rodrigo` $\times$ `user3_mariana` | `"taylor swift"`, `"pop"`, `"indie"` | `3 pts` | Nenhum | `taylor swift` ($2.0 \times 1.0$) + `pop` ($1.0 \times 0.90$) + `indie` ($1.0 \times 0.90$) | **3,80 pts (48%)** |
| **Par 3:** `user1_rodrigo` $\times$ `user2_gabriel` | `"rock"` | `1 pt` | `"rock"` ($w_{\text{Gabriel}} = 0.3 < 0.5$) | Único padrão em comum (`"rock"`) descartado pela poda temporal da BFS | **0,00 pts (0%)** |
| **Par 4:** `user2_gabriel` $\times$ `user4_lucas` | `"matue"`, `"rock"` | `2 pts` | `"matue"` ($0.2$) e `"rock"` ($0.3$) | Ambos os padrões descartados por estarem abaixo do limite de corte (`0.5`) | **0,00 pts (0%)** |

## 3. Benchmark de desempenho

- [x] Aho-Corasick e busca ingênua executados sobre os mesmos textos e dicionário
- [x] Tempo de execução comparado variando o tamanho do dicionário (ex.: 10, 50, 200 padrões)
- [x] Tempo de execução comparado variando o tamanho do texto de entrada
- [x] Resultados interpretados em relação ao ganho teórico esperado (O(n+m+z) vs. O(n·m))

**Tabela comparativa:**

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

**Interpretação dos resultados:**

1. **Comprovação prática da complexidade linear $O(n + m + z)$ do Aho-Corasick:** Analisando o cenário de texto grande (`100.000` caracteres), quando aumentamos o dicionário em 20 vezes (de `10` para `200` padrões), o tempo de varredura do Aho-Corasick permanece praticamente constante (`2,3607 ms` para 10 padrões, `2,8164 ms` para 50 padrões e `2,7765 ms` para 200 padrões). Isso ocorre porque, após o pré-processamento do autômato em $O(m)$, a busca (`search`) realiza exatamente uma única leitura de $n$ caracteres sobre o texto, independentemente da quantidade de padrões cadastrados na Trie.
2. **Crescimento multiplicativo $O(n \cdot m)$ da Busca Ingênua:** Na busca ingênua preparada na [Sprint 2](https://github.com/Pozo1/syncora_mobile/blob/main/docs_sprint/Grupo3_Sprint2.md), o algoritmo precisa revarrer o texto de tamanho $n$ para cada um dos padrões do dicionário. Como resultado, no texto de `100.000` caracteres, o tempo salta de `3,6946 ms` (10 padrões) para `16,6112 ms` (50 padrões) e atinge `62,3461 ms` (200 padrões) — tornando o Aho-Corasick **22,45x mais rápido** em textos longos e até **39,09x mais rápido** em textos de `1.000` caracteres com 200 padrões (`0,0232 ms` contra `0,9066 ms`).
3. **Empate técnico apenas para dicionários minúsculos ($k = 10$, $n = 1.000$):** Com apenas 10 padrões e 1.000 caracteres, ambas as abordagens levam ~`0,10 ms` (`0,99x`), pois o custo fixo de acesso às propriedades de objetos (`current.children[char]`) na Trie em JavaScript se equivale a 10 laços curtos em memória cache. À medida que o dicionário escala para 50 e 200 termos, a vantagem assintótica do autômato se torna massiva.

## 4. Sprint Review — checkpoint intermediário

**Incremento demonstrado ao PO (docente):**
Execução em terminal (`node src/algorithms/testRunner.js`) demonstrando o método `search(text)` sobre o mesmo autômato da Sprint 2, a extração exata de padrões e posições nos 3 textos da Sprint 1 e no caso de padrões sobrepostos (`"indie"`, `"rock"`, `"indie rock"`, `"kpop"`, `"pop"`), o cálculo do score refinado com pesos por categoria e poda BFS em memória para 4 pares de usuários, e a tabela de benchmark variando dicionário (10, 50, 200) e texto (1 KB, 10 KB, 100 KB).

**Feedback recebido:**
A professora validou a fidelidade ao autômato construído na Sprint 2 e a justificativa matemática do refinamento do score combinando pesos semânticos (Artista vs. Gênero) com a poda temporal da BFS, orientando o grupo a conectar esse motor ao fluxo do aplicativo e documentar as limitações na Sprint 4.

## 5. Scrum

- [x] Atualizações assíncronas semanais registradas
- [x] Board refletindo o estado real da Sprint

## 6. Diário de bordo (retrospectiva individual)

| Integrante | O que fiz nesta Sprint | Dificuldades | O que pretendo manter/ajustar |
|---|---|---|---|
| **Rodrigo Pozo** | Implementei a função de baseline da busca ingênua, estruturei o script de benchmark variando o dicionário (10, 50, 200 padrões) e o tamanho da entrada (1 KB a 100 KB) e refinei a fórmula de score unindo pesos de Artista/Gênero à poda temporal da BFS ([`src/algorithms/BFS.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/BFS.js)). | Estabilizar a medição de tempo em milissegundos no Node.js para entradas pequenas de 1.000 caracteres devido às otimizações dinâmicas da engine V8, o que resolvi aplicando *warmup* e média de repetições com `performance.now()`. | Manter os mesmos dados de benchmark consolidados nesta sprint para a documentação técnica final e focar na integração com o módulo do Syncora na Sprint 4. |
| **Gabriel Nascimento** | Implementei o método `search(text)` em [`src/algorithms/AhoCorasick.js`](https://github.com/Pozo1/syncora_mobile/blob/main/src/algorithms/AhoCorasick.js) utilizando o autômato da Sprint 2, validei a saída sobre os textos da Sprint 1 e criei a bateria de testes para padrões sobrepostos (`"indie rock"`, `"pop rock"`, `"kpop"`). | Ajustar o cálculo do índice inicial (`i - word.length + 1`) quando um mesmo nó emite múltiplos padrões de comprimentos diferentes herdados pelo ponteiro `fail`. | Manter a organização modular entre `AhoCorasick.js` e `BFS.js` para facilitar a demonstração ponta a ponta na entrega final da Sprint 4. |

---

## Rubrica de avaliação — Sprint 3 (nota de 0 a 4,0)

| Critério | Peso | O que caracteriza nota máxima | Nota atribuída | Observações |
|---|---|---|---|---|
| Implementação da busca | 1,0 | Goto/fail/output corretos; padrões sobrepostos tratados | | |
| Cálculo do score de compatibilidade | 0,5 | Regra aplicada e refinada com justificativa | | |
| Benchmark de desempenho | 1,5 | Comparação sistemática, variando dicionário e texto; interpretação ligada à teoria | | |
| Sprint Review / Scrum + diário | 1,0 | Incremento demonstrado; board e diário atualizados | | |
| **Nota final da Sprint 3** | **4,0** | | **___ / 4,0** | |
