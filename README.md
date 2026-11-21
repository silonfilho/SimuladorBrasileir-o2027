# Brasileirão2027

Simulador fictício das Séries A, B e C do Campeonato Brasileiro de 2027. Escolha uma divisão, preencha os placares e acompanhe a classificação em tempo real. As Séries A e B têm 20 clubes e 38 rodadas cada. A Série C tem 24 clubes e três fases.

**[Jogar Brasileirão2027](https://simuladorbrasileir-o2027.onrender.com)**

## Como jogar

1. Clique em **Brasileirão2027**, **SérieB2027** ou **SérieC2027** no topo para escolher a divisão.
2. Use os números acima da lista de jogos para navegar entre as rodadas.
3. Digite os gols do mandante e do visitante. A classificação é recalculada assim que os dois campos forem preenchidos.
4. Pressione **Enter** no segundo campo para ir ao próximo jogo. No último confronto, o atalho avança para a próxima rodada quando ela estiver disponível.

A tabela mostra o aproveitamento em **%** e os resultados dos **Últimos 3** jogos concluídos.

Cada divisão mantém seus próprios placares enquanto a página estiver aberta. **Limpar rodada** apaga os placares da rodada exibida e **Limpar tudo** reinicia a divisão selecionada. Recarregar a página reinicia a simulação.

## Série A

A tabela destaca as vagas na Libertadores, na Pré-Libertadores e na Sul-Americana, além da zona de rebaixamento.

## Série B e playoffs

O returno repete os confrontos do primeiro turno na mesma ordem, com os mandos invertidos. Cada clube joga 19 vezes em casa e 19 fora. No calendário fictício, cada rodada tem dois jogos na quarta, um na quinta, dois na sexta, três no sábado e dois no domingo.

Os dois primeiros sobem diretamente e os quatro últimos são rebaixados. Ao completar os 380 placares da fase regular, a opção **Playoffs** aparece ao lado da rodada 38:

- **3º × 6º** e **4º × 5º**, com ida e volta.
- O 3º e o 4º disputam a volta em casa e avançam em caso de empate no placar agregado.
- Os dois vencedores garantem as vagas restantes na Série A de 2028.

## Série C

A primeira fase tem 23 rodadas em turno único. Os oito primeiros avançam aos quadrangulares e os dois últimos caem. Nos quadrangulares, os dois primeiros de cada grupo sobem, e os líderes disputam a final em ida e volta. Um empate no agregado da final é decidido nos pênaltis.

## Executar localmente

Abra `dist/index.html` no navegador. O simulador usa HTML, CSS e JavaScript e roda sem instalar dependências. A interface tem modos claro e escuro e se adapta a telas de celular.

```text
dist/
├── index.html
├── favicon.png
├── manrope-600.woff2
├── silon-filho.png
├── serie-b/ (escudos da Série B)
├── serie-c.js
├── serie-c/ (escudos da Série C)
└── uniformes/ (imagens guardadas para uso futuro)
```

## Publicar no Render

1. Envie a pasta `dist` inteira e este README para a raiz do repositório no GitHub.
2. Conecte o repositório a um **Static Site** no Render ou atualize a branch conectada ao site existente.
3. Configure **Publish Directory** como `dist` e deixe **Build Command** em branco.

## Créditos

Projeto de [Silon Filho](https://github.com/silonfilho). Escudos consultados no [Futbox](https://www.futbox.com/pt/clubes#!conmebol/brasil) e no [ge](https://ge.globo.com/futebol/).
