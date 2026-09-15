# Syncora 🎵

Syncora é um aplicativo de relacionamento e conexão social focado em sintonia musical. Diferente dos apps tradicionais baseados apenas em fotos, o Syncora utiliza a API do Spotify para cruzar dados de hábitos musicais em tempo real, permitindo conexões autênticas entre usuários com base na compatibilidade sonora.

*Projeto acadêmico desenvolvido para o curso de Ciência da Computação da Universidade Braz Cubas.*

## 📋 Dados de Entrega Acadêmica

* **Nome do projeto:** Syncora
* **Integrantes do grupo:** Rodrigo Pozo Griecco e Gabriel Nascimento
* **Turma:** Ciência da Computação - Universidade Braz Cubas
* **Link do repositório:** https://github.com/Pozo1/syncora_mobile
* **Branch principal utilizada:** main

## 🛠️ Tecnologias Utilizadas

*   **Front-end:** React Native com Expo (SDK 57)
*   **Back-end & Banco de Dados:** Supabase (Auth, Database, Storage)
*   **Integração:** Spotify Web API (OAuth e Currently Playing)
*   **Navegação:** React Navigation v7
*   **UI/UX:** Componentes customizados, React Native Deck Swiper, Expo Haptics

## 🧠 Estrutura Algorítmica (Iniciação Científica)

A infraestrutura foi preparada e integrada ao núcleo algorítmico do aplicativo, resolvendo o problema do "gosto estático" em redes de afinidade:
*   **Aho-Corasick:** Utilizado para varredura de strings em tempo $O(N)$, extraindo palavras-chave musicais da API em tempo real e alimentando as conexões do banco de dados sem *backtracking*.
*   **Busca em Largura (BFS) com Time-Decay:** Travessia do grafo de usuários na tabela `taste_edges` em tempo $O(V+E)$, recomendando conexões e aplicando poda de arestas (*edge pruning*) para ignorar caminhos cujo peso de afinidade tenha caído devido à ociosidade musical.

## ⚙️ Como rodar o projeto localmente

1. **Clone o repositório:**
   
   git clone [https://github.com/Pozo1/syncora_mobile](https://github.com/Pozo1/syncora_mobile)

   Instale as dependências:


npm install

Configure as Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e solicite aos desenvolvedores do grupo as chaves de acesso do Supabase e do Spotify.

Inicie o servidor do Expo:


npx expo start -c
⚠️ ATENÇÃO: Liberação de IP para o Login do Spotify (Passo Obrigatório)

Como o aplicativo utiliza a API oficial do Spotify em ambiente de desenvolvimento, o sistema de autenticação bloqueia qualquer acesso que não esteja na whitelist do painel de desenvolvedor.

Para que o login funcione no dispositivo de avaliação:
Ao rodar o comando do Expo, veja o IP gerado no terminal (exemplo: exp://192.168.X.X:8081). Por favor, envie esse endereço exato (ou o seu IPv4) para a equipe adicionar ao painel de desenvolvedor do Spotify. Sem isso, o botão de login retornará um erro de "Redirect URI".


Depois de salvar o arquivo, basta fazer o envio dessa documentação final:

