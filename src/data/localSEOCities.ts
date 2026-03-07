export interface CityData {
  slug: string;
  name: string;
  region: string;
  variationIndex: number;
  nearbySlug?: string[];
}

export interface ServiceData {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  keyword: string;
  area: string;
}

export const LEGAL_SERVICES: ServiceData[] = [
  {
    slug: "pensao-alimenticia",
    name: "Pensão Alimentícia",
    shortName: "Pensão",
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
    shortName: "Aluguel",
    icon: "🏠",
    keyword: "cobranca-aluguel",
    area: "Direito Imobiliário",
  },
  {
    slug: "transferencia-veiculo",
    name: "Transferência de Veículo",
    shortName: "Veículo",
    icon: "🚗",
    keyword: "transferencia-veiculo",
    area: "Direito Civil",
  },
  {
    slug: "direito-agrario",
    name: "Direito Agrário",
    shortName: "Agrário",
    icon: "🌾",
    keyword: "direito-agrario",
    area: "Direito Agrário",
  },
  {
    slug: "atraso-voo",
    name: "Atraso e Cancelamento de Voo",
    shortName: "Voo",
    icon: "✈️",
    keyword: "atraso-voo",
    area: "Direito do Consumidor",
  },
  {
    slug: "revisional-juros",
    name: "Revisional de Juros Bancários",
    shortName: "Juros",
    icon: "📉",
    keyword: "revisional-juros",
    area: "Direito Bancário",
  },
  {
    slug: "indenizacao-energia",
    name: "Indenização por Queda de Energia",
    shortName: "Energia",
    icon: "⚡",
    keyword: "indenizacao-energia",
    area: "Direito do Consumidor",
  },
];

