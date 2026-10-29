# Etapa 8 Redação do artigo

## Solicitação

Escreva a primeira versão completa do artigo seguindo a estrutura abaixo.

# Título

INTEGRANDO AHO-CORASICK EM GRAFOS DINÂMICOS: ANÁLISE DA COMPLEXIDADE DE TEMPO NA FILTRAGEM MÚLTIPLA DE ATRIBUTOS[cite: 6]

## Palavras-chave

Aho-Corasick; Busca em Largura; Complexidade assintótica[cite: 6]

## Introdução

A expansão de redes sociais dinâmicas exige algoritmos capazes de sugerir conexões relevantes com custo computacional rigorosamente controlado[cite: 6]. Em cenários caracterizados pela escassez ou ausência de dados históricos (*cold start*), a literatura demonstra a evolução para mitigar falhas, do uso de grafos a modelos pesados de linguagem[cite: 6]. O problema central deste trabalho é quantificar a complexidade assintótica de tempo ao integrar a máquina de Aho-Corasick com a busca em largura (BFS) na filtragem de atributos, dispensando o uso de GNNs ou aceleração de hardware (GPU)[cite: 6]. O objetivo é analisar essa fusão teórica para fornecer alternativas escaláveis de busca em tempo linear[cite: 6].

## Metodologia

Realizou-se uma revisão bibliográfica narrativa cuja busca foi conduzida nas bases ACM Digital Library, IEEE Xplore e Scopus[cite: 6]. Os critérios de inclusão selecionaram artigos nos idiomas em inglês que abordassem otimização de autômatos, algoritmos de grafos estritos (BFS) e métodos para mitigar *cold start* em recomendação estrutural[cite: 6].

## Revisão da literatura

### Custo assintótico da correspondência múltipla de padrões na filtragem de atributos

A verificação sequencial ingênua de $m$ padrões em um texto de comprimento $n$ incorre em um custo inadequado de $O(n \cdot m)$[cite: 6]. A superação desse gargalo é viabilizada pelo autômato de Aho-Corasick, que utiliza uma árvore Trie e transições *goto*, *failure* e *output* para garantir correspondência múltipla em tempo linear de $O(n+m+z)$[cite: 6]. Recentes otimizações via autômatos Double-Array (DAAC) demonstraram que gerenciar a disposição de memória reduz falhas de cache L3 e otimiza o casamento de padrões[cite: 6].

### Eficiência da BFS na travessia e otimização topológica

No contexto de travessia em redes não direcionadas, a BFS é amplamente reconhecida como o algoritmo mais eficiente para explorar vizinhanças curtas[cite: 6]. Com complexidade de tempo travada em $O(V + E)$, ela assegura o controle de proximidade e prioriza amizades mútuas sem a dependência de dados prévios[cite: 6]. Na literatura recente de autômatos de produto (*Product Graphs*), a BFS também otimiza a avaliação de caminhos rotulados de forma sensível ao tamanho da saída[cite: 6].

### Síntese crítica

Embora a literatura avance na poda de GNNs (LightGNN) e na otimização isolada de memória para autômatos, ela permanece estritamente fragmentada ao lidar com a filtragem textual e a navegação estrutural[cite: 6]. A convergência de métodos leves é uma tendência clara, mas a lacuna reside na inovação teórica de utilizar a BFS internamente no cálculo de *failure links* da Trie, e não apenas para explorar vértices da rede externa[cite: 6].

## Considerações finais

Em conclusão, a integração das propriedades da árvore Trie, das transições de falha e da travessia em níveis da BFS apresenta uma solução teórica robusta para reduzir gargalos computacionais[cite: 6]. Essa fusão oferece fundamentos para a filtragem simultânea de atributos em grafos dinâmicos[cite: 6]. As limitações recaem sobre a ausência de implementações focadas em redes hiperescaláveis, sugerindo como implicação futura o desenvolvimento de arquiteturas de *software* aplicadas a produção que comprovem esses limites de tempo.

## Resumo

A expansão de redes sociais dinâmicas exige algoritmos com custo computacional rigorosamente controlado[cite: 6]. O objetivo deste trabalho é analisar o impacto na complexidade de tempo assintótica resultante da integração do autômato de Aho-Corasick e da BFS na filtragem múltipla de atributos[cite: 6]. Metodologicamente, realizou-se uma revisão bibliográfica narrativa (ACM, IEEE, Scopus)[cite: 6]. Os achados indicam que enquanto a busca ingênua incorre em gargalo $O(n \cdot m)$, o Aho-Corasick provê tempo linear $O(n+m+z)$[cite: 6]. Conclui-se que a literatura aborda autômatos e grafos de forma fragmentada, existindo forte potencial para integrar a BFS no cálculo dos *failure links* visando filtragens textuais escaláveis em redes[cite: 6].

## Referências

ABDULLAH, Nor Aniza; RASHEED, Rasheed Abubakar; NASIR, Mohd Hairul Nizam Md.; RAHMAN, Md Mujibur. Eliciting Auxiliary Information for Cold Start User Recommendation: A Survey. Applied Sciences, Basel, v. 11, n. 20, art. 9608, p. 1-31, out. 2021. DOI: https://doi.org/10.3390/app11209608.[cite: 6]
ABO KHAMIS, Mahmoud; KARA, Ahmet; OLTEANU, Dan; SUCIU, Dan. Output-sensitive evaluation of regular path queries. Proceedings of the ACM on Management of Data, v. 3, n. 2, art. 105, p. 1–20, 2025. DOI: 10.1145/3725242.[cite: 6]
AHO, Alfred Vaino; CORASICK, Margaret Jean. Efficient String Matching: An Aid to Bibliographic Search. Communications of the ACM, New York, v. 18, n. 6, p. 333-340, jun. 1975. DOI: https://doi.org/10.1145/360825.360855.[cite: 6]
CHEN, Guoxuan; XIA, Lianghao; HUANG, Chao. LightGNN: Simple Graph Neural Network for Recommendation. In: ACM INTERNATIONAL CONFERENCE ON WEB SEARCH AND DATA MINING (WSDM), 18., 2025, Hannover. New York: ACM, 2025. p. 1-10. DOI: https://doi.org/10.1145/3701551.3703562.[cite: 6]
KANDA, Shunsuke; AKABE, Koichi; ODA, Yusuke. Engineering faster double-array Aho–Corasick automata. Software: Practice and Experience, v. 53, n. 6, p. 1332–1361, 2023. DOI: 10.1002/spe.3190.[cite: 6]
PIRA, Rigon; DOMI, Jeta; QEHAJA, Besnik; HAJRIZI, Edmond. Friends Recommendation in Dynamic Social Networks Using Breadth-First Search Algorithm. In: IEEE INTERNATIONAL CONFERENCE ON SOCIAL COMPUTING, 2018. [S. l.]: IEEE, 2018. p. 120-127. DOI: https://doi.org/10.1109/SocialCom.2018.00024.[cite: 6]
ZHANG, Weizhi et al. Cold-start recommendation towards the era of large language models (LLMs): a comprehensive survey and roadmap. arXiv, 2025. Preprint. DOI: 10.48550/arXiv.2501.01945.[cite: 6]

## Checklist

- [x] A introdução termina com o objetivo.
- [x] A metodologia descreve o processo realmente realizado.
- [x] A revisão compara os artigos.
- [x] A conclusão responde ao problema.
- [x] O resumo representa o texto completo.