import { AhoCorasick } from './AhoCorasick.js';
import { MatchBFS } from './BFS.js';

console.log("🚀 Iniciando o Teste de Prova (Benchmark) - Syncora\n");

// ==========================================
// FASE 1: Testando o Aho-Corasick O(N)
// ==========================================
console.log("--- FASE 1: Motor Aho-Corasick ---");
const ac = new AhoCorasick();

// 1. Cadastrando as palavras-chave no Autômato (Simulando o banco)
const keywords = ["indie rock", "trap", "mpb", "the weeknd", "eletronica"];
keywords.forEach(kw => ac.addKeyword(kw));
ac.buildFailureLinks(); // Constrói a árvore de falhas

// 2. Simulando uma string crua e suja vindo da API do Spotify
const spotifyData = "user likes listening to trap and sometimes indie rock, but mostly the weeknd on weekends.";

// 3. Medindo o tempo de varredura
console.time("Tempo de Execução (Aho-Corasick)");
const extractedTags = ac.search(spotifyData);
console.timeEnd("Tempo de Execução (Aho-Corasick)");

console.log("Tags extraídas da API limpas:", extractedTags);
console.log("\n");

// ==========================================
// FASE 2: Testando o BFS O(V+E) com Time-Decay
// ==========================================
console.log("--- FASE 2: Travessia BFS com Poda Temporal ---");

// Simulando nosso grafo baseado na tabela 'taste_edges'
// Peso >= 0.5 (Gosto recente/ativo) | Peso < 0.5 (Gosto antigo/apodreceu)
const mockGraph = {
  "usuario_logado": [
    { destino: "perfil_rodrigo", peso: 0.9 },  // Conexão forte recente
    { destino: "perfil_joao", peso: 0.3 },     // Conexão fraca (time-decay podará)
    { destino: "perfil_maria", peso: 0.8 }     // Conexão forte recente
  ],
  "perfil_rodrigo": [
    { destino: "perfil_gabriel", peso: 0.7 }   // Conexão de segundo grau
  ]
};

const bfs = new MatchBFS(mockGraph);

// Medindo o tempo de travessia do grafo
console.time("Tempo de Execução (BFS)");
const matches = bfs.encontrarMatches("usuario_logado", 0.5); // 0.5 é a nota de corte temporal
console.timeEnd("Tempo de Execução (BFS)");

console.log("Matches recomendados (Joao foi ignorado pelo tempo):", matches);
console.log("\n✅ Teste concluído com sucesso!");