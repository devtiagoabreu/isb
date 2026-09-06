// Textos de ajuda compartilhados entre as entidades CRUD.
// Conteúdo orientativo de preenchimento (têxtil, comercial, fiscal e contábil).

import type { CrudFieldInfo } from "./types";

export const CNPJ_9 = {
  oQue:
    "Primeira parte do CNPJ/CPF, com 9 dígitos (para CNPJ: base — antes da barra; para CPF: os 9 primeiros dígitos). O ERP Systêxtil cadastra o documento quebrado em 3 partes numéricas.",
  regras: [
    "Nunca digitar pontos, barras ou traço — somente os dígitos.",
    "Para CNPJ: são os 9 primeiros dígitos do número (ex.: 12.345.678/0001-95 → 123456789).",
    "Para CPF: são os 8 primeiros dígitos do CPF + o 9º dígito separado pelo campo cnpj_2 (o Systêxtil recompõe o documento unindo as partes).",
    "Confira na integração o parâmetro que recompõe cnpj_9 + cnpj_4 + cnpj_2 para validar o documento completo.",
  ],
  exemplos: [
    "CNPJ 12.345.678/0001-95 → cnpj_9 = 123456789",
    "CPF 123.456.789-09 → cnpj_9 = 12345678 (8 dígitos) e cnpj_2 = 9",
  ],
} satisfies CrudFieldInfo;

export const CNPJ_4 = {
  oQue:
    "Segunda parte do CNPJ: os 4 dígitos antes da barra (ordem/estabelecimento). Para pessoa física (CPF), geralmente vem zerado ou vazio.",
  regras: ["Somente dígitos, sem separadores.", "Só existe para CNPJ; para CPF mantenha vazio ou 0000 conforme convenção do ERP."],
  exemplos: ["CNPJ 12.345.678/0001-95 → cnpj_4 = 0001", "Pessoa física → cnpj_4 = (vazio)"],
} satisfies CrudFieldInfo;

export const CNPJ_2 = {
  oQue:
    "Terceira parte do documento: os 2 dígitos verificadores. Para CPF, ao invés dos dígitos verificadores, o Systêxtil grava aqui o 9º dígito do CPF.",
  regras: [
    "CNPJ: dígitos verificadores (ex.: .../0001-95 → 95).",
    "CPF: último dígito do bloco de 9 (os verificadores vão no cnpj_9) — siga a convenção do tenant.",
  ],
  exemplos: ["CNPJ 12.345.678/0001-95 → cnpj_2 = 95", "CPF 123.456.789-09 → cnpj_2 = 9"],
} satisfies CrudFieldInfo;

export const TIPO_PESSOA_SYSTEX = {
  oQue: "Se o cadastro é de Pessoa Física (CPF) ou Pessoa Jurídica (CNPJ).",
  regras: [
    "1 = Pessoa Física: use CPF, sem inscrição estadual obrigatória.",
    "2 = Pessoa Jurídica: use CNPJ e informe inscrição estadual quando contribuinte de ICMS.",
  ],
  exemplos: ["autônomo confecção → 1 (Física)", "indústria têxtil → 2 (Jurídica)"],
} satisfies CrudFieldInfo;

export const CEP_BRASIL = {
  oQue: "Código de Endereçamento Postal do endereço do cadastro (8 dígitos).",
  regras: ["Somente dígitos (o Systêxtil normalmente grava sem o hífen).", "Busque o CEP por UF/cidade para evitar erro de endereço na nota fiscal."],
  exemplos: ["06213-020 → 06213020", "05015-010 → 05015010"],
} satisfies CrudFieldInfo;

export const ENDERECO_SYSTEX =
  (
    n: string // nome do campo de endereço (retorna helper parametrizado)
  ) =>
  ({
    oQue: "Rua/avenida do endereço do cadastro, sem o número (que vai no campo próprio).",
    regras: [
      "Não repetir o número no campo endereço — existe campo específico.",
      "Digite tipo + nome (ex.: RUA, AV, TV, ROD) para normalizar a listagem.",
      "Endereço incompleto bloqueia a emissão de NF-e de saída.",
    ],
    exemplos: ["Rua do Brás, sem número (o 900 vai no campo Número)", "AV GUILHERME COTTING"],
  }) as CrudFieldInfo;

export const SITUACAO_CLIENTE = {
  oQue: "Situação do cadastro no ERP: ativo pode ser usado em pedidos e notas; inativo é bloqueado.",
  regras: [
    "1 = Ativo: apto a vender/faturar.",
    "2 = Inativo: bloqueia novos pedidos e NF-e (mantém histórico).",
    "Não se exclui cliente com movimento contábil — inative.",
  ],
  exemplos: ["cliente com pedidos em aberto → 1 (ativo)", "cliente encerrado → 2 (inativo)"],
} satisfies CrudFieldInfo;

export const DDD_TELEFONE = {
  oQue: "Código de área (DDD) do telefone fixo ou celular.",
  regras: ["Somente dígitos, geralmente 2 (11, 19, 62, 48...).", "Para telefone comercial têxtil com ramal, informe o DDD e o número sem o ramal."],
  exemplos: ["São Paulo → 11", "Campinas → 19"],
} satisfies CrudFieldInfo;

export const DDD_CELULAR = {
  oQue: "Código de área (DDD) do celular.",
  regras: ["Somente dígitos (11, 19, 62, 48...).", "Móvel: DDD + 9 dígitos (o 9º é do número, não do DDD)."],
  exemplos: ["São Paulo → 11", "Blumenau → 47"],
} satisfies CrudFieldInfo;

export const EMAIL_NFE = {
  oQue: "E-mail onde o ERP envia o arquivo XML/PDF da NF-e e os links de download.",
  regras: [
    "Pode ser um e-mail corporativo separado do e-mail comercial.",
    "Precisa ter caixa disponível (e-mail com bounce rejeita o envio da nota).",
    "Processos de cotações/confecções costumam usar o e-mail da administração.",
  ],
  exemplos: ["nf@tecidossubra.com.br (emissão de NF-e)", "financeiro@tecidossubra.com.br (2ª via)"],
} satisfies CrudFieldInfo;

export const INSCRICAO_ESTADUAL = {
  oQue: "Inscrição Estadual (IE) do contribuinte de ICMS — cadastro na SEFAZ estadual.",
  regras: [
    "Obrigatória para PJ contribuinte de ICMS (fábrica, atacado, transporte).",
    "Para PF/autônomo e para não contribuinte, deixe vazio.",
    "IE inválida ou de outra UF bloqueia a NF-e de saída e a homologação no SPED.",
  ],
  exemplos: ["SP → Ex.: 123.456.789.012", "consumidor final sem IE → (vazio)"],
} satisfies CrudFieldInfo;

