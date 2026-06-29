## Objetivo
Adicionar uma nova frente de captação ("Casos com documentos prontos para análise") com 10 serviços novos, totalmente integrada às páginas hiperlocais já existentes, gerando milhares de novas combinações cidade × serviço sem quebrar nada do que já funciona.

## Escopo (o que será feito)

### 1. Cadastro dos 10 novos serviços (`src/data/localSEOCities.ts`)
Adicionar ao array `LEGAL_SERVICES` (mantendo todos os 25 já existentes):
- `desconto-indevido-inss` — Previdenciário / Bancário
- `consignado-nao-contratado` — Bancário / Consumidor
- `negativacao-indevida` — Consumidor
- `cobranca-indevida` — Consumidor / Bancário
- `produto-nao-entregue` — Consumidor
- `direito-arrependimento` — Consumidor
- `voo-atrasado-cancelado` — Consumidor (separado do já existente `atraso-voo`, para casar com o slug pedido)
- `veiculo-nao-transferido` — Civil / Consumidor
- `fgts-nao-depositado` — Trabalhista
- `verbas-rescisorias-nao-pagas` — Trabalhista

Cada um com `slug`, `name`, `shortName`, `icon`, `keyword` igual ao slug, `area`, `customCTA` informativo (sem promessa de resultado).

### 2. Dataset dedicado (`src/data/documentReadyServices.ts` — novo arquivo)
Para cada um dos 10 serviços, definir:
- `slug`, `name`, `area`, `shortDescription` (≤180 chars)
- `documents: string[]` — lista de documentos comuns
- `whenItHappens: string[]` — situações típicas (3-5)
- `whatCanBeAnalyzed: string[]` — pontos da análise documental
- `careNotice: string` — texto de cautela / não-promessa
- `faqs: { q, a }[]` — 5 perguntas reais por serviço (templated com cidade)
- `intro(city)`, `attendance(city)` — funções de variação textual

Também exporta `DOCUMENT_READY_SLUGS` (Set) e helper `isDocumentReadyService(slug)`.

### 3. Variações de texto para o ServiceLocalPage
Adicionar entradas em `serviceTextVariations` para os 10 novos slugs (intro/situations/howItWorks/whenToLook/conclusion). Como o `ServiceLocalPage` já tem fallback Premium, mas queremos conteúdo único e ≥800 palavras por página, escrever variações específicas usando os dados do dataset.

### 4. Componente reutilizável `DocumentReadyCasesSection.tsx` (novo)
Renderiza:
- Título: "Casos que podem ser analisados com documentos"
- Subtítulo dinâmico com nome da cidade
- Grid de 10 cards (nome do serviço, área, descrição curta, lista resumida de documentos, botão "Ver documentos necessários" linkando para `/advogado-{slug}-{city}`)
- Linguagem segura, sem promessas

Props: `cityName`, `citySlug`.

### 5. Integração `LocalAdvocaciaPage.tsx`
Inserir `<DocumentReadyCasesSection>` logo após a seção "Problemas que Resolvemos em {city}", antes da seção de atendimento. Sem mudar layout/estilos existentes.

### 6. Integração `ServiceLocalPage.tsx`
Detectar se `serviceSlug` está em `DOCUMENT_READY_SLUGS`. Quando estiver, renderizar entre o bloco "Como funciona" e o FAQ os 5 blocos obrigatórios pedidos:
- "Quando esse problema pode acontecer"
- "Quais documentos ajudam a comprovar" (com checklist)
- "O que pode ser analisado"
- "Quando o caso exige cuidado" (aviso de cautela)
- "Atendimento em {cidade} e no Paraná"
- CTA "Envie seus documentos para uma análise inicial" → WhatsApp

Também: mesclar as 5 FAQs específicas do dataset com as 4 genéricas já existentes (até 7 totais), para gerar FAQPage schema mais rico.

### 7. Página pilar `/casos-com-documentos-prontos-parana` (`src/pages/CasosDocumentosParana.tsx` — novo)
- H1: "Casos Jurídicos com Documentos Prontos para Análise no Paraná"
- Subtítulo conforme briefing
- Lista os 10 serviços com cards detalhados (nome, área, descrição, docs, CTA)
- Seção "Cidades atendidas" linkando para `/escritorio-advocacia-{city}` (Curitiba, Londrina, Maringá, Cascavel, Ponta Grossa, Foz do Iguaçu, São José dos Pinhais, Colombo, Guarapuava, Pato Branco)
- `usePageSEO` com title/description próprios, canonical
- JSON-LD `ItemList` + `LegalService`
- CTA WhatsApp e link para "Falar com nossa equipe"

Rota registrada em `App.tsx` antes da catch-all.

### 8. Rodapé e sitemap
- Adicionar link "Casos com Documentos Prontos" no `Footer.tsx` (seção já existente de áreas), sem reorganizar o footer.
- Adicionar URL da página pilar em `public/sitemap-static.xml`.

### 9. Garantias de não-regressão
- Rotas hiperlocais já existentes (`/advogado-{keyword|slug}-{city}` + catch-all + `/advogado/*` + escritorio) continuam funcionando porque os 10 serviços novos são registrados no mesmo array `LEGAL_SERVICES` (gerando rotas automaticamente).
- Dashboard, portal do cliente, blog, simuladores, geradores: nenhuma alteração.
- Design: mantém tema escuro, Playfair/Inter, paleta navy + champagne; só adiciona seções no mesmo estilo das já presentes.
- OAB: linguagem "verificar documentos / avaliar o caso / análise inicial / orientação personalizada"; nada de "causa ganha" ou "indenização garantida".

## Detalhes técnicos
- Cidades novas: o helper já existente `getServiceCitySlug(slug, city)` produz `advogado-{slug}-{city}`, que casa com o briefing (`/advogado-desconto-indevido-inss-curitiba` etc.). Pequeno typo do briefing (`/advgado-...`) será ignorado em favor do padrão correto já presente no projeto.
- Schema FAQPage continua gerado por `usePageSEO({faqHtml})` ou injeção manual; vou expandir `faqItems` no ServiceLocalPage para incluir os FAQs do dataset.
- TypeScript estrito: tipos exportados (`DocumentReadyService`, `DocReadyFaq`).
- Sem secrets, sem nova migration, sem edge function.

## Arquivos
- editar: `src/data/localSEOCities.ts`, `src/pages/LocalAdvocaciaPage.tsx`, `src/pages/ServiceLocalPage.tsx`, `src/App.tsx`, `src/components/landing/Footer.tsx`, `public/sitemap-static.xml`
- novos: `src/data/documentReadyServices.ts`, `src/components/DocumentReadyCasesSection.tsx`, `src/pages/CasosDocumentosParana.tsx`

## Fora do escopo
- Não criar tabelas no banco.
- Não mexer em sitemaps gerados pela edge function (os 10 novos serviços serão pegos automaticamente na próxima geração, pois usam `LEGAL_SERVICES`).
- Não rebrand de cores/fontes.
