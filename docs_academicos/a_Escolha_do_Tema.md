# Etapa (a) — Escolha do Tema

> **Como preencher:** este documento deve ser preenchido **em conjunto pelo grupo**, mas com registro individualizado da contribuição de cada integrante. Substitua os campos pelas informações do seu grupo. Não apague as instruções em itálico — elas ajudam na avaliação do orientador.

---

## 1. Identificação do Grupo

| Campo | Informação |
| --- | --- |
| Curso / Disciplina | `Ciência da Computação (6º Semestre) / Computabilidade e Complexidade de Algoritmos` |
| Projeto de Pesquisa / IC | `Análise de Complexidade: Aho-Corasick e Busca em Largura (BFS) em Redes Dinâmicas` |
| Orientador(a) | `Profa. Andrea Ono Sakai` |
| Data de entrega desta etapa | `24/09/2026` |
| Integrantes do grupo | `Rodrigo Pozo Griecco, Gabriel Nascimento` |

---

## 2. Tema Escolhido

**2.1 Área geral de interesse**
*Qual grande área do conhecimento/disciplina motivou a escolha (ex.: complexidade dos algoritmos, classes de problemas P, NP, Algoritmos Gulosos, Programação Dinâmica, Divisão e conquista)?*

> `Complexidade de Algoritmos e Teoria dos Grafos.`

**2.2 Tema delimitado (versão final)**
*Escreva o tema já delimitado, de forma específica — não o tema amplo. Lembre-se: o tema deve ser enunciado em 1 a 2 frases, como um assunto (ainda não é uma pergunta de pesquisa, isso vem na etapa "c").*

> **Tema:** `Análise teórica da complexidade de tempo (Notação Big-O) na aplicação conjunta do autômato finito Aho-Corasick com a Busca em Largura (BFS) para travessia e filtragem de arestas em redes temporais dinâmicas.`

**2.3 Do amplo ao específico**
*Mostre o raciocínio de delimitação — como vocês chegaram do tema amplo ao tema específico.*

| Tema amplo (ponto de partida) | Tema delimitado (ponto de chegada) |
| --- | --- |
| `Complexidade de algoritmos de travessia e busca em estruturas de dados.` | `Como a complexidade assintótica se comporta na integração teórica do autômato Aho-Corasick com BFS na filtragem de grafos temporais?` |

---

## 3. Justificativa da Escolha

**3.1 Relevância**
*Por que esse tema é importante ou atual? Para quem ele importa (academia, mercado, sociedade)?*

> `O tema é central para a teoria da computação, pois a validação de algoritmos em tempo polinomial tratável é o maior desafio em grafos onde as arestas mudam ao longo do tempo (redes dinâmicas). A literatura carece de análises formais sobre a união de máquinas de estado eficientes (Aho-Corasick) com buscas cegas (BFS) para mitigar a explosão combinatória, tornando a pesquisa academicamente relevante para o mapeamento de classes de complexidade.`

**3.2 Viabilidade**
*O grupo avaliou se tem tempo, recursos, acesso a dados/fontes e domínio mínimo do assunto para desenvolver esse tema até o fim do projeto?*

| Critério | Avaliação (Sim/Parcial/Não) | Observação |
| --- | --- | --- |
| Tempo disponível é suficiente | `Sim` | `O escopo teórico de análise cabe no semestre letivo.` |
| Há acesso a fontes/dados necessários | `Sim` | `Levantamento bibliográfico concluído com artigos reais indexados nas bases IEEE e ACM.` |
| O grupo já tem domínio mínimo do tema | `Sim` | `Domínio formal da notação O(V+E) e dos fundamentos matemáticos de autômatos.` |
| Recursos técnicos necessários estão disponíveis | `Sim` | `Ambiente de versionamento (GitHub) e repositórios acadêmicos estruturados e operantes.` |

**3.3 Originalidade / Não-redundância**
*O grupo verificou rapidamente (via um levantamento preliminar) se o tema já é excessivamente explorado ou se existe um ângulo próprio a ser explorado?*

> `Sim. A maioria das pesquisas na área foca em heurísticas ou GNNs para recomendação em grafos estáticos. O nosso recorte analítico determinístico sobre redes dinâmicas oferece um viés puramente matemático e algorítmico, fugindo de abordagens comerciais convencionais.`

---

## 4. Validação com o Orientador

| Campo | Informação |
| --- | --- |
| Data da conversa/validação | `17/09/2026` |
| Tema aprovado pelo orientador? | `Sim, mediante adequação de escopo.` |
| Observações ou ajustes solicitados pelo orientador | `A professora determinou que a pesquisa deve focar estritamente na análise bibliográfica e matemática da complexidade de Aho-Corasick e BFS, isolando o projeto do desenvolvimento prático do aplicativo Syncora.` |

---

## 5. Contribuição Individual dos Integrantes

> **Importante:** cada integrante deve descrever, com suas próprias palavras, o que efetivamente fez nesta etapa. Contribuições genéricas como "ajudei em tudo" não serão aceitas. Use verbos de ação e seja específico (ex.: "pesquisei 5 temas candidatos e apresentei prós/contras ao grupo").

### Integrante 1 — `Rodrigo Pozo Griecco`

* **O que fez nesta etapa:** `Redigi a justificativa teórica focada na relevância matemática da pesquisa e estruturei a pergunta de pesquisa central, removendo elementos de escopo comercial ou de desenvolvimento de software que invalidavam a viabilidade acadêmica.`
* **Tempo dedicado (aprox.):** `3h`
* **Evidência da contribuição** *(print de conversa, rascunho de e-mail, documento compartilhado etc.)*: `Commits no repositório GitHub contendo a formulação inicial e as correções de viabilidade exigidas pela banca (arquivos localizados na pasta docs_academicos).`

### Integrante 2 — `Gabriel Nascimento`

* **O que fez nesta etapa:** `Delimitei o recorte da teoria dos grafos, definindo o foco nas redes dinâmicas/temporais e validei a adequação da notação Big-O estrutural da Busca em Largura (BFS) no contexto teórico da pesquisa.`
* **Tempo dedicado (aprox.):** `3h`
* **Evidência da contribuição:** `Commits no repositório GitHub com a validação do escopo teórico e ajustes de originalidade incorporados na documentação final.`

---

### 5.1 Quadro-resumo de participação

| Integrante | Contribuição principal | % estimado de participação nesta etapa |
| --- | --- | --- |
| `Rodrigo Pozo Griecco` | `Reestruturação do problema de pesquisa e elaboração da justificativa teórica.` | `50%` |
| `Gabriel Nascimento` | `Definição do recorte de avaliação em redes dinâmicas e viabilidade algorítmica.` | `50%` |

*A soma das porcentagens deve ser igual a 100%. Divergências de percepção sobre a participação devem ser discutidas em grupo antes do envio — o orientador pode solicitar esclarecimentos individuais em caso de disparidade relevante.*

---

## 6. Checklist Final da Etapa

* [x] Tema delimitado redigido em 1-2 frases
* [x] Justificativa de relevância escrita
* [x] Viabilidade avaliada pelo grupo
* [x] Verificação preliminar de originalidade realizada
* [x] Tema validado com o orientador
* [x] Contribuição individual de cada integrante registrada
* [x] Quadro-resumo de participação preenchido (soma = 100%)