export const TIPO_FRETE = {
  oQue: "Quem assume o frete da mercadoria (reflete no campo modalidade do frete da NF-e).",
  regras: [
    "0 = Contratação do frete por conta do destinatário/remetente pela Tabela (frete por conta de terceiros).",
    "1 = Por conta do emitente (CIF).",
    "2 = Por conta do destinatário (FOB).",
    "3 = Por conta de terceiros.",
    "4 = Transporte próprio por conta do remetente.",
    "5 = Transporte próprio por conta do destinatário.",
    "6 = Sem frete (cortesia).",
    "7 = Sem ocorrência de transporte.",
  ],
  exemplos: ["venda com entrega paga pela fábrica → 1 (CIF)", "venda com retirada na fábrica → 2 (FOB)"],
} satisfies CrudFieldInfo;

export const FORMA_PAGAMENTO = {
  oQue: "Código da forma/condição de pagamento padrão do cadastro no ERP (tabela de formas do Systêxtil).",
  regras: ["Use o código da tabela (não a descrição) — campos 'código' do ERP são numéricos.", "Convenção comum têxtil: BOLETO, DI, CHEQUE A PRAZO, CARTÃO, CREDIÁRIO — conforme cadastrado."],
  exemplos: ["Boleto 30 dias → código da forma", "Cheque pré-datado → código da forma"],
} satisfies CrudFieldInfo;

export const CAMPOS_BANCARIOS = {
  oQue: "Dados bancários do cadastro (banco, agência, conta) para remessa de títulos/boleto e PIX.",
  regras: [
    "Código do banco = 3 dígitos (Federação Brasileira de Bancos, ex.: 237 = Bradesco).",
    "Agência sem o dígito verificador (na maioria das convenções).",
    "Conta sem o dígito verificador, salvo convenção do ERP.",
  ],
  exemplos: ["Bradesco → banco 237, agência 1234", "Itaú → 341, agência 0056"],
} satisfies CrudFieldInfo;

export const TIPO_FORNECEDOR = {
  oQue: "Código do tipo de fornecedor na tabela do ERP (ex.: 1 = matéria-prima, 2 = embalagem, 3 = serviço, etc.).",
  regras: [
    "Separe por natureza: fios/tecelagem, tinturaria/beneficiamento, aviamentos e embalagens, transporte.",
    "O código deve existir na tabela de tipos — consulte com o suporte do Systêxtil.",
  ],
  exemplos: ["tecelagem (algodão bruto) → código da tabela", "transportadora → código da tabela"],
} satisfies CrudFieldInfo;

export const CIDADE_SYSTEX = {
  oQue: "Código numérico da cidade no cadastro de municípios do ERP, e a descrição apenas para exibição.",
  regras: [
    "Prefira escolher a cidade existente na tabela (o código alimenta o IBGE na NF-e).",
    "O campo de código é o que vale para o ERP; a descrição é informativa.",
  ],
  exemplos: ["São Paulo → código da tabela", "Blumenau → código da tabela"],
} satisfies CrudFieldInfo;

export const PIX_SYSTEX = {
  oQue: "Chave PIX para pagamento do fornecedor, cadastrada junto aos dados bancários.",
  regras: [
    "tipo 1 = CPF/CNPJ (somente dígitos) | 2 = e-mail | 3 = celular (com DDD) | 4 = chave aleatória.",
    "A chave deve ser a cadastrada no banco do recebedor (evita devolução de pagamento).",
    "Para PJ verifique se a chave é do CNPJ (não do sócio).",
  ],
  exemplos: ["tipo 1 → 12345678000195", "tipo 4 → 3e2b2f0a-4f5e-4c39-8b12-7f0b0a1a2b3c"],
} satisfies CrudFieldInfo;

export const NCM_TEXTIL = {
  oQue:
    "Classificação fiscal da mercadoria (8 dígitos) — obrigatória na NF-e, informada na 'Classificação fiscal' do produto.",
  regras: [
    "Setor têxtil: Cap. 52 = algodão, 54 = filamentos sintéticos, 55 = fibras sintéticas, 58 = tecidos especiais, 60 = malha, 62 = vestuário (tecido plano).",
    "Regra da fibra predominante em peso: tecido 60% algodão + 40% poliéster = NCM do algodão (Cap. 52).",
    "Verifique composição, peso (g/m²) e acabamento (cru/tingido/estampado) — cada combinação muda o NCM.",
    "NCM incorreto gera erro de tributação no SPED (PIS/COFINS) e multa.",
  ],
  exemplos: [
    "Tecido algodão cru, ≤200 g/m² → 5208.19.00",
    "Tecido algodão cru, >200 g/m² → 5209.19.00",
    "Camiseta de malha de algodão → 6109.10.00",
    "Calça jeans → 6203.42.00",
    "Tecido de malha → 6006.22.00",
    "Não tecido (TNT) → 5603.11.10",
  ],
} satisfies CrudFieldInfo;

export const CEST_TEXTIL = {
  oQue:
    "Código Especificador da Substituição Tributária (7 dígitos) — identifica a mercadoria sujeita a ICMS-ST na NF-e.",
  regras: [
    "Formato XX.XXX.XX: 2 dígitos do segmento + 3 do item + 2 da especificação.",
    "Em têxteis o segmento é o 14 (tecidos e artefatos dos Cap. 50–63) — códigos válidos de 14.001.00 a 14.014.00.",
    "Só preencha para mercadoria em ST pelo Convênio ICMS 142/2018 ou protocolo das UFs de origem/destino.",
    "CEST inexistente (ex.: 14.028.00) é rejeitado na validação da NF-e e do Bling — confirme na tabela CEST × NCM da UF.",
    "Ter CEST não significa estar em ST: depende do estado destinatário.",
  ],
  exemplos: [
    "Tecido com ST para a UF de destino → 14.014.00 (confira na tabela)",
    "Produto fora do ST → deixe vazio",
    "Inválido (rejeita na NF-e) → 14.028.00",
  ],
} satisfies CrudFieldInfo;

export const UNIDADE_MEDIDA = {
  oQue: "Unidade de medida de venda/estoque do item (tabela de unidades do ERP).",
  regras: [
    "Tecido plano costuma balizar em METRO (M) ou METRO QUADRADO (M2); peças de vestuário em UN (unidade).",
    "Fios e aviamentos: ROLO (RL), KG, M. Serviços: serviço/outro.",
    "A unidade do cadastro precisa bater com a unidade da NCM (ex.: tecido em M² na venda vs. KG na importação).",
  ],
  exemplos: ["tecido → M2", "peça de roupa → UN", "rolo de fio → RL ou KG", "serviço de beneficiamento → OUTRO/SER"],
} satisfies CrudFieldInfo;

