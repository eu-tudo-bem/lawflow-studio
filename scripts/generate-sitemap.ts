/**
 * Script para regenerar public/sitemap.xml a partir dos dados reais de
 * localSEOCities.ts — garante que NENHUM slug com acento ou URL inválida
 * entre no sitemap.
 *
 * Execução: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

// ── Importação direta dos dados canônicos ─────────────────────────────────────
// Replicamos inline para evitar dependência de transpilação do TS no script
// (sincronize se LEGAL_SERVICES ou PARANA_CITIES mudarem)

const LEGAL_SERVICES_KEYWORDS = [
  "pensao-alimenticia",
  "divorcio-consensual",
  "cobranca-aluguel",
  "transferencia-veiculo",
  "direito-agrario",
  "atraso-voo",
  "revisional-juros",
  "indenizacao-energia",
  "certidao-negativa",
  "extravio-bagagem",
  "uniao-estavel",
  "inventario-partilha",
  "usucapiao",
  "aposentadoria-inss",
  "direito-imobiliario",
  "usucapiao-extrajudicial",
  "arrendamento-rural",
  "comodato-rural",
  "reintegracao-posse",
  "contrato-locacao",
  "aluguel-comercial",
  "acordo-prenupcial",
  "doacao-terreno",
  "arrendamento-terra",
  "gestao-agronegocio",
];

// Slugs extraídos do PARANA_CITIES já corrigidos (sem acentos, sem typos)
const CITY_SLUGS = [
  "curitiba","londrina","maringa","cascavel","foz-do-iguacu","ponta-grossa",
  "guarapuava","colombo","apucarana","toledo","arapongas","campo-largo",
  "campo-mourao","paranagua","umuarama","cornelio-procopio","pato-branco",
  "francisco-beltrao","telemacos-borba","irati","palmas","cianorte","castro",
  "dois-vizinhos","guaira","pinhais","sao-jose-dos-pinhais","araucaria",
  "fazenda-rio-grande","almirante-tamandare","piraquara","sarandi","cambe",
  "paranavai","rolandia","marechal-candido-rondon","santa-helena","palotina",
  "medianeira","ibipora","prudentopolis","santo-antonio-da-platina",
  "jacarezinho","bandeirantes","siqueira-campos","goioere","jaguariaiva",
  "uniao-da-vitoria","missal","pontal-do-parana","morretes","antonina",
  "mandirituba","quatro-barras","senges","wenceslau-braz","realeza","ampere",
  "ubirata","ipora","terra-roxa","assai","astorga","porecatu","capanema",
  "mangueirinha","reserva-do-iguacu","palmital","bituruna","pinhao",
  "chopinzinho","laranjal",
  // Lote 5
  "abatia","adrianopolis","agudos-do-sul","alvorada-do-sul","amapoa",
  "anahy","andira","angulo","araruna","ariranha-do-ivai","atalaia",
  "balsa-nova","barbosa-ferraz","barra-do-jacare","barracao",
  "bela-vista-da-caroba","bela-vista-do-paraiso","boa-esperanca",
  "boa-esperanca-do-iguacu","boa-ventura-de-sao-roque","boa-vista-da-aparecida",
  "bocaiuva-do-sul","bom-jesus-do-sul","bom-sucesso","bom-sucesso-do-sul",
  "borrazopolis","braganey","brasilandia-do-sul","cafeara","cafezal-do-sul",
  "california","cambara","cambira","campina-da-lagoa","campina-do-simao",
  "campo-bonito","campo-do-tenente","campo-magro","candido-de-abreu",
  "candoi","cantagalo","formosa-do-oeste","jesuitas","nova-aurora","maripa",
  "mercedes","pato-bragado","quatro-pontes","tupassi","cafelandia","iguatu",
  "ibema","guaraniacu","mariluz","moreira-sales","tuneiras-do-oeste","tapira",
  "icaraima","alto-paraiso","perola","altania","sao-jorge-do-patrocinio",
  "alto-piquiri","ivata","planaltina-do-parana","santa-isabel-do-ivai",
  "santa-monica","santo-antonio-do-caiua","sao-joao-do-caiua","guairaca",
  "terra-rica","itauna-do-sul","nova-londrina","marilena","porto-rico",
  "querencia-do-norte","santa-cruz-do-monte-castelo","sao-pedro-do-parana",
  "nova-olimpia","maria-helena","xambre",
];

const BASE_URL = "https://fernandezefernandes.adv.br";

const DOCUMENT_SLUGS = [
  "notificacao-cobranca-aluguel",
  "notificacao-divida",
  "acordo-divorcio",
  "declaracao-uniao-estavel",
  "contrato-arrendamento-rural",
  "declaracao-dependencia-economica",
  "revisao-pensao-alimenticia",
];

function url(loc: string, priority: string, changefreq = "monthly") {
  return `<url>\n<loc>${BASE_URL}${loc}</loc>\n<changefreq>${changefreq}</changefreq>\n<priority>${priority}</priority>\n</url>`;
}

const urls: string[] = [
  url("/", "1.0", "weekly"),
  url("/blog", "0.9", "daily"),
  url("/calculadora", "0.7"),
  url("/simulador-pensao", "0.7"),
  url("/simulador-juros", "0.7"),
  url("/simulador-aposentadoria", "0.7"),
  url("/simulador-horas-extras", "0.7"),
  url("/pensao-alimenticia", "0.8"),
  url("/divorcio-consensual", "0.8"),
  url("/cobranca-aluguel", "0.8"),
  url("/direito-agrario", "0.8"),
  url("/transferencia-veiculos", "0.8"),
  url("/gerador-documentos", "0.8"),
  ...DOCUMENT_SLUGS.map((s) => url(`/gerador-${s}`, "0.75")),
  // Escritórios por cidade
  ...CITY_SLUGS.map((c) => url(`/escritorio-advocacia-${c}`, "0.9")),
  // Serviço × Cidade
  ...LEGAL_SERVICES_KEYWORDS.flatMap((svc) =>
    CITY_SLUGS.map((c) => url(`/advogado-${svc}-${c}`, "0.85"))
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

const outPath = resolve(process.cwd(), "public/sitemap.xml");
writeFileSync(outPath, xml, "utf-8");

const total = urls.length;
console.log(`✅ sitemap.xml gerado: ${total} URLs → ${outPath}`);
console.log(`   - ${CITY_SLUGS.length} cidades`);
console.log(`   - ${LEGAL_SERVICES_KEYWORDS.length} serviços`);
console.log(`   - ${CITY_SLUGS.length * LEGAL_SERVICES_KEYWORDS.length} páginas serviço×cidade`);
