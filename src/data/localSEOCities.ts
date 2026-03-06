export interface CityData {
  slug: string;
  name: string;
  region: string;
  variationIndex: number;
  nearbySlug?: string[]; // slugs of geographically close cities for internal linking
}

export interface ServiceData {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  keyword: string; // "advogado-{keyword}-{city}"
  area: string;
}

export const LEGAL_SERVICES: ServiceData[] = [
  {
    slug: "pensao-alimenticia",
    name: "Pensão Alimentícia",
    shortName: "Pensão Alimentícia",
    icon: "👨‍👩‍👧",
    keyword: "pensao-alimenticia",
    area: "Direito de Família",
  },
  {
    slug: "divorcio-consensual",
    name: "Divórcio Consensual",
    shortName: "Divórcio",
    icon: "⚖️",
    keyword: "divorcio-consensual",
    area: "Direito de Família",
  },
  {
    slug: "cobranca-aluguel",
    name: "Cobrança de Aluguel",
    shortName: "Cobrança de Aluguel",
    icon: "🏠",
    keyword: "cobranca-aluguel",
    area: "Direito Imobiliário",
  },
  {
    slug: "transferencia-veiculo",
    name: "Transferência de Veículo",
    shortName: "Transferência de Veículo",
    icon: "🚗",
    keyword: "transferencia-veiculo",
    area: "Direito Civil",
  },
  {
    slug: "direito-agrario",
    name: "Direito Agrário",
    shortName: "Direito Agrário",
    icon: "🌾",
    keyword: "direito-agrario",
    area: "Direito Agrário",
  },
];

export const PARANA_CITIES: CityData[] = [
  { slug: "curitiba", name: "Curitiba", region: "Grande Curitiba", variationIndex: 0, nearbySlug: ["sao-jose-dos-pinhais","colombo","araucaria","pinhais","campo-largo"] },
  { slug: "londrina", name: "Londrina", region: "Norte do Paraná", variationIndex: 1, nearbySlug: ["arapongas","cornelio-procopio","apucarana","rolandia"] },
  { slug: "maringa", name: "Maringá", region: "Noroeste do Paraná", variationIndex: 2, nearbySlug: ["umuarama","cianorte","campo-mourao","sarandi"] },
  { slug: "cascavel", name: "Cascavel", region: "Oeste do Paraná", variationIndex: 3, nearbySlug: ["toledo","foz-do-iguacu","medianeira","santa-helena"] },
  { slug: "foz-do-iguacu", name: "Foz do Iguaçu", region: "Oeste do Paraná", variationIndex: 4, nearbySlug: ["cascavel","toledo","medianeira","missal"] },
  { slug: "ponta-grossa", name: "Ponta Grossa", region: "Centro do Paraná", variationIndex: 0, nearbySlug: ["castro","telemacos-borba","guarapuava","irati"] },
  { slug: "guarapuava", name: "Guarapuava", region: "Centro-Sul do Paraná", variationIndex: 1, nearbySlug: ["ponta-grossa","irati","palmas","pato-branco"] },
  { slug: "colombo", name: "Colombo", region: "Grande Curitiba", variationIndex: 2, nearbySlug: ["curitiba","campo-largo","pinhais","araucaria"] },
  { slug: "apucarana", name: "Apucarana", region: "Norte do Paraná", variationIndex: 3, nearbySlug: ["londrina","arapongas","maringa","cianorte"] },
  { slug: "toledo", name: "Toledo", region: "Oeste do Paraná", variationIndex: 4, nearbySlug: ["cascavel","foz-do-iguacu","marechal-candido-rondon","palotina"] },
  { slug: "arapongas", name: "Arapongas", region: "Norte do Paraná", variationIndex: 0, nearbySlug: ["londrina","apucarana","maringa","cornelio-procopio"] },
  { slug: "campo-largo", name: "Campo Largo", region: "Grande Curitiba", variationIndex: 1, nearbySlug: ["curitiba","colombo","araucaria","pinhais"] },
  { slug: "campo-mourao", name: "Campo Mourão", region: "Centro-Oeste do Paraná", variationIndex: 2, nearbySlug: ["maringa","umuarama","cianorte","goioere"] },
  { slug: "paranagua", name: "Paranaguá", region: "Litoral do Paraná", variationIndex: 3, nearbySlug: ["curitiba","matinhos","antonina","guaratuba"] },
  { slug: "umuarama", name: "Umuarama", region: "Noroeste do Paraná", variationIndex: 4, nearbySlug: ["maringa","campo-mourao","cianorte","cruzeiro-do-sul"] },
  { slug: "cornelio-procopio", name: "Cornélio Procópio", region: "Norte Pioneiro do Paraná", variationIndex: 0, nearbySlug: ["londrina","arapongas","bandeirantes","jacarezinho"] },
  { slug: "pato-branco", name: "Pato Branco", region: "Sudoeste do Paraná", variationIndex: 1, nearbySlug: ["francisco-beltrao","dois-vizinhos","palmas","guarapuava"] },
  { slug: "francisco-beltrao", name: "Francisco Beltrão", region: "Sudoeste do Paraná", variationIndex: 2, nearbySlug: ["pato-branco","dois-vizinhos","palmas","coronel-vivida"] },
  { slug: "telemacos-borba", name: "Telêmaco Borba", region: "Centro do Paraná", variationIndex: 3, nearbySlug: ["ponta-grossa","irati","guarapuava","castro"] },
  { slug: "irati", name: "Irati", region: "Centro-Sul do Paraná", variationIndex: 4, nearbySlug: ["guarapuava","ponta-grossa","telemacos-borba","palmas"] },
  { slug: "palmas", name: "Palmas", region: "Sudoeste do Paraná", variationIndex: 0, nearbySlug: ["pato-branco","francisco-beltrao","guarapuava","irati"] },
  { slug: "cianorte", name: "Cianorte", region: "Noroeste do Paraná", variationIndex: 1, nearbySlug: ["maringa","umuarama","campo-mourao","apucarana"] },
  { slug: "castro", name: "Castro", region: "Centro do Paraná", variationIndex: 2, nearbySlug: ["ponta-grossa","telemacos-borba","guarapuava","irati"] },
  { slug: "dois-vizinhos", name: "Dois Vizinhos", region: "Sudoeste do Paraná", variationIndex: 3, nearbySlug: ["pato-branco","francisco-beltrao","palmas","coronel-vivida"] },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return PARANA_CITIES.find((c) => c.slug === slug);
}

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return LEGAL_SERVICES.find((s) => s.slug === slug);
}