export const GENERO_TIPI = {
  oQue:
    "Gênero do item conforme a tabela de gêneros do SPED Fiscal (para o Bling: 'tipo de item SPED'). Geralmente coincide com o capítulo da TIPI.",
  regras: [
    "Tabela de Gênero do Item (SPED fiscal): gênero = capítulo TIPI da mercadoria.",
    "Têxteis: gênero correspondente ao capítulo (52 algodão, 54 sintéticos, 60 malha, 62 vestuário...).",
    "Alguns produtos têxteis podem ter gêneros genéricos para serviços (ex.: beneficiamento) — confira com o fiscal.",
  ],
  exemplos: ["5208.19.00 → gênero 52 (algodão)", "tecidos de malha 60xx → gênero 60"],
} satisfies CrudFieldInfo;

export const CODIGO_BARRAS = {
  oQue: "Barras do produto (EAN-13 quando houver; código interno quando trabalha com grades).",
  regras: [
    "Confecção usa EAN-13 por grade (cor/tamanho) — o cadastro guarda o EAN da combinação.",
    "Padrão comum têxtil: 789 + código interno (12-13 dígitos).",
    "Deixe vazio quando o item não tem código de barras físico (ex.: serviço).",
  ],
  exemplos: ["789 + 10 dígitos internos (EAN-13)", "(vazio) para serviço ou item sem grade própria"],
} satisfies CrudFieldInfo;

export const COMPRADO_FABRICADO = {
  oQue: "Indica se o item é comprado de terceiros ou produzido na própria fábrica (controla o PCP).",
  regras: [
    "1 = Comprado (itens de fornecedor — não gera OP).",
    "2 = Fabricado (gerado via ordem de produção no PCP, com estrutura).",
    "Tecido comprado pronto entra como comprado; tecido beneficiado internamente pode ser 'fabricado'.",
  ],
  exemplos: ["fio comprado → 1", "tecido tecido na tecelagem → 2"],
} satisfies CrudFieldInfo;

export const ORIGEM_MERCADORIA = {
  oQue: "Origem da mercadoria para a NF-e (campo orig do grupo de impostos).",
  regras: [
    "0/1 = Nacional (0 = nacional conforme TIPI; 1 = nacional com conteúdo de importação).",
    "2 = Estrangeira (importada direta); 3 = Estrangeira com conteúdo nacional.",
    "Para tecidos importados, informe o CFOP e orig corretos para não distorcer o crédito de ICMS.",
  ],
  exemplos: ["tecido nacional → 0", "tecido importado → 2", "beneficiamento nacional → 0"],
} satisfies CrudFieldInfo;

export const CONTA_ESTOQUE = {
  oQue: "Conta contábil de estoque (plano de contas) que recebe o valor do item — alimenta o saldo do balanço (ativo circulante).",
  regras: [
    "Insumos/MP → subconta de matéria-prima; produto acabado → subconta de produto acabado.",
    "Contabilmente um tecido comprado entra como matéria-prima e migra para produto acabado após o PCP.",
    "Use a conta do plano vigente (ex.: 1.1.5.x) e confira o espelho no SPED.",
  ],
  exemplos: ["fio/aviamento → conta MP 1.1.5.01", "tecido acabado → conta PA 1.1.5.03"],
} satisfies CrudFieldInfo;

export const NIVEL_PRODUTO = {
  oQue:
    "Nível do item na estrutura do produto (hierarquia de materiais da tecelagem). O item é identificado por Nível + Grupo + Subgrupo + Item.",
  regras: [
    "1 = Peça (produto comercial); 2 = Tecido; 4 = Tecido Cru; 5 = Serviços; 7 = Fio; 8 = Largura de tecido; 9 = Material Comprado.",
    "Tecido cru (4) vira tecido comercial (2) após beneficiamento.",
    "Serviços (5) não geram estoque físico.",
  ],
  exemplos: ["camisa pronta → 1", "tecido beneficiado → 2", "tecido em branco → 4", "tinturaria (serviço) → 5", "fio de algodão → 7"],
} satisfies CrudFieldInfo;

export const GRUPO_SUBGRUPO_ITEM = {
  oQue:
    "Endereço completo do item na estrutura: Grupo.Subgrupo.Item de Estrutura. São códigos numéricos do ERP (ex.: Grupo 10 = tecelagem, Subgrupo 100 = algodão, Item = sequencial).",
  regras: [
    "Sempre informe Grupo + Subgrupo + Item junto com o Nível — sozinho o caminho é vazio.",
    "Use a hierarquia já cadastrada para não criar itens duplicados.",
    "A descrição do item costuma ser formada automaticamente pelo ERP a partir do nível.",
  ],
  exemplos: ["Nível 2 (Tecido) → Grupo 020 · Subgrupo 0209 · Item 002", "Nível 7 (Fio) → Grupo 070 · Subgrupo 0701 · Item 003"],
} satisfies CrudFieldInfo;

export const CLI_ID = {
  oQue: "Identificador interno da grade de tamanho utilizada no cadastro de grade do ERP.",
  regras: [
    "Grades comuns em confecção: PP/P/M/G/GG/ÚNICO; infantil NUMÉRICAS (2,4,6,8); malha P/M/G.",
    "Só é obrigatório quando o item usa grade (itens de peça).",
    "Para tecido em metro, normalmente a grade não se aplica (deixe vazio).",
  ],
  exemplos: ["código da grade PP-P-M-G-GG", "código da grade única (para tecido) se o ERP exigir"],
} satisfies CrudFieldInfo;

export const TIPO_CODIGO_EAN = {
  oQue: "Como o EAN é gerado para o item com grade: por cor ou por tamanho.",
  regras: [
    "1 = EAN por cor (mesmo código de barras para todos os tamanhos de uma cor).",
    "2 = EAN por tamanho (código de barras diferente por tamanho).",
    "Escolha conforme a operação: varejo normalmente precisa de EAN único por cor para a etiqueta e o ponto de venda.",
  ],
  exemplos: ["etiqueta por cor → 1", "etiqueta por tamanho → 2"],
} satisfies CrudFieldInfo;

