import { z } from "zod";

export interface FieldDef {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "number" | "cpf";
  placeholder?: string;
  required?: boolean;
  colSpan?: "half" | "full";
}

export interface DocumentType {
  slug: string;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  whenToUse: string;
  howItWorks: string;
  faq: { q: string; a: string }[];
  fields: FieldDef[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
}

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    slug: "notificacao-cobranca-aluguel",
    label: "Notificação Extrajudicial de Cobrança de Aluguel",
    shortLabel: "Notificação de Cobrança de Aluguel",
    icon: "🏠",
    category: "Direito Imobiliário",
    description:
      "Notificação formal enviada pelo locador ao locatário exigindo o pagamento de aluguéis em atraso, com prazo definido e alerta sobre medidas judiciais.",
    whenToUse:
      "Use quando o inquilino está com 1 ou mais meses de aluguel em atraso e você deseja notificá-lo formalmente antes de ingressar com ação de despejo.",
    howItWorks:
      "Preencha os dados do locador, locatário, endereço do imóvel, valor em atraso e prazo para pagamento. O documento será gerado automaticamente em PDF e poderá ser enviado ao inquilino por e-mail, correios ou cartório.",
    keywords: ["notificacao extrajudicial cobranca aluguel", "modelo notificacao inquilino", "cobrar aluguel atrasado"],
    metaTitle: "Gerar Notificação de Cobrança de Aluguel Grátis | PDF",
    metaDescription:
      "Gere sua notificação extrajudicial de cobrança de aluguel online e grátis. Documento em PDF pronto para envio ao inquilino. Rápido e fácil.",
    faq: [
      { q: "A notificação extrajudicial tem validade legal?", a: "Sim. A notificação extrajudicial é um documento válido juridicamente que comprova que você notificou formalmente o inquilino sobre o débito." },
      { q: "Preciso de advogado para enviar uma notificação de cobrança?", a: "Para a notificação simples, não é obrigatório. Porém, um advogado garante que o documento esteja correto e aumenta as chances de o inquilino cumprir a obrigação." },
      { q: "Como enviar a notificação ao inquilino?", a: "Você pode enviar por e-mail com confirmação de leitura, pelos Correios com AR (Aviso de Recebimento) ou por cartório de registro de títulos." },
      { q: "O que fazer se o inquilino ignorar a notificação?", a: "Após o prazo sem resposta, você pode ingressar com ação de despejo por falta de pagamento. Um advogado pode ajudar nesse processo." },
    ],
    fields: [
      { id: "locador_nome", label: "Nome completo do Locador (Proprietário)", type: "text", placeholder: "Ex.: João da Silva", required: true, colSpan: "half" },
      { id: "locador_cpf", label: "CPF do Locador", type: "cpf", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "locatario_nome", label: "Nome completo do Locatário (Inquilino)", type: "text", placeholder: "Ex.: Maria Souza", required: true, colSpan: "half" },
      { id: "locatario_cpf", label: "CPF do Locatário", type: "cpf", placeholder: "000.000.000-00", required: false, colSpan: "half" },
      { id: "endereco_imovel", label: "Endereço completo do imóvel", type: "text", placeholder: "Ex.: Rua das Flores, 100, Ap. 5 – Centro – Curitiba/PR", required: true, colSpan: "full" },
      { id: "valor_aluguel", label: "Valor do aluguel mensal (R$)", type: "number", placeholder: "Ex.: 1500,00", required: true, colSpan: "half" },
      { id: "meses_atraso", label: "Quantidade de meses em atraso", type: "number", placeholder: "Ex.: 3", required: true, colSpan: "half" },
      { id: "valor_total", label: "Valor total da dívida (R$)", type: "number", placeholder: "Ex.: 4500,00", required: true, colSpan: "half" },
      { id: "prazo_dias", label: "Prazo para pagamento (dias)", type: "number", placeholder: "Ex.: 15", required: true, colSpan: "half" },
      { id: "cidade", label: "Cidade de emissão", type: "text", placeholder: "Ex.: Curitiba", required: true, colSpan: "half" },
      { id: "data_emissao", label: "Data de emissão", type: "date", required: true, colSpan: "half" },
    ],
  },
  {
    slug: "notificacao-divida",
    label: "Notificação Extrajudicial de Dívida",
    shortLabel: "Notificação de Dívida",
    icon: "💸",
    category: "Direito Civil",
    description:
      "Notificação formal de cobrança de dívida entre pessoas físicas ou jurídicas, com especificação do valor, origem da dívida e prazo para pagamento.",
    whenToUse:
      "Use quando alguém lhe deve dinheiro e você quer notificá-la formalmente antes de tomar medidas judiciais, como ação de cobrança ou protesto em cartório.",
    howItWorks:
      "Preencha os dados do credor, devedor, valor da dívida e prazo. O documento formal será gerado em PDF e poderá ser usado como prova judicial do débito reconhecido.",
    keywords: ["notificacao extrajudicial divida", "modelo cobranca divida", "notificacao extrajudicial cobranca"],
    metaTitle: "Gerar Notificação Extrajudicial de Dívida Grátis | PDF",
    metaDescription:
      "Gere sua notificação extrajudicial de cobrança de dívida online e grátis. Documento formal em PDF com valor da dívida e prazo para pagamento.",
    faq: [
      { q: "Qual a diferença entre notificação extrajudicial e ação de cobrança?", a: "A notificação extrajudicial é um aviso formal antes do processo judicial. Se o devedor não pagar no prazo, aí sim você entra com a ação de cobrança no Judiciário." },
      { q: "A notificação interrompe a prescrição da dívida?", a: "A notificação extrajudicial pode ser usada para demonstrar a ciência do devedor, mas apenas a ação judicial interrompe a prescrição." },
      { q: "Posso cobrar juros e multa na notificação?", a: "Sim, desde que estejam previstos no contrato original ou na lei. Recomendamos que um advogado revise os valores antes do envio." },
    ],
    fields: [
      { id: "credor_nome", label: "Nome completo do Credor", type: "text", placeholder: "Ex.: João da Silva", required: true, colSpan: "half" },
      { id: "credor_cpf", label: "CPF/CNPJ do Credor", type: "text", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "devedor_nome", label: "Nome completo do Devedor", type: "text", placeholder: "Ex.: Carlos Oliveira", required: true, colSpan: "half" },
      { id: "devedor_cpf", label: "CPF/CNPJ do Devedor", type: "text", placeholder: "000.000.000-00", required: false, colSpan: "half" },
      { id: "origem_divida", label: "Origem da dívida (descreva brevemente)", type: "textarea", placeholder: "Ex.: empréstimo pessoal realizado em 01/01/2024, contrato de prestação de serviços, etc.", required: true, colSpan: "full" },
      { id: "valor_divida", label: "Valor principal da dívida (R$)", type: "number", placeholder: "Ex.: 5000,00", required: true, colSpan: "half" },
      { id: "prazo_dias", label: "Prazo para pagamento (dias)", type: "number", placeholder: "Ex.: 15", required: true, colSpan: "half" },
      { id: "cidade", label: "Cidade de emissão", type: "text", placeholder: "Ex.: Curitiba", required: true, colSpan: "half" },
      { id: "data_emissao", label: "Data de emissão", type: "date", required: true, colSpan: "half" },
    ],
  },
  {
    slug: "acordo-divorcio",
    label: "Acordo Simples de Divórcio Consensual",
    shortLabel: "Acordo de Divórcio",
    icon: "⚖️",
    category: "Direito de Família",
    description:
      "Minuta de acordo para divórcio consensual entre cônjuges, contemplando partilha de bens, guarda dos filhos, pensão alimentícia e demais obrigações.",
    whenToUse:
      "Use quando você e seu cônjuge estão de acordo com todos os termos do divórcio e desejam formalizar a separação de forma amigável, sem litígios.",
    howItWorks:
      "Preencha os dados dos cônjuges e as condições acordadas. A minuta gerada é um modelo orientativo que deve ser revisado por um advogado antes de ser levado ao cartório ou juízo.",
    keywords: ["modelo acordo divorcio consensual", "minuta divorcio amigavel", "acordo separacao conjugal"],
    metaTitle: "Gerar Modelo de Acordo de Divórcio Consensual Grátis | PDF",
    metaDescription:
      "Gere uma minuta de acordo de divórcio consensual online e grátis. Inclui dados das partes, partilha de bens, guarda e pensão alimentícia.",
    faq: [
      { q: "O modelo gerado já é suficiente para o divórcio?", a: "O documento é uma minuta orientativa. Para ter validade jurídica plena, ele deve ser revisado por um advogado e levado a cartório (se não houver filhos menores) ou homologado por juiz." },
      { q: "Posso fazer o divórcio sem advogado?", a: "Em cartório, a lei exige a presença de advogado mesmo no divórcio consensual sem filhos menores. O advogado garante que todos os seus direitos sejam respeitados." },
      { q: "Qual a diferença entre divórcio em cartório e judicial?", a: "Se não houver filhos menores ou incapazes, o divórcio pode ser feito em cartório, de forma mais rápida e econômica. Com filhos, o processo deve ser judicial, mas ainda pode ser consensual." },
    ],
    fields: [
      { id: "conjuge1_nome", label: "Nome completo do Cônjuge 1", type: "text", placeholder: "Ex.: João da Silva", required: true, colSpan: "half" },
      { id: "conjuge1_cpf", label: "CPF do Cônjuge 1", type: "cpf", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "conjuge2_nome", label: "Nome completo do Cônjuge 2", type: "text", placeholder: "Ex.: Ana Silva", required: true, colSpan: "half" },
      { id: "conjuge2_cpf", label: "CPF do Cônjuge 2", type: "cpf", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "data_casamento", label: "Data do casamento", type: "date", required: true, colSpan: "half" },
      { id: "regime_bens", label: "Regime de bens", type: "text", placeholder: "Ex.: Comunhão Parcial de Bens", required: true, colSpan: "half" },
      { id: "filhos", label: "Filhos menores (nomes e idades, ou 'não há filhos menores')", type: "textarea", placeholder: "Ex.: Pedro Silva, 8 anos; Carla Silva, 5 anos", required: true, colSpan: "full" },
      { id: "guarda", label: "Acordo de guarda dos filhos", type: "textarea", placeholder: "Ex.: Guarda compartilhada. Residência base com a mãe. Visitas ao pai em fins de semana alternados.", required: false, colSpan: "full" },
      { id: "pensao", label: "Pensão alimentícia acordada", type: "textarea", placeholder: "Ex.: O pai pagará R$ 1.200,00/mês por filho até completar 24 anos ou se sustentar.", required: false, colSpan: "full" },
      { id: "partilha_bens", label: "Partilha de bens (descreva brevemente)", type: "textarea", placeholder: "Ex.: Imóvel da Rua X fica com a esposa; veículo placa XYZ fica com o marido.", required: false, colSpan: "full" },
      { id: "cidade", label: "Cidade", type: "text", placeholder: "Ex.: Curitiba", required: true, colSpan: "half" },
      { id: "data_emissao", label: "Data do acordo", type: "date", required: true, colSpan: "half" },
    ],
  },
  {
    slug: "declaracao-uniao-estavel",
    label: "Declaração de União Estável",
    shortLabel: "Declaração de União Estável",
    icon: "💑",
    category: "Direito de Família",
    description:
      "Declaração formal de reconhecimento de união estável entre companheiros, com data de início do relacionamento e informações básicas sobre a convivência.",
    whenToUse:
      "Use quando você e seu companheiro desejam formalizar a união estável para fins de dependência em planos de saúde, INSS, herança ou outros benefícios legais.",
    howItWorks:
      "Preencha os dados dos companheiros e a data de início da união. A declaração é um modelo que deve ser levado a cartório para reconhecimento de firma ou lavratura de escritura pública.",
    keywords: ["declaracao uniao estavel modelo", "como declarar uniao estavel", "modelo uniao estavel"],
    metaTitle: "Gerar Declaração de União Estável Grátis | PDF",
    metaDescription:
      "Gere uma declaração de união estável online e grátis. Documento em PDF para reconhecimento formal do relacionamento. Simples e rápido.",
    faq: [
      { q: "A declaração de união estável tem validade jurídica?", a: "Sim, mas para maior segurança jurídica, recomenda-se lavrar uma escritura pública de união estável em cartório." },
      { q: "Qual a diferença entre declaração e escritura de união estável?", a: "A declaração é um documento mais simples, adequado para fins imediatos (ex.: plano de saúde). A escritura pública é mais completa e tem fé pública." },
      { q: "Preciso de advogado para declarar união estável?", a: "Para a declaração simples, não é obrigatório. Para a escritura pública, um advogado ou tabelião orientará o processo." },
    ],
    fields: [
      { id: "companheiro1_nome", label: "Nome completo do Companheiro(a) 1", type: "text", placeholder: "Ex.: João da Silva", required: true, colSpan: "half" },
      { id: "companheiro1_cpf", label: "CPF do Companheiro(a) 1", type: "cpf", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "companheiro2_nome", label: "Nome completo do Companheiro(a) 2", type: "text", placeholder: "Ex.: Maria Souza", required: true, colSpan: "half" },
      { id: "companheiro2_cpf", label: "CPF do Companheiro(a) 2", type: "cpf", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "data_inicio", label: "Data de início da união", type: "date", required: true, colSpan: "half" },
      { id: "endereco_comum", label: "Endereço de residência comum", type: "text", placeholder: "Ex.: Rua das Flores, 100 – Curitiba/PR", required: true, colSpan: "full" },
      { id: "regime_bens", label: "Regime de bens (opcional)", type: "text", placeholder: "Ex.: Comunhão Parcial de Bens (padrão legal)", required: false, colSpan: "half" },
      { id: "cidade", label: "Cidade de emissão", type: "text", placeholder: "Ex.: Curitiba", required: true, colSpan: "half" },
      { id: "data_emissao", label: "Data de emissão", type: "date", required: true, colSpan: "half" },
    ],
  },
  {
    slug: "contrato-arrendamento-rural",
    label: "Contrato Simples de Arrendamento Rural",
    shortLabel: "Contrato de Arrendamento Rural",
    icon: "🌾",
    category: "Direito Agrário",
    description:
      "Contrato de arrendamento rural entre arrendador e arrendatário, com definição da área arrendada, prazo, valor e condições de uso da terra.",
    whenToUse:
      "Use quando você deseja formalizar o arrendamento de terra rural para agricultura, pecuária ou outros fins agropecuários, protegendo os direitos de ambas as partes.",
    howItWorks:
      "Preencha os dados das partes, a área arrendada, prazo e valor. O contrato é gerado em PDF e deve ser assinado por ambas as partes e por duas testemunhas.",
    keywords: ["contrato arrendamento rural modelo", "modelo contrato arrendamento terra", "arrendamento rural contrato"],
    metaTitle: "Gerar Contrato de Arrendamento Rural Grátis | PDF",
    metaDescription:
      "Gere seu contrato simples de arrendamento rural online e grátis. Documento em PDF com dados das partes, área, prazo e valor. Rápido e fácil.",
    faq: [
      { q: "O contrato de arrendamento rural precisa ser registrado?", a: "Não é obrigatório o registro em cartório, mas é recomendável para maior segurança jurídica e comprovação em eventuais disputas." },
      { q: "Qual o prazo mínimo de um arrendamento rural?", a: "O Estatuto da Terra prevê prazo mínimo de 3 anos para lavouras temporárias e 5 anos para lavouras permanentes. O contrato não pode estabelecer prazos inferiores." },
      { q: "O arrendatário tem direito de preferência na venda?", a: "Sim. Pelo Estatuto da Terra, o arrendatário tem direito de preferência na compra do imóvel rural arrendado em igualdade de condições com terceiros." },
    ],
    fields: [
      { id: "arrendador_nome", label: "Nome completo do Arrendador (Proprietário)", type: "text", placeholder: "Ex.: João da Silva", required: true, colSpan: "half" },
      { id: "arrendador_cpf", label: "CPF/CNPJ do Arrendador", type: "text", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "arrendatario_nome", label: "Nome completo do Arrendatário", type: "text", placeholder: "Ex.: Carlos Oliveira", required: true, colSpan: "half" },
      { id: "arrendatario_cpf", label: "CPF/CNPJ do Arrendatário", type: "text", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "localizacao_area", label: "Localização da área rural (município, estado, matrícula)", type: "textarea", placeholder: "Ex.: Gleba X, Sítio Bom Jesus, Município de Castro/PR, matrícula nº 1234 – CRI de Castro.", required: true, colSpan: "full" },
      { id: "area_hectares", label: "Área em hectares", type: "number", placeholder: "Ex.: 50", required: true, colSpan: "half" },
      { id: "finalidade", label: "Finalidade do arrendamento", type: "text", placeholder: "Ex.: lavoura de soja e milho", required: true, colSpan: "half" },
      { id: "prazo_anos", label: "Prazo do contrato (anos)", type: "number", placeholder: "Ex.: 3", required: true, colSpan: "half" },
      { id: "valor_anual", label: "Valor anual do arrendamento (R$)", type: "number", placeholder: "Ex.: 15000,00", required: true, colSpan: "half" },
      { id: "data_inicio", label: "Data de início", type: "date", required: true, colSpan: "half" },
      { id: "cidade", label: "Cidade de assinatura", type: "text", placeholder: "Ex.: Castro", required: true, colSpan: "half" },
      { id: "data_emissao", label: "Data do contrato", type: "date", required: true, colSpan: "half" },
    ],
  },
  {
    slug: "declaracao-dependencia-economica",
    label: "Declaração de Dependência Econômica",
    shortLabel: "Declaração de Dependência Econômica",
    icon: "📄",
    category: "Direito Civil",
    description:
      "Declaração formal de que determinada pessoa depende economicamente de outra, utilizada para fins de INSS, plano de saúde, benefícios sociais ou processos judiciais.",
    whenToUse:
      "Use quando você precisa comprovar que uma pessoa é seu dependente econômico para inclusão em plano de saúde, benefício do INSS, ação judicial ou outros fins legais.",
    howItWorks:
      "Preencha os dados do declarante, do dependente e a relação entre eles. A declaração é gerada em PDF e deve ter firma reconhecida em cartório para uso oficial.",
    keywords: ["declaracao dependencia economica modelo", "comprovante dependencia economica", "declaracao dependente economico"],
    metaTitle: "Gerar Declaração de Dependência Econômica Grátis | PDF",
    metaDescription:
      "Gere sua declaração de dependência econômica online e grátis. Documento em PDF para INSS, plano de saúde e processos judiciais.",
    faq: [
      { q: "Quem pode ser considerado dependente econômico?", a: "Filhos, enteados, genitores, cônjuges, companheiros e outros familiares que dependam financeiramente do declarante." },
      { q: "A declaração precisa de reconhecimento de firma?", a: "Para fins de INSS e planos de saúde, geralmente sim. Para outros fins, depende da exigência do órgão receptor." },
      { q: "Qual a diferença entre dependente do INSS e dependente fiscal?", a: "São categorias diferentes. O dependente do INSS segue as regras da Previdência Social. O dependente fiscal segue as regras da Receita Federal para declaração de IR." },
    ],
    fields: [
      { id: "declarante_nome", label: "Nome completo do Declarante", type: "text", placeholder: "Ex.: João da Silva", required: true, colSpan: "half" },
      { id: "declarante_cpf", label: "CPF do Declarante", type: "cpf", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "declarante_endereco", label: "Endereço do Declarante", type: "text", placeholder: "Ex.: Rua X, 100 – Curitiba/PR", required: true, colSpan: "full" },
      { id: "dependente_nome", label: "Nome completo do Dependente", type: "text", placeholder: "Ex.: Maria da Silva", required: true, colSpan: "half" },
      { id: "dependente_cpf", label: "CPF do Dependente", type: "cpf", placeholder: "000.000.000-00", required: false, colSpan: "half" },
      { id: "relacao", label: "Relação entre as partes", type: "text", placeholder: "Ex.: mãe, filho, companheiro(a)", required: true, colSpan: "half" },
      { id: "periodo", label: "Período de dependência", type: "text", placeholder: "Ex.: desde janeiro de 2020", required: true, colSpan: "half" },
      { id: "descricao", label: "Descrição da dependência econômica", type: "textarea", placeholder: "Ex.: O declarante arca com todas as despesas de moradia, alimentação, saúde e educação do dependente.", required: true, colSpan: "full" },
      { id: "finalidade", label: "Finalidade da declaração", type: "text", placeholder: "Ex.: inclusão em plano de saúde, benefício INSS", required: true, colSpan: "half" },
      { id: "cidade", label: "Cidade de emissão", type: "text", placeholder: "Ex.: Curitiba", required: true, colSpan: "half" },
      { id: "data_emissao", label: "Data de emissão", type: "date", required: true, colSpan: "half" },
    ],
  },
  {
    slug: "revisao-pensao-alimenticia",
    label: "Pedido de Revisão de Pensão Alimentícia",
    shortLabel: "Revisão de Pensão Alimentícia",
    icon: "👨‍👩‍👧",
    category: "Direito de Família",
    description:
      "Modelo de requerimento de revisão de pensão alimentícia para apresentar ao advogado ou como orientação do pedido judicial de revisão dos alimentos.",
    whenToUse:
      "Use quando houve mudança significativa na situação financeira do alimentante ou nas necessidades do alimentando que justifique a revisão do valor da pensão.",
    howItWorks:
      "Preencha os dados das partes, o valor atual da pensão e os motivos da revisão. O documento é um modelo orientativo que deve ser revisado por um advogado para embasar a ação judicial.",
    keywords: ["pedido revisao pensao alimenticia modelo", "revisao pensao alimentar", "como pedir revisao pensao"],
    metaTitle: "Gerar Modelo de Revisão de Pensão Alimentícia Grátis | PDF",
    metaDescription:
      "Gere um modelo de pedido de revisão de pensão alimentícia online e grátis. Documento orientativo em PDF para embasar sua ação judicial.",
    faq: [
      { q: "Em que casos posso pedir revisão de pensão?", a: "Quando houver mudança na situação financeira do alimentante (ex.: desemprego, redução de renda) ou mudança nas necessidades do alimentando (ex.: maioridade, nova despesa médica)." },
      { q: "Quanto tempo demora a ação de revisão de pensão?", a: "Varia conforme a comarca. Em regra, de 6 meses a 2 anos. O juiz pode conceder a redução ou aumento provisório desde a citação do réu." },
      { q: "Preciso de advogado para pedir revisão de pensão?", a: "Sim. A ação de revisão de alimentos é um processo judicial que exige representação por advogado. Nossa equipe pode ajudar." },
    ],
    fields: [
      { id: "requerente_nome", label: "Nome completo do Requerente", type: "text", placeholder: "Ex.: João da Silva", required: true, colSpan: "half" },
      { id: "requerente_cpf", label: "CPF do Requerente", type: "cpf", placeholder: "000.000.000-00", required: true, colSpan: "half" },
      { id: "requerido_nome", label: "Nome completo do Requerido (outro cônjuge/genitor)", type: "text", placeholder: "Ex.: Ana Silva", required: true, colSpan: "half" },
      { id: "beneficiario", label: "Nome do(s) beneficiário(s) da pensão", type: "text", placeholder: "Ex.: Pedro Silva (filho)", required: true, colSpan: "half" },
      { id: "valor_atual", label: "Valor atual da pensão (R$)", type: "number", placeholder: "Ex.: 1200,00", required: true, colSpan: "half" },
      { id: "valor_solicitado", label: "Valor solicitado após revisão (R$)", type: "number", placeholder: "Ex.: 800,00 (redução) ou 1600,00 (aumento)", required: true, colSpan: "half" },
      { id: "motivo_revisao", label: "Motivo da revisão (descreva a mudança de situação)", type: "textarea", placeholder: "Ex.: o requerente perdeu o emprego em março/2024 e passou a receber apenas seguro-desemprego de R$ 1.800/mês, insuficiente para manter o valor atual da pensão.", required: true, colSpan: "full" },
      { id: "data_fixacao", label: "Data em que a pensão foi fixada", type: "date", required: false, colSpan: "half" },
      { id: "cidade", label: "Cidade", type: "text", placeholder: "Ex.: Curitiba", required: true, colSpan: "half" },
      { id: "data_emissao", label: "Data do documento", type: "date", required: true, colSpan: "half" },
    ],
  },
];

export function getDocumentTypeBySlug(slug: string): DocumentType | undefined {
  return DOCUMENT_TYPES.find((d) => d.slug === slug);
}

// Zod schema builder for lead capture
export const leadCaptureSchema = z.object({
  lead_name: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres").max(100),
  lead_email: z.string().trim().email("E-mail inválido").max(150),
  lead_whatsapp: z
    .string()
    .trim()
    .min(10, "WhatsApp inválido")
    .max(20)
    .regex(/^[\d\s\(\)\-\+]+$/, "WhatsApp deve conter apenas números"),
});

export type LeadCaptureData = z.infer<typeof leadCaptureSchema>;
