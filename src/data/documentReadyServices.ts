/**
 * "Casos com documentos prontos para análise" — frente de captação informativa
 * focada em situações em que extratos, prints, contratos e protocolos permitem
 * uma avaliação inicial pelo escritório.
 *
 * IMPORTANTE: linguagem compatível com a publicidade da OAB — informativa,
 * sem promessa de resultado ("verificar documentos", "avaliar o caso",
 * "análise inicial", "orientação personalizada"). Nada de "causa ganha",
 * "indenização garantida", "resolva hoje" etc.
 */

export interface DocReadyFaq {
  q: (city: string) => string;
  a: (city: string) => string;
}

export interface DocumentReadyService {
  slug: string;
  name: string;
  shortName: string;
  area: string;
  icon: string;
  shortDescription: string;
  documents: string[];
  whenItHappens: (city: string) => string[];
  whatCanBeAnalyzed: string[];
  careNotice: string;
  intro: (city: string) => string;
  attendance: (city: string) => string;
  faqs: DocReadyFaq[];
}

const DOC_READY: DocumentReadyService[] = [
  {
    slug: "desconto-indevido-inss",
    name: "Desconto Indevido no INSS",
    shortName: "Desconto Indevido no INSS",
    area: "Previdenciário / Bancário",
    icon: "🛡️",
    shortDescription:
      "Descontos de associações, mensalidades ou valores não reconhecidos no benefício previdenciário podem ser revisados a partir do extrato do Meu INSS.",
    documents: [
      "Extrato de pagamento do Meu INSS",
      "Número do benefício",
      "RG e CPF",
      "Comprovante de residência",
      "Prints ou histórico dos descontos",
    ],
    whenItHappens: (city) => [
      `Beneficiários em ${city} que percebem descontos de associações que nunca autorizaram`,
      `Aposentados que identificam mensalidades fixas no extrato do Meu INSS sem contrato correspondente`,
      `Pensionistas que recebem o benefício reduzido sem comunicação prévia`,
      `Idosos que tentam cancelar o desconto pelo telefone e não recebem retorno`,
    ],
    whatCanBeAnalyzed: [
      "Histórico de descontos no extrato do Meu INSS",
      "Existência ou não de autorização formal para o desconto",
      "Valores acumulados e período afetado",
      "Possíveis caminhos administrativos junto ao INSS e judiciais para suspender o desconto e discutir restituição",
    ],
    careNotice:
      "Cada situação precisa ser avaliada individualmente. O conteúdo desta página é informativo e não garante o sucesso da medida — a análise depende da conferência dos documentos e do histórico do benefício.",
    intro: (city) =>
      `Aposentados e pensionistas em ${city} que identificam descontos de associações, mensalidades ou serviços não reconhecidos no benefício do INSS podem começar por uma análise documental simples, a partir do extrato do Meu INSS. O escritório Fernandez & Fernandes avalia o histórico de descontos, verifica a existência de autorização formal e orienta sobre os possíveis caminhos administrativos e judiciais para suspender a cobrança e discutir a restituição.`,
    attendance: (city) =>
      `O atendimento para moradores de ${city} é feito de forma 100% online. Você envia o extrato do Meu INSS, os documentos pessoais e prints dos descontos pelo WhatsApp e a equipe avalia o caso antes de qualquer providência.`,
    faqs: [
      {
        q: (c) => `Como saber se há desconto indevido no meu benefício do INSS em ${c}?`,
        a: (c) =>
          `O primeiro passo é baixar o extrato de pagamento no aplicativo Meu INSS. Nele aparecem todas as deduções. Para clientes em ${c}, nossa equipe ajuda a interpretar o extrato e identificar descontos que merecem revisão.`,
      },
      {
        q: () => `Quais documentos preciso reunir antes da análise?`,
        a: () =>
          `Extrato do Meu INSS dos últimos meses, número do benefício, RG, CPF, comprovante de residência e prints ou histórico dos descontos questionados. Quanto mais completo o material, mais precisa a análise inicial.`,
      },
      {
        q: () => `Existe prazo para questionar descontos antigos?`,
        a: () =>
          `Sim, há prazos administrativos e judiciais. Por isso é importante reunir os documentos e buscar orientação assim que o desconto for percebido, para não perder janelas de discussão.`,
      },
      {
        q: (c) => `Posso resolver isso sem ação judicial em ${c}?`,
        a: (c) =>
          `Em muitos casos, é possível iniciar pela via administrativa junto ao INSS ou à entidade responsável pelo desconto. A escolha depende da análise individual do caso de cada cliente em ${c}.`,
      },
      {
        q: () => `O atendimento é totalmente online?`,
        a: () =>
          `Sim. Todos os documentos podem ser enviados pelo WhatsApp e a orientação é prestada à distância, com a mesma segurança de um atendimento presencial.`,
      },
    ],
  },
  {
    slug: "consignado-nao-contratado",
    name: "Empréstimo Consignado Não Contratado",
    shortName: "Consignado Não Contratado",
    area: "Bancário / Consumidor",
    icon: "🏦",
    shortDescription:
      "Empréstimos ou descontos em benefício ou salário que o consumidor afirma não ter contratado podem ser revistos a partir dos extratos e dos contratos eventualmente apresentados pelo banco.",
    documents: [
      "Extrato do benefício ou folha de pagamento",
      "Extrato bancário",
      "Contrato, se existir",
      "Prints do aplicativo do banco",
      "Protocolo de reclamação junto ao banco",
    ],
    whenItHappens: (city) => [
      `Aposentados de ${city} que veem parcelas de empréstimo aparecerem no benefício sem reconhecer a contratação`,
      `Trabalhadores que recebem o salário com desconto consignado nunca solicitado`,
      `Clientes que descobrem o empréstimo após receber o valor na conta sem pedido prévio`,
      `Pessoas que tiveram dados utilizados por terceiros para simular a contratação`,
    ],
    whatCanBeAnalyzed: [
      "Existência ou não de contrato assinado eletronicamente ou em papel",
      "Conferência da assinatura, biometria e demais elementos de autenticação",
      "Histórico de parcelas debitadas e valor total comprometido",
      "Possíveis providências junto ao banco, ao INSS, ao empregador e ao Poder Judiciário",
    ],
    careNotice:
      "Reconhecer ou não a contratação exige análise cuidadosa. Em alguns casos, o crédito foi efetivamente recebido pelo cliente; em outros, há indícios de fraude. A orientação é sempre personalizada.",
    intro: (city) =>
      `Em ${city}, é comum aposentados e trabalhadores identificarem descontos de empréstimo consignado que afirmam não ter contratado. Antes de qualquer medida, é fundamental reunir o extrato do benefício ou folha de pagamento, o extrato bancário e o contrato — caso o banco tenha fornecido — para que a equipe do escritório Fernandez & Fernandes possa avaliar a documentação, verificar indícios de fraude e orientar sobre os próximos passos administrativos e judiciais.`,
    attendance: (city) =>
      `Atendemos clientes de ${city} de forma 100% online. Os documentos podem ser enviados pelo WhatsApp e a análise inicial é feita pela equipe antes de qualquer recomendação de medida.`,
    faqs: [
      {
        q: () => `O que fazer ao identificar um consignado que não contratei?`,
        a: () =>
          `O ideal é reunir o extrato do benefício ou folha de pagamento, o extrato bancário e qualquer print do aplicativo, registrar reclamação formal junto ao banco e guardar o protocolo. Esse material é a base da análise jurídica.`,
      },
      {
        q: () => `Preciso devolver o valor depositado na conta?`,
        a: () =>
          `A devolução de valores depende do caso. Em muitas hipóteses, discute-se a origem do depósito junto à autoria do contrato. Por isso, é importante não movimentar o valor antes de orientação jurídica.`,
      },
      {
        q: (c) => `Como o banco prova que eu contratei o empréstimo em ${c}?`,
        a: (c) =>
          `O banco precisa apresentar contrato assinado ou registros eletrônicos de autenticação. Em ${c}, nossa equipe avalia esse material para verificar consistência e indícios de fraude.`,
      },
      {
        q: () => `Posso pedir a suspensão imediata dos descontos?`,
        a: () =>
          `Em determinadas situações é possível pleitear a suspensão dos descontos, especialmente quando há fortes indícios de fraude. Cada pedido depende da análise individual.`,
      },
      {
        q: () => `Quanto tempo leva uma análise inicial?`,
        a: () =>
          `Com os documentos completos em mãos, a análise inicial costuma ser feita em poucos dias úteis. A complexidade aumenta quando faltam extratos ou protocolos.`,
      },
    ],
  },
  {
    slug: "negativacao-indevida",
    name: "Negativação Indevida",
    shortName: "Negativação Indevida",
    area: "Direito do Consumidor",
    icon: "📉",
    shortDescription:
      "Inclusão do nome no Serasa, SPC ou Boa Vista por dívida inexistente, já paga ou não reconhecida pode ser questionada a partir das consultas e protocolos.",
    documents: [
      "Print da negativação",
      "Consulta Serasa, SPC ou Boa Vista",
      "Comprovante de pagamento, se houver",
      "Protocolos de atendimento com a empresa",
      "E-mails ou conversas com a empresa",
    ],
    whenItHappens: (city) => [
      `Consumidores em ${city} negativados por dívidas que já foram quitadas`,
      `Pessoas que descobrem o nome sujo ao tentar fazer uma compra ou financiamento`,
      `Clientes negativados por contas que nunca contrataram, em possível caso de fraude`,
      `Empresas que mantêm o nome do consumidor inscrito após acordo já cumprido`,
    ],
    whatCanBeAnalyzed: [
      "Origem da dívida apontada na consulta",
      "Existência de comprovação de pagamento ou de quitação parcial",
      "Eventuais protocolos de tentativa de solução administrativa",
      "Possíveis pedidos de exclusão do registro e discussão de reparação por danos",
    ],
    careNotice:
      "Cada inscrição precisa ser avaliada de forma individual. Há casos em que o débito é legítimo e situações em que cabe discussão. O conteúdo é informativo e não substitui a análise jurídica.",
    intro: (city) =>
      `Consumidores em ${city} que descobrem o nome inscrito no Serasa, SPC ou Boa Vista por dívida que não reconhecem, que já foi paga ou que sequer foi contratada podem começar pela análise documental simples. Com a consulta completa, prints e comprovantes em mãos, a equipe do escritório Fernandez & Fernandes verifica a origem da inscrição, avalia indícios de irregularidade e orienta sobre os próximos passos para discutir a exclusão e eventual reparação.`,
    attendance: (city) =>
      `Moradores de ${city} são atendidos 100% online. Basta enviar a consulta atualizada, prints e protocolos pelo WhatsApp para que a equipe avalie a situação antes de qualquer providência.`,
    faqs: [
      {
        q: () => `Como conseguir a consulta completa para a análise?`,
        a: () =>
          `Você pode emitir a consulta gratuitamente nos sites do Serasa, SPC ou Boa Vista. Quanto mais recente, melhor para verificar o que ainda está ativo.`,
      },
      {
        q: (c) => `Já paguei a dívida e continuo negativado em ${c}, o que fazer?`,
        a: (c) =>
          `Reúna o comprovante de pagamento, o protocolo da empresa e a consulta atualizada. Em ${c}, nossa equipe ajuda a verificar se a baixa não foi providenciada e a orientar sobre as medidas cabíveis.`,
      },
      {
        q: () => `Quanto tempo a empresa tem para retirar o nome?`,
        a: () =>
          `Após a quitação, em regra a baixa precisa ser providenciada em prazos curtos. A demora pode gerar discussão sobre reparação, sempre conforme análise individual.`,
      },
      {
        q: () => `Posso discutir uma negativação de cobrança que nunca foi minha?`,
        a: () =>
          `Sim. Esses casos exigem documentação que demonstre que o contrato é desconhecido, além de protocolos de tentativa de solução. A análise jurídica avalia a viabilidade.`,
      },
      {
        q: () => `O atendimento é online?`,
        a: () =>
          `Sim. Toda a documentação pode ser enviada pelo WhatsApp e a orientação é feita à distância.`,
      },
    ],
  },
  {
    slug: "cobranca-indevida",
    name: "Cobrança Indevida",
    shortName: "Cobrança Indevida",
    area: "Direito do Consumidor / Bancário",
    icon: "💳",
    shortDescription:
      "Cobranças não reconhecidas em cartão, conta bancária, boleto, contrato ou serviço já cancelado podem ser verificadas a partir das faturas e protocolos.",
    documents: [
      "Fatura ou extrato detalhado",
      "Extrato bancário",
      "Comprovante de cobrança",
      "Protocolo de reclamação",
      "Contrato ou termo de cancelamento",
    ],
    whenItHappens: (city) => [
      `Clientes em ${city} que continuam recebendo cobranças após cancelar um serviço`,
      `Consumidores cobrados por tarifas ou pacotes que nunca contrataram`,
      `Pessoas surpreendidas por valores recorrentes no cartão sem origem clara`,
      `Empresas que cobram valores em duplicidade ou em desacordo com o contrato`,
    ],
    whatCanBeAnalyzed: [
      "Histórico das cobranças e periodicidade",
      "Existência de contrato ou termo que justifique o valor",
      "Tentativas de solução administrativa e respostas da empresa",
      "Caminhos para suspender cobranças futuras e discutir devolução de valores pagos",
    ],
    careNotice:
      "Cada cobrança precisa ser analisada à luz do contrato e do histórico de relacionamento com a empresa. O conteúdo é informativo e não promete a devolução de valores.",
    intro: (city) =>
      `Moradores de ${city} que enfrentam cobranças não reconhecidas em cartão, conta, boleto ou contrato já cancelado podem começar pela análise dos documentos. Com fatura, extrato, comprovantes e protocolos em mãos, o escritório Fernandez & Fernandes avalia se há fundamento na cobrança, identifica indícios de irregularidade e orienta sobre os próximos passos para tentar suspender o débito e discutir eventual devolução.`,
    attendance: (city) =>
      `O atendimento para clientes de ${city} é 100% online: documentos enviados pelo WhatsApp, análise pela equipe e orientação personalizada antes de qualquer medida.`,
    faqs: [
      {
        q: () => `O que separar antes de pedir uma análise?`,
        a: () =>
          `Fatura ou extrato detalhado dos últimos meses, comprovante das cobranças contestadas, protocolos de reclamação e cópia do contrato ou termo de cancelamento, quando houver.`,
      },
      {
        q: (c) => `Cancelei o serviço e continuam cobrando em ${c}, o que fazer?`,
        a: (c) =>
          `Guarde o protocolo de cancelamento e as faturas seguintes. Em ${c}, nossa equipe avalia a documentação e orienta sobre os caminhos para tentar suspender os débitos e discutir a devolução.`,
      },
      {
        q: () => `Posso suspender o pagamento da fatura enquanto discuto a cobrança?`,
        a: () =>
          `A decisão sobre pagar ou não pagar enquanto se discute o débito envolve consequências (juros, negativação) e deve ser avaliada caso a caso, com orientação jurídica individualizada.`,
      },
      {
        q: () => `Tenho direito à devolução em dobro?`,
        a: () =>
          `A discussão de devolução, simples ou em dobro, depende de várias circunstâncias do caso. A análise documental é o ponto de partida para qualquer recomendação.`,
      },
      {
        q: () => `O acompanhamento é online?`,
        a: () =>
          `Sim. Todo o processo, desde a análise inicial até o acompanhamento posterior, pode ser feito à distância.`,
      },
    ],
  },
  {
    slug: "produto-nao-entregue",
    name: "Produto Não Entregue",
    shortName: "Produto Não Entregue",
    area: "Direito do Consumidor",
    icon: "📦",
    shortDescription:
      "Compras feitas pela internet ou em marketplace em que o produto não foi entregue podem ser verificadas a partir do pedido, do pagamento e das conversas com a loja.",
    documents: [
      "Comprovante de compra",
      "Nota fiscal, se houver",
      "Código de rastreio",
      "Prints do pedido",
      "Conversas com vendedor ou loja",
      "Comprovante de pagamento",
    ],
    whenItHappens: (city) => [
      `Consumidores em ${city} que ultrapassaram o prazo de entrega prometido e não receberam o produto`,
      `Clientes que recebem o status de entregue, mas o produto não chegou`,
      `Pessoas que compraram em marketplaces e ficam sem retorno do vendedor`,
      `Compradores que recebem cobrança após cancelar o pedido por atraso`,
    ],
    whatCanBeAnalyzed: [
      "Datas previstas e datas reais de entrega",
      "Comprovantes de pagamento e status logístico",
      "Tentativas de solução com a loja e com o marketplace",
      "Possíveis pedidos de restituição, cancelamento e discussão de danos",
    ],
    careNotice:
      "O conteúdo é informativo. A viabilidade de cada medida depende dos termos da compra, da política do marketplace e da documentação reunida.",
    intro: (city) =>
      `Consumidores em ${city} que compraram pela internet ou em marketplace e não receberam o produto podem começar por uma análise documental simples. Com o pedido, o comprovante de pagamento, o código de rastreio e as conversas com a loja, a equipe do escritório Fernandez & Fernandes avalia o cumprimento dos prazos e orienta sobre os próximos passos para discutir a entrega, o cancelamento ou a restituição.`,
    attendance: (city) =>
      `O atendimento para moradores de ${city} é 100% online. Os documentos podem ser enviados pelo WhatsApp para que a equipe avalie o caso antes de qualquer providência.`,
    faqs: [
      {
        q: () => `Quais documentos ajudam na análise?`,
        a: () =>
          `Comprovante de compra, nota fiscal (se houver), código de rastreio, prints do pedido, conversas com a loja e comprovante de pagamento.`,
      },
      {
        q: (c) => `O produto aparece como entregue, mas não recebi em ${c}, o que fazer?`,
        a: (c) =>
          `Registre imediatamente a reclamação com a loja e a transportadora, guarde o protocolo e tire prints do status. Em ${c}, nossa equipe avalia o material para orientar sobre os próximos passos.`,
      },
      {
        q: () => `Posso pedir cancelamento e devolução do valor?`,
        a: () =>
          `O pedido de cancelamento e restituição depende do prazo, dos termos da loja e da legislação aplicável. A análise individual indica o caminho mais adequado.`,
      },
      {
        q: () => `E se a loja estiver fora do Paraná?`,
        a: () =>
          `Compras pela internet podem ser discutidas no domicílio do consumidor. Mas a recomendação depende da análise do caso.`,
      },
      {
        q: () => `Como funciona o acompanhamento?`,
        a: () =>
          `Todo o atendimento é online: envio de documentos, análise, orientação e acompanhamento posterior pelo WhatsApp.`,
      },
    ],
  },
  {
    slug: "direito-arrependimento",
    name: "Direito de Arrependimento Negado",
    shortName: "Direito de Arrependimento",
    area: "Direito do Consumidor",
    icon: "↩️",
    shortDescription:
      "Compras online canceladas dentro do prazo legal, mas com negativa de reembolso ou de cancelamento, podem ser verificadas a partir do pedido e das respostas da loja.",
    documents: [
      "Comprovante de compra",
      "Data da entrega",
      "Pedido de cancelamento",
      "Resposta da loja",
      "Comprovante de pagamento",
    ],
    whenItHappens: (city) => [
      `Consumidores em ${city} que pediram cancelamento dentro do prazo legal e tiveram a solicitação negada`,
      `Compradores que enviaram o produto de volta e não receberam o reembolso`,
      `Clientes que recebem condições não previstas no momento da compra para exercer o arrependimento`,
      `Pessoas pressionadas a aceitar crédito na loja em vez de devolução do valor pago`,
    ],
    whatCanBeAnalyzed: [
      "Datas de entrega e de pedido de cancelamento",
      "Política da loja informada na compra",
      "Comunicações com o vendedor e protocolos",
      "Caminhos para discutir o cumprimento do direito de arrependimento",
    ],
    careNotice:
      "Nem toda compra está sujeita ao direito de arrependimento. A análise depende do canal de venda, do prazo e dos termos contratados.",
    intro: (city) =>
      `Consumidores em ${city} que exerceram o direito de arrependimento em uma compra online dentro do prazo legal e tiveram o reembolso ou o cancelamento negado podem buscar análise documental. Com o pedido, o comprovante de pagamento e as respostas da loja, o escritório Fernandez & Fernandes avalia se o exercício do direito foi regular e orienta sobre os próximos passos.`,
    attendance: (city) =>
      `Moradores de ${city} são atendidos 100% online, com envio de documentos pelo WhatsApp e análise pela equipe antes de qualquer providência.`,
    faqs: [
      {
        q: () => `Qual é o prazo para arrependimento em compras online?`,
        a: () =>
          `A legislação prevê prazo de sete dias a contar do recebimento, em compras feitas fora do estabelecimento (como pela internet). Cada caso é analisado individualmente.`,
      },
      {
        q: () => `Preciso devolver o produto para receber o dinheiro?`,
        a: () =>
          `Em regra, sim. A devolução do produto integra o exercício do direito de arrependimento. O custo do envio também é discutido conforme o caso.`,
      },
      {
        q: () => `A loja pode oferecer só crédito?`,
        a: () =>
          `O ressarcimento deve ocorrer na mesma forma do pagamento, em regra. A oferta de crédito precisa ser aceita voluntariamente pelo consumidor.`,
      },
      {
        q: (c) => `O que fazer se a loja não responder em ${c}?`,
        a: (c) =>
          `Reúna prints da tentativa, protocolos e respostas (ou ausência delas). Em ${c}, nossa equipe avalia o material para orientar sobre as medidas cabíveis.`,
      },
      {
        q: () => `É possível discutir reparação adicional?`,
        a: () =>
          `Em algumas situações há discussão sobre danos. A análise documental individual indica se há fundamento.`,
      },
    ],
  },
  {
    slug: "voo-atrasado-cancelado",
    name: "Voo Atrasado, Cancelado ou Bagagem Extraviada",
    shortName: "Voo Atrasado ou Cancelado",
    area: "Direito do Consumidor",
    icon: "✈️",
    shortDescription:
      "Problemas com companhia aérea — atraso relevante, cancelamento, perda de conexão ou bagagem extraviada — podem ser verificados a partir do bilhete, do cartão de embarque e dos comprovantes.",
    documents: [
      "Bilhete aéreo",
      "Cartão de embarque",
      "E-mails ou mensagens da companhia",
      "Comprovantes de gastos",
      "Registro de irregularidade de bagagem (RIB), se houver",
    ],
    whenItHappens: (city) => [
      `Passageiros com origem ou destino em ${city} que enfrentam atrasos relevantes`,
      `Voos cancelados sem aviso prévio adequado`,
      `Perda de conexão por culpa da companhia`,
      `Bagagem extraviada, danificada ou entregue com grande atraso`,
    ],
    whatCanBeAnalyzed: [
      "Tempo de atraso e motivo informado pela companhia",
      "Assistência material oferecida (alimentação, hospedagem, comunicação)",
      "Comprovantes de gastos extras",
      "Registro de irregularidade de bagagem e providências da companhia",
    ],
    careNotice:
      "Cada situação aérea tem particularidades (motivo do atraso, distância, conexões internacionais). O conteúdo é informativo e a análise é sempre individual.",
    intro: (city) =>
      `Passageiros com voos relacionados a ${city} que enfrentam atrasos relevantes, cancelamentos, perda de conexão ou bagagem extraviada podem começar pela análise documental. Com o bilhete aéreo, cartão de embarque, comprovantes de gastos e eventuais registros de irregularidade, a equipe do escritório Fernandez & Fernandes avalia se houve falha no serviço e orienta sobre os próximos passos.`,
    attendance: (city) =>
      `O atendimento para clientes de ${city} é 100% online. Os documentos podem ser enviados pelo WhatsApp para análise inicial.`,
    faqs: [
      {
        q: () => `O que separar logo após o problema no voo?`,
        a: () =>
          `Bilhete aéreo, cartão de embarque, e-mails da companhia, comprovantes de gastos extras (alimentação, hospedagem, transporte) e, no caso de bagagem, o RIB feito no aeroporto.`,
      },
      {
        q: () => `Há prazo para discutir o ocorrido?`,
        a: () =>
          `Sim. Existem prazos administrativos junto à companhia e à ANAC, além de prazos judiciais. Por isso, reunir os documentos rapidamente é importante.`,
      },
      {
        q: (c) => `Posso discutir mesmo morando em ${c} e o voo ter sido em outro estado?`,
        a: (c) =>
          `Sim. A discussão pode ocorrer no domicílio do consumidor. Em ${c}, todo o atendimento é feito de forma online.`,
      },
      {
        q: () => `E se a companhia disser que o atraso foi por causa do tempo?`,
        a: () =>
          `Motivos meteorológicos podem ou não excluir responsabilidade, dependendo do caso e da assistência prestada. A análise individual verifica esses pontos.`,
      },
      {
        q: () => `Bagagem atrasada também conta?`,
        a: () =>
          `Sim. Bagagem extraviada, danificada ou entregue com grande atraso pode ser objeto de discussão, sempre a partir dos documentos.`,
      },
    ],
  },
  {
    slug: "veiculo-nao-transferido",
    name: "Veículo Vendido e Não Transferido",
    shortName: "Veículo Não Transferido",
    area: "Direito Civil / Consumidor",
    icon: "🚗",
    shortDescription:
      "Venda de veículo em que o comprador não realiza a transferência, gerando multas, débitos ou riscos ao antigo proprietário, pode ser analisada com base no recibo e no histórico.",
    documents: [
      "Recibo ou ATPV-e",
      "Comprovante de venda",
      "Conversas com o comprador",
      "Multas recebidas",
      "CRLV",
      "Comunicado de venda ao Detran, se houver",
    ],
    whenItHappens: (city) => [
      `Antigos proprietários em ${city} que continuam recebendo multas após a venda`,
      `Vendedores que descobrem débitos de IPVA ou licenciamento em seu nome`,
      `Pessoas que perderam contato com o comprador após a entrega do veículo`,
      `Antigos donos envolvidos em ocorrências de trânsito praticadas após a venda`,
    ],
    whatCanBeAnalyzed: [
      "Data e formalização da venda",
      "Realização ou não do comunicado de venda ao Detran",
      "Histórico de multas e débitos após a venda",
      "Possíveis medidas administrativas junto ao Detran e judiciais em relação ao comprador",
    ],
    careNotice:
      "A regularização depende da documentação. O conteúdo é informativo e a viabilidade de cada medida é analisada caso a caso.",
    intro: (city) =>
      `Vendedores em ${city} que repassaram o veículo e descobriram, depois, que o comprador não fez a transferência podem começar por uma análise documental. Com recibo, ATPV-e, conversas e eventuais multas em mãos, o escritório Fernandez & Fernandes avalia o histórico, verifica se o comunicado de venda foi feito ao Detran e orienta sobre os próximos passos.`,
    attendance: (city) =>
      `Moradores de ${city} são atendidos 100% online. Os documentos podem ser enviados pelo WhatsApp para a análise inicial.`,
    faqs: [
      {
        q: () => `O que é o comunicado de venda e por que ele importa?`,
        a: () =>
          `É a comunicação que o vendedor faz ao Detran informando a alienação do veículo. Quando bem feito, reduz riscos para o antigo proprietário em relação a multas e débitos posteriores.`,
      },
      {
        q: (c) => `Já recebi multa por fato após a venda em ${c}, o que posso fazer?`,
        a: (c) =>
          `Reúna o recibo da venda, conversas com o comprador e o aviso de infração. Em ${c}, nossa equipe avalia o caso para orientar sobre defesa administrativa e medidas em relação ao comprador.`,
      },
      {
        q: () => `Posso obrigar o comprador a transferir?`,
        a: () =>
          `Há caminhos jurídicos para discutir a obrigação de transferência, dependendo da documentação. A análise individual verifica a viabilidade.`,
      },
      {
        q: () => `E os débitos de IPVA e licenciamento?`,
        a: () =>
          `Os débitos podem ser objeto de discussão, especialmente quando há comunicado de venda em data anterior. A análise verifica as datas e os documentos.`,
      },
      {
        q: () => `O atendimento é online?`,
        a: () =>
          `Sim. Toda a documentação pode ser enviada pelo WhatsApp e a orientação é prestada à distância.`,
      },
    ],
  },
  {
    slug: "fgts-nao-depositado",
    name: "FGTS Não Depositado",
    shortName: "FGTS Não Depositado",
    area: "Direito Trabalhista",
    icon: "💼",
    shortDescription:
      "Empregado que identifica ausência de depósitos de FGTS durante o contrato de trabalho pode começar por uma análise do extrato e dos holerites.",
    documents: [
      "Extrato do FGTS",
      "CTPS digital",
      "Holerites",
      "Termo de rescisão, se houver",
      "Contrato de trabalho",
    ],
    whenItHappens: (city) => [
      `Trabalhadores em ${city} que verificam meses sem depósito no extrato do FGTS`,
      `Empregados que não receberam o depósito após a rescisão`,
      `Pessoas que percebem divergência entre o valor do salário e o valor depositado`,
      `Casos em que o empregador alega problemas administrativos para justificar a ausência`,
    ],
    whatCanBeAnalyzed: [
      "Períodos sem depósito identificados no extrato",
      "Valores devidos com base nos holerites",
      "Histórico de eventual termo de rescisão e quitação",
      "Caminhos administrativos junto à Caixa, à fiscalização do trabalho e à Justiça do Trabalho",
    ],
    careNotice:
      "A discussão de FGTS exige análise do contrato, do extrato e do histórico salarial. O conteúdo é informativo e não substitui a orientação jurídica individual.",
    intro: (city) =>
      `Trabalhadores em ${city} que identificam ausência de depósitos do FGTS — durante o contrato ou na rescisão — podem começar por uma análise documental. Com o extrato do FGTS, holerites, CTPS digital e o contrato de trabalho em mãos, o escritório Fernandez & Fernandes verifica o histórico, calcula os períodos em aberto e orienta sobre os próximos passos.`,
    attendance: (city) =>
      `O atendimento para moradores de ${city} é 100% online, com envio de documentos pelo WhatsApp e análise pela equipe antes de qualquer medida.`,
    faqs: [
      {
        q: () => `Como obter o extrato do FGTS?`,
        a: () =>
          `Pelo aplicativo FGTS ou pelo site da Caixa. O extrato detalhado mostra os depósitos por competência e é essencial para a análise.`,
      },
      {
        q: () => `Há prazo para discutir o FGTS não depositado?`,
        a: () =>
          `Sim. Existem prazos para a cobrança judicial. Por isso, identificar a ausência logo e reunir os documentos é importante.`,
      },
      {
        q: (c) => `Ainda estou empregado em ${c}, posso discutir?`,
        a: (c) =>
          `Sim. A análise é feita de forma reservada e a estratégia avalia os impactos de cada medida durante a vigência do contrato em ${c}.`,
      },
      {
        q: () => `O empregador pode parcelar os depósitos atrasados?`,
        a: () =>
          `Há caminhos administrativos e acordos possíveis. A análise individual indica o melhor caminho.`,
      },
      {
        q: () => `Posso resolver online?`,
        a: () =>
          `Sim. Toda a documentação pode ser enviada pelo WhatsApp e o atendimento é feito à distância.`,
      },
    ],
  },
  {
    slug: "verbas-rescisorias-nao-pagas",
    name: "Verbas Rescisórias Não Pagas",
    shortName: "Verbas Rescisórias",
    area: "Direito Trabalhista",
    icon: "📑",
    shortDescription:
      "Empresa que não paga corretamente saldo de salário, aviso prévio, férias, 13º, FGTS ou multa rescisória pode ser analisada a partir do TRCT e dos holerites.",
    documents: [
      "TRCT (Termo de Rescisão do Contrato de Trabalho)",
      "CTPS digital",
      "Holerites",
      "Comprovantes de pagamento",
      "Extrato do FGTS",
      "Comunicação de dispensa",
    ],
    whenItHappens: (city) => [
      `Trabalhadores em ${city} dispensados sem o pagamento integral das verbas rescisórias`,
      `Empregados que não receberam aviso prévio, férias proporcionais ou 13º`,
      `Casos em que a multa do FGTS não foi paga`,
      `Situações em que a empresa atrasa o pagamento das verbas após a dispensa`,
    ],
    whatCanBeAnalyzed: [
      "Conferência das verbas constantes no TRCT",
      "Cálculo de eventuais diferenças com base no histórico salarial",
      "Histórico de comprovantes de pagamento",
      "Caminhos administrativos e judiciais para cobrança das verbas em atraso",
    ],
    careNotice:
      "A análise das verbas rescisórias depende do tipo de contrato, da forma de dispensa e da documentação. O conteúdo é informativo.",
    intro: (city) =>
      `Trabalhadores em ${city} dispensados sem o pagamento integral das verbas rescisórias — saldo de salário, aviso prévio, férias, 13º, FGTS ou multa — podem começar por uma análise documental. Com TRCT, holerites, CTPS digital e extrato do FGTS em mãos, o escritório Fernandez & Fernandes confere os valores e orienta sobre os próximos passos para a cobrança.`,
    attendance: (city) =>
      `Moradores de ${city} são atendidos 100% online. Os documentos podem ser enviados pelo WhatsApp para análise inicial.`,
    faqs: [
      {
        q: () => `Qual prazo a empresa tem para pagar as verbas rescisórias?`,
        a: () =>
          `A legislação prevê prazos específicos após a dispensa. O atraso pode gerar discussão sobre acréscimos, sempre conforme análise individual.`,
      },
      {
        q: () => `O que fazer se o TRCT veio com valores menores?`,
        a: () =>
          `Reúna holerites e o contrato de trabalho. A análise documental verifica se há diferenças e calcula os valores em discussão.`,
      },
      {
        q: (c) => `Posso assinar o TRCT mesmo discordando em ${c}?`,
        a: (c) =>
          `A assinatura tem efeitos que devem ser avaliados antes. Em ${c}, nossa equipe orienta sobre as implicações antes do passo final.`,
      },
      {
        q: () => `E quando a empresa simplesmente não paga?`,
        a: () =>
          `Existem medidas administrativas e judiciais. A análise individual indica o caminho mais adequado.`,
      },
      {
        q: () => `Há prazo para reclamar na Justiça do Trabalho?`,
        a: () =>
          `Sim. Os prazos são específicos da Justiça do Trabalho. Por isso é importante buscar orientação assim que identificar o problema.`,
      },
    ],
  },
];