export const TIPO_PRODUTO_PEDIDO = {
  oQue: "Qualidade do produto comercializada no pedido (primeira, segunda, retalho, amostra, exportação...).",
  regras: [
    "1 = Primeira qualidade; 2 = Segunda; 3 = Retalho; 4 = Amostragem; 5 = Exportação; 6 = Desenvolvimento.",
    "Segunda qualidade e retalho mudam o preço e o estoque (contas separadas).",
    "Amostragem (4) não gera faturamento normal — uso para malha de amostra.",
  ],
  exemplos: ["tecido dentro do padrão → 1", "fim de rolo defeituoso → 2 ou 3"],
} satisfies CrudFieldInfo;

export const TIPO_PEDIDO = {
  oQue: "Forma de atendimento do pedido no PCP (programado sob encomenda ou pronta entrega).",
  regras: [
    "0 = Programado: entra no PCP como encomenda (produzir/tecer sob demanda).",
    "1 = Pronta entrega: atende do estoque (sem gerar demanda de produção).",
  ],
  exemplos: ["pedido de tecido personalizado → 0", "pedido de produto em estoque → 1"],
} satisfies CrudFieldInfo;

export const TIPO_PROMOCAO = {
  oQue: "Se o pedido tem caráter promocional/desconto especial.",
  regras: ["0 = não é promoção; 1 = é promoção; 2 = é desconto.", "Promoção/desconto pode exigir autorização e contabilização de descontos comerciais separada."],
  exemplos: ["venda normal → 0", "campanha de fim de estação → 1", "desconto por volume → 2"],
} satisfies CrudFieldInfo;

export const NATUREZA_OPERACAO = {
  oQue: "Natureza da operação do documento fiscal (código da tabela de naturezas da empresa).",
  regras: [
    "Exemplos: 'Venda de mercadoria', 'Venda fora do estado', 'Devolução de compra', 'Remessa de amostra grátis'.",
    "A natureza define o CFOP e a tributação (ICMS/PIS/COFINS) da NF-e.",
    "Use naturezas distintas para venda interna, interestadual e devolução — evita erro de CFOP.",
  ],
  exemplos: ["código de 'Venda de mercadoria' do catálogo", "código de 'Devolução de venda' do catálogo"],
} satisfies CrudFieldInfo;

export const CFOP = {
  oQue: "Código Fiscal de Operações e Prestações (4 dígitos) usado no frete/faturamento do pedido.",
  regras: [
    "Venda dentro do estado: 5.102/5.101; fora do estado (têxtil SP→MG): 6.102.",
    "Compra: inteira 1.102 (+ importação 3.102); devolução de venda 2.102/2.202; transferência 5.949.",
    "O CFOP deve ser consistente com a natureza da operação e o envio/recebimento de mercadoria.",
    "SPED: CFOP incorreto gera glosa de crédito e obriga EFD.",
  ],
  exemplos: ["venda SP (mesma UF) → 5102", "venda SP→MG (tecido) → 6102", "devolução de venda → 2202"],
} satisfies CrudFieldInfo;

export const FRE_VIA = {
  oQue: "Via de transporte do pedido (terrestre, aéreo, marítimo, ferroviário, fluvial).",
  regras: ["Têxtil nacional (SP, MG, PR, BA etc.) normalmente é terrestre/rodoviário.", "Importação/exportação pode ser marítima ou aérea."],
  exemplos: ["entrega rodoviária nacional → 1 (terrestre)", "exportação por navio → 3 (marítimo)"],
} satisfies CrudFieldInfo;

export const PEDIDO_MAE = {
  oQue: "Indica se o pedido é um pedido-mãe (que gera/aglomera subpedidos) no fluxo de produção.",
  regras: ["S = é pedido-mãe (split em subpedidos por setor); N = pedido comum.", "Pedido-mãe não fatura diretamente."],
  exemplos: ["pedido desmembrado por cor/tamanho → S", "pedido direto → N"],
} satisfies CrudFieldInfo;

export const SITUACAO_VENDA = {
  oQue: "Situação de venda interna do ERP (diferente do status do pedido) usada para filtros e relatórios.",
  regras: [
    "Códigos comuns: 0 = digitado, 5 = faturado, 9 = cancelado, 15 = em aberto, 50+ = etapas de produção/faturamento (opcional).",
    "Cabe ao fiscal/ti confirmar a tabela de situações do tenant — os números variam entre instalações.",
  ],
  exemplos: ["pedido novo → 0", "pedido cancelado → 9", "conforme tabela do tenant"],
} satisfies CrudFieldInfo;

export const STATUS_PEDIDO = {
  oQue: "Etapa do pedido no fluxo de aprovação/faturamento.",
  regras: [
    "0 digitado → 1 financeiro → 2 liberado financeiro → 3 faturamento → faturado.",
    "4 = a cancelar; 5 = cancelado; 9 = aberto na web.",
    "Reverta status apenas com autorização (controles de auditoria do ERP).",
  ],
  exemplos: ["pedido aprovado → 2 (liberado financeiro)", "pedido cancelado → 5"],
} satisfies CrudFieldInfo;

export const COLEÇÃO = {
  oQue: "Coleção comercial a que pertence o produto (ex.: coleção verão/outono) — agrupa itens no catálogo.",
  regras: [
    "Nomeie por temporada: ex.: 'COLEÇÃO VERÃO 2026', 'COLECAO TEJUCABA 2025'.",
    "Confecção usa coleção para lançamento, amostradores e grades.",
  ],
  exemplos: ["Verão 2026", "Inverno 2025"],
} satisfies CrudFieldInfo;

export const COLEÇÃO_INTERNACIONAL = {
  oQue: "Descrição traduzida da coleção para catálogos/exportação.",
  regras: ["Mantenha o mesmo sentido da descrição original.", "Exportação para países hispanófonos/latinos usa o espanhol."],
  exemplos: ["'Summer 2026' (inglês)", "'Verano 2026' (espanhol)"],
} satisfies CrudFieldInfo;

export const LARGURA = {
  oQue: "Largura util do tecido (em cm ou m, conforme a convenção da fábrica) — usada no cálculo de metragem e rendimento.",
  regras: [
    "Tecidos planos comuns: 1,40 m; 1,50 m; 1,60 m (larguras de tear).",
    "A largura informada deve ser a largura util (após encolhimento/enxugadura), não a do tear.",
    "Confira a unidade usada pela integração (cm ou m).",
  ],
  exemplos: ["tecido 1,50 m → 1.50 (m) ou 150 (cm)", "tecido 1,14 m → 1.14 ou 114"],
} satisfies CrudFieldInfo;

