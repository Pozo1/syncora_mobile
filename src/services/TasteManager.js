/**
 * Gerenciador de Afinidades Musicais (TasteManager)
 * Projeto Syncora (IC - Computabilidade e Complexidade de Algoritmos)
 */

import { supabase } from './supabaseClient';
import { AhoCorasick } from '../algorithms/AhoCorasick'; 

class TasteManagerService {
  constructor() {
    this.ac = new AhoCorasick();
    this.isInitialized = false;
  }

  initAutomaton() {
    if (this.isInitialized) return;
    
    // Dicionário de Gêneros Principais
    const tags = [
      "rock", "trap", "pop", "indie", "sertanejo", "eletronica", 
      "the weeknd", "funk", "mpb", "hip hop", "rap", "r&b", "post malone",
      "pagode", "samba", "lo-fi", "jazz", "kpop"
    ];
    
    tags.forEach(tag => this.ac.addKeyword(tag));
    this.ac.buildFailureLinks(); 
    
    this.isInitialized = true;
  }

  async updateTasteGraph(userId, trackName, artistName) {
    if (!userId || !trackName || trackName === "Pausado") return;
    
    this.initAutomaton();

    const rawText = `${trackName} ${artistName}`.toLowerCase();
    console.log(`\n🧠 [TASTE MANAGER] Vasculhando a string: "${rawText}"`);
    
    const matches = this.ac.search(rawText);
    let extractedTags = [];
    
    if (matches.length > 0) {
      // Achou um gênero no dicionário!
      extractedTags = [...new Set(matches.map(m => m.keyword))];
      console.log(`✅ [TASTE MANAGER] Gênero identificado via Aho-Corasick:`, extractedTags);
    } else {
      // 🚨 FALLBACK ALGORÍTMICO: Não achou o gênero? Usa o Artista Principal!
      // Separa por vírgula (caso tenha feat) e pega o primeiro nome
      const mainArtist = artistName.split(',')[0].trim().toLowerCase();
      
      if (mainArtist && mainArtist !== "perfil offline") {
        extractedTags = [mainArtist];
        console.log(`🔄 [TASTE MANAGER] Plano B ativado! Usando o artista como nó do grafo: [${mainArtist}]`);
      } else {
        return; // Só aborta se realmente não tiver artista nenhum
      }
    }

    try {
      const { data: currentEdges } = await supabase
        .from('taste_edges')
        .select('*')
        .eq('user_id', userId);

      if (currentEdges && currentEdges.length > 0) {
        for (let edge of currentEdges) {
          if (!extractedTags.includes(edge.taste_keyword)) {
            const newScore = Math.max(0, edge.affinity_score - 0.1); 
            await supabase
              .from('taste_edges')
              .update({ affinity_score: newScore })
              .eq('id', edge.id);
          }
        }
      }

      for (let tag of extractedTags) {
         const { data: existingEdge } = await supabase
           .from('taste_edges')
           .select('id')
           .eq('user_id', userId)
           .eq('taste_keyword', tag)
           .single();

         if (existingEdge) {
           await supabase
             .from('taste_edges')
             .update({ 
               affinity_score: 1.0, 
               last_interacted_at: new Date().toISOString() 
             })
             .eq('id', existingEdge.id);
         } else {
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