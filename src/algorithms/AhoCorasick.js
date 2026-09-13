/**
 * Autômato de Aho-Corasick - Fases 1, 2 e 3 (Final)
 * Projeto Syncora (IC - Computabilidade e Complexidade de Algoritmos)
 * 
 * Motivação: Pré-processar as strings (gêneros e artistas do Spotify) 
 * garantindo complexidade de tempo linear O(N). Blinda o banco de dados contra
 * o gargalo do Regex e prepara o terreno para o BFS de recomendação rodar.
 */

class TrieNode {
  constructor() {
    this.children = {}; 
    this.fail = null;   
    this.output = [];   
  }
}

export class AhoCorasick {
  constructor() {
    this.root = new TrieNode(); 
  }

  /**
   * Fase 1: Constrói a Trie (Árvore de Prefixos) com as palavras-chave.
   */
  addKeyword(word) {
    let current = this.root;
    
    for (let char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char]; 
    }
    
    current.output.push(word);
  }

  /**
   * Fase 2: Constrói os ponteiros de falha usando Busca em Largura (BFS).
   */
  buildFailureLinks() {
    let queue = []; 

    for (let char in this.root.children) {
      let child = this.root.children[char];
      child.fail = this.root;
      queue.push(child);
    }

    while (queue.length > 0) {
      let current = queue.shift();

      for (let char in current.children) {
        let child = current.children[char];
        queue.push(child);

        let fallback = current.fail;
        while (fallback !== null && !fallback.children[char]) {
          fallback = fallback.fail;
        }

        child.fail = fallback ? fallback.children[char] : this.root;
        child.output = [...child.output, ...child.fail.output];
      }
    }
  }

  /**
   * Fase 3: A Varredura (Search) em Tempo Linear O(N).
   * Recebe o texto bruto e extrai todas as palavras-chave mapeadas,
   * utilizando os links de falha para nunca fazer backtracking.
   */
  search(text) {
    let current = this.root;
    let results = [];

    // Varre o texto caractere por caractere (sempre pra frente)
    for (let i = 0; i < text.length; i++) {
      let char = text[i];

      // Se não tem caminho e não estamos na raiz, usa o link de falha
      while (current !== null && !current.children[char]) {
        current = current.fail;
      }

      // Se caiu antes da raiz, volta pra raiz. Se achou caminho, avança.
      if (current === null) {
        current = this.root;
      } else {
        current = current.children[char];
      }

      // Se o nó atual tiver alguma palavra finalizada, capturamos o match!
      if (current.output.length > 0) {
        for (let word of current.output) {
          results.push({
            keyword: word,
            indexEncontrado: i - word.length + 1
          });
        }
      }
    }

    return results;
  }
}