export const METRAGEM = {
  oQue: "Metragem média do rolo do tecido (quantos metros tem em média cada rolo) — base para conversão de estoque.",
  regras: [
    "Rolos de tecido plano em média 30–60 m (tecidos mais encorpados 25–40 m).",
    "Usado no PCP para transformar rolos em metros e no estoque.",
  ],
  exemplos: ["rolo de 50 m → 50", "rolo de 36 m → 36"],
} satisfies CrudFieldInfo;

export const PESO_OZ = {
  oQue: "Gramatura/peso do tecido, geralmente expresso em onças por jarda quadrada (oz/yd²) para malhas e denim.",
  regras: [
    "Jeans e malha costumam usar 8 a 14 oz (denim 12 oz é padrão).",
    "Conversão: 1 oz/yd² ≈ 33,91 g/m² — útil para validar o NCM (≤200 g/m² vs >200 g/m²).",
  ],
  exemplos: ["jeans 12 oz → 12", "malha penteada 9 oz → 9", "gramatura 220 g/m² ≈ 6.5 oz"],
} satisfies CrudFieldInfo;

export const CLASSIFICACAO_FISCAL = {
  oQue: "NCM da mercadoria no cadastro do Systêxtil (campo 'classificação fiscal'), usado na NF-e.",
  regras: [
    "Preencha com o NCM completo de 8 dígitos (ex.: 5208.19.00).",
    "Combine com o CEST quando o item estiver em ST (ICMS-ST).",
    "Têxtil: Cap. 50–64 conforme fibra, peso e acabamento (ver regras do NCM).",
  ],
  exemplos: ["5208.19.00 (tecido algodão cru)", "5512.11.00 (tecido poliéster)", "5603.11.10 (TNT)"],
} satisfies CrudFieldInfo;

export const LINHA = {
  oQue: "Linha de produto no ERP (agrupamento comercial, ex.: lençol, toalha, cama/mesa/banho, jeans).",
  regras: ["Linha costuma ser usada no cadastro comercial e no catálogo.", "Confira os códigos existentes na tabela de linhas."],
  exemplos: ["código da linha 'Cama, mesa e banho'", "código da linha 'Jeans'"],
} satisfies CrudFieldInfo;

export const TIPO_PRODUTO = {
  oQue: "Código complementar que refina o nível do item (varia conforme o nível — informar igual ao do ERP).",
  regras: ["Para tecido pode indicar o tipo de ligamento; para peça o tipo de peça.", "Consulte a tabela do Systêxtil — os valores dependem do nível."],
  exemplos: ["tecido plano → código da tabela", "peça de vestuário → código da tabela"],
} satisfies CrudFieldInfo;

export const COR_ESTOQUE = {
  oQue: "Cor / sortimento de estoque do item (ex.: cor de referência usada no saldo).",
  regras: ["Cadastre por cor de estoque quando o ERP não usa grade por cor.", "Padronize nomes de cor (BRANCO, PRETO, AZUL ROYAL)."],
  exemplos: ["BRANCO", "PRETO", "AZUL ROYAL"],
} satisfies CrudFieldInfo;

export const SITUACAO_PRODUTO = {
  oQue: "Situação do item no Cadastro (ativa/inativa/lançamento).",
  regras: [
    "0 = Ativo; 1 = Inativo (bloqueia venda/faturamento); 2 = Lançamento (pré-coleção).",
    "Item em lançamento pode não gerar estoque/pedido ainda.",
  ],
  exemplos: ["produto comercializado → 0", "item fora de linha → 1"],
} satisfies CrudFieldInfo;

export const PRODUTO_PROTOTIPO = {
  oQue: "Marca o item como protótipo (amostra de desenvolvimento).",
  regras: ["true = protótipo (não vende, não compõe estoque normal).", "false = produto normal."],
  exemplos: ["peça piloto para prova → true", "produto de venda → false"],
} satisfies CrudFieldInfo;

export const TIPO_CONTA = {
  oQue: "Classifica a conta bancária do cadastro.",
  regras: ["1 = Conta normal (corrente CC) — usada em remessas de cobrança.", "2 = Poupança (não aceita boleto/cheque)."],
  exemplos: ["conta corrente → 1", "poupança → 2"],
} satisfies CrudFieldInfo;

export const MOEDA = {
  oQue: "Código da moeda da condição/contrato (padrão 1 = Real).",
  regras: ["Exportação usa a moeda do contrato (ex.: USD = dólar).", "Venda interna usa o Real."],
  exemplos: ["venda interna → 1 (R$)", "exportação → código da moeda (USD)"],
} satisfies CrudFieldInfo;

export const SEQUENCIA_ENDERECO = {
  oQue: "Contador (sequência) do endereço do cliente no ERP quando há mais de um endereço.",
  regras: ["Mantenha o mesmo sequencial já existente ao editar (não duplicar).", "Cada endereço extra recebe uma sequência nova."],
  exemplos: ["endereço principal → 1", "segundo endereço → 2"],
} satisfies CrudFieldInfo;

export const CAMPOS_CLIENTE_PEDIDO = {
  oQue: "CNPJ/CPF do cliente que consta no pedido (8-9 dígitos).",
  regras: ["É a primeira parte do CNPJ (antes da barra) ou os primeiros dígitos do CPF.", "Precisa existir o cadastro de cliente — o pedido referencia o cadastro."],
  exemplos: ["12.345.678/0001-95 → 12345678 (8 dígitos, por convenção do pedido)"],
} satisfies CrudFieldInfo;

export const DESCONTO_SPD = {
  oQue: "Percentuais de desconto comerciais aplicados no pedido (1, 2 e 3).",
  regras: [
    "Só aplicar percentuais autorizados (tabela comercial).",
    "Desconto soma na sequência 1 → 2 → 3 (ex.: 5% + 2% + 1%).",
    "Descontos elevados alteram a base de PIS/COFINS — validar com o fiscal.",
  ],
  exemplos: ["tabela de desconto 10% → 10", "desconto progressivo 5% + 2% → 5 e 2"],
} satisfies CrudFieldInfo;

export const ENCARGOS = {
  oQue: "Percentual de encargos financeiros (juros/financiamento) embutido no pedido.",
  regras: ["Usado em vendas a prazo com encargos embutidos.", "Não confundir com juros contratuais — esse é encargo de operação."],
  exemplos: ["venda financiada com 2% a.m. → 2 (conforme política)"],
} satisfies CrudFieldInfo;

export const ORIGEM_PEDIDO = {
  oQue: "Origem do pedido (código da tabela: balcão, telefone, web, representante, etc.).",
  regras: ["Identifica o canal de venda para comissões e relatórios.", "Ajuste conforme a tabela de origens do ERP."],
  exemplos: ["balcão → código", "representante → código"],
} satisfies CrudFieldInfo;