// Text variations to avoid duplicate content penalties
export const textVariations = {
  subtitle: [
    (city: string, region: string) =>
      `Atendimento jurídico especializado para clientes em ${city} e região. Nossa equipe está pronta para defender seus direitos com agilidade e eficiência.`,
    (city: string, region: string) =>
      `Há mais de 20 anos prestando assessoria jurídica completa para moradores de ${city} e do ${region}. Consultoria personalizada para cada caso.`,
    (city: string, region: string) =>
      `Soluções jurídicas rápidas e eficazes para quem está em ${city}. Atendemos presencialmente e de forma 100% online em todo o ${region}.`,
    (city: string, region: string) =>
      `Se você está em ${city} e precisa de um advogado de confiança, nossa equipe oferece atendimento humanizado e eficiente para resolver seu problema.`,
    (city: string, region: string) =>
      `Advogados especializados atendendo clientes de ${city} e ${region}. Comprometimento total com seu caso, do início ao fim.`,
  ],
  serviceIntro: [
    (city: string) =>
      `Confira os serviços jurídicos disponíveis para clientes em ${city}:`,
    (city: string) =>
      `Nossa equipe atende clientes de ${city} nas seguintes áreas do direito:`,
    (city: string) =>
      `Para moradores de ${city}, oferecemos assessoria especializada nas principais demandas jurídicas:`,
    (city: string) =>
      `Atuamos em diversas frentes para proteger os direitos de quem está em ${city}:`,
    (city: string) =>
      `Conheça as áreas em que ajudamos clientes de ${city} a resolver problemas jurídicos:`,
  ],
  problemsIntro: [
    (city: string) =>
      `Resolvemos os problemas jurídicos mais comuns enfrentados por quem mora em ${city}:`,
    (city: string) =>
      `Situações com que mais auxiliamos clientes de ${city}:`,
    (city: string) =>
      `Você está em ${city} e enfrenta algum desses problemas? Podemos te ajudar:`,
    (city: string) =>
      `Principais demandas que resolvemos para clientes de ${city}:`,
    (city: string) =>
      `Se você mora em ${city} e precisa de um advogado para alguma das situações abaixo, entre em contato:`,
  ],
  attendanceText: [
    (city: string) =>
      `Realizamos atendimento online com total segurança e acompanhamento completo do seu processo para clientes de ${city} e região. Não é necessário comparecer ao escritório para iniciar seu caso.`,
    (city: string) =>
      `Moradores de ${city} podem contratar nossos serviços 100% à distância. Usamos tecnologia para garantir agilidade, transparência e comunicação direta durante todo o processo.`,
    (city: string) =>
      `Para clientes de ${city}, oferecemos consultoria jurídica inicial gratuita via WhatsApp. Avaliamos seu caso e indicamos os próximos passos de forma rápida e objetiva.`,
    (city: string) =>
      `Nossa estrutura digital permite atender clientes de ${city} com a mesma qualidade do atendimento presencial. Acompanhamento em tempo real e comunicação direta com seu advogado.`,
    (city: string) =>
      `Atendemos clientes de ${city} de forma totalmente remota, com assinatura digital de contratos e acompanhamento online do seu processo judicial.`,
  ],
  ctaText: [
    (city: string) => `Falar com Advogado em ${city}`,
    (city: string) => `Consulta Gratuita Agora`,
    (city: string) => `Fale com um Advogado Agora`,
    (city: string) => `Solicitar Atendimento em ${city}`,
    (city: string) => `Quero Resolver Meu Problema`,
  ],
};

