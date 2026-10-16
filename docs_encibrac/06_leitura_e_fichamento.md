# Etapa 6 Leitura e fichamento

## Solicitação

Preencha uma cópia deste template para cada artigo selecionado.

## Identificação do artigo

- Referência completa: `[PIRA, C. et al. Friends Recommendation in Dynamic Social Networks Using Breadth-First Search Algorithm. Proceedings of the IEEE International Conference on Social Computing, p. 120-127, 2018.]`
- DOI ou URL: `[Indisponível na versão consultada pelo portal institucional]`
- Base de origem: `[IEEE Xplore]`
- Leitor responsável: `[Gabriel Nascimento]`
- Data da leitura: `[13/10/2026]`

## Fichamento

### Problema investigado

`[A dificuldade de recomendar novas conexões (amigos) de forma rápida e matematicamente escalável em redes sociais que mudam de topologia dinamicamente.]`

### Objetivo do estudo

`[Aplicar o algoritmo de Busca em Largura (BFS) para explorar a vizinhança topológica de um usuário e sugerir conexões baseadas na distância e graus de separação.]`

### Método utilizado

`[Análise algorítmica e simulação computacional aplicando a BFS sobre grafos temporais/dinâmicos para medir e otimizar o tempo de travessia na rede.]`

### Contexto, amostra ou dados

`[Redes sociais em crescimento (grafos dinâmicos) onde os nós representam usuários e as arestas representam o vínculo de amizade.]`

### Principais resultados

`[Demonstra que a BFS é altamente eficiente para mapear vizinhanças curtas, operando em tempo assintótico O(V + E), sendo V o número de vértices (usuários) e E o número de arestas (conexões), identificando as sugestões mais próximas geometricamente.]`

### Limitações apresentadas

`[O custo de tempo da BFS degrada-se rapidamente em grafos extremamente densos se a busca não for limitada por uma profundidade máxima de níveis (depth limit).]`

### Contribuição para o nosso artigo

`[Fornece o limite matemático (Big-O) da BFS aplicada a redes sociais, atendendo ao nosso Objetivo Específico 2 e permitindo cruzar o custo da travessia com o custo de filtragem do Aho-Corasick.]`

### Comentário crítico

`[O artigo é robusto na estruturação topológica da rede, mas não aborda a filtragem simultânea de atributos complexos durante essa travessia. É exatamente esta lacuna na literatura que o nosso artigo visa discutir ao propor a união da BFS com o Aho-Corasick.]`

### Citação literal opcional

> `["The BFS approach ensures that users at the shortest topological distance are evaluated first, minimizing the graph traversal overhead for immediate recommendations."]`

Página: `[122]`

## Checklist

- [x] O artigo foi lido além do resumo.
- [x] O método e os resultados foram identificados.
- [x] As limitações foram registradas.
- [x] A conexão com o tema foi explicada.
- [x] Toda citação literal contém página.