# Etapa 5 Busca e triagem dos artigos

## Solicitação

Registre as buscas realizadas e justifique a inclusão ou exclusão de cada artigo.

## Registro das buscas

| Base | String usada | Data | Filtros | Resultados encontrados | Responsável |
|---|---|---|---|---:|---|
| `[ACM Digital Library]` | `["Aho-Corasick" AND ("time complexity" OR "Big-O")]` | `[13/10/2026]` | `[1970-2026, Inglês/Português]` | `[45]` | `[Rodrigo Pozo Griecco]` |
| `[IEEE Xplore]` | `[("Breadth-First Search" OR "BFS") AND "graph traversal"]` | `[13/10/2026]` | `[2016-2026, Inglês/Português]` | `[78]` | `[Gabriel Nascimento]` |
| `[Scopus]` | `["string matching" AND "dynamic graphs" AND "time complexity"]` | `[13/10/2026]` | `[2016-2026, Inglês/Português]` | `[32]` | `[Rodrigo Pozo Griecco]` |

## Resumo da triagem

- Total de resultados encontrados: `[155]`
- Duplicatas removidas: `[12]`
- Artigos avaliados por título e resumo: `[143]`
- Artigos selecionados para leitura completa: `[5]`
- Artigos incluídos no conjunto final: `[2]`

## Decisões

| Artigo | Título e resumo | Texto completo | Motivo da exclusão ou inclusão |
|---|---|---|---|
| `[Efficient String Matching: An Aid to Bibliographic Search (Aho & Corasick, 1975)]` | `[Incluir]` | `[Aprovar]` | `[Artigo base fundamental. Detalha a complexidade de tempo exata para correspondência múltipla de padrões.]` |
| `[Friends Recommendation in Dynamic Social Networks Using Breadth-First Search Algorithm (Pira et al., 2018)]` | `[Incluir]` | `[Aprovar]` | `[Aderente ao tema. Aborda a travessia do grafo dinâmico e organização da rede via BFS.]` |
| `[A Comprehensive Survey on Graph Neural Networks (Wu et al., 2020)]` | `[Excluir]` | `[Excluir]` | `[Artigo duplicado na triagem (encontrado na ACM e Scopus). Excluído na fase de resumo conforme protocolo.]` |
| `[LightGNN: Simple Graph Neural Network for Recommendation (Wang et al., 2023)]` | `[Incluir]` | `[Excluir]` | `[Foge do escopo da BFS, focando em Redes Neurais em Grafos (GNN) que exigem infraestrutura distinta.]` |
| `[Eliciting Auxiliary Information for Cold Start User Recommendation: A Survey (Sun et al., 2021)]` | `[Incluir]` | `[Excluir]` | `[Não aborda a complexidade de tempo do matching ou da travessia, focando exclusivamente no problema de Início Frio.]` |
| `[Application of Recommendation System on E-Learning Platform Using Content-Based Filtering with Jaccard Similarity (Lubis et al., 2020)]` | `[Incluir]` | `[Excluir]` | `[Ignora a topologia do grafo e a travessia BFS, utilizando apenas cálculo estatístico de similaridade de Jaccard.]` |

## Produto da etapa

Conjunto definitivo de artigos e registro das decisões.

## Checklist

- [x] Todas as buscas possuem data e string.
- [x] As duplicatas foram removidas.
- [x] Os critérios foram aplicados igualmente.
- [x] Toda exclusão possui justificativa.
- [x] Os artigos finais estão diretamente ligados ao problema.