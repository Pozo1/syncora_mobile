/**
 * Motor Integrado Syncora — Aho-Corasick O(n+m+z) + BFS Time-Decay O(V+E) + Score + Benchmark
 * Arquivo pronto para substituir `src/algorithms/testRunner.js` (Zero avisos no SonarLint/SonarQube)
 * Autores: Rodrigo Pozo Griecco e Gabriel Nascimento
 */

import { AhoCorasick } from './AhoCorasick.js';
import { MatchBFS } from './BFS.js';

// ============================================================================
// 1. BASELINE: BUSCA INGÊNUA O(n * m) (Preparada na Sprint 2 para Benchmark)
// ============================================================================
function correspondeNoIndice(text, pattern, startIndex) {
  for (let j = 0; j < pattern.length; j++) {
    if (text[startIndex + j] !== pattern[j]) {
      return false;
    }
  }
  return true;
}

export function buscaIngenua(text, dictionary) {
  const results = [];
  for (const pattern of dictionary) {
    const limite = text.length - pattern.length;
    for (let i = 0; i <= limite; i++) {
      if (correspondeNoIndice(text, pattern, i)) {
        results.push({
          keyword: pattern,
          indexEncontrado: i
        });
      }
    }
  }
  return results;
}

// ============================================================================
// 2. MOTOR UNIFICADO LEVE: AHO-CORASICK + BFS (TIME-DECAY) + SCORE REFINADO
// ============================================================================
export class SyncoraMatchEngine {
  constructor(dictionary = [], artistList = []) {
    this.ac = new AhoCorasick();
    this.artistSet = new Set(artistList.map(a => a.toLowerCase()));
    this.userProfiles = {};

    for (const word of dictionary) {
      this.ac.addKeyword(word.toLowerCase());
    }
    this.ac.buildFailureLinks();
  }

  extrairFallbackArtista(fallbackArtist) {
    if (!fallbackArtist) return [];
    const mainArtist = fallbackArtist.split(',')[0].trim().toLowerCase();
    return mainArtist && mainArtist !== 'perfil offline' ? [mainArtist] : [];
  }

  /**
   * Etapa 1: Recebe o texto bruto do Spotify do usuário, extrai tags em O(N) via Aho-Corasick
   * e registra os pesos temporais (affinity_score de 0.0 a 1.0) das arestas.
   */
  ingestUserSpotifyData(userId, rawText, customDecayMap = {}, fallbackArtist = "") {
    const matches = this.ac.search(rawText.toLowerCase());
    let uniqueTags = [...new Set(matches.map(m => m.keyword))];

    if (uniqueTags.length === 0) {
      uniqueTags = this.extrairFallbackArtista(fallbackArtist);
    }

    const tagWeights = new Map();
    for (const tag of uniqueTags) {
      const weight = customDecayMap[tag] ?? 1.0;
      tagWeights.set(tag, weight);
    }

    this.userProfiles[userId] = { rawText, matches, tagWeights };
    return { matches, uniqueTags };
  }

  /**
   * Calcula o maior peso médio de aresta ativa compartilhada entre dois perfis.
   */
  calcularMaiorPesoAtivo(profileU, profileV, limiteDecay) {
    let maxActiveWeight = 0;

    for (const [tag, weightU] of profileU.tagWeights.entries()) {
      const weightV = profileV.tagWeights.get(tag);
      const ambosAtivos = weightU >= limiteDecay && weightV !== undefined && weightV >= limiteDecay;

      if (ambosAtivos) {
        const avgWeight = (weightU + weightV) / 2.0;
        if (avgWeight > maxActiveWeight) {
          maxActiveWeight = avgWeight;
        }
      }
    }

    return +maxActiveWeight.toFixed(2);
  }

  /**
   * Etapa 2: Constrói dinamicamente o grafo de afinidade entre usuários para o MatchBFS
   * Aplica a poda temporal (Edge Pruning) nas tags com peso < limiteDecay.
   */
  buildUserGraph(limiteDecay = 0.5) {
    const grafo = {};
    const userIds = Object.keys(this.userProfiles);

    for (const u of userIds) {
      grafo[u] = [];
      for (const v of userIds) {
        if (u === v) continue;
        const pesoAresta = this.calcularMaiorPesoAtivo(
          this.userProfiles[u],
          this.userProfiles[v],
          limiteDecay
        );
        if (pesoAresta > 0) {
          grafo[u].push({ destino: v, peso: pesoAresta });
        }
      }
    }

    return grafo;
  }

