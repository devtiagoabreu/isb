# ISB - Integração Systêxtil x Bling

Este repositório contém a infraestrutura e a lógica de negócios para a integração automatizada e bidirecional entre o ERP **Systêxtil Cloud** e o **Bling V3**, desenhada para sustentar de forma ágil e segura a operação B2C/E-commerce da **Pro Moda Têxtil**.

A solução é desenvolvida utilizando o framework **Next.js (App Router)** e hospedada sob arquitetura serverless na **Vercel**, aproveitando a escalabilidade automática e suporte nativo a conexões seguras por SSL (`https://`).

---

## 📌 Visão Geral do Sistema

A arquitetura de dados segue uma matriz de responsabilidades rígida para garantir a integridade operacional e fiscal da Pro Moda Têxtil:

*   **Systêxtil ERP (Mestre Físico e Fiscal):** Centraliza o cadastro técnico de produtos, o saldo real de estoque (isolado no **Depósito 50 - E-commerce** com saldos fracionados em metros, ex: `150.50`), a escrituração das Notas Fiscais emitidas pelo Bling e a geração dos títulos de contas a receber na tesouraria.
*   **Bling ERP (Frente de Operação Comercial):** Atua como espelho dinâmico do estoque do Depósito 50 para os canais de e-commerce e marketplaces, processa as vendas B2C e realiza o faturamento oficial (emissão de NF-e).

---

## 🔑 Credenciais do Aplicativo (Bling V3)

Estas são as credenciais oficiais geradas no Portal do Desenvolvedor do Bling para o aplicativo privado da Pro Moda. 

> ⚠️ **IMPORTANTE:** Nunca adicione o `BLING_CLIENT_SECRET` diretamente no código sob controle de versão público. Utilize variáveis de ambiente (`.env`).

| Parâmetro | Valor |
| :--- | :--- |
| **Client ID** | `ea4e20b875cfdc7c67c35f1ec84da997a6d757cd` *(identificador público)* |
| **Client Secret** | *NÃO versionar — carregar via variável de ambiente `.env.local`* |
| **Link de Convite / Autorização** | [Clique aqui para autorizar o App](https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=ea4e20b875cfdc7c67c35f1ec84da997a6d757cd&state=063a0e901100fe2cbd2e73eceafc5fb3) |

---

## 🛠️ Variáveis de Ambiente (`.env.local`)

Crie um arquivo `.env.local` na raiz do seu projeto Next.js com o seguinte conteúdo:

```env
# Configurações do Bling V3
BLING_CLIENT_ID=ea4e20b875cfdc7c67c35f1ec84da997a6d757cd
BLING_CLIENT_SECRET=seu_client_secret_bling
BLING_WEBHOOK_SECRET=seu_webhook_secret_bling
BLING_REDIRECT_URI=https://seu-dominio-vercel.vercel.app/api/auth/callback

# Configurações do Systêxtil Cloud
SYSTEXTIL_API_URL=https://api.systextil.com.br
SYSTEXTIL_CLIENT_ID=seu_client_id_systextil
SYSTEXTIL_CLIENT_SECRET=seu_client_secret_systextil
SYSTEXTIL_DEPOSITO_ECOMMERCE=50
```

---

## 🗂️ Estrutura de Rotas e Endpoints no Next.js (App Router)

Abaixo estão os arquivos-chave necessários para o início do desenvolvimento e testes rápidos no ambiente Vercel.

### 1. Endpoint do Webhook de Faturamento
Este endpoint processa as notificações do Bling sobre faturamento de vendas (NF-e emitida) para dar baixa no Systêxtil.

**Caminho:** `/app/api/webhooks/bling/route.js`

```javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const securityToken = searchParams.get('token');
    const EXPECTED_TOKEN = process.env.BLING_WEBHOOK_SECRET;

    if (!securityToken || securityToken !== EXPECTED_TOKEN) {
      console.warn('⚠️ Tentativa de acesso não autorizada ao Webhook.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = await request.json();
    const eventType = payload.event; // "nfe"
    const eventData = payload.data;

    if (!eventData) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    // Processamento de Nota Fiscal Emitida (Faturamento)
    if (eventType === 'nfe') {
      const situacao = eventData.situacao; // Ex: '3' (Autorizada) ou 'emitida'
      
      if (situacao === '3' || situacao === 'emitida' || situacao === 'autorizada') {
        const nfeId = eventData.id;
        const numeroNota = eventData.numero;
        console.log(`⚙️ Processando faturamento: NF-e Nº ${numeroNota} (ID Bling: ${nfeId})`);

        // AQUI: Executar integração com Systêxtil de forma assíncrona
        // 1. POST /pessoa/v1/cliente (Garantir cliente no Systêxtil)
        // 2. POST /venda/v1/pedido/venda (Criar pedido)
        // 3. POST /fiscal/v1/documento/entrada (Registrar XML no Depósito 50 para baixa de estoque física)
        // 4. POST /financeiro/v1/titulo/receber (Geração do Contas a Receber)
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

### 2. Fluxo OAuth 2.0 - Endpoint de Callback
Manipula o código temporário recebido ao clicar no link de convite e o troca pelas credenciais persistentes.

**Caminho:** `/app/api/auth/callback/route.js`

```javascript
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Código de autorização não encontrado' }, { status: 400 });
    }

    // Parâmetros de troca
    const credentials = Buffer.from(
      `${process.env.BLING_CLIENT_ID}:${process.env.BLING_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.BLING_REDIRECT_URI,
      }),
    });

    const tokenData = await response.json();

    if (!response.ok) {
      throw new Error(tokenData.error_description || 'Erro ao obter token');
    }

    // Salvar tokenData.access_token e tokenData.refresh_token em banco de dados
    console.log('✅ Tokens de Autenticação gerados com sucesso!');

    return NextResponse.json({ success: true, message: 'Autenticação concluída! Guarde os tokens.' });
  } catch (error) {
    console.error('❌ Erro no OAuth callback:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 📐 Regras de Negócio Implementadas

### A. Formação de SKU Único (Systêxtil → Bling)
O SKU plano no Bling é gerado a partir da concatenação de 4 parâmetros estruturais de identificação da Systêxtil:

$$\text{SKU Bling} = \text{nivel\_produto} + \text{grupo\_id} + \text{subgrupo\_id} + \text{item\_id}$$

*   **Exemplo:**
    *   `nivel_produto`: `1` (Fio/Tecido)
    *   `grupo_id`: `TE01`
    *   `subgrupo_id`: `001`
    *   `item_id`: `A05`
    *   **SKU Final no Bling:** `1TE01001A05`

### B. Consumo e Baixa de Estoque Decimais (Metros)
*   **Depósito Foco:** Depósito `50` (E-commerce).
*   **Controle Fracionado:** O processamento deve tratar números decimais com até duas casas flutuantes (ex: `15.75` metros de tecido).
*   **Movimentação:** Para dar baixa após o faturamento de um pedido, o integrador chama `POST /material/v1/movimento/estoque` no Systêxtil com o seguinte payload JSON:

```json
{
  "tipo_movimento": 2,
  "deposito": 50,
  "nivel": "1",
  "grupo": "TE01",
  "subgrupo": "001",
  "item": "A05",
  "quantidade": 15.75
}
```

---

## 🤖 Contexto para Programação com IA (OpenCode / Cursor / Copilot)

Copie e cole a diretiva abaixo no prompt inicial do seu assistente de IA (**OpenCode**, **Cursor**, **ChatGPT**, etc.) para acelerar a geração do código completo:

```text
Você é um desenvolvedor especialista em Next.js (App Router), Vercel Serverless e integrações de ERPs brasileiros.
Você deve construir uma integração robusta entre o Bling V3 e o Systêxtil Cloud para a empresa Pro Moda Têxtil.

Instruções Técnicas Rígidas:
1. O Systêxtil é o mestre físico absoluto. O Bling apenas espelha o estoque contido no "Depósito 50".
2. Toda transação de estoque deve suportar metros em formato decimal/fracionado (ex: 12.50).
3. Na exportação de produtos do Systêxtil para o Bling, monte o SKU usando a concatenação de: nivel_produto + grupo_id + subgrupo_id + item_id.
4. Ao faturar uma venda no Bling, capture o Webhook de NF-e, baixe o XML do Bling V3 via API, e execute o fluxo em cascata no Systêxtil: Criar Cliente, Registrar Pedido, Registrar XML de Entrada no módulo Fiscal (POST /fiscal/v1/documento/entrada para baixa do Depósito 50), e Gerar Título a Receber Financeiro.
5. Utilize a biblioteca Axios ou Fetch Nativo para o consumo das rotas e implemente o tratamento de erro HTTP 429 (Too Many Requests) do Bling usando uma fila de requisições com Backoff Exponencial.

O Client ID do aplicativo do Bling é: ea4e20b875cfdc7c67c35f1ec84da997a6d757cd
O Client Secret e o Webhook Secret NÃO devem ser colocados aqui: carregue-os de variáveis de ambiente (.env.local).
O Link de convite/Auth URL para testes de login é: https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=ea4e20b875cfdc7c67c35f1ec84da997a6d757cd&state=063a0e901100fe2cbd2e73eceafc5fb3
```

---

## 🚀 Como testar localmente

1. Clone o repositório para sua máquina local:
   ```bash
   git clone https://github.com/devtiagoabreu/isb.git
   cd isb
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local:
   ```bash
   npm run dev
   ```
4. Utilize o **Ngrok** ou o **Localtunnel** para expor a porta local (`3000`) para a internet e use a URL gerada para cadastrar seus Webhooks no Bling de forma segura (`https://`).
