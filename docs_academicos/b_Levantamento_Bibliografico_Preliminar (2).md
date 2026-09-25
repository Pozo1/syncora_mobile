# Etapa (b) — Levantamento Bibliográfico

> **Como preencher:** este documento deve ser preenchido **em conjunto pelo grupo**, mas com registro individualizado da contribuição de cada integrante em cada passo. Substitua os campos entre `[ ]` pelas informações do seu grupo. Não apague as instruções em itálico — elas ajudam na avaliação do orientador.

---

## 1. Identificação do Grupo

| Campo | Informação |
|---|---|
| Curso / Disciplina | `Ciência da Computação (6º Semestre) / Computabilidade e Complexidade de Algoritmos` |
| Projeto de Pesquisa / IC | `Análise de Complexidade: Aho-Corasick e Busca em Largura (BFS) em Redes Dinâmicas` |
| Orientador(a) | `Profa. Andrea Ono Sakai` |
| Data de entrega desta etapa | `24/09/2026` |
| Integrantes do grupo | `Rodrigo Pozo Griecco, Gabriel Nascimento` |
| Tema (da etapa "a") | `Análise teórica da complexidade de tempo da arquitetura combinada do autômato Aho-Corasick com a Busca em Largura (BFS) aplicada à filtragem de nós em grafos dinâmicos, utilizando o aplicativo Syncora como cenário de estudo.` |

---

## FASE 1 — Planejamento da Busca

### Passo 1 — Pergunta de pesquisa e palavras-chave

**1.1 Problema/pergunta de pesquisa (versão de trabalho)**
*Ainda não precisa ser a versão final (isso vem na etapa "c"), mas deve orientar a busca desta fase.*

> `Como a complexidade computacional da associação entre o algoritmo de casamento de padrões Aho-Corasick e a travessia de grafos por Busca em Largura (BFS) se comporta teoricamente na filtragem de nós em redes temporais dinâmicas?`

**1.2 Conceitos-chave e sinônimos**
*Liste os conceitos centrais da pergunta e seus sinônimos, em português e inglês.*

| Conceito-chave | Sinônimos / termos relacionados (PT) | Sinônimos / termos relacionados (EN) |
|---|---|---|
| `Complexidade Computacional` | `Análise de Algoritmos, Tempo Polinomial, Notação Big-O` | `Algorithmic Complexity, Computational Time, Big-O Notation` |
| `Casamento de Padrões Múltiplos` | `Máquina de Estados, Autômatos Finitos, Aho-Corasick` | `String Matching, Finite Automata, Lexical Analysis` |
| `Travessia de Grafos Dinâmicos` | `Busca em Largura, Redes Temporais, Poda de Arestas` | `Breadth-First Search, BFS, Temporal Networks, Dynamic Graphs` |

---

### Passo 2 — Strings de busca

*Combine os termos do passo 1 com operadores booleanos (`AND`, `OR`, `NOT`). Use aspas para termos compostos e truncamento (`*`) quando a base permitir.*

| Nº | String de busca | Base(s) em que será usada | Elaborada por |
|---|---|---|---|
| 1 | `("Aho-Corasick" OR "string matching") AND ("computational complexity" OR "time complexity")` | `IEEE Xplore, ACM DL` | `Rodrigo Pozo Griecco` |
| 2 | `("breadth-first search" OR "BFS") AND ("dynamic graphs" OR "temporal networks")` | `IEEE Xplore` | `Gabriel Nascimento` |
| 3 | `("recommender systems" OR "social networks") AND ("graph traversal" OR "edge pruning")` | `Scopus` | `Rodrigo Pozo Griecco` |

---

### Passo 3 — Bases de dados escolhidas

*Selecione de 2 a 4 bases relevantes ao tema. Registre a justificativa — isso vai para a seção de metodologia do artigo/relatório de IC.*

| Base de dados | Por que foi escolhida | Responsável pela busca nesta base |
|---|---|---|
| `IEEE Xplore` | `Principal repositório de engenharia de software, essencial para o levantamento de análises formais de tempo de execução e complexidade Big-O de algoritmos de travessia.` | `Gabriel Nascimento` |
| `ACM Digital Library` | `Referência global em teoria da computação e estruturas de dados, fundamental para acessar o trabalho original de Aho e Corasick e literatura de autômatos finitos.` | `Rodrigo Pozo Griecco` |
| `Scopus` | `Base multidisciplinar necessária para cruzar a teoria de grafos dinâmicos com aplicações de decaimento temporal em redes.` | `Rodrigo Pozo Griecco` |