  avaliarTagCompartilhada(tag, weightA, weightB, limiteDecay) {
    if (weightA < limiteDecay || weightB < limiteDecay) {
      return { podada: true, itemPodado: { tag, weightA, weightB } };
    }

    const isArtist = this.artistSet.has(tag);
    const baseWeight = isArtist ? 2.0 : 1.0;
    const points = +(baseWeight * ((weightA + weightB) / 2.0)).toFixed(2);

    return {
      podada: false,
      points,
      itemAtivo: {
        tag,
        tipo: isArtist ? 'Artista (2.0)' : 'Gênero (1.0)',
        weightA,
        weightB,
        points
      }
    };
  }

  /**
   * Etapa 3: Calcula o Score de Compatibilidade (Sprint 1 Linear vs Sprint 3/4 Refinado)
   * - Artista em comum = 2.0 pontos base
   * - Gênero em comum  = 1.0 ponto base
   * - Ponderado pela média de frescor (Time-Decay) se ambos >= limiteDecay (0.5)
   */
  calculatePairCompatibility(userA, userB, limiteDecay = 0.5) {
    const profileA = this.userProfiles[userA];
    const profileB = this.userProfiles[userB];
    if (!profileA || !profileB) return null;

    let scoreSprint1 = 0;
    let scoreRefinado = 0;
    const sharedActive = [];
    const prunedByDecay = [];

    for (const [tag, weightA] of profileA.tagWeights.entries()) {
      if (!profileB.tagWeights.has(tag)) continue;

      scoreSprint1 += 1;
      const weightB = profileB.tagWeights.get(tag);
      const avaliacao = this.avaliarTagCompartilhada(tag, weightA, weightB, limiteDecay);

      if (avaliacao.podada) {
        prunedByDecay.push(avaliacao.itemPodado);
      } else {
        scoreRefinado += avaliacao.points;
        sharedActive.push(avaliacao.itemAtivo);
      }
    }

    const percentual = Math.min(100, Math.round((scoreRefinado / 8.0) * 100));

    return {
      userA,
      userB,
      scoreSprint1,
      scoreRefinado: +scoreRefinado.toFixed(2),
      percentualCompatibilidade: `${percentual}%`,
      sharedActive,
      prunedByDecay
    };
  }

  /**
   * Etapa 4: Executa o MatchBFS (src/algorithms/BFS.js) sobre o grafo e retorna
   * os candidatos recomendados ordenados pelo Score Refinado de Compatibilidade.
   */
  recommendMatches(rootUserId, limiteDecay = 0.5) {
    const grafo = this.buildUserGraph(limiteDecay);
    const bfs = new MatchBFS(grafo);
    const idsRecomendados = bfs.encontrarMatches(rootUserId, limiteDecay);

    return idsRecomendados
      .map(candidateId => this.calculatePairCompatibility(rootUserId, candidateId, limiteDecay))
      .sort((a, b) => b.scoreRefinado - a.scoreRefinado);
  }
}

// ============================================================================
// 3. EXECUÇÃO COMPLETA DOS TESTES (SPRINTS 3 E 4)
// ============================================================================
console.log("🚀 Iniciando Suite Completa Syncora (Sprints 3 e 4 — Aho-Corasick + BFS)\n");

const dictSprint1 = [
  "pop", "rock", "indie", "jazz", "funk", "eletronica", "sertanejo", "mpb", "trap", "hip hop",
  "the weeknd", "taylor swift", "drake", "bad bunny", "dua lipa", "kendrick lamar",
  "arctic monkeys", "anitta", "matue", "djavan"
];

const dictExpandido = [...dictSprint1, "indie rock", "pop rock", "kpop", "trap funk"];

const artistas = [
  "the weeknd", "taylor swift", "drake", "bad bunny", "dua lipa",
  "kendrick lamar", "arctic monkeys", "anitta", "matue", "djavan"
];

// --- 3.1. Busca sobre os Textos da Sprint 1 e Padrões Sobrepostos ---
console.log("--- 1. BUSCA AHO-CORASICK (TEXTOS SPRINT 1 + SOBREPOSIÇÃO) ---");
const ac = new AhoCorasick();
for (const kw of dictExpandido) {
  ac.addKeyword(kw);
}
ac.buildFailureLinks();

const textosSprint1 = [
  "user1_data: taylor swift, pop, indie, arctic monkeys, rock",
  "user2_data: funk, anitta, matue, trap, hip hop, djavan",
  "user3_data: the weeknd, pop, drake, jazz, eletronica, dua lipa",
  "sobreposicao: curto muito indie rock, kpop, pop rock e trap funk nas playlists"
];

for (const txt of textosSprint1) {
  console.log(`Texto: "${txt}"`);
  console.log("Ocorrências:", ac.search(txt));
}

