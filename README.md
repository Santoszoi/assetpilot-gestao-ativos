# AssetPilot

**Gestão de ativos e inventário de TI**

Sistema web local para controle de equipamentos, patrimônio, responsáveis, localização e histórico de alterações. Interface em português, com painel de indicadores e exportação de dados.

## Início rápido no Windows

**Requisito:** Node.js 20 ou superior instalado.

1. Baixe o repositório em **Code → Download ZIP** e extraia a pasta.
2. Dê dois cliques em **`INICIAR-ASSETPILOT.cmd`**.
3. Digite uma senha de administrador com **no mínimo 12 caracteres**. A senha não aparece na tela.
4. Aguarde a mensagem `AssetPilot: http://127.0.0.1:3334`.
5. Acesse **http://127.0.0.1:3334** e entre com a mesma senha.

**Não feche a janela do servidor durante o uso.** Para encerrar, pressione Ctrl+C. A senha é solicitada a cada inicialização e não é salva em arquivo.

### Inicialização pelo terminal

No PowerShell, dentro da pasta do projeto:

```powershell
.\iniciar-assetpilot.ps1
```

Se a política de execução impedir a execução do script, utilize o arquivo `INICIAR-ASSETPILOT.cmd` no lugar dele.

No Linux/macOS:

```bash
export ADMIN_PASSWORD='defina-uma-senha-forte-com-12-ou-mais-caracteres'
npm start
```

## Funcionalidades

- Dashboard com indicadores por situação do equipamento.
- Cadastro, consulta, edição e exclusão de ativos.
- Controle de patrimônio único, categoria, número de série, responsável e localização.
- Pesquisa por equipamento, patrimônio, categoria ou responsável.
- Registro de atividades de cadastro, atualização e exclusão.
- Exportação do inventário em CSV.
- Autenticação de administrador local (**Marcos**) e bloqueio temporário após tentativas de login incorretas.
- Persistência em arquivo JSON, sem necessidade de instalar banco de dados.

## Armazenamento e backup

Os dados ficam em `data/assets.json`, criado automaticamente quando necessário. **Faça backup desse arquivo** antes de substituir a pasta do projeto ou formatar o computador. Não envie esse arquivo com dados reais para um repositório público.

## Testes

```bash
npm test
```

## Arquitetura

- **Frontend:** HTML, CSS e JavaScript nativos, responsivos.
- **Backend:** Node.js 20+, API HTTP local.
- **Persistência:** JSON local com gravação por arquivo temporário.
- **Dependências externas:** nenhuma.

## Escopo e segurança

O servidor escuta somente em `127.0.0.1`. É uma aplicação de uso individual e **não deve ser exposta diretamente à internet**. Ainda não possui contas multiusuário, permissões por perfil, sincronização entre computadores, backup automático ou banco SQL. O histórico é operacional e não constitui trilha de auditoria inviolável.

Projeto complementar ao [DeskFlow](https://github.com/Santoszoi/deskflow-help-desk), voltado ao gerenciamento de chamados de suporte.