export const DOCUMENT_READY_SERVICES = DOC_READY;

export const DOCUMENT_READY_SLUGS = new Set(DOC_READY.map((s) => s.slug));

export function isDocumentReadyService(slug: string): boolean {
  return DOCUMENT_READY_SLUGS.has(slug);
}

export function getDocumentReadyService(slug: string): DocumentReadyService | undefined {
  return DOC_READY.find((s) => s.slug === slug);
}

/**
 * Cidades-polo para interlinking nas páginas pilar e documentais.
 * Distribui autoridade interna no Paraná em vez de concentrar tudo em Curitiba.
 */
export const PILLAR_CITY_SLUGS: { slug: string; name: string }[] = [
  { slug: "curitiba", name: "Curitiba" },
  { slug: "londrina", name: "Londrina" },
  { slug: "maringa", name: "Maringá" },
  { slug: "cascavel", name: "Cascavel" },
  { slug: "ponta-grossa", name: "Ponta Grossa" },
  { slug: "foz-do-iguacu", name: "Foz do Iguaçu" },
];

/**
 * Mapa de serviços relacionados (interlinking entre páginas documentais).
 * Distribui sinal interno e evita páginas "gêmeas".
 */
export const DOCUMENT_READY_RELATED: Record<string, { slug: string; label: string }[]> = {
  "desconto-indevido-inss": [
    { slug: "consignado-nao-contratado", label: "Consignado Não Contratado" },
    { slug: "cobranca-indevida", label: "Cobrança Indevida" },
    { slug: "aposentadoria-inss", label: "Aposentadoria INSS" },
  ],
  "consignado-nao-contratado": [
    { slug: "desconto-indevido-inss", label: "Desconto Indevido no INSS" },
    { slug: "cobranca-indevida", label: "Cobrança Indevida" },
    { slug: "negativacao-indevida", label: "Negativação Indevida" },
  ],
  "negativacao-indevida": [
    { slug: "cobranca-indevida", label: "Cobrança Indevida" },
    { slug: "produto-nao-entregue", label: "Produto Não Entregue" },
    { slug: "direito-arrependimento", label: "Direito de Arrependimento" },
  ],
  "cobranca-indevida": [
    { slug: "negativacao-indevida", label: "Negativação Indevida" },
    { slug: "consignado-nao-contratado", label: "Consignado Não Contratado" },
    { slug: "direito-arrependimento", label: "Direito de Arrependimento" },
  ],
  "produto-nao-entregue": [
    { slug: "direito-arrependimento", label: "Direito de Arrependimento" },
    { slug: "cobranca-indevida", label: "Cobrança Indevida" },
    { slug: "negativacao-indevida", label: "Negativação Indevida" },
  ],
  "direito-arrependimento": [
    { slug: "produto-nao-entregue", label: "Produto Não Entregue" },
    { slug: "cobranca-indevida", label: "Cobrança Indevida" },
    { slug: "negativacao-indevida", label: "Negativação Indevida" },
  ],
  "voo-atrasado-cancelado": [
    { slug: "extravio-bagagem", label: "Extravio de Bagagem" },
    { slug: "produto-nao-entregue", label: "Produto Não Entregue" },
    { slug: "cobranca-indevida", label: "Cobrança Indevida" },
  ],
  "veiculo-nao-transferido": [
    { slug: "transferencia-veiculo", label: "Transferência de Veículo" },
    { slug: "cobranca-indevida", label: "Cobrança Indevida" },
    { slug: "negativacao-indevida", label: "Negativação Indevida" },
  ],
  "fgts-nao-depositado": [
    { slug: "verbas-rescisorias-nao-pagas", label: "Verbas Rescisórias Não Pagas" },
    { slug: "simulador-horas-extras", label: "Simulador de Horas Extras" },
    { slug: "calculadora-rescisao", label: "Calculadora de Rescisão" },
  ],
  "verbas-rescisorias-nao-pagas": [
    { slug: "fgts-nao-depositado", label: "FGTS Não Depositado" },
    { slug: "simulador-horas-extras", label: "Simulador de Horas Extras" },
    { slug: "calculadora-rescisao", label: "Calculadora de Rescisão" },
  ],
};

/**
 * Meta SEO específico para serviços documentais.
 * Padrão: "[Serviço] em [Cidade] | Análise de Documentos" (~160 chars).
 * Sem "+20 anos", "consulta gratuita", "indenização" ou promessa de resultado.
 */
export function getDocumentReadyMeta(
  serviceSlug: string,
  cityName: string
): { title: string; description: string } | null {
  const s = getDocumentReadyService(serviceSlug);
  if (!s) return null;
  return {
    title: `${s.name} em ${cityName} | Análise de Documentos`,
    description: `Envie extratos, prints, contratos, comprovantes e protocolos para análise inicial de ${s.shortName.toLowerCase()} em ${cityName}. Atendimento online no Paraná.`,
  };
}

/**
 * Disclaimer informativo padrão (publicidade OAB-compliant).
 */
export const DOCUMENT_READY_DISCLAIMER =
  "Este conteúdo é informativo e não substitui a análise individual do caso. A viabilidade de qualquer medida depende da conferência dos documentos, datas, valores e demais informações apresentadas.";
