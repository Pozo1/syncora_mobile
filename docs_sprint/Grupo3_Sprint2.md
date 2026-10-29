# Diário de Sprint 2 — Construção do autômato
**Período:** Semana 2
**Grupo / tema:** Grupo 3 — Aho-Corasick para compatibilidade musical no Syncora

**Equipe:** Grupo 3
**Integrantes:** Rodrigo Pozo Griecco, Gabriel Nascimento
**Scrum Master do Sprint:** Gabriel Nascimento
**Repositório GitHub:** [Repositório Syncora](https://github.com/Pozo1/syncora_mobile)

> O dicionário de padrões está **fechado na Sprint 1** e não muda aqui sem justificar. Esta sprint constrói o **trie** e a **função de falha** do autômato de Aho-Corasick. **Não há** busca em texto nem benchmark — isso é Sprint 3.

### Contrato desta sprint

| | Artefato | Origem / destino |
|---|---|---|
| **Entra** | Dicionário de padrões v1 | Sprint 1 — **não alterar sem registrar o motivo** |
| **Entra** | Formato do texto de entrada e exemplos | Sprint 1 |
| **Sai** | Trie construído a partir do dicionário | Sprint 3 |
| **Sai** | Função de falha implementada (BFS) | Sprint 3 **é obrigada a usar este autômato** |
| **Sai** | Testes unitários de construção do autômato | Sprint 3 |

**Não sai daqui:** busca no texto, cálculo de score, benchmark de desempenho.

- [x] Confirmei que o dicionário usado é exatamente o v1 da Sprint 1

---

## 1. Construção do trie

- [x] Estrutura de dados do trie implementada (nós, transições por caractere)
- [x] Cada padrão do dicionário inserido corretamente, com marcação de "fim de padrão" nos nós correspondentes
- [x] Trie testado manualmente com pelo menos 2 padrões, percorrendo o caminho esperado

**Descrição da estrutura implementada:**
A estrutura central foi implementada através de duas classes: `TrieNode` e `AhoCorasick`. Cada `TrieNode` armazena um mapa de transições para os filhos (`children`), um ponteiro de falha (`fail`) inicializado como nulo e um array de saídas (`output`). O método de inserção (`addKeyword`) itera letra por letra dos 20 padrões (fechados na Sprint 1), criando os nós necessários na memória com custo O(1) por caractere. No último caractere de cada padrão iterado, a string completa é adicionada ao array `output` do nó final correspondente, sinalizando o fim de uma palavra.

**Evidências (link do repositório/commit):** [src/algorithms/AhoCorasick.js](./src/algorithms/AhoCorasick.js)

## 2. Função de falha (failure links)

- [x] Função de falha calculada via BFS a partir da raiz
- [x] Links de falha corretos para pelo menos 3 nós verificados manualmente
- [x] Links de saída (output) agregados corretamente (um nó pode sinalizar mais de um padrão)

**Descrição do cálculo e verificação manual:**
A função de falha (`buildFailureLinks`) foi implementada utilizando uma Fila (`queue`) nativa, operando essencialmente um algoritmo de Busca em Largura (BFS). Inicialmente, todos os nós de profundidade 1 (filhos diretos da raiz) têm seu *fail* apontado para a própria raiz e entram na fila. Para os nós em níveis subsequentes (N > 1), o algoritmo resolve as transições percorrendo o ponteiro de falha do nó "pai" (*fallback*) até encontrar uma transição de caractere válida ou colidir com a raiz. Por fim, os arrays de `output` são unificados através de desestruturação (`[...child.output, ...child.fail.output]`), assegurando que sub-strings válidas contidas em padrões maiores não sejam ignoradas pelo motor.

## 3. Testes unitários de construção

- [x] Teste garantindo que todos os padrões do dicionário estão no trie
- [x] Teste garantindo que os failure links levam a estados coerentes (não perdem prefixos válidos)
- [x] Teste de caso de borda: padrão vazio ou padrão que é prefixo de outro

**Tabela de casos de teste:**

| Caso | O que verifica | Resultado obtido | Passou? |
|---|---|---|---|
| Inserção de Dicionário $O(m)$ | Se os 20 padrões da Sprint 1 foram alocados na memória do TrieNode. | Árvore corretamente populada; extremidades contêm `output.length > 0`. | Sim |
| Roteamento de Backtracking | Se o processamento BFS garante que o nível $N$ herde os *failure links* já resolvidos do nível $N-1$. | O processamento da Fila vinculou os ponteiros sem gerar loops infinitos. | Sim |
| Agregação de Sub-strings | Se uma string (ex: "pop") inserida após "indie pop" transmite sua saída ao ser atingida via *fail link*. | Arrays unificados com sucesso; o nó dispara as múltiplas compatibilidades. | Sim |

## 4. Preparação da busca ingênua (baseline)

- [x] Implementação simples de busca padrão a padrão (ex.: `.find()`/regex por padrão) preparada, para servir de baseline no benchmark da Sprint 3
- [x] Testada sobre os mesmos exemplos de texto da Sprint 1

**Descrição da busca ingênua preparada:**
Para a base de comparação do Benchmark na Sprint 3, estruturamos logicamente uma busca iterativa ingênua (Native Brute-Force). O processo consome um loop iterando nos 20 padrões do dicionário e, para cada iteração, executa uma validação (`texto.includes(padrao)` ou `Regex`) percorrendo toda a *string* do mock extraída do Spotify. Essa base será utilizada para demonstrar e comprovar matematicamente para a banca a ineficiência de um limite assintótico $O(n \cdot m)$ frente ao modelo em tempo linear que desenhamos com autômatos.

## 5. Scrum

- [x] Atualizações semanais no board
- [x] Board refletindo o estado real

**Link do board:** [https://github.com/users/Pozo1/projects/3](https://github.com/users/Pozo1/projects/3)

## 6. Diário de bordo (retrospectiva individual)

| Integrante | O que fiz nesta Sprint | Dificuldades | O que pretendo manter/ajustar |
|---|---|---|---|
| Rodrigo Pozo | Modelei a classe `TrieNode` e mapeei a alocação de complexidade espacial da árvore, além de desenhar o baseline da Busca Ingênua. | Conseguir visualizar mentalmente o crescimento da alocação de nós filhos na memória do JavaScript. | Manter a rotina de ilustrar a máquina de estados num quadro em branco antes de avançar para a fase de varredura. |
| Gabriel Nascimento | Escrevi o algoritmo de `buildFailureLinks` utilizando a estrutura Queue para estabelecer a BFS como motor da máquina de estados. | Garantir a lógica de concatenação dos arrays de output pelo ponteiro de *fail* sem sobrescrever regras. | Seguir disciplinado em relação ao escopo, sem pular para a fase de *search* até que os links matemáticos estejam perfeitamente provados. |

---

## Rubrica de avaliação — Sprint 2 (nota de 0 a 4,0)

| Critério | Peso | O que caracteriza nota máxima | Nota atribuída | Observações |
|---|---|---|---|---|
| Construção do trie | 1,0 | Todos os padrões inseridos corretamente; estrutura verificada manualmente | | |
| Função de falha | 1,5 | BFS correta; links verificados; outputs agregados corretamente | | |
| Testes unitários de construção | 1,0 | Casos cobrindo padrões, failure links e bordas | | |
| Scrum + diário de bordo | 0,5 | Board com histórico; diário reflexivo de todos | | |
| **Nota final da Sprint 2** | **4,0** | | **___ / 4,0** | |