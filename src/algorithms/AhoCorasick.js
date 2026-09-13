/**
 * Autômato de Aho-Corasick - Fase 1
 * Projeto Syncora (IC - Computabilidade e Complexidade de Algoritmos)
 * 
 * Motivação: Pré-processar as strings (gêneros e artistas do Spotify) 
 * garantindo complexidade de tempo linear $O(N)$. Isso blinda o banco
 * de dados contra o gargalo do Regex (que tem pior caso O(N*M)) e
 * prepara o terreno limpo para o BFS rodar.
 */

class TrieNode {
  constructor() {
    this.children = {}; // Mapeia as próximas letras (nós filhos da árvore)
    this.fail = null;   // Ponteiro de falha (Failure Link) - crucial para evitar o backtracking
    this.output = [];   // Guarda a keyword completa (ex: "Indie Rock") quando chega no final do ramo
  }
}

export class AhoCorasick {
  constructor() {
    this.root = new TrieNode(); // Inicia a árvore com um nó raiz vazio
  }

  /**
   * Constrói a Trie (Árvore de Prefixos) com as palavras-chave do Spotify.
   * Custo computacional: $O(M)$, onde M é o tamanho da palavra que estamos inserindo.
   */
  addKeyword(word) {
    let current = this.root;
    
    // Desce na árvore letra por letra. Se a letra não existir no caminho, cria o nó.
    for (let char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char]; // Pula para a próxima letra
    }
    
    // Chegou na última letra da palavra, então carimbamos o nó como uma saída válida
    current.output.push(word);
  }

  // TODO: Implementar a construção dos links de falha (Etapa 2)
  // TODO: Implementar a busca no texto do usuário em tempo linear (Etapa 3)
}