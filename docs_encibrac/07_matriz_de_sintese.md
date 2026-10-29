# Etapa 7 Matriz de síntese e organização da revisão

## Solicitação

Compare os artigos e organize a revisão por temas ou eixos. Não produza apenas uma sequência de resumos.

## Eixos da revisão

1. Custo assintótico da correspondência múltipla de padrões na filtragem de atributos[cite: 6].
2. Eficiência da BFS na travessia e otimização topológica de vizinhanças[cite: 6].
3. Lacuna teórica na fusão de autômatos e grafos[cite: 6].

## Matriz de síntese

| Eixo | Artigos relacionados | Convergências | Divergências | Limitações | Lacunas |
|---|---|---|---|---|---|
| Custo assintótico e filtragem de atributos[cite: 6] | Aho; Corasick (1975); Kanda; Akabe; Oda (2023)[cite: 6] | Uso de autômatos (Trie) reduz drasticamente o tempo de busca frente à solução ingênua[cite: 6]. | DAAC foca em otimizar falhas de cache L3 em memória, enquanto a estrutura original foca na matemática do autômato[cite: 6]. | A superação do custo $O(n \cdot m)$ limita-se a textos puros e estáticos, sem topologia[cite: 6]. | Falta de aplicação direta do autômato em atributos distribuídos numa rede dinâmica[cite: 6]. |
| Eficiência da BFS em vizinhanças[cite: 6] | Pira et al. (2018); Abo Khamis et al. (2025)[cite: 6] | BFS é a estrutura mais eficiente para exploração por níveis sem depender de modelos pesados[cite: 6]. | Pira foca na proximidade social genérica, enquanto Abo Khamis foca em avaliação sensível à saída (*output-sensitive*) em autômatos de produto[cite: 6]. | Dependência exclusiva de propriedades topológicas (amizades mútuas)[cite: 6]. | Ausência de integração da travessia estrutural $O(V+E)$ com a filtragem de atributos profundos nos nós[cite: 6]. |
| Fusão de autômatos e grafos[cite: 6] | Abdullah et al. (2021); Zhang et al. (2025); Chen; Xia; Huang (2025)[cite: 6] | Necessidade urgente de algoritmos leves e escaláveis para resolver problemas estruturais (como o *cold start*)[cite: 6]. | Algumas correntes tentam podar GNNs (LightGNN), outras utilizam LLMs pesados[cite: 6]. | Soluções estritamente fragmentadas: ou otimizam a rede neural ou navegam em grafos[cite: 6]. | Inexistência de uma síntese unificada que funda os *failure links* da Trie com a BFS do grafo[cite: 6]. |

## Roteiro da revisão da literatura

### Eixo 1

- Ideia principal: O gargalo computacional da busca simultânea de atributos textuais internos aos nós, superando o custo inadequado de $O(n \cdot m)$[cite: 6].
- Evidências que serão usadas: A árvore Trie e as funções *goto, failure* e *output* (Aho; Corasick, 1975) que garantem tempo linear $O(n+m+z)$, e a otimização de memória DAAC (Kanda et al., 2023)[cite: 6].
- Comparação entre estudos: O autômato clássico provê a base matemática[cite: 6], enquanto o estudo recente DAAC comprova a eficiência em nível de hardware (cache L3)[cite: 6].
- Ligação com o problema: Justifica a base do motor de recomendação textual para atributos múltiplos sem gerar estrangulamento de servidor[cite: 6].

### Eixo 2

- Ideia principal: Travessia e otimização topológica em redes sociais dinâmicas utilizando BFS sob complexidade $O(V + E)$[cite: 6].
- Evidências que serão usadas: Eficiência da BFS para vizinhanças curtas (Pira et al., 2018) e em autômatos de produto (Abo Khamis et al., 2025)[cite: 6].
- Comparação entre estudos: Aplicação em redes não direcionadas para sugerir amizades *versus* consultas complexas em grafos orientados à saída (*output-sensitive*)[cite: 6].
- Ligação com o problema: Estabelece o algoritmo estrutural de navegação que será fundido à árvore Trie[cite: 6].

## Síntese crítica provisória

A literatura atual aponta uma forte tendência na busca por alternativas leves e escaláveis em detrimento de modelos pesados de *Deep Learning* (GNNs e LLMs) para resolver problemas em redes sociais dinâmicas[cite: 6]. Contudo, há uma divergência estrutural: os estudos abordam a filtragem de cadeias de caracteres (via autômatos) e a navegação topológica (via BFS) de maneira estritamente fragmentada[cite: 6]. A grande lacuna teórica a ser preenchida é a ausência de uma síntese unificada que integre a BFS não apenas na exploração do grafo externo, mas no cálculo interno dos *failure links* do Aho-Corasick, permitindo varredura de atributos e conexões simultaneamente[cite: 6].

## Checklist

- [x] Os artigos foram agrupados por ideias.
- [x] Há comparações entre estudos.
- [x] As divergências foram registradas.
- [x] As lacunas são específicas e sustentadas pelas leituras.