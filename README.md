# Brasileirão2027

Simulador fictício do Campeonato Brasileiro Série A de 2027. Preencha os placares dos 380 jogos, distribuídos em 38 rodadas, e acompanhe a classificação em tempo real.

**[Jogar Brasileirão2027](https://simuladorbrasileir-o2027.onrender.com)**

## Como jogar

1. Escolha uma rodada pelos números acima da lista de jogos.
2. Digite os gols do mandante e do visitante. A classificação é recalculada assim que os dois campos forem preenchidos.
3. Pressione Enter no segundo campo para ir ao próximo jogo. No último confronto, o atalho avança para a rodada seguinte, quando disponível.

A classificação acumula os resultados digitados em todas as rodadas. Use **Limpar rodada** para apagar os placares da rodada exibida ou **Limpar tudo** para reiniciar a simulação. Recarregar a página também reinicia a simulação.

## O que o simulador inclui

- 20 clubes com escudos na classificação e nos jogos.
- Calendário fictício com datas e horários em ordem cronológica.
- Classificação por pontos, vitórias, saldo de gols e gols marcados, nessa ordem.
- Legenda com as faixas de Libertadores, Pré-Libertadores, Sul-Americana e rebaixamento.
- Modos claro e escuro e layout adaptado para celular.

## Executar localmente

Abra `dist/index.html` no navegador. O projeto usa HTML, CSS e JavaScript e roda diretamente no navegador, sem instalar dependências.

```text
dist/
├── index.html
├── manrope-600.woff2
└── silon-filho.png
```

## Publicar no Render

1. Envie este README e a pasta `dist` para a raiz do repositório no GitHub.
2. No Render, crie um **Static Site** e conecte o repositório.
3. Use `dist` em **Publish Directory**, deixe **Build Command** em branco e inicie a publicação.

## Créditos

Projeto de [Silon Filho](https://github.com/silonfilho). Escudos consultados no [Futbox](https://www.futbox.com/pt/clubes#!conmebol/brasil) e no [ge](https://ge.globo.com/futebol/brasileirao-serie-a/).