export const FUNCIONARIO_REPRESENTANTE = {
  oQue: "Códigos do funcionário que lançou o pedido e do representante que comissiona a venda.",
  regras: ["Podem ser diferentes: lançador vs. representante da praça.", "O representante normalmente recebe comissão — certifique o código certo."],
  exemplos: ["funcionário 123 (vendedor interno)", "representante 45 (comissão da praça)"],
} satisfies CrudFieldInfo;

export const PORTADOR = {
  oQue: "Portador do boleto/titularidade da cobrança (banco) no pedido.",
  regras: ["Usado na geração de títulos de cobrança.", "Use o código do banco portador cadastrado (ex.: 237 Bradesco, 341 Itaú)."],
  exemplos: ["237 (Bradesco)", "341 (Itaú)"],
} satisfies CrudFieldInfo;

export const BRASIL_DADOS_PESSOA = {
  oQue: "Dados básicos do cliente na operação (nome/razão social, CPF/CNPJ).",
  regras: [
    "Razão social é o nome oficial (contrato/CNPJ); fantasia a marca com que vende.",
    "CPF/CNPJ sem máscara no cadastro, para validar corretamente.",
  ],
  exemplos: ["Cliente confecção → 'Malharia Campos Ltda' (razão) / 'Campos Malhas' (fantasia)"],
} satisfies CrudFieldInfo;

export const DADOS_CONTATO = {
  oQue: "Pessoa de contato do cadastro (quem atende pedidos, orçamentos e cobranças).",
  regras: ["Prefira o contato comercial (comprador/representante).", "Separar contato de faturamento quando o ERP comporta."],
  exemplos: ["'Maria do Compras — (19) 98888-7777'", "'Departamento Financeiro'"],
} satisfies CrudFieldInfo;

export const OBSERVACOES = {
  oQue: "Anotações livres do cadastro (condições especiais, alertas de entrega, restrições).",
  regras: ["Não colocar dados sensíveis bancários nestes campos (logs visíveis).", "Use para alertas comerciais/reais, não contábeis."],
  exemplos: ["'Só entregar terça e sexta'", "'Solicitar pedido mínimo de 100 peças'"],
} satisfies CrudFieldInfo;

// ---------- Bling ----------

export const BLING_TIPO_PESSOA = {
  oQue: "Tipo de pessoa do contato.",
  regras: [
    "F = Pessoa física (CPF); J = Pessoa jurídica (CNPJ); E = Estrangeira.",
    "Para PJ, o número do documento usa apenas dígitos do CNPJ.",
  ],
  exemplos: ["confecção → J", "autônomo → F", "cliente no exterior → E"],
} satisfies CrudFieldInfo;

export const BLING_SITUACAO = {
  oQue: "Situação do cadastro no Bling.",
  regras: [
    "A = Ativo · I = Inativo · E = Excluído · S = Sem movimento.",
    "Excluído (E) é usado pelo módulo de exclusão em 2 passos — não escolher manualmente no cadastro.",
  ],
  exemplos: ["contato ativo → A", "contato inativo → I"],
} satisfies CrudFieldInfo;

export const BLING_TIPO_PRODUTO = {
  oQue: "Se o item é produto físico ou serviço.",
  regras: ["P = Produto (gera estoque e NF-e de mercadoria).", "S = Serviço (não gera estoque; fatura por serviço na NFSe)."],
  exemplos: ["tecido → P", "beneficiamento terceirizado → S"],
} satisfies CrudFieldInfo;

export const BLING_FORMATO = {
  oQue: "Se o produto é simples ou variável (grade de cor/tamanho).",
  regras: [
    "S = Simples (um SKU sem grade).",
    "V = Variável (grade: cria variações por cor/tamanho no Bling).",
    "Confecção com grade PP/P/M/G usa V.",
  ],
  exemplos: ["tecido por metro → S", "camiseta PP-P-M-G → V"],
} satisfies CrudFieldInfo;

export const BLING_CATEGORIA = {
  oQue: "Grupo que organiza o produto (o vinculado ao cadastro também aparece no marketplace).",
  regras: [
    "Use o ID da categoria (o campo aceita o número, ex.: 14070698).",
    "Categorias têxteis comuns: 'CAMISETAS', 'TECIDOS', 'CAMA MESA', 'JEANS'.",
  ],
  exemplos: ["camisetas → 14070698", "tecidos → (ID da categoria no Bling)"],
} satisfies CrudFieldInfo;

export const BLING_UNIDADE = {
  oQue: "Unidade de venda do produto.",
  regras: [
    "Tecido: M ou M2 (metro/metro quadrado); peça: UN (unidade); fio: RL ou KG.",
    "A unidade da venda deve ser coerente com a da NF-e.",
  ],
  exemplos: ["tecido 1,50m → M2", "camiseta → UN", "rolo de fio → RL"],
} satisfies CrudFieldInfo;

export const BLING_MARCA = {
  oQue: "Marca do produto (vinculada ao cadastro de marcas do Bling).",
  regras: ["Use texto curto, capitalizado, sem CNPJ.", "A marca aparece no título/descrição dos marketplaces."],
  exemplos: ["Dohler", "Santista", "Casa Maia"],
} satisfies CrudFieldInfo;

export const BLING_GTIN = {
  oQue: "Código de barras (EAN/GTIN) do produto.",
  regras: [
    "EAN-13 (13 dígitos começando com 789 no Brasil) ou GTIN-8 para itens pequenos.",
    "O dígito verificador deve ser válido — o Bling valida e pode rejeitar.",
    "Não criar GTIN inventado em produtos de exportação.",
  ],
  exemplos: ["7891000100004", "789 + 9 dígitos + verificador"],
} satisfies CrudFieldInfo;

export const BLING_PESO = {
  oQue: "Peso líquido e bruto (embalagem) do produto, em kg.",
  regras: [
    "Peso bruto = líquido + embalagem.",
    "Conferido nos transportes (frete) e no peso da NF-e.",
    "Tecido: use o peso médio por unidade vendida (kg/metro).",
  ],
  exemplos: ["tecido 0,51 kg/rolo → líquido 0.51 bruto 0.55", "camiseta ~0,20 kg"],
} satisfies CrudFieldInfo;

export const BLING_NCM = NCM_TEXTIL;
export const BLING_CEST = CEST_TEXTIL;
export const BLING_ORIGEM_MERCADORIA = ORIGEM_MERCADORIA;

