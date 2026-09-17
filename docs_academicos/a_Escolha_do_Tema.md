# Etapa (a) — Escolha do Tema

> **Como preencher:** este documento deve ser preenchido **em conjunto pelo grupo**, mas com registro individualizado da contribuição de cada integrante. Substitua os campos entre `[ ]` pelas informações do seu grupo. Não apague as instruções em itálico — elas ajudam na avaliação do orientador.

---

## 1. Identificação do Grupo

| Campo | Informação |
| --- | --- |
| Curso / Disciplina | `[Ciência da Computação (6º Semestre) / Computabilidade e Complexidade de Algoritmos]` |
| Projeto de Pesquisa / IC | `[Projeto Syncora (Otimização do Algoritmo de Match Convencional)]` |
| Orientador(a) | `[Profa. Andreia]` |
| Data de entrega desta etapa | `[18/08/2026]` |
| Integrantes do grupo | `[Rodrigo Pozo Griecco, Gabriel Nascimento]` |

---

## 2. Tema Escolhido

**2.1 Área geral de interesse**
*Qual grande área do conhecimento/disciplina motivou a escolha (ex.: complexidade dos algoritmos, classes de problemas P, NP, Algoritmos Gulosos, Programação Dinâmica, Divisão e conquista)?*

> `[Complexidade de Algoritmos e Teoria dos Grafos.]`

**2.2 Tema delimitado (versão final)**
*Escreva o tema já delimitado, de forma específica — não o tema amplo. Lembre-se: o tema deve ser enunciado em 1 a 2 frases, como um assunto (ainda não é uma pergunta de pesquisa, isso vem na etapa "c").*

> **Tema:** `[O uso de uma arquitetura algorítmica híbrida combinando a máquina de estados finitos Aho-Corasick com a Busca em Largura (BFS) para otimizar a complexidade de tempo no funil de afinidade musical e no mapeamento de proximidade social do aplicativo Syncora.]`

**2.3 Do amplo ao específico**
*Mostre o raciocínio de delimitação — como vocês chegaram do tema amplo ao tema específico.*

| Tema amplo (ponto de partida) | Tema delimitado (ponto de chegada) |
| --- | --- |
| `[Complexidade de algoritmos aplicados a sistemas de recomendação em redes sociais.]` | `[Como estruturar um pipeline híbrido (Aho-Corasick + BFS) para garantir afinidade musical e proximidade social em tempo polinomial tratável?]` |

---

## 3. Justificativa da Escolha

**3.1 Relevância**
*Por que esse tema é importante ou atual? Para quem ele importa (academia, mercado, sociedade)?*

> `[O tema apresenta forte relevância prática para o desenvolvimento de software escalável. Unir a busca de padrões múltiplos em strings (Aho-Corasick) com a exploração de conexões em grafos (BFS) resolve a lentidão de processamento em bancos de dados relacionais. Para o mercado, entrega matches mais precisos e de forma instantânea, eliminando o problema de "cold start" (início frio) sem onerar a infraestrutura do servidor.]`

**3.2 Viabilidade**
*O grupo avaliou se tem tempo, recursos, acesso a dados/fontes e domínio mínimo do assunto para desenvolver esse tema até o fim do projeto?*

| Critério | Avaliação (Sim/Parcial/Não) | Observação |
| --- | --- | --- |
| Tempo disponível é suficiente | `[Sim]` | `[O escopo do funil híbrido cabe perfeitamente no semestre.]` |
| Há acesso a fontes/dados necessários | `[Sim]` | `[5 artigos chave já foram mapeados, baixados e fichados.]` |
| O grupo já tem domínio mínimo do tema | `[Sim]` | `[A lógica base do BFS (complexidade O(V+E)) já está funcional no app.]` |
| Recursos técnicos necessários estão disponíveis | `[Sim]` | `[Ambiente de desenvolvimento (Supabase e banco de dados) operante.]` |

**3.3 Originalidade / Não-redundância**
*O grupo verificou rapidamente (via um levantamento preliminar) se o tema já é excessivamente explorado ou se existe um ângulo próprio a ser explorado?*

> `[Sim. Em nossa pesquisa preliminar, notamos que a maioria dos trabalhos na área foca em filtragem colaborativa (fatorização de matrizes) ou Redes Neurais em Grafos (GNNs), métodos que possuem um custo computacional elevadíssimo. Nossa abordagem se diferencia por explorar uma via determinística e mais enxuta, unindo dois algoritmos clássicos para criar um funil de filtragem que protege a infraestrutura e garante baixa complexidade.]`

---

## 4. Validação com o Orientador

| Campo | Informação |
| --- | --- |
| Data da conversa/validação | `[18/08/2026]` |
| Tema aprovado pelo orientador? | `[Sim. Fui instruído a pensar sobre outros ambientes da infra, qual eu ainda não tinha pensado, para desta forma, validar o tema.]` |
| Observações ou ajustes solicitados pelo orientador | `[Estudar a dependência da API do Spotify e resolver o problema de gostos estáticos. Deve ser algo que se altera ao longo do tempo, para que o aplicativo colha dados e acompanhe essas mudanças sociais.]` |

---

## 5. Contribuição Individual dos Integrantes

> **Importante:** cada integrante deve descrever, com suas próprias palavras, o que efetivamente fez nesta etapa. Contribuições genéricas como "ajudei em tudo" não serão aceitas. Use verbos de ação e seja específico (ex.: "pesquisei 5 temas candidatos e apresentei prós/contras ao grupo").

### Integrante 1 — `[Rodrigo Pozo Griecco]`

* **O que fez nesta etapa:** `[Busquei os 5 artigos acadêmicos estruturais (incluindo o paper original de Aho & Corasick) e estruturei a análise crítica, descartando opções de altíssima complexidade computacional como GNNs. Formulei a lógica central da arquitetura híbrida para apresentar à professora. Validação da complexidade do BFS atual e adequação estrutural da nova proposta.]`
* **Tempo dedicado (aprox.):** `[6h]`
* **Evidência da contribuição** *(print de conversa, rascunho de e-mail, documento compartilhado etc.)*: `[Print da pasta de artigos organizados com os arquivos em PDF da pesquisa bibliográfica e documentação técnica (README) dos algoritmos.]` (Vou atribuir tudo a Notion)

### Integrante 2 — `[Gabriel Nascimento]`

* **O que fez nesta etapa:** `[Auxiliei na delimitação do tema com foco na infraestrutura de dados e na viabilidade técnica do projeto. Validei a complexidade de tempo O(V+E) do algoritmo BFS (Busca em Largura) já implementado no repositório, garantindo que o código base suportaria a integração com o Aho-Corasick. Também realizei o levantamento preliminar da dependência da API do Spotify, fundamental para responder ao questionamento da orientadora sobre o dinamismo das informações.]`
* **Tempo dedicado (aprox.):** `[4h]`
* **Evidência da contribuição:** `[Prints do repositório contendo a implementação prévia do BFS e rascunhos do mapeamento de rotas e resiliência da API do Spotify.]` (Vou atribuir tudo a Notion)


---

### 5.1 Quadro-resumo de participação

| Integrante | Contribuição principal | % estimado de participação nesta etapa |
| --- | --- | --- |
| `[Rodrigo Pozo Griecco]` | `[Pesquisa bibliográfica, descarte de modelos ineficientes e tese da arquitetura híbrida.]` | `[60%]` |
| `[Gabriel Nascimento]` | `[Validação da complexidade do BFS atual, adequação estrutural da nova proposta e análise de dependência de APIs externas.]` | `[40%]` |

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