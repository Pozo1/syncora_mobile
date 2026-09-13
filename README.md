# Syncora 🎵

Syncora é um aplicativo de relacionamento e conexão social focado em sintonia musical. Diferente dos apps tradicionais baseados apenas em fotos, o Syncora utiliza a API do Spotify para cruzar dados de hábitos musicais em tempo real, permitindo conexões autênticas entre usuários com base na compatibilidade sonora.

*Projeto acadêmico desenvolvido para o curso de Ciência da Computação da Universidade Braz Cubas.*

## 🛠️ Tecnologias Utilizadas

*   **Front-end:** React Native com Expo (SDK 57)
*   **Back-end & Banco de Dados:** Supabase (Auth, Database, Storage)
*   **Integração:** Spotify Web API (OAuth e Currently Playing)
*   **Navegação:** React Navigation v7
*   **UI/UX:** Componentes customizados, React Native Deck Swiper, Expo Haptics

## 🚀 Próximos Passos (Em Desenvolvimento)

A infraestrutura atual foi preparada para receber o núcleo algorítmico do aplicativo:
*   **Aho-Corasick + Busca em Largura (BFS):** Implementação de uma Trie estruturada com BFS para varredura de strings e palavras-chave na "Bio" e no chat dos usuários, aprimorando o sistema de matchmaking oculto.

## ⚙️ Como rodar o projeto localmente

1. **Clone o repositório:**
 
   git clone https://github.com/Pozo1/syncora_mobile
   
Instale as dependências:

npm install

Configure as Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e me peça (Rodrigo) as chaves de acesso do Supabase e do Spotify.

Inicie o servidor do Expo:

npx expo start -c

⚠️ ATENÇÃO: Liberação de IP para o Login do Spotify (Passo Obrigatório)
Como o aplicativo utiliza a API oficial do Spotify em ambiente de desenvolvimento, o sistema de autenticação bloqueia qualquer acesso que não esteja na whitelist do painel de desenvolvedor.

Para que o login funcione no seu celular/computador:

Ao rodar o comando do Expo, veja o IP gerado no terminal ou no CMD(exemplo: exp://192.168.X.X:8081).

Por favor, me envie esse endereço exato (ou o seu IPv4) para que eu possa adicioná-lo ao painel de desenvolvedor do Spotify. Sem isso, o botão de login retornará um erro de "Redirect URI".