// --- 3.2. Fluxo Ponta a Ponta (Aho-Corasick + BFS com Time-Decay + Score) ---
console.log("\n--- 2. INTEGRAÇÃO PONTA A PONTA (AHO-CORASICK + MATCHBFS + SCORE) ---");
const engine = new SyncoraMatchEngine(dictExpandido, artistas);

engine.ingestUserSpotifyData(
  "user1_rodrigo",
  "user1_data: taylor swift, pop, indie rock, arctic monkeys, rock",
  { "taylor swift": 1.0, "pop": 0.9, "indie": 1.0, "rock": 1.0, "indie rock": 1.0, "arctic monkeys": 0.9 }
);
engine.ingestUserSpotifyData(
  "user2_gabriel",
  "user2_data: funk, anitta, matue, trap, hip hop, djavan, rock",
  { "funk": 1.0, "anitta": 1.0, "matue": 0.9, "trap": 1.0, "hip hop": 0.8, "djavan": 1.0, "rock": 0.3 }
);
engine.ingestUserSpotifyData(
  "user3_mariana",
  "user3_data: the weeknd, pop, drake, jazz, eletronica, dua lipa, taylor swift, indie",
  { "the weeknd": 1.0, "pop": 0.9, "drake": 0.8, "jazz": 0.7, "eletronica": 0.9, "dua lipa": 1.0, "taylor swift": 1.0, "indie": 0.8 }
);
engine.ingestUserSpotifyData(
  "user4_lucas",
  "user4_data: arctic monkeys, indie rock, rock, pop, the weeknd, matue",
  { "arctic monkeys": 1.0, "indie rock": 1.0, "rock": 0.9, "pop": 0.8, "the weeknd": 0.9, "matue": 0.2 }
);

console.log("Ranking de Matches via BFS para user1_rodrigo:");
console.log(JSON.stringify(engine.recommendMatches("user1_rodrigo", 0.5), null, 2));

console.log("\nVerificação de Poda Temporal (Rodrigo x Gabriel - 'rock' com peso 0.3):");
console.log(JSON.stringify(engine.calculatePairCompatibility("user1_rodrigo", "user2_gabriel", 0.5), null, 2));

// --- 3.3. Benchmark Sistemático (Aho-Corasick vs Busca Ingênua) ---
console.log("\n--- 3. BENCHMARK DE DESEMPENHO (AHO-CORASICK vs BUSCA INGÊNUA) ---");
function gerarDicionario(tamanho) {
  const lista = [...dictExpandido];
  while (lista.length < tamanho) {
    lista.push(`genero_musical_${lista.length}_artista_spotify_${lista.length % 17}`);
  }
  return lista.slice(0, tamanho);
}

function gerarTexto(tamanhoAlvo, dicionario) {
  const vocab = [
    "spotify", "playlist", "listening", "track", "album", "feat", "remix", "live",
    "session", "acoustic", "stream", "user_history", ...dicionario.slice(0, Math.min(25, dicionario.length))
  ];
  let texto = "";
  let i = 0;
  while (texto.length < tamanhoAlvo) {
    texto += vocab[i % vocab.length] + " ";
    i++;
  }
  return texto.slice(0, tamanhoAlvo);
}

function medirTempoMedio(fn, iteracoes) {
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const inicio = now();
  for (let i = 0; i < iteracoes; i++) {
    fn();
  }
  return (now() - inicio) / iteracoes;
}

const tamanhosDict = [10, 50, 200];
const tamanhosTexto = [1000, 10000, 100000];
const iteracoes = 30;

for (const dSize of tamanhosDict) {
  const dict = gerarDicionario(dSize);
  const acBench = new AhoCorasick();
  for (const w of dict) {
    acBench.addKeyword(w);
  }
  acBench.buildFailureLinks();

  for (const tSize of tamanhosTexto) {
    const texto = gerarTexto(tSize, dict);
    acBench.search(texto);
    buscaIngenua(texto, dict);

    const tempoAC = medirTempoMedio(() => acBench.search(texto), iteracoes);
    const tempoIngenua = medirTempoMedio(() => buscaIngenua(texto, dict), iteracoes);

    const ganho = (tempoIngenua / Math.max(tempoAC, 0.0001)).toFixed(2);
    console.log(
      `Dicionário: ${String(dSize).padStart(3)} | Texto: ${String(tSize).padStart(6)} chars | ` +
      `Aho-Corasick: ${tempoAC.toFixed(4)} ms | Ingênua: ${tempoIngenua.toFixed(4)} ms | Ganho: ${ganho}x`
    );
  }
}

console.log("\n✅ Suite concluída com sucesso!");