export const PARANA_CITIES: CityData[] = [
  // Lote 1 & 2 (46 Cidades)
  {
    slug: "curitiba",
    name: "Curitiba",
    region: "Grande Curitiba",
    variationIndex: 0,
    nearbySlug: ["sao-jose-dos-pinhais", "colombo", "araucaria"],
  },
  {
    slug: "londrina",
    name: "Londrina",
    region: "Norte do Paraná",
    variationIndex: 1,
    nearbySlug: ["arapongas", "cambe", "rolandia"],
  },
  {
    slug: "maringa",
    name: "Maringá",
    region: "Noroeste do Paraná",
    variationIndex: 2,
    nearbySlug: ["sarandi", "paicandu", "marialva"],
  },
  {
    slug: "cascavel",
    name: "Cascavel",
    region: "Oeste do Paraná",
    variationIndex: 3,
    nearbySlug: ["toledo", "medianeira", "corbelia"],
  },
  {
    slug: "foz-do-iguacu",
    name: "Foz do Iguaçu",
    region: "Oeste do Paraná",
    variationIndex: 4,
    nearbySlug: ["medianeira", "santa-helena"],
  },
  {
    slug: "ponta-grossa",
    name: "Ponta Grossa",
    region: "Campos Gerais",
    variationIndex: 0,
    nearbySlug: ["castro", "palmeira", "irati"],
  },
  {
    slug: "guarapuava",
    name: "Guarapuava",
    region: "Centro-Sul",
    variationIndex: 1,
    nearbySlug: ["pinhao", "prudentopolis"],
  },
  {
    slug: "colombo",
    name: "Colombo",
    region: "Grande Curitiba",
    variationIndex: 2,
    nearbySlug: ["curitiba", "almirante-tamandare"],
  },
  {
    slug: "apucarana",
    name: "Apucarana",
    region: "Norte do Paraná",
    variationIndex: 3,
    nearbySlug: ["arapongas", "jandaia-do-sul"],
  },
  {
    slug: "toledo",
    name: "Toledo",
    region: "Oeste do Paraná",
    variationIndex: 4,
    nearbySlug: ["cascavel", "marechal-candido-rondon"],
  },
  {
    slug: "arapongas",
    name: "Arapongas",
    region: "Norte do Paraná",
    variationIndex: 0,
    nearbySlug: ["londrina", "apucarana"],
  },
  {
    slug: "campo-largo",
    name: "Campo Largo",
    region: "Grande Curitiba",
    variationIndex: 1,
    nearbySlug: ["curitiba", "araucaria"],
  },
  {
    slug: "campo-mourao",
    name: "Campo Mourão",
    region: "Centro-Oeste",
    variationIndex: 2,
    nearbySlug: ["goioere", "cianorte"],
  },
  { slug: "paranagua", name: "Paranaguá", region: "Litoral", variationIndex: 3, nearbySlug: ["matinhos", "guaratuba"] },
  {
    slug: "umuarama",
    name: "Umuarama",
    region: "Noroeste",
    variationIndex: 4,
    nearbySlug: ["cruzeiro-do-oeste", "loanda"],
  },
  {
    slug: "cornelio-procopio",
    name: "Cornélio Procópio",
    region: "Norte Pioneiro",
    variationIndex: 0,
    nearbySlug: ["bandeirantes", "santo-antonio-da-platina"],
  },
  {
    slug: "pato-branco",
    name: "Pato Branco",
    region: "Sudoeste",
    variationIndex: 1,
    nearbySlug: ["francisco-beltrao", "coronel-vivida"],
  },
  {
    slug: "francisco-beltrao",
    name: "Francisco Beltrão",
    region: "Sudoeste",
    variationIndex: 2,
    nearbySlug: ["pato-branco", "dois-vizinhos"],
  },
  {
    slug: "telemacos-borba",
    name: "Telêmaco Borba",
    region: "Centro",
    variationIndex: 3,
    nearbySlug: ["reserva", "irati"],
  },
  { slug: "irati", name: "Irati", region: "Sudeste", variationIndex: 4, nearbySlug: ["imbituva", "prudentopolis"] },
  { slug: "palmas", name: "Palmas", region: "Sudoeste", variationIndex: 0, nearbySlug: ["pato-branco"] },
  {
    slug: "cianorte",
    name: "Cianorte",
    region: "Noroeste",
    variationIndex: 1,
    nearbySlug: ["maringa", "campo-mourao"],
  },
  {
    slug: "castro",
    name: "Castro",
    region: "Campos Gerais",
    variationIndex: 2,
    nearbySlug: ["ponta-grossa", "jaguariaiva"],
  },
  {
    slug: "dois-vizinhos",
    name: "Dois Vizinhos",
    region: "Sudoeste",
    variationIndex: 3,
    nearbySlug: ["francisco-beltrao"],
  },
  {
    slug: "guaira",
    name: "Guaíra",
    region: "Oeste",
    variationIndex: 4,
    nearbySlug: ["toledo", "marechal-candido-rondon"],
  },
  {
    slug: "pinhais",
    name: "Pinhais",
    region: "Grande Curitiba",
    variationIndex: 0,
    nearbySlug: ["curitiba", "piraquara"],
  },
  {
    slug: "sao-jose-dos-pinhais",
    name: "São José dos Pinhais",
    region: "Grande Curitiba",
    variationIndex: 1,
    nearbySlug: ["curitiba", "pinhais"],
  },
  {
    slug: "araucaria",
    name: "Araucária",
    region: "Grande Curitiba",
    variationIndex: 2,
    nearbySlug: ["curitiba", "fazenda-rio-grande"],
  },
  {
    slug: "fazenda-rio-grande",
    name: "Fazenda Rio Grande",
    region: "Grande Curitiba",
    variationIndex: 3,
    nearbySlug: ["curitiba", "araucaria"],
  },
  {
    slug: "almirante-tamandare",
    name: "Almirante Tamandaré",
    region: "Grande Curitiba",
    variationIndex: 4,
    nearbySlug: ["curitiba", "colombo"],
  },
  {
    slug: "piraquara",
    name: "Piraquara",
    region: "Grande Curitiba",
    variationIndex: 0,
    nearbySlug: ["curitiba", "pinhais"],
  },
  { slug: "sarandi", name: "Sarandi", region: "Noroeste", variationIndex: 1, nearbySlug: ["maringa", "marialva"] },
  { slug: "cambe", name: "Cambé", region: "Norte", variationIndex: 2, nearbySlug: ["londrina", "rolandia"] },
  {
    slug: "paranavai",
    name: "Paranavaí",
    region: "Noroeste",
    variationIndex: 3,
    nearbySlug: ["loanda", "nova-esperanca"],
  },
  { slug: "rolandia", name: "Rolândia", region: "Norte", variationIndex: 4, nearbySlug: ["londrina", "cambe"] },
  {
    slug: "marechal-candido-rondon",
    name: "Marechal Cândido Rondon",
    region: "Oeste",
    variationIndex: 0,
    nearbySlug: ["toledo", "guaira"],
  },
  {
    slug: "uniao-da-vitoria",
    name: "União da Vitória",
    region: "Sudeste",
    variationIndex: 1,
    nearbySlug: ["sao-mateus-do-sul"],
  },
  {
    slug: "medianeira",
    name: "Medianeira",
    region: "Oeste",
    variationIndex: 2,
    nearbySlug: ["foz-do-iguacu", "cascavel"],
  },
  { slug: "ibipora", name: "Ibiporã", region: "Norte", variationIndex: 3, nearbySlug: ["londrina"] },
  {
    slug: "prudentopolis",
    name: "Prudentópolis",
    region: "Centro",
    variationIndex: 4,
    nearbySlug: ["guarapuava", "irati"],
  },
  {
    slug: "santo-antonio-da-platina",
    name: "Santo Antônio da Platina",
    region: "Norte Pioneiro",
    variationIndex: 0,
    nearbySlug: ["jacarezinho", "ibaiti"],
  },
  { slug: "guaratuba", name: "Guaratuba", region: "Litoral", variationIndex: 1, nearbySlug: ["matinhos", "paranagua"] },
  { slug: "matinhos", name: "Matinhos", region: "Litoral", variationIndex: 2, nearbySlug: ["guaratuba", "paranagua"] },
  {
    slug: "jacarezinho",
    name: "Jacarezinho",
    region: "Norte Pioneiro",
    variationIndex: 3,
    nearbySlug: ["santo-antonio-da-platina"],
  },
  { slug: "palotina", name: "Palotina", region: "Oeste", variationIndex: 4, nearbySlug: ["guaira", "toledo"] },
  {
    slug: "goioere",
    name: "Goioerê",
    region: "Centro-Oeste",
    variationIndex: 0,
    nearbySlug: ["campo-mourao", "umuarama"],
  },

  // Lote 3 (30 Novas Cidades)
  {
    slug: "assis-chateaubriand",
    name: "Assis Chateaubriand",
    region: "Oeste",
    variationIndex: 1,
    nearbySlug: ["toledo", "palotina"],
  },
  { slug: "bandeirantes", name: "Bandeirantes", region: "Norte", variationIndex: 2, nearbySlug: ["cornelio-procopio"] },
  {
    slug: "campina-grande-do-sul",
    name: "Campina Grande do Sul",
    region: "Grande Curitiba",
    variationIndex: 3,
    nearbySlug: ["curitiba", "colombo"],
  },
  { slug: "colorado", name: "Colorado", region: "Norte", variationIndex: 4, nearbySlug: ["maringa", "paranavai"] },
  { slug: "corbelia", name: "Corbélia", region: "Oeste", variationIndex: 0, nearbySlug: ["cascavel"] },
  {
    slug: "coronel-vivida",
    name: "Coronel Vivida",
    region: "Sudoeste",
    variationIndex: 1,
    nearbySlug: ["pato-branco", "chopinzinho"],
  },
  {
    slug: "cruzeiro-do-oeste",
    name: "Cruzeiro do Oeste",
    region: "Noroeste",
    variationIndex: 2,
    nearbySlug: ["umuarama"],
  },
  {
    slug: "ibaiti",
    name: "Ibaiti",
    region: "Norte Pioneiro",
    variationIndex: 3,
    nearbySlug: ["santo-antonio-da-platina"],
  },
  { slug: "imbituva", name: "Imbituva", region: "Sudeste", variationIndex: 4, nearbySlug: ["irati"] },
  { slug: "ivaipora", name: "Ivaiporã", region: "Vale do Ivaí", variationIndex: 0, nearbySlug: ["apucarana"] },
  { slug: "jandaia-do-sul", name: "Jandaia do Sul", region: "Norte", variationIndex: 1, nearbySlug: ["apucarana"] },
  { slug: "jaguariaiva", name: "Jaguariaíva", region: "Campos Gerais", variationIndex: 2, nearbySlug: ["castro"] },
  { slug: "lapa", name: "Lapa", region: "Grande Curitiba", variationIndex: 3, nearbySlug: ["araucaria"] },
  {
    slug: "laranjeiras-do-sul",
    name: "Laranjeiras do Sul",
    region: "Centro-Sul",
    variationIndex: 4,
    nearbySlug: ["guarapuava"],
  },
  { slug: "loanda", name: "Loanda", region: "Noroeste", variationIndex: 0, nearbySlug: ["paranavai"] },
  { slug: "mandaguari", name: "Mandaguari", region: "Norte", variationIndex: 1, nearbySlug: ["maringa"] },
  { slug: "marialva", name: "Marialva", region: "Norte", variationIndex: 2, nearbySlug: ["sarandi", "maringa"] },
  { slug: "nova-esperanca", name: "Nova Esperança", region: "Noroeste", variationIndex: 3, nearbySlug: ["paranavai"] },
  { slug: "paicandu", name: "Paiçandu", region: "Noroeste", variationIndex: 4, nearbySlug: ["maringa"] },
  { slug: "palmeira", name: "Palmeira", region: "Campos Gerais", variationIndex: 0, nearbySlug: ["ponta-grossa"] },
  { slug: "pinhao", name: "Pinhão", region: "Centro-Sul", variationIndex: 1, nearbySlug: ["guarapuava"] },
  { slug: "pitanga", name: "Pitanga", region: "Centro", variationIndex: 2, nearbySlug: ["guarapuava"] },
  {
    slug: "quedas-do-iguacu",
    name: "Quedas do Iguaçu",
    region: "Centro-Sul",
    variationIndex: 3,
    nearbySlug: ["cascavel"],
  },
  { slug: "reserva", name: "Reserva", region: "Campos Gerais", variationIndex: 4, nearbySlug: ["telemacos-borba"] },
  {
    slug: "rio-branco-do-sul",
    name: "Rio Branco do Sul",
    region: "Grande Curitiba",
    variationIndex: 0,
    nearbySlug: ["curitiba"],
  },
  { slug: "rio-negro", name: "Rio Negro", region: "Sudeste", variationIndex: 1, nearbySlug: ["lapa"] },
  {
    slug: "santa-helena",
    name: "Santa Helena",
    region: "Oeste",
    variationIndex: 2,
    nearbySlug: ["marechal-candido-rondon"],
  },
  {
    slug: "sao-mateus-do-sul",
    name: "São Mateus do Sul",
    region: "Sudeste",
    variationIndex: 3,
    nearbySlug: ["uniao-da-vitoria"],
  },
  {
    slug: "siqueira-campos",
    name: "Siqueira Campos",
    region: "Norte Pioneiro",
    variationIndex: 4,
    nearbySlug: ["ibaiti"],
  },
  { slug: "chopinzinho", name: "Chopinzinho", region: "Sudoeste", variationIndex: 0, nearbySlug: ["pato-branco"] },
];