---

### Passo 4 — Critérios de inclusão e exclusão

**Critérios de inclusão:**
- `Estudos revisados por pares que detalhem a análise de complexidade computacional (O(N), O(V+E)) de algoritmos de grafos ou de casamento de padrões.`
- `Artigos publicados em veículos reconhecidos (IEEE, ACM, Elsevier) que possuam identificador DOI verificável.`
- `Trabalhos que abordem a estrutura matemática de redes temporais ou grafos dinâmicos (onde arestas perdem peso ou desaparecem com o tempo).`

**Critérios de exclusão:**
- `Artigos focados exclusivamente no desenvolvimento de aplicativos comerciais sem análise teórica da estrutura de dados.`
- `Estudos baseados em Redes Neurais em Grafos (GNNs) ou modelos estocásticos, por fugirem do escopo de algoritmos determinísticos em tempo polinomial.`
- `Referências não indexadas ou resumos estendidos sem a comprovação estrutural das classes de complexidade.`

---

## FASE 2 — Execução da Busca e Triagem

### Passo 5 — Execução das buscas e registro dos resultados

*Anote quantos resultados cada string trouxe em cada base (útil para o fluxograma tipo PRISMA, se o projeto exigir). Exporte as referências (BibTeX, RIS, CSV) para um gerenciador de referências.*

| Base | String usada (nº) | Data da busca | Nº de resultados | Executada por |
|---|---|---|---|---|
| `ACM DL` | `1` | `18/09/2026` | `312` | `Rodrigo Pozo Griecco` |
| `IEEE Xplore` | `2` | `18/09/2026` | `148` | `Gabriel Nascimento` |
| `Scopus` | `3` | `18/09/2026` | `205` | `Rodrigo Pozo Griecco` |

**Total de resultados brutos (soma de todas as buscas):** `665`

**Gerenciador de referências utilizado:** `Zotero`
**Formato de exportação:** `BibTeX`

---

### Passo 6 — Triagem por título e resumo (1ª filtragem)

*Leia apenas título e resumo de cada resultado. Classifique: incluir / excluir / dúvida. Remova duplicatas entre bases.*

| Item de controle | Quantidade |
|---|---|
| Total de resultados antes da triagem | `665` |
| Duplicatas removidas | `41` |
| Classificados como "Incluir" | `22` |
| Classificados como "Excluir" | `589` |
| Classificados como "Dúvida" | `13` |

**Como as dúvidas foram resolvidas?** *(ex.: discussão em grupo, consulta ao orientador)*
`Realizamos uma leitura dinâmica da metodologia dos 13 artigos. Descartamos 9 que focavam em otimização de hardware (GPU) para BFS, pois nosso escopo é a complexidade algorítmica teórica. Aprovamos 4 que abordavam a matemática de grafos com arestas temporais.`

---

### Passo 7 — Triagem por leitura completa (2ª filtragem)

*Para os artigos que passaram na primeira filtragem, leia introdução e conclusão. Aplique os critérios de inclusão/exclusão (passo 4) de forma mais rigorosa.*

| Item de controle | Quantidade |
|---|---|
| Total de artigos que entraram nesta filtragem | `26 (22 inclusões + 4 dúvidas resolvidas)` |
| Aprovados (conjunto definitivo para fichamento) | `5` |
| Excluídos nesta etapa | `21` |

**Principais motivos de exclusão nesta filtragem:**
- `Trabalhos que não apresentavam a notação assintótica de tempo no texto, focando apenas em resultados empíricos de desempenho comercial.`
- `Estudos de casamento de padrões que utilizavam aproximações heurísticas em vez de autômatos determinísticos.`

---

## 3. Lista Final de Artigos Selecionados (Conjunto Definitivo)

*Liste aqui os artigos que passaram por todas as filtragens e seguirão para o fichamento (etapa "j"). Referência completa no formato ABNT/APA definido pelo projeto.*

