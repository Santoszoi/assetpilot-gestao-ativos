# AssetPilot — Gestão de Ativos de TI

Aplicação web **local** para gerenciar inventário de TI. Projeto de portfólio complementar ao [DeskFlow](https://github.com/Santoszoi/deskflow-help-desk).

## Como executar

Requer **Node.js 20 ou superior**. Não precisa instalar pacotes adicionais.

1. Baixe ou clone este repositório.
2. No terminal, defina uma senha segura com pelo menos 12 caracteres:
   - Windows PowerShell: `$env:ADMIN_PASSWORD='escolha-uma-senha-forte'`
   - Linux/macOS: `export ADMIN_PASSWORD='escolha-uma-senha-forte'`
3. Execute `npm start`.
4. Abra **http://127.0.0.1:3334**.

O administrador é **Marcos**. A senha é definida localmente e não é armazenada no GitHub.

## Funcionalidades

- Painel com indicadores de ativos.
- Cadastro, edição e exclusão de equipamentos.
- Patrimônio único, categorias, status, localização e responsável.
- Busca, histórico de operações e exportação CSV.
- Dados persistidos localmente em `data/assets.json`.

## Segurança e limitações

**Não publique esta aplicação diretamente na internet.** O servidor escuta somente `127.0.0.1`, e foi concebido para uso individual e local. Não possui gerenciamento de múltiplos usuários, perfis de permissão, banco SQL ou backup automático. Faça cópias de segurança de `data/assets.json`.

Esta é a **versão local independente** do AssetPilot, não uma exportação do protótipo Lovable. O DeskFlow permanece em seu repositório próprio.
