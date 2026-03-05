export interface CityData {
  slug: string;
  name: string;
  region: string;
  variationIndex: number;
}

export const PARANA_CITIES: CityData[] = [
  { slug: "curitiba", name: "Curitiba", region: "Grande Curitiba", variationIndex: 0 },
  { slug: "londrina", name: "Londrina", region: "Norte do Paraná", variationIndex: 1 },
  { slug: "maringa", name: "Maringá", region: "Noroeste do Paraná", variationIndex: 2 },
  { slug: "cascavel", name: "Cascavel", region: "Oeste do Paraná", variationIndex: 3 },
  { slug: "foz-do-iguacu", name: "Foz do Iguaçu", region: "Oeste do Paraná", variationIndex: 4 },
  { slug: "ponta-grossa", name: "Ponta Grossa", region: "Centro do Paraná", variationIndex: 0 },
  { slug: "guarapuava", name: "Guarapuava", region: "Centro-Sul do Paraná", variationIndex: 1 },
  { slug: "colombo", name: "Colombo", region: "Grande Curitiba", variationIndex: 2 },
  { slug: "apucarana", name: "Apucarana", region: "Norte do Paraná", variationIndex: 3 },
  { slug: "toledo", name: "Toledo", region: "Oeste do Paraná", variationIndex: 4 },
  { slug: "arapongas", name: "Arapongas", region: "Norte do Paraná", variationIndex: 0 },
  { slug: "campo-largo", name: "Campo Largo", region: "Grande Curitiba", variationIndex: 1 },
  { slug: "campo-mourao", name: "Campo Mourão", region: "Centro-Oeste do Paraná", variationIndex: 2 },
  { slug: "paranagua", name: "Paranaguá", region: "Litoral do Paraná", variationIndex: 3 },
  { slug: "umuarama", name: "Umuarama", region: "Noroeste do Paraná", variationIndex: 4 },
  { slug: "cornelio-procopio", name: "Cornélio Procópio", region: "Norte Pioneiro do Paraná", variationIndex: 0 },
  { slug: "pato-branco", name: "Pato Branco", region: "Sudoeste do Paraná", variationIndex: 1 },
  { slug: "francisco-beltrao", name: "Francisco Beltrão", region: "Sudoeste do Paraná", variationIndex: 2 },
  { slug: "castro", name: "Castro", region: "Centro do Paraná", variationIndex: 3 },
  { slug: "dois-vizinhos", name: "Dois Vizinhos", region: "Sudoeste do Paraná", variationIndex: 4 },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return PARANA_CITIES.find((c) => c.slug === slug);
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

export const WHATSAPP_NUMBER = "5541995808145";

export function getWhatsAppLink(city: string): string {
  const message = encodeURIComponent(
    `Olá! Vim pelo site e gostaria de uma consulta sobre meu caso. Sou de ${city}.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
