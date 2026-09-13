/**
 * Algoritmo de Busca em Largura (BFS) com Poda Temporal (Time-Decay)
 * Projeto Syncora (IC - Computabilidade e Complexidade de Algoritmos)
 * 
 * Motivação: Percorrer o grafo de afinidade musical em complexidade O(V+E).
 * Este algoritmo lê as arestas geradas pela tabela 'taste_edges' e ignora sumariamente
 * as conexões cujo peso (affinity_score) caiu com o tempo, resolvendo o problema
 * de "gostos estáticos" sem onerar o processador.
 */

export class MatchBFS {
  constructor(grafoOriginal) {
    // Na integração final, esse grafo será alimentado com os dados do Supabase
    this.grafo = grafoOriginal;
  }

  /**
   * Varre a rede para encontrar perfis compatíveis.
   * @param {string} usuarioRaizId - O ID do usuário logado que está buscando matches
   * @param {number} limiteDecay - Peso mínimo da aresta (padrão: 0.5). Abaixo disso, o gosto "apodreceu".
   */
  encontrarMatches(usuarioRaizId, limiteDecay = 0.5) {
    let fila = [usuarioRaizId]; // A fila (Queue) é a estrutura de dados base do BFS
    let visitados = new Set();  // Set garante tempo de busca O(1) para verificar se já visitou o nó
    
    visitados.add(usuarioRaizId);
    let recomendacoes = [];

    while (fila.length > 0) {
      // Retira o primeiro usuário da fila
      let nóAtual = fila.shift();
      
      // Busca todas as conexões (arestas) deste usuário no grafo
      let arestas = this.grafo[nóAtual] || [];

      for (let aresta of arestas) {
        // A MÁGICA DO TIME-DECAY: A Poda de Arestas (Edge Pruning)
        // Se a afinidade caiu abaixo do limite, ignoramos esse caminho.
        if (aresta.peso < limiteDecay) {
          continue; 
        }

        let idVizinho = aresta.destino;

        // Se o vizinho tem uma conexão forte e ainda não foi visitado, entra na fila
        if (!visitados.has(idVizinho)) {
          visitados.add(idVizinho);
          fila.push(idVizinho);
          
          // Se não for o próprio usuário, é um match em potencial!
          if (idVizinho !== usuarioRaizId) {
            recomendacoes.push(idVizinho);
          }
        }
      }
    }

    return recomendacoes;
  }
}