export const BLING_DEPOSITO = {
  oQue: "Depósito de estoque onde a mercadoria é armazenada.",
  regras: [
    "situacao 1 = Ativo (recebe movimento); 0 = Inativo (bloqueia entrada/saída).",
    "padrao = true indica o depósito default de entrada.",
    "É o Bling quem controla a regra: não é permitido inativar/remover o depósito padrão (precisa de outro depósito padrão antes).",
    "O Bling não possui endpoint de exclusão de depósito — inative em vez de excluir.",
  ],
  exemplos: ["'Geral' → padrão true, ativo", "'Expedição' → padrão false, ativo"],
} satisfies CrudFieldInfo;

export const BLING_VENDEDOR = {
  oQue: "Vendedor vinculado a um contato.",
  regras: [
    "O Bling não cria/edita vendedor por API — somente consulta.",
    "descontoLimite = teto de desconto que o vendedor pode aplicar.",
  ],
  exemplos: ["vendedor João → contato.nome 'João da Silva', descontoLimite 10.0"],
} satisfies CrudFieldInfo;

export const BLING_PEDIDO_VENDA = {
  oQue: "Pedido de venda emitido no Bling.",
  regras: [
    "Campos: número do pedido, data, cliente (contato), situação, loja e totais.",
    "Abaixo só há leitura — criação/edição são feitas na tela Vendas do Bling (PUT destrutivo evitado aqui).",
  ],
  exemplos: ["pedido 10025 → cliente 'Campos Malhas', total 5.400,50"],
} satisfies CrudFieldInfo;

export const NOME_RAZAO_SOCIAL = {
  oQue: "Nome ou razão social do cadastro.",
  regras: [
    "Razão social = nome oficial do contrato/CNPJ (ex.: 'Malharia Campos Ltda').",
    "Nome fantasia = marca com que vende ('Campos Malhas') — vai no campo próprio."],
  exemplos: ["'Malharia Campos Ltda' (razão)", "'Tecidos Elegance Ltda' (razão)"],
} satisfies CrudFieldInfo;

export const FANTASIA = {
  oQue: "Nome fantasia / marca do cadastro.",
  regras: ["Curto, sem CNPJ, sem símbolos.", "Usado em formulários e etiquetas comerciais."],
  exemplos: ["'Campos Malhas'", "'Elegance Tecidos'"],
} satisfies CrudFieldInfo;

export const NUMERO = {
  oQue: "Número do endereço do cadastro.",
  regras: ["Somente o número (sem 'nº', razão ou andar).", "Não existe → use 'S/N'."],
  exemplos: ["900", "S/N"],
} satisfies CrudFieldInfo;

export const COMPLEMENTO = {
  oQue: "Complemento do endereço (bloco, galpão, sala, andar).",
  regras: ["Use apenas quando necessário (padroniza o endereço e evita erros na NF-e)."],
  exemplos: ["BLOCO A", "GALPAO 2", "LOJA 34"],
} satisfies CrudFieldInfo;

export const BAIRRO = {
  oQue: "Bairro do endereço do cadastro.",
  regras: ["Digite de forma consistente (o SEFAZ compara com o CEP)."],
  exemplos: ["BRAS", "CENTRO"],
} satisfies CrudFieldInfo;

export const UF_BRASIL = {
  oQue: "Unidade federativa (sigla com 2 letras).",
  regras: ["Use a sigla maiúscula (SP, MG, PR, BA...).", "Deve ser coerente com CEP e cidade (regra de antiga SRF/SEFAZ)."],
  exemplos: ["SP", "MG", "SC"],
} satisfies CrudFieldInfo;

export const CELULAR = {
  oQue: "Telefone celular do cadastro, com DDD no campo próprio.",
  regras: ["Apenas dígitos, sem parênteses/traço.", "Móvel: 9 dígitos + DDD no campo separado."],
  exemplos: ["988887777 (com DDD 11 no campo próprio)"],
} satisfies CrudFieldInfo;

export const TELEFONE = {
  oQue: "Telefone fixo do cadastro com DDD no campo próprio.",
  regras: ["Apenas dígitos, sem parênteses/traço.", "Se houver ramal, coloque apenas o número e informe o ramal em observações."],
  exemplos: ["37777000 (com DDD 11 no campo próprio)"],
} satisfies CrudFieldInfo;

export const EMAIL = {
  oQue: "E-mail comercial do cadastro (contato cotação/pedido).",
  regras: ["E-mail válido e com caixa (recebimento de pedidos/boletos).", "Separe do e-mail de NF-e quando houver — use o campo próprio."],
  exemplos: ["comercial@tecidossubra.com.br", "contato@malharia.com.br"],
} satisfies CrudFieldInfo;

export const PRECO = {
  oQue: "Preço de venda unitário do produto.",
  regras: ["Preço por unidade de medida de venda (metro, peça, quilo).", "Sem impostos embutidos? Confira a política comercial de cada cliente."],
  exemplos: ["12,90 → 12.9", "85,00 por peça → 85"],
} satisfies CrudFieldInfo;

export const PRECO_CUSTO = {
  oQue: "Preço de custo do produto (último custo de compra/formação).",
  regras: ["É dado interno — não expor em catálogos/marketplaces.", "Embasa a margem e o custo da NF-e de venda (SPED)."],
  exemplos: ["última entrada de 8,30 → 8.3"],
} satisfies CrudFieldInfo;

export const DESCRICAO_CURTA = {
  oQue: "Descrição curta do produto para marketplaces e vitrines.",
  regras: ["Texto raso, sem HTML, sem caracteres especiais.", "Menos de 50 caracteres para as vitrines dos marketplaces."],
  exemplos: ["'Tecido algodão 200g, cor branca'", "'Camiseta algodão penteado'"],
} satisfies CrudFieldInfo;

export const CODIGO_PRODUTO = {
  oQue: "Código de referência do produto (código interno de tecido/peça).",
  regras: [
    "Deve ser único no cadastro.",
    "Use a referência da fábrica (ex.: fiação/ligamento baliza o código).",
    "Sem espaços, pontos ou caracteres especiais.",
  ],
  exemplos: ["2.K1820.093.102705", "100/4"],
} satisfies CrudFieldInfo;

export const NOME_PRODUTO = {
  oQue: "Nome/descrição do produto como aparece em NF-e, pedidos e marketplaces.",
  regras: [
    "Use o nome comercial completo do tecido/peça (referência + característica).",
    "Consistente com a NCM (não informe características que contradizem a classificação).",
  ],
  exemplos: ["'TECIDO LENCOL ELEGANCE ALGODAO TRICOLINE'", "'CAMISETA MALHA PENTEADA GOLA V'"],
} satisfies CrudFieldInfo;

