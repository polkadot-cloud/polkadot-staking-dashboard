# Bem-vindo ao Polkadot Cloud Staking!

Esta seção tem como objetivo familiarizar os desenvolvedores com o Polkadot Staking Dashboard. Entre em contato com __staking@polkadot.cloud__ para esclarecimentos sobre qualquer conteúdo neste documento.

## Enviando Pull Requests

Este projeto segue a especificação Conventional Commits. Os pull requests são mesclados e compactados, sendo o título do pull request usado como mensagem de commit. As mensagens de commit devem aderir à seguinte estrutura:

```
<tipo>(<escopo>): <resumo>
```

Exemplos de títulos de PR:

- feat: implementar sobreposição de ajuda
- feat(auth): implementar API de login
- fix: resolver problema com alinhamento de botão
- fix(docs): corrigir seção de instalação no README

O tipo **chore** não será adicionado aos logs de alteração de versão e deve ser usado para atualizações silenciosas.

## Configuração do Projeto

### Instalação de Dependências

```bash
pnpm install
```

### Iniciando o Servidor de Desenvolvimento

```bash
pnpm dev
```

### Construindo para Produção

```bash
pnpm build
```

### Executando Testes

```bash
pnpm test
```

### Linting do Código

```bash
pnpm lint
```

## Estrutura do Projeto

O projeto é organizado como um monorepo usando pnpm workspaces. Cada pacote está localizado no diretório `packages/`.

## Contribuindo

Obrigado por considerar contribuir para o Polkadot Cloud Staking! Por favor, leia nossas diretrizes de contribuição antes de enviar um pull request.

## Licença

Este projeto é licenciado sob a Licença GPL 3.0.
