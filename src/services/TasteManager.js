/**
 * Gerenciador de Afinidades Musicais (TasteManager)
 * Projeto Syncora (IC - Computabilidade e Complexidade de Algoritmos)
 * 
 * Motivação: Alimentar a tabela 'taste_edges' de forma dinâmica.
 * Intercepta a música atual do usuário, extrai tags via Aho-Corasick em O(N)
 * e aplica o decaimento temporal (time-decay) reduzindo o peso de gêneros ociosos.
 */

import { supabase } from './supabaseClient';
// Ajuste o caminho de importação conforme a estrutura real das suas pastas
import { AhoCorasick } from '../algorithms/AhoCorasick'; 

class TasteManagerService {
  constructor() {
    this.ac = new AhoCorasick();
    this.isInitialized = false;
  }

  /**
   * Alimenta o autômato com o dicionário de palavras-chave.
   * Na vida real, isso viria de uma tabela de gêneros, mas para a IC
   * usamos um dicionário estático para demonstrar a extração linear.
   */
  initAutomaton() {
    if (this.isInitialized) return;
    
    const tags = [
      "rock", "trap", "pop", "indie", "sertanejo", "eletronica", 
      "the weeknd", "funk", "mpb", "hip hop", "rap", "r&b"
    ];
    
    tags.forEach(tag => this.ac.addKeyword(tag));
    this.ac.buildFailureLinks(); // Constrói a árvore para evitar backtracking
    
    this.isInitialized = true;
  }

  /**
   * Processa a música atual e atualiza a rede de grafos no Supabase.
   * @param {string} userId - UUID interno do perfil do usuário
   * @param {string} trackName - Título da música
   * @param {string} artistName - Nome do artista
   */
  async updateTasteGraph(userId, trackName, artistName) {
    if (!userId || !trackName || trackName === "Pausado") return;
    
    this.initAutomaton();

    // 1. Limpa e junta o texto sujo que veio da API do Spotify
    const rawText = `${trackName} ${artistName}`.toLowerCase();
    
    // 2. Extração O(N) das tags matemáticas
    const matches = this.ac.search(rawText);
    
    // Se não encontrou nenhuma tag mapeada, aborta para não onerar o banco
    if (matches.length === 0) return;

    // Remove tags duplicadas caso a string gere repetições
    const extractedTags = [...new Set(matches.map(m => m.keyword))];

    try {
      // 3. APLICAÇÃO DO TIME-DECAY
      // Busca todas as arestas de gosto atuais do usuário
      const { data: currentEdges } = await supabase
        .from('taste_edges')
        .select('*')
        .eq('user_id', userId);

      if (currentEdges && currentEdges.length > 0) {
        for (let edge of currentEdges) {
          // Se for um gosto antigo (que não está tocando agora), apodrece o peso em 10%
          if (!extractedTags.includes(edge.taste_keyword)) {
            const newScore = Math.max(0, edge.affinity_score - 0.1); 
            await supabase
              .from('taste_edges')
              .update({ affinity_score: newScore })
              .eq('id', edge.id);
          }
        }
      }

      // 4. RENOVAÇÃO DO GRAFO (UPSERT)
      // As tags que ele está ouvindo agora vão direto para o peso máximo (1.0)
      for (let tag of extractedTags) {
         const { data: existingEdge } = await supabase
           .from('taste_edges')
           .select('id')
           .eq('user_id', userId)
           .eq('taste_keyword', tag)
           .single();

         if (existingEdge) {
           // Gosto já existe no banco: apenas "ressuscita" o peso para 1.0
           await supabase
             .from('taste_edges')
             .update({ 
               affinity_score: 1.0, 
               last_interacted_at: new Date().toISOString() 
             })
             .eq('id', existingEdge.id);
         } else {
           // Gosto virgem: cria a conexão inicial no grafo
           await supabase
             .from('taste_edges')
             .insert({
               user_id: userId,
               taste_keyword: tag,
               affinity_score: 1.0
             });
         }
      }
      
      console.log(`🎵 Grafo Matemático Atualizado! Sintonias Ativas: [${extractedTags.join(', ')}]`);
    } catch (error) {
      console.error("Erro ao atualizar o grafo de recomendação:", error);
    }
  }
}

export const TasteManager = new TasteManagerService();