export const BLING_SITUACAO_DEPOSITO = {
  oQue: "Situação do depósito de estoque.",
  regras: [
    "1 = Ativo: recebe e libera movimento de estoque.",
    "0 = Inativo: bloqueia entrada/saída de mercadoria.",
  ],
  exemplos: ["depósito em uso → 1", "na filial desativada → 0"],
} satisfies CrudFieldInfo;

export const DEPOSITO_PADRAO = {
  oQue: "Marca o depósito como padrão (destino default de entrada de mercadoria).",
  regras: [
    "Deve existir UM depósito padrão por operação.",
    "O Bling impede inativar/remover o depósito padrão: para trocar, aponte outro como padrão primeiro.",
  ],
  exemplos: ["'Geral' → padrão = true", "'Expedição' → padrão = false"],
} satisfies CrudFieldInfo;

export const DESCONSIDERAR_SALDO = {
  oQue: "Indica que o saldo deste depósito é desconsiderado no cálculo de disponibilidade.",
  regras: [
    "true = saldo não conta (ex.: depósito de terceiros/consignado).",
    "false = saldo conta no estoque disponível.",
    "Combinar com o tipo da operação (balanço do disponível).",
  ],
  exemplos: ["depósito consignado → true", "estoque próprio → false"],
} satisfies CrudFieldInfo;

export const SITUACAO_FORNECEDOR = {
  oQue: "Situação do cadastro do fornecedor no ERP.",
  regras: [
    "1 = Ativo (compras liberadas).",
    "2 = Inativo (bloqueia novas compras/pedidos).",
    "9 = Pré-cadastro (aguardando qualificação do comprador).",
  ],
  exemplos: ["fornecedor homologado → 1", "fornecedor em análise → 9"],
} satisfies CrudFieldInfo;

export const TIPO_SOCIO = {
  oQue: "Indica se o fornecedor está relacionado como sócio de empresa do grupo (partes relacionadas).",
  regras: [
    "Use para transparência de partes relacionadas (controles societários).",
    "Não é pré-requisito para a compra — é informação complementar.",
  ],
  exemplos: ["fornecedor ligado ao sócio → true", "fornecedor independente → false"],
} satisfies CrudFieldInfo;

export const DISPONIVEL_INTERNET = {
  oQue: "Se a coleção é pública no canal web/B2B.",
  regras: [
    "true = aparece no catálogo online/B2B.",
    "false = só uso interno no ERP.",
  ],
  exemplos: ["coleção comercial publicada → true", "coleção em desenvolvimento → false"],
} satisfies CrudFieldInfo;

export const TIPO_PECA_PEDIDO = {
  oQue: "Tipo de peça comercializado no pedido (norteia o perfil de itens esperados).",
  regras: [
    "1 = Peças (vestuário confeccionado).",
    "2 = Tecidos (beneficiados).",
    "4 = Tecidos crus.",
    "7 = Fios.",
  ],
  exemplos: ["pedido de tecido beneficiado → 2", "pedido de camisetas → 1"],
} satisfies CrudFieldInfo;

export const TIPO_FRETE_PEDIDO = {
  oQue: "Como o frete é tratado neste pedido (convenção do pedido de venda).",
  regras: [
    "1 = Frete pago · 2 = Frete a pagar · 3 = Por conta de terceiros · 4 = Cortesia · 5 = Valor fechado · 6 = Transporte próprio remetente · 7 = Transporte próprio destinatário.",
    "Siga a tabela vigente do ERP — o número aqui não é o código da NF-e.",
  ],
  exemplos: ["entrega paga pela fábrica (CIF) → 1", "frete avulso do cliente (FOB) → 2"],
} satisfies CrudFieldInfo;

export const EMPRESA_PEDIDO = {
  oQue: "Código da empresa/estabelecimento emissor do pedido.",
  regras: ["Use o código do CNPJ da empresa de venda.", "Define a série da NF-e e o cadastro fiscal usado."],
  exemplos: ["código da empresa matriz → 1 (exemplo)", "código da filial de expedição → 2 (exemplo)"],
} satisfies CrudFieldInfo;

export const CODIGO_PEDIDO = {
  oQue: "Número sequencial do pedido na empresa.",
  regras: ["É gerado pelo ERP (sequência por empresa).", "Usado como referência comercial e de faturamento."],
  exemplos: ["10025", "4567"],
} satisfies CrudFieldInfo;

export const PEDIDO_CLIENTE = {
  oQue: "Código/número do pedido de compra do cliente (referência externa).",
  regras: ["Obrigatório quando o cliente envia o próprio número (ex.: OC do cliente).", "Facilita conferência e NF-e na referência do cliente."],
  exemplos: ["'OC 5512'", "'PED 00987'"],
} satisfies CrudFieldInfo;

export const DATA_EMISSAO = {
  oQue: "Data de emissão/cadastro do documento.",
  regras: ["Formato AAAA-MM-DD.", "A data do pedido costuma ser anterior ou igual à da NF-e."],
  exemplos: ["2026-09-05"],
} satisfies CrudFieldInfo;

export const QUANTIDADE_TOTAL = {
  oQue: "Quantidade total de itens do pedido.",
  regras: ["Soma das quantidades dos itens, na unidade do item.", "Conferir com o romaneio/nota ao faturar."],
  exemplos: ["850 metros de tecido", "120 peças"],
} satisfies CrudFieldInfo;

export const VALOR_BRUTO = {
  oQue: "Valor total bruto do pedido (soma dos itens sem descontos).",
  regras: ["Base antes de descontos e encargos.", "Conferir com base de impostos no faturamento."],
  exemplos: ["R$ 120.000,00"],
} satisfies CrudFieldInfo;

export const VALOR_LIQUIDO = {
  oQue: "Valor total líquido do pedido (bruto − descontos + frete/encargos quando aplicáveis).",
  regras: ["É a referência para cobrança e boleto.", "Deve ser igual/net com o valor da NF-e emitida."],
  exemplos: ["R$ 113.400,00 com 10% de desconto"],
} satisfies CrudFieldInfo;

export const SALDO = {
  oQue: "Saldo restante do pedido (quantidade/valor ainda não faturado).",
  regras: ["Saldo zero = pedido 100% faturado.", "Pedido com saldo pendente não pode ser encerrado."],
  exemplos: ["qtde saldo 250 m de 1.000 m", "valor saldo R$ 0,00 (faturado)"],
} satisfies CrudFieldInfo;