1. `AHO, A. V.; CORASICK, M. J. Efficient string matching: an aid to bibliographic search. Communications of the ACM, v. 18, n. 6, p. 333-340, 1975. DOI: 10.1145/360825.360855.`
2. `BEAMER, S.; ASANOVIĆ, K.; PATTERSON, D. Direction-optimizing breadth-first search. Em: Proceedings of the International Conference on High Performance Computing, Networking, Storage and Analysis (SC '12). IEEE, 2012. DOI: 10.1109/SC.2012.50.`
3. `HOLME, P.; SARAMÄKI, J. Temporal networks. Physics reports, v. 519, n. 3, p. 97-125, 2012. DOI: 10.1016/j.physrep.2012.03.001.`
4. `ADOMAVICIUS, G.; TUZHILIN, A. Toward the next generation of recommender systems: A survey of the state-of-the-art and possible extensions. IEEE Transactions on Knowledge and Data Engineering, v. 17, n. 6, p. 734-749, 2005. DOI: 10.1109/TKDE.2005.99.`
5. `NAVARRO, G. A guided tour to approximate string matching. ACM Computing Surveys (CSUR), v. 33, n. 1, p. 31-88, 2001. DOI: 10.1145/375360.375365.`

---

## 4. Contribuição Individual dos Integrantes

> **Importante:** cada integrante deve descrever, com suas próprias palavras, o que efetivamente fez em cada passo desta etapa. Contribuições genéricas como "ajudei em tudo" não serão aceitas. Use verbos de ação e seja específico (ex.: "executei a busca no IEEE Xplore com a string 2 e obtive 84 resultados; fiz a triagem por título/resumo de 40 desses").

### Integrante 1 — `Rodrigo Pozo Griecco`
- **Passo(s) em que atuou:** `Passos 1, 3, 5, 6 e 7`
- **O que fez em cada passo:** `Formulei a pergunta de pesquisa focando na análise teórica das métricas Big-O (passo 1). Conduzi as buscas nas bases ACM DL e Scopus utilizando as strings 1 e 3, exportando os resultados brutos para o Zotero (passo 5). Participei da filtragem por título, descartando aplicações estritamente comerciais. Gerei o arquivo de exportação BibTeX que comprova a rastreabilidade bibliográfica e o adicionei à pasta da disciplina no repositório.`
- **Tempo dedicado (aprox.):** `4h`
- **Evidência da contribuição** *(print de busca, planilha de triagem, exportação BibTeX, etc.)*: `Arquivo referencias_ic.bib e prints das buscas efetuadas na ACM DL devidamente commitados na pasta docs_academicos no GitHub.`

### Integrante 2 — `Gabriel Nascimento`
- **Passo(s) em que atuou:** `Passos 2, 4, 5, 6 e 7`
- **O que fez em cada passo:** `Estruturei as strings booleanas e defini os critérios de exclusão rigorosos para barrar artigos sobre o desenvolvimento prático de apps (passo 2 e 4). Executei a busca no IEEE Xplore usando a string 2 (focada em BFS e grafos dinâmicos), retornando 148 documentos. Li a metodologia dos 13 artigos em dúvida e verifiquei ativamente os DOIs dos 5 artigos finais aprovados para garantir conformidade com as exigências da banca.`
- **Tempo dedicado (aprox.):** `3,5h`
- **Evidência da contribuição:** `Planilha de triagem revisada e evidências de busca no portal IEEE Xplore armazenadas fisicamente na estrutura do repositório no GitHub.`

### 4.1 Quadro-resumo de participação por passo

| Passo | Responsável(is) | % estimado de participação de cada um |
|---|---|---|
| 1. Pergunta e palavras-chave | `Rodrigo e Gabriel` | `70% / 30%` |
| 2. Strings de busca | `Gabriel e Rodrigo` | `60% / 40%` |
| 3. Bases de dados | `Rodrigo e Gabriel` | `60% / 40%` |
| 4. Critérios de inclusão/exclusão | `Gabriel e Rodrigo` | `70% / 30%` |
| 5. Execução das buscas | `Rodrigo e Gabriel` | `50% / 50%` |
| 6. Triagem título/resumo | `Rodrigo e Gabriel` | `50% / 50%` |
| 7. Triagem texto completo | `Rodrigo e Gabriel` | `50% / 50%` |

### 4.2 Quadro-resumo geral de participação na etapa

| Integrante | % estimado de participação total nesta etapa |
|---|---|
| `Rodrigo Pozo Griecco` | `50%` |
| `Gabriel Nascimento` | `50%` |

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