// Service-specific text variations (5 variations per service)
export const serviceTextVariations: Record<string, {
  intro: ((city: string) => string)[];
  situations: ((city: string) => string[])[];
  howItWorks: ((city: string) => string)[];
  whenToLook: ((city: string) => string)[];
  conclusion: ((city: string) => string)[];
}> = {
  "pensao-alimenticia": {
    intro: [
      (city) => `A pensão alimentícia é um direito fundamental de crianças e adolescentes em ${city} e em todo o Brasil. Quando os pais se separam, um deles assume a guarda dos filhos e o outro tem a obrigação legal de contribuir mensalmente com alimentos, educação, saúde e moradia.`,
      (city) => `Em ${city}, milhares de famílias enfrentam conflitos relacionados à pensão alimentícia todos os anos. A falta de pagamento, o valor inadequado ou a dificuldade em fixar os alimentos são situações que exigem a atuação de um advogado especializado em direito de família.`,
      (city) => `A fixação de pensão alimentícia em ${city} segue as regras do Código Civil e do Estatuto da Criança e do Adolescente. O valor é calculado com base na necessidade do alimentando e na possibilidade financeira do alimentante, cabendo ao juiz decidir em caso de desacordo.`,
      (city) => `Se você mora em ${city} e enfrenta problemas com pensão alimentícia — seja para receber, revisar ou executar os alimentos devidos — um advogado especializado pode ajudar você a garantir seus direitos na Justiça de forma rápida e eficaz.`,
      (city) => `A ação de alimentos em ${city} pode ser ajuizada tanto para fixar uma pensão inicialmente quanto para revisar valores já estabelecidos. Com as mudanças de renda do alimentante ou das necessidades do filho, é possível pedir a revisão a qualquer tempo.`,
    ],
    situations: [
      (city) => [
        `Pai ou mãe que não paga a pensão em ${city}`,
        `Valor de pensão insuficiente para cobrir as necessidades do filho`,
        `Necessidade de revisão por mudança de renda ou de situação financeira`,
        `Execução de pensão atrasada — prisão do devedor de alimentos`,
        `Fixação inicial de pensão após separação ou divórcio`,
        `Alimentos provisórios enquanto o processo tramita`,
      ],
      (city) => [
        `Pensão alimentícia não paga há mais de 3 meses em ${city}`,
        `Ex-companheiro se recusa a contribuir voluntariamente`,
        `Filho atingiu a maioridade e ainda depende economicamente`,
        `Mudança de emprego ou renda do devedor de alimentos`,
        `Necessidade de incluir despesas médicas ou escolares`,
        `Acordo extrajudicial que não está sendo cumprido`,
      ],
      (city) => [
        `Criança ou adolescente sem suporte financeiro de um dos pais`,
        `Pensão acordada informalmente e não cumprida`,
        `Devedor de alimentos com bens ou renda não declarada`,
        `Necessidade de desconto em folha de pagamento`,
        `Processo de alimentos parado na Justiça de ${city}`,
        `Revisão de acordo feito há mais de 3 anos`,
      ],
    ],
    howItWorks: [
      (city) => `O processo de pensão alimentícia em ${city} começa com a análise da situação pelo advogado. Em seguida, é ajuizada a ação de alimentos, e o juiz pode fixar alimentos provisórios já nos primeiros dias. A audiência de conciliação busca um acordo; caso não haja, o juiz decide o valor definitivo.`,
      (city) => `Na comarca de ${city}, o processo de alimentos segue o rito especial da Lei nº 5.478/68. O requerente apresenta a petição inicial, o réu é citado, e em audiência ambas as partes tentam um acordo. Se não houver composição, as provas são produzidas e o juiz prolata sentença fixando o valor.`,
      (city) => `Para fixar pensão em ${city}, o advogado coleta documentos de renda e despesas das partes. Com base no binômio necessidade-possibilidade, é elaborada petição fundamentada. O juiz pode conceder alimentos provisórios liminarmente, garantindo o sustento do filho durante a tramitação do processo.`,
    ],
    whenToLook: [
      (city) => `Procure um advogado de pensão alimentícia em ${city} imediatamente se: o outro genitor se recusa a pagar voluntariamente; a pensão está atrasada há mais de 30 dias; o valor atual não cobre as necessidades básicas do filho; ou houve mudança significativa de renda de qualquer das partes.`,
      (city) => `É hora de buscar orientação jurídica em ${city} quando: você não consegue um acordo amigável sobre o valor da pensão; o devedor oculta renda para pagar menos; a pensão fixada há mais de 2 anos não foi corrigida; ou você precisa de alimentos provisórios com urgência.`,
      (city) => `Não espere para procurar um advogado em ${city} se a situação envolve: filhos sem sustento básico garantido; devedor com múltiplos meses em atraso; necessidade de penhora de bens ou prisão civil por dívida alimentar; ou processo de revisão de alimentos já em andamento.`,
    ],
    conclusion: [
      (city) => `Em ${city}, nosso escritório atua há mais de 20 anos em ações de pensão alimentícia, com histórico de resultados favoráveis. Atendemos de forma completamente online, sem necessidade de deslocamento. Entre em contato via WhatsApp e receba orientação jurídica gratuita sobre o seu caso.`,
      (city) => `Se você está em ${city} e precisa de um advogado especializado em pensão alimentícia, entre em contato agora. Oferecemos consulta inicial gratuita, atendimento 100% digital e acompanhamento personalizado do seu processo até a resolução final.`,
      (city) => `Não deixe que seus direitos sejam desrespeitados. Em ${city} e em toda a região, nosso escritório oferece atendimento especializado em ações de alimentos, revisão de pensão e execução por inadimplência. Fale conosco pelo WhatsApp agora mesmo.`,
    ],
  },
  "divorcio-consensual": {
    intro: [
      (city) => `O divórcio consensual em ${city} é a forma mais rápida e menos traumática de encerrar legalmente um casamento quando ambos os cônjuges estão de acordo. Sem filhos menores ou incapazes, o processo pode ser feito diretamente em cartório, sem necessidade de ação judicial.`,
      (city) => `Em ${city}, casais que decidem se separar de forma amigável podem optar pelo divórcio consensual extrajudicial. Essa modalidade é mais rápida, econômica e evita o desgaste emocional de um processo litigioso. Um advogado é indispensável para garantir que todos os seus direitos sejam preservados.`,
      (city) => `O divórcio consensual é a saída mais tranquila para casais em ${city} que decidiram encerrar a relação conjugal sem conflitos. Com a ajuda de um advogado especializado, é possível realizar todo o processo em poucas semanas, seja pela via extrajudicial (cartório) ou judicial.`,
      (city) => `Moradores de ${city} têm acesso facilitado ao divórcio consensual. Quando há acordo sobre partilha de bens, guarda dos filhos e eventuais alimentos, o processo é célere e pode ser encerrado sem audiências prolongadas. A orientação jurídica adequada faz toda a diferença nesse momento.`,
      (city) => `Se você e seu cônjuge decidiu se divorciar de forma amigável em ${city}, saiba que é possível resolver tudo de maneira rápida e discreta. O divórcio consensual protege ambas as partes e garante segurança jurídica para todos os acordos estabelecidos durante a separação.`,
    ],
    situations: [
      (city) => [
        `Divórcio amigável em ${city} — sem filhos menores`,
        `Divórcio consensual com partilha de bens imóveis`,
        `Separação com filhos e necessidade de acordo de guarda`,
        `Conversão de separação judicial em divórcio`,
        `Divórcio extrajudicial em cartório de ${city}`,
        `Dissolução de união estável com patrimônio a partilhar`,
      ],
      (city) => [
        `Casal de ${city} que decidiu se separar consensualmente`,
        `Imóveis, veículos ou empresas a dividir no divórcio`,
        `Acordo sobre guarda compartilhada dos filhos`,
        `Definição de pensão alimentícia no acordo de divórcio`,
        `Partilha de FGTS, previdência privada e investimentos`,
        `Reconhecimento e dissolução de união estável`,
      ],
      (city) => [
        `Cônjuges que não querem processo judicial demorado`,
        `Casamento realizado em ${city} com bens a partilhar`,
        `Necessidade de divórcio rápido para nova união`,
        `Guarda dos filhos já acordada informalmente`,
        `Imóvel financiado com necessidade de transferência`,
        `Dissolução de sociedade conjugal com empresa`,
      ],
    ],
    howItWorks: [
      (city) => `O divórcio consensual em ${city} começa com a consulta ao advogado, que elabora a minuta do acordo. Se não houver filhos menores, o casal vai ao cartório com o advogado para assinar a escritura pública. O processo é concluído em dias. Com filhos, o processo é judicial, mas igualmente célere quando há acordo.`,
      (city) => `Para divórcio consensual em ${city}: o advogado redige o acordo (partilha, guarda, alimentos), as partes revisam e assinam. Sem filhos menores, a escritura é lavrada em cartório em uma única visita. Com filhos, a petição é homologada pelo juiz em audiência rápida. Simples, discreto e eficaz.`,
      (city) => `O processo de divórcio consensual em ${city} envolve: levantamento dos bens do casal, definição dos termos do acordo, elaboração do contrato pelo advogado, e assinatura em cartório ou homologação judicial. Em casos simples, tudo pode ser resolvido em menos de 30 dias.`,
    ],
    whenToLook: [
      (city) => `Procure um advogado de divórcio em ${city} quando: você e seu cônjuge estão de acordo com a separação; há bens a partilhar (imóveis, veículos, empresa, investimentos); existem filhos e é necessário formalizar guarda e alimentos; ou a separação de fato já dura mais de 1 ano.`,
      (city) => `É hora de consultar um advogado em ${city} se: você quer garantir seus direitos na partilha; tem dúvidas sobre a guarda dos filhos; precisa de orientação sobre pensão alimentícia; ou quer realizar o divórcio de forma rápida sem desgastes emocionais adicionais.`,
      (city) => `Não adie o divórcio consensual em ${city}. Quanto antes você formalizar a separação, mais segurança jurídica você terá. Consulte um advogado se há imóveis, filhos menores, dívidas conjuntas ou necessidade de pensão — todos esses pontos precisam estar bem definidos no acordo.`,
    ],
    conclusion: [
      (city) => `Em ${city}, nosso escritório facilita o processo de divórcio consensual com atendimento humano e eficiente. Cuidamos de toda a documentação, garantimos a proteção dos seus direitos e agilizamos o processo para que você possa seguir em frente com tranquilidade.`,
      (city) => `Se você está em ${city} e precisa de um advogado para divórcio consensual, entre em contato via WhatsApp. Oferecemos consulta gratuita, atendimento 100% online e honorários acessíveis. Resolva sua situação de forma rápida e sem conflitos.`,
      (city) => `Nosso escritório atende clientes de ${city} em processos de divórcio consensual com experiência, discrição e agilidade. Fale conosco agora pelo WhatsApp e saiba como podemos ajudar você a resolver sua situação de forma tranquila e segura.`,
    ],
  },
  "cobranca-aluguel": {
    intro: [
      (city) => `A cobrança judicial de aluguéis atrasados em ${city} é um instrumento legal eficaz para proprietários que enfrentam inquilinos inadimplentes. A ação de despejo por falta de pagamento é a medida mais utilizada e pode resultar na desocupação do imóvel em 15 dias, além da cobrança dos valores devidos.`,
      (city) => `Em ${city}, proprietários de imóveis que sofrem com inquilinos que não pagam o aluguel têm à disposição instrumentos jurídicos poderosos. A ação de despejo combinada com a cobrança de aluguéis atrasados garante tanto a retomada do imóvel quanto o recebimento dos valores em aberto.`,
      (city) => `O inadimplemento de aluguéis é um problema recorrente em ${city} e em todo o Brasil. A Lei do Inquilinato (Lei nº 8.245/91) protege os direitos dos locadores e permite a cobrança judicial dos valores devidos, incluindo multas, juros e honorários advocatícios.`,
      (city) => `Se você é proprietário de imóvel em ${city} e está com aluguéis em atraso, saiba que a lei está do seu lado. Um advogado especializado em direito imobiliário pode ajudar você a recuperar os valores devidos e retomar o imóvel de forma rápida e legal.`,
      (city) => `A execução de contrato de locação em ${city} abrange não apenas o despejo por falta de pagamento, mas também a cobrança de todas as parcelas em atraso, IPTU, condomínio e demais encargos previstos no contrato. Conheça seus direitos como locador.`,
    ],
    situations: [
      (city) => [
        `Inquilino com 1 ou mais meses de aluguel atrasado em ${city}`,
        `Locatário que se recusa a desocupar o imóvel`,
        `Cobrança de IPTU, condomínio e multas contratuais`,
        `Fiador que não honrou a dívida do locatário`,
        `Contrato de locação vencido e inquilino sem pagar`,
        `Imóvel danificado pelo inquilino inadimplente`,
      ],
      (city) => [
        `Proprietário de ${city} com múltiplos meses de aluguel a receber`,
        `Locatário sumiu e abandonou o imóvel sem pagar`,
        `Despejo liminar por falta de pagamento`,
        `Cobrança do seguro fiança ou depósito caução`,
        `Inquilino comercial com dívida de aluguel`,
        `Acordo de parcelamento descumprido pelo locatário`,
      ],
      (city) => [
        `Contrato de locação residencial com inadimplência`,
        `Locação sem garantia (sem fiador, sem seguro)`,
        `Necessidade de reintegração de posse urgente`,
        `Cobrança de valores após desocupação do imóvel`,
        `Locatário que sublocou o imóvel sem autorização`,
        `Rescisão antecipada com multa contratual`,
      ],
    ],
    howItWorks: [
      (city) => `A ação de despejo em ${city} começa com notificação ao inquilino. Se não houver pagamento em 15 dias, a ação é ajuizada. O juiz pode conceder liminar de despejo em 15 dias. Após a desocupação, segue-se a cobrança dos valores em atraso, que pode ser feita por execução de título extrajudicial (contrato de locação).`,
      (city) => `O processo de cobrança de aluguéis em ${city} envolve: análise do contrato, notificação do inquilino, ajuizamento da ação de despejo por falta de pagamento, pedido de liminar para desocupação em 15 dias, e execução dos valores atrasados incluindo multas e juros legais.`,
      (city) => `Para recuperar seu imóvel em ${city} e cobrar os aluguéis devidos: o advogado analisa o contrato, elabora notificação extrajudicial, e caso não haja resposta, ajuíza a ação de despejo. Com liminar deferida, o oficial de justiça efetua o despejo. Simultaneamente, os valores são cobrados judicialmente.`,
    ],
    whenToLook: [
      (city) => `Procure um advogado de cobrança de aluguel em ${city} quando: o inquilino está com 1 ou mais meses em atraso; o locatário se nega a desocupar o imóvel; o contrato venceu e não houve renovação; ou o fiador está se esquivando da responsabilidade pelo débito.`,
      (city) => `É urgente consultar um advogado em ${city} se: o inquilino acumula dívidas e você precisa retomar o imóvel; há danos ao imóvel que precisam ser cobrados; o inquilino alegou pandemia ou dificuldades financeiras sem perspectiva de pagamento; ou você precisa despejar com rapidez.`,
      (city) => `Não deixe os aluguéis em atraso se acumularem em ${city}. Quanto mais tempo passa, mais difícil fica a cobrança. Consulte um advogado imediatamente se o inquilino está com mais de 30 dias de inadimplência, pois a ação de despejo liminar pode resolver o problema em menos de 30 dias.`,
    ],
    conclusion: [
      (city) => `Em ${city}, nosso escritório é especializado em ações de despejo e cobrança de aluguéis. Atuamos com rapidez e eficiência para garantir que você recupere seu imóvel e receba os valores devidos. Entre em contato via WhatsApp para uma análise gratuita do seu contrato de locação.`,
      (city) => `Proprietários de imóveis em ${city} contam com nossa equipe especializada em direito imobiliário para resolver situações de inadimplência. Cuidamos de todo o processo de despejo e cobrança, do início ao fim. Fale conosco agora e recupere seu imóvel rapidamente.`,
      (city) => `Se você é locador em ${city} e está com aluguéis atrasados, não perca mais tempo. Nossa equipe cuida da notificação, do processo de despejo e da cobrança judicial dos valores em atraso. Consulta inicial gratuita — entre em contato pelo WhatsApp.`,
    ],
  },
  "transferencia-veiculo": {
    intro: [
      (city) => `A transferência de veículo não realizada pelo vendedor é um problema jurídico frequente em ${city}. Quando o comprador paga pelo veículo mas o vendedor se recusa ou não cumpre a obrigação de transferir o documento, é possível ingressar com ação judicial de obrigação de fazer para forçar a transferência.`,
      (city) => `Em ${city}, é comum que compradores de veículos usados enfrentem a situação em que o vendedor some após receber o pagamento, deixando o carro no nome do antigo dono. Essa situação gera riscos sérios ao comprador, que pode ser responsabilizado por multas, acidentes e impostos gerados pelo veículo.`,
      (city) => `A regularização de veículos em ${city} é uma necessidade crescente. Seja por compra informal, herança ou doação, muitos proprietários enfrentam dificuldades para transferir o documento do veículo. Um advogado especializado pode resolver essa situação através de ação judicial ou orientação extrajudicial.`,
      (city) => `Se você comprou um veículo em ${city} e o vendedor não assina os documentos de transferência, saiba que você tem direito de buscar essa obrigação judicialmente. A ação de obrigação de fazer pode forçar a transferência e ainda garantir indenização pelos prejuízos causados pela demora.`,
      (city) => `A transferência irregular de veículos em ${city} pode causar uma série de problemas ao comprador: multas no nome errado, impossibilidade de fazer seguro, dificuldades em caso de acidente, e até bloqueio do veículo. A solução jurídica é rápida e eficaz com a orientação adequada.`,
    ],
    situations: [
      (city) => [
        `Vendedor em ${city} que se recusa a transferir o veículo`,
        `Veículo comprado há meses ainda no nome do vendedor`,
        `Multas e impostos chegando no nome do vendedor`,
        `Herança de veículo sem inventário formal`,
        `Doação de veículo não registrada em cartório`,
        `Financiamento quitado mas transferência não feita`,
      ],
      (city) => [
        `Compra informal de veículo sem nota fiscal`,
        `Veículo bloqueado no DETRAN por falta de transferência`,
        `Vendedor que sumiu após receber o pagamento`,
        `Veículo em leilão com documentação irregular`,
        `Transferência de frota empresarial para pessoa física`,
        `Contrato particular de compra e venda não cumprido`,
      ],
      (city) => [
        `IPVA e licenciamento vencidos por impossibilidade de transferência`,
        `Seguro negado por irregularidade documental`,
        `Veículo apreendido por documentação irregular`,
        `Dívidas do antigo dono recaindo sobre o comprador`,
        `Transferência de veículo de pessoa falecida`,
        `Disputas entre compradores do mesmo veículo`,
      ],
    ],
    howItWorks: [
      (city) => `Para transferência de veículo em ${city}: o advogado analisa o contrato de compra e venda ou recibo, notifica o vendedor extrajudicialmente. Se não houver resposta, ajuíza ação de obrigação de fazer com pedido de tutela de urgência. O juiz pode determinar a transferência sob pena de multa diária (astreintes) em caso de descumprimento.`,
      (city) => `O processo de regularização de veículo em ${city} começa com a coleta de documentos (contrato, recibo, comprovantes de pagamento). O advogado notifica o vendedor e, em caso de negativa, ingressa com ação judicial. Em muitos casos, a simples notificação resolve a situação sem necessidade de processo.`,
      (city) => `Para resolver a transferência de veículo em ${city}: análise dos documentos disponíveis, orientação sobre o procedimento no DETRAN, elaboração de notificação ao vendedor, e se necessário, ajuizamento de ação de obrigação de fazer. O juiz pode aplicar multa diária ao vendedor até que cumpra a obrigação.`,
    ],
    whenToLook: [
      (city) => `Procure um advogado de transferência de veículo em ${city} quando: o vendedor se recusa ou não responde às tentativas de transferência; você está recebendo multas e notificações no nome do vendedor; o DETRAN está bloqueando a transferência; ou passaram mais de 30 dias desde a compra sem regularização.`,
      (city) => `É hora de consultar um advogado em ${city} se: você comprou um veículo há mais de 30 dias e ele ainda está no nome do vendedor; surgiu uma dívida ou bloqueio judicial sobre o veículo; o vendedor sumiu; ou você está sendo cobrado por infrações que não cometeu.`,
      (city) => `Não aguarde em ${city} se você já tentou resolver a transferência amigavelmente e não obteve resultado. A demora só agrava a situação: multas se acumulam, o seguro é negado, e o veículo pode ser apreendido. Um advogado resolve essa situação rapidamente com a ação judicial adequada.`,
    ],
    conclusion: [
      (city) => `Em ${city}, nosso escritório resolve situações de transferência de veículos com rapidez e eficiência. Se você está com problemas de documentação veicular, entre em contato via WhatsApp para uma consulta gratuita. Cuidamos de todo o processo para regularizar seu veículo.`,
      (city) => `Proprietários de veículos com documentação irregular em ${city} podem contar com nosso escritório para resolver a situação judicial ou extrajudicialmente. Atendimento 100% online, sem necessidade de comparecer ao escritório. Fale conosco pelo WhatsApp agora.`,
      (city) => `Se você tem problemas com transferência de veículo em ${city}, nossa equipe especializada em direito civil pode ajudar. Analisamos seu caso gratuitamente e indicamos o melhor caminho para regularizar a situação rapidamente. Entre em contato via WhatsApp.`,
    ],
  },
  "direito-agrario": {
    intro: [
      (city) => `O direito agrário em ${city} e na região abrange questões relacionadas à regularização de imóveis rurais, conflitos possessórios, arrendamento rural, contratos agrários e reforma agrária. Com o Paraná sendo um dos maiores estados agrícolas do Brasil, a demanda por advogados especializados nessa área é crescente.`,
      (city) => `Em ${city} e na região, produtores rurais, proprietários de terras e trabalhadores do campo frequentemente precisam de orientação jurídica especializada. O direito agrário envolve legislação específica, incluindo o Estatuto da Terra, o Código Civil e diversas normas do INCRA que exigem conhecimento técnico aprofundado.`,
      (city) => `A regularização de imóveis rurais na região de ${city} é uma das demandas mais comuns no direito agrário. Propriedades sem registro, disputas de taças, arrendamentos informais e conflitos possessórios são situações que requerem a atuação de um advogado especializado para garantir a segurança jurídica da propriedade.`,
      (city) => `O Paraná, estado onde se localiza ${city}, é um dos maiores produtores agrícolas do Brasil. Com essa relevância econômica, surgem diversas questões jurídicas no meio rural: desde a regularização fundiária até conflitos entre proprietários, arrendatários e parceiros agrícolas. Um advogado agrário é essencial para proteger seus direitos.`,
      (city) => `Proprietários rurais e agricultores da região de ${city} enfrentam desafios jurídicos específicos: contratos de arrendamento, parceria agrícola, comodato rural, usucapião rural, georeferenciamento e regularização no INCRA. Conheça como um advogado especializado em direito agrário pode ajudar você.`,
    ],
    situations: [
      (city) => [
        `Regularização de imóvel rural sem escritura em ${city}`,
        `Conflito de posse entre produtores rurais na região`,
        `Arrendamento rural sem contrato formalizado`,
        `Disputa de limites entre propriedades rurais`,
        `Usucapião rural — posse mansa e pacífica`,
        `Georeferenciamento e registro no INCRA`,
      ],
      (city) => [
        `Parceria agrícola sem contrato formal na região de ${city}`,
        `Imóvel rural herdado sem inventário`,
        `Reintegração de posse de propriedade rural invadida`,
        `Contrato de comodato rural descumprido`,
        `Regularização de imóvel no INCRA e cartório`,
        `Conflito com arrendatário que não desocupa`,
      ],
      (city) => [
        `Terra rural sem documentação regularizada`,
        `Disputa judicial sobre limites de fazenda`,
        `Produtor rural expulso indevidamente de sua terra`,
        `Venda de imóvel rural com documentação irregular`,
        `Reforma agrária e direitos do assentado`,
        `Financiamento rural com garantia hipotecária`,
      ],
    ],
    howItWorks: [
      (city) => `A regularização de imóvel rural na região de ${city} começa com a análise dos títulos existentes e do histórico da propriedade. O advogado orienta sobre o procedimento no cartório e no INCRA, providencia o georeferenciamento se necessário, e cuida do registro ou retificação de área. Para conflitos possessórios, ajuíza ação adequada com pedido de liminar.`,
      (city) => `Para resolver questões de direito agrário na região de ${city}: o advogado levanta a documentação da propriedade, identifica irregularidades, orienta sobre a forma de regularização (INCRA, cartório, ação judicial), e adota as medidas necessárias para garantir a segurança jurídica do imóvel rural.`,
      (city) => `O processo de regularização fundiária rural na região de ${city} envolve: análise documental completa, orientação sobre alternativas (usucapião rural, retificação de área, regularização administrativa no INCRA), elaboração dos documentos necessários, e acompanhamento até a conclusão do registro ou sentença judicial.`,
    ],
    whenToLook: [
      (city) => `Procure um advogado de direito agrário em ${city} quando: sua propriedade rural não tem escritura ou documentação completa; há conflito de posse ou disputa de limites com vizinhos; o arrendatário não paga ou não desocupa; você precisa regularizar o imóvel para vender ou financiar.`,
      (city) => `É essencial consultar um advogado na região de ${city} se: você herdou uma propriedade rural sem inventário; pretende vender terras mas a documentação está irregular; há invasão ou esbulho possessório da sua propriedade; ou você precisa regularizar o georeferenciamento para venda ou financiamento.`,
      (city) => `Não adie a regularização do seu imóvel rural na região de ${city}. Propriedades sem documentação adequada não podem ser vendidas, hipotecadas ou financiadas, e ficam vulneráveis a conflitos possessórios. Um advogado especializado resolve a situação de forma definitiva.`,
    ],
    conclusion: [
      (city) => `Em ${city} e na região, nosso escritório conta com experiência em direito agrário para atender produtores rurais, proprietários de terras e agricultores. Desde a regularização de imóveis rurais até conflitos possessórios, cuidamos do seu caso com dedicação. Entre em contato via WhatsApp.`,
      (city) => `Se você tem imóvel rural na região de ${city} e precisa de orientação jurídica, nosso escritório oferece atendimento especializado em direito agrário. Consulta inicial gratuita e atendimento 100% online. Fale conosco agora pelo WhatsApp.`,
      (city) => `Proprietários rurais da região de ${city} contam com nossa equipe para resolver questões jurídicas do campo. Regularização fundiária, contratos agrários, conflitos de posse e muito mais. Entre em contato via WhatsApp e proteja seu patrimônio rural.`,
    ],
  },
};

export const WHATSAPP_NUMBER = "5541995808145";

export function getWhatsAppLink(city: string, service?: string): string {
  const subject = service ? `${service} em ${city}` : city;
  const message = encodeURIComponent(
    `Olá! Vim pelo site e gostaria de uma consulta sobre ${subject}. Sou de ${city}.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// All city slugs for routing
export const ALL_CITY_SLUGS = PARANA_CITIES.map((c) => c.slug);

// Generate all service+city route slugs
export function getServiceCitySlug(serviceSlug: string, citySlug: string): string {
  return `advogado-${serviceSlug}-${citySlug}`;
}