export const textVariations = {
  subtitle: [
    (city: string, region: string) =>
      `Atendimento jurídico especializado em ${city} e região. Nossa equipa está pronta para defender os seus direitos com agilidade no ${region}.`,
    (city: string, region: string) =>
      `Há mais de 20 anos prestando assessoria jurídica completa para moradores de ${city}. Consultoria personalizada em todo o ${region}.`,
  ],
  attendanceText: [
    (city: string) =>
      `Realizamos atendimento online com total segurança para clientes de ${city}. Não é necessário deslocar-se ao escritório para iniciar o seu caso.`,
    (city: string) =>
      `Moradores de ${city} podem contratar os nossos serviços 100% à distância, com acompanhamento em tempo real via WhatsApp.`,
  ],
};

export const serviceTextVariations: Record<string, any> = {
  "pensao-alimenticia": {
    intro: [
      (city: string) =>
        `A pensão alimentícia é um direito fundamental em ${city}. Ajudamos a garantir o sustento dos seus filhos através de ações de fixação ou revisão.`,
    ],
    situations: [
      (city: string) => [
        `Pai que não paga pensão em ${city}`,
        `Necessidade de aumentar o valor`,
        `Execução de atrasados`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `O processo em ${city} inicia com a análise de rendimentos e necessidades, seguido do pedido judicial de alimentos provisórios.`,
    ],
    whenToLook: [
      (city: string) =>
        `Procure um especialista em ${city} assim que houver separação ou se a pensão estiver atrasada há mais de um mês.`,
    ],
    conclusion: [(city: string) => `Garanta os direitos de quem ama em ${city}. Fale connosco agora pelo WhatsApp.`],
  },
  "atraso-voo": {
    intro: [
      (city: string) =>
        `Passageiros em ${city} que enfrentam atrasos de voo superiores a 4 horas ou cancelamentos têm direito a indemnização por danos morais.`,
    ],
    situations: [
      (city: string) => [
        `Voo atrasado saindo de ${city}`,
        `Cancelamento sem aviso prévio`,
        `Overbooking e perda de conexão`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `Analisamos o seu bilhete e provas do atraso em ${city} para entrar com uma ação contra a companhia aérea.`,
    ],
    whenToLook: [
      (city: string) =>
        `Consulte-nos se o seu voo atrasou mais de 4 horas ou se teve gastos extras com alimentação e hotel em ${city}.`,
    ],
    conclusion: [(city: string) => `Não aceite apenas um voucher. Em ${city}, lute pela sua indemnização em dinheiro.`],
  },
  "revisional-juros": {
    intro: [
      (city: string) =>
        `Está a pagar parcelas abusivas em ${city}? A ação revisional de juros bancários pode reduzir drasticamente a sua dívida de veículo ou empréstimo.`,
    ],
    situations: [
      (city: string) => [
        `Parcelas de carro muito altas em ${city}`,
        `Juros abusivos em cartões`,
        `Busca e apreensão iminente`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `Fazemos um cálculo pericial para identificar taxas acima da média do Banco Central para clientes em ${city}.`,
    ],
    whenToLook: [
      (city: string) =>
        `Se sente que a sua dívida em ${city} não baixa mesmo pagando em dia, é hora de revisar o contrato.`,
    ],
    conclusion: [
      (city: string) => `Recupere o seu fôlego financeiro em ${city}. Peça uma análise gratuita do seu contrato.`,
    ],
  },
  "indenizacao-energia": {
    intro: [
      (city: string) =>
        `A queda constante de energia em ${city} que causa danos em aparelhos ou prejuízos comerciais gera direito a indemnização imediata.`,
    ],
    situations: [
      (city: string) => [
        `Queima de eletrodomésticos em ${city}`,
        `Prejuízo em stock por falta de luz`,
        `Demora excessiva no restabelecimento`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `Documentamos a falha no serviço em ${city} e os danos causados para exigir a reparação total pela concessionária.`,
    ],
    whenToLook: [
      (city: string) =>
        `Sempre que a falta de energia em ${city} causar um prejuízo financeiro direto ou queima de equipamentos.`,
    ],
    conclusion: [
      (city: string) => `A concessionária é responsável. Em ${city}, faça valer os seus direitos de consumidor.`,
    ],
  },
  "divorcio-consensual": {
    intro: [
      (city: string) =>
        `O divórcio consensual em ${city} é a forma mais rápida e barata de encerrar um casamento quando há acordo entre as partes.`,
    ],
    situations: [
      (city: string) => [
        `Separação amigável em ${city}`,
        `Partilha de bens e guarda de filhos`,
        `Divórcio em cartório`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `Elaboramos a minuta do acordo em ${city} e realizamos o processo judicial ou extrajudicial de forma célere.`,
    ],
    whenToLook: [
      (city: string) =>
        `Quando ambos decidem seguir caminhos diferentes em ${city} e desejam uma resolução sem conflitos.`,
    ],
    conclusion: [(city: string) => `Encerre este ciclo com dignidade e rapidez em ${city}. Atendimento 100% discreto.`],
  },
  "cobranca-aluguel": {
    intro: [
      (city: string) =>
        `Proprietários em ${city} com inquilinos inadimplentes podem recorrer ao despejo e cobrança judicial de aluguéis em atraso.`,
    ],
    situations: [
      (city: string) => [
        `Inquilino sem pagar em ${city}`,
        `Falta de pagamento de condomínio/IPTU`,
        `Necessidade de retomar o imóvel`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `Entramos com a ação de despejo acumulada com cobrança para clientes de ${city}, visando a desocupação rápida.`,
    ],
    whenToLook: [
      (city: string) => `Não espere meses. Com um dia de atraso em ${city}, já pode iniciar as medidas de cobrança.`,
    ],
    conclusion: [(city: string) => `Proteja o seu património imobiliário em ${city}. Consulte um especialista.`],
  },
  "transferencia-veiculo": {
    intro: [
      (city: string) =>
        `Comprou ou vendeu um carro em ${city} e o documento não foi transferido? Resolvemos bloqueios e transferências judiciais.`,
    ],
    situations: [
      (city: string) => [
        `Vendedor sumiu após a venda em ${city}`,
        `Multas no nome do antigo dono`,
        `Veículo com bloqueio administrativo`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `Ingressamos com ação de obrigação de fazer em ${city} para forçar a transferência junto ao DETRAN.`,
    ],
    whenToLook: [
      (city: string) => `Se passaram 30 dias da negociação em ${city} e o documento continua irregular, procure-nos.`,
    ],
    conclusion: [
      (city: string) => `Evite multas e problemas jurídicos com o seu veículo em ${city}. Regularize agora.`,
    ],
  },
  "direito-agrario": {
    intro: [
      (city: string) =>
        `O Paraná é força no campo, e em ${city} protegemos produtores rurais em contratos de arrendamento e conflitos de terras.`,
    ],
    situations: [
      (city: string) => [
        `Contratos de arrendamento em ${city}`,
        `Usucapião e reintegração de posse`,
        `Regularização de imóveis rurais`,
      ],
    ],
    howItWorks: [
      (city: string) =>
        `Analisamos a cadeia dominial e contratos agrários na região de ${city} para garantir segurança jurídica.`,
    ],
    whenToLook: [(city: string) => `Antes de assinar parcerias ou se houver ameaça à posse da sua terra em ${city}.`],
    conclusion: [
      (city: string) => `A sua terra é o seu maior bem. Em ${city}, conte com advocacia especializada no campo.`,
    ],
  },
};

export const WHATSAPP_NUMBER = "5541995808145";

export function getWhatsAppLink(city: string, service?: string): string {
  const subject = service ? `${service} em ${city}` : city;
  const message = encodeURIComponent(`Olá! Vim pelo site e gostaria de uma consulta sobre ${subject}. Sou de ${city}.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function getCityBySlug(slug: string): CityData | undefined {
  return PARANA_CITIES.find((c) => c.slug === slug);
}

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return LEGAL_SERVICES.find((s) => s.slug === slug);
}

export const ALL_CITY_SLUGS = PARANA_CITIES.map((c) => c.slug);

export function getServiceCitySlug(serviceSlug: string, citySlug: string): string {
  return `advogado-${serviceSlug}-${citySlug}`;
}
