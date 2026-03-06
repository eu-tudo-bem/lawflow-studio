import jsPDF from "jspdf";
import type { DocumentType } from "@/data/documentTypes";

const FIRM_NAME = "Fernandez & Fernandes Advocacia";
const FIRM_OAB = "OAB/PR";

function formatCurrency(value: string | number): string {
  const num = parseFloat(String(value).replace(",", "."));
  if (isNaN(num)) return String(value);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  } catch {
    return dateStr;
  }
}

function wrapText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

// -------------------------------------------------------------------
// Main entry — build PDF content based on document type
// -------------------------------------------------------------------
export function generateDocumentPDF(docType: DocumentType, formData: Record<string, string>): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  const lineH = 6;

  // ── Helper: current Y tracker ───────────────────────────────────
  let y = margin;

  function newLine(n = 1) { y += lineH * n; }

  function checkPageBreak(needed = 20) {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function addHeading(text: string, size = 13) {
    checkPageBreak(12);
    doc.setFontSize(size);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 50, 90);
    doc.text(text, pageW / 2, y, { align: "center" });
    newLine(1.5);
  }

  function addSubheading(text: string) {
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 50, 90);
    doc.text(text, margin, y);
    newLine(1.2);
  }

  function addBody(text: string) {
    checkPageBreak(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    y = wrapText(doc, text, margin, y, contentW, lineH);
    newLine(0.5);
  }

  function addDivider() {
    checkPageBreak(4);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    newLine(1);
  }

  // ── Header ──────────────────────────────────────────────────────
  doc.setFillColor(30, 50, 90);
  doc.rect(0, 0, pageW, 18, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 180, 80);
  doc.text(FIRM_NAME, pageW / 2, 8, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(FIRM_OAB + " · atendimento@fernandezefernandes.adv.br", pageW / 2, 14, { align: "center" });
  y = 26;

  // ── Title ────────────────────────────────────────────────────────
  addHeading(docType.label.toUpperCase(), 13);
  addDivider();

  // ── Document-specific content ────────────────────────────────────
  switch (docType.slug) {
    case "notificacao-cobranca-aluguel":
      buildNotificacaoAluguel(formData);
      break;
    case "notificacao-divida":
      buildNotificacaoDivida(formData);
      break;
    case "acordo-divorcio":
      buildAcordoDivorcio(formData);
      break;
    case "declaracao-uniao-estavel":
      buildDeclaracaoUniaoEstavel(formData);
      break;
    case "contrato-arrendamento-rural":
      buildContratoArrendamento(formData);
      break;
    case "declaracao-dependencia-economica":
      buildDeclaracaoDependencia(formData);
      break;
    case "revisao-pensao-alimenticia":
      buildRevisaoPensao(formData);
      break;
    default:
      buildGeneric(formData);
  }

  addSignatureSection();

  // ── Footer on each page ──────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const fY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Documento gerado em caráter orientativo — Recomendamos revisão por advogado antes de uso. " +
        FIRM_NAME + " · " + FIRM_OAB,
      pageW / 2,
      fY,
      { align: "center" }
    );
    doc.text(`Página ${i} de ${totalPages}`, pageW - margin, fY, { align: "right" });
  }

  return doc;

  // ── Template builders ────────────────────────────────────────────

  function buildNotificacaoAluguel(d: Record<string, string>) {
    const totalDivida = formatCurrency(d.valor_total || String(parseFloat(d.valor_aluguel || "0") * parseFloat(d.meses_atraso || "1")));
    addSubheading("DADOS DO LOCADOR (NOTIFICANTE)");
    addBody(`Nome: ${d.locador_nome}     CPF: ${d.locador_cpf}`);
    newLine(0.5);
    addSubheading("DADOS DO LOCATÁRIO (NOTIFICADO)");
    addBody(`Nome: ${d.locatario_nome}     CPF: ${d.locatario_cpf || "não informado"}`);
    addBody(`Endereço do imóvel: ${d.endereco_imovel}`);
    addDivider();
    addSubheading("NOTIFICAÇÃO");
    addBody(
      `${d.locador_nome}, qualificado(a) acima, na qualidade de LOCADOR(A) do imóvel situado em ${d.endereco_imovel}, vem, por meio desta NOTIFICAÇÃO EXTRAJUDICIAL, notificar o(a) Sr.(a) ${d.locatario_nome} de que se encontra em débito com os aluguéis do referido imóvel, conforme especificado abaixo:`
    );
    newLine(0.5);
    addBody(`• Valor do aluguel mensal: ${formatCurrency(d.valor_aluguel)}`);
    addBody(`• Quantidade de meses em atraso: ${d.meses_atraso} mês(es)`);
    addBody(`• Valor total da dívida: ${totalDivida}`);
    newLine(0.5);
    addBody(
      `Fica V. Sa. NOTIFICADO(A) a efetuar o pagamento do valor total acima dentro do prazo improrrogável de ${d.prazo_dias} (${d.prazo_dias}) dias corridos, contados do recebimento desta notificação.`
    );
    newLine(0.5);
    addBody(
      `O não pagamento no prazo estipulado ensejará o imediato ajuizamento de ação de despejo por falta de pagamento cumulada com cobrança dos valores em atraso, acrescidos de juros, multa contratual e honorários advocatícios, sem prejuízo de outras medidas legais cabíveis.`
    );
    newLine(0.5);
    addBody(`${d.cidade}, ${formatDate(d.data_emissao)}.`);
  }

  function buildNotificacaoDivida(d: Record<string, string>) {
    addSubheading("DADOS DO CREDOR (NOTIFICANTE)");
    addBody(`Nome: ${d.credor_nome}     CPF/CNPJ: ${d.credor_cpf}`);
    newLine(0.5);
    addSubheading("DADOS DO DEVEDOR (NOTIFICADO)");
    addBody(`Nome: ${d.devedor_nome}     CPF/CNPJ: ${d.devedor_cpf || "não informado"}`);
    addDivider();
    addSubheading("NOTIFICAÇÃO");
    addBody(
      `${d.credor_nome}, qualificado(a) acima, vem, por meio desta NOTIFICAÇÃO EXTRAJUDICIAL, notificar o(a) Sr.(a) ${d.devedor_nome} de que possui dívida pendente com o(a) notificante, conforme detalhado a seguir:`
    );
    newLine(0.5);
    addBody(`• Origem da dívida: ${d.origem_divida}`);
    addBody(`• Valor principal: ${formatCurrency(d.valor_divida)}`);
    newLine(0.5);
    addBody(
      `Fica V. Sa. NOTIFICADO(A) a efetuar o pagamento do valor acima dentro do prazo improrrogável de ${d.prazo_dias} (${d.prazo_dias}) dias corridos a partir do recebimento desta.`
    );
    newLine(0.5);
    addBody(
      `A inércia no prazo fixado ensejará o ajuizamento imediato de ação de cobrança, bem como protesto do título em cartório, sem prejuízo de juros de mora de 1% ao mês e multa de 2% sobre o valor total, conforme autorizado pela legislação vigente.`
    );
    newLine(0.5);
    addBody(`${d.cidade}, ${formatDate(d.data_emissao)}.`);
  }

  function buildAcordoDivorcio(d: Record<string, string>) {
    addSubheading("PARTES");
    addBody(`CÔNJUGE VARÃO: ${d.conjuge1_nome}, CPF ${d.conjuge1_cpf}`);
    addBody(`CÔNJUGE VIRAGO: ${d.conjuge2_nome}, CPF ${d.conjuge2_cpf}`);
    addBody(`Data do casamento: ${formatDate(d.data_casamento)}   |   Regime de bens: ${d.regime_bens}`);
    addDivider();
    addSubheading("ACORDO");
    addBody(
      `As partes acima qualificadas, em pleno exercício de sua capacidade civil, firmam o presente ACORDO DE DIVÓRCIO CONSENSUAL, nos seguintes termos:`
    );
    newLine(0.5);
    addSubheading("CLÁUSULA 1ª – DISSOLUÇÃO DO CASAMENTO");
    addBody(
      `As partes concordam com a dissolução do vínculo matrimonial contraído em ${formatDate(d.data_casamento)}, sob o regime de ${d.regime_bens}, não subsistindo entre eles qualquer afeto ou vontade de manutenção da vida conjugal.`
    );
    newLine(0.5);
    if (d.filhos) {
      addSubheading("CLÁUSULA 2ª – FILHOS E GUARDA");
      addBody(`Filhos: ${d.filhos}`);
      if (d.guarda) addBody(`Acordo de guarda: ${d.guarda}`);
    }
    if (d.pensao) {
      addSubheading("CLÁUSULA 3ª – ALIMENTOS");
      addBody(d.pensao);
    }
    if (d.partilha_bens) {
      addSubheading("CLÁUSULA 4ª – PARTILHA DE BENS");
      addBody(d.partilha_bens);
    }
    newLine(0.5);
    addBody(`${d.cidade}, ${formatDate(d.data_emissao)}.`);
    newLine(1);
    addBody("_____________________________________          _____________________________________");
    addBody(`${d.conjuge1_nome}                              ${d.conjuge2_nome}`);
  }

  function buildDeclaracaoUniaoEstavel(d: Record<string, string>) {
    addSubheading("DECLARAÇÃO DE UNIÃO ESTÁVEL");
    addBody(
      `${d.companheiro1_nome}, CPF ${d.companheiro1_cpf}, e ${d.companheiro2_nome}, CPF ${d.companheiro2_cpf}, residentes e domiciliados em ${d.endereco_comum}, DECLARAM, para os fins de direito, que convivem em UNIÃO ESTÁVEL desde ${formatDate(d.data_inicio)}, de forma contínua, duradoura e pública, com objetivo de constituição de família.`
    );
    newLine(0.5);
    if (d.regime_bens) {
      addBody(`Regime de bens: ${d.regime_bens}.`);
    }
    newLine(0.5);
    addBody(
      `A presente declaração é firmada para os fins que se fizerem necessários, especialmente para ${d.finalidade || "fins legais"}.`
    );
    newLine(0.5);
    addBody(
      `Os declarantes afirmam, ainda, que não estão impedidos de contrair casamento e que a presente união é sua única relação desta natureza.`
    );
    newLine(0.5);
    addBody(`${d.cidade}, ${formatDate(d.data_emissao)}.`);
    newLine(1);
    addBody("_____________________________________          _____________________________________");
    addBody(`${d.companheiro1_nome}                         ${d.companheiro2_nome}`);
  }

  function buildContratoArrendamento(d: Record<string, string>) {
    addSubheading("PARTES");
    addBody(`ARRENDADOR: ${d.arrendador_nome}, CPF/CNPJ ${d.arrendador_cpf}`);
    addBody(`ARRENDATÁRIO: ${d.arrendatario_nome}, CPF/CNPJ ${d.arrendatario_cpf}`);
    addDivider();
    addSubheading("CLÁUSULA 1ª – OBJETO");
    addBody(
      `O ARRENDADOR cede em arrendamento ao ARRENDATÁRIO a área rural de ${d.area_hectares} (${d.area_hectares}) hectares, situada em: ${d.localizacao_area}, para fins de ${d.finalidade}.`
    );
    newLine(0.5);
    addSubheading("CLÁUSULA 2ª – PRAZO");
    addBody(
      `O presente contrato terá vigência de ${d.prazo_anos} (${d.prazo_anos}) anos, com início em ${formatDate(d.data_inicio)}, encerrando-se em ${computeEndDate(d.data_inicio, parseInt(d.prazo_anos) || 3)}, podendo ser renovado mediante acordo escrito entre as partes.`
    );
    newLine(0.5);
    addSubheading("CLÁUSULA 3ª – VALOR DO ARRENDAMENTO");
    addBody(
      `O ARRENDATÁRIO pagará ao ARRENDADOR o valor anual de ${formatCurrency(d.valor_anual)}, em parcela única, até o dia 15 (quinze) do mês correspondente a cada aniversário do contrato.`
    );
    newLine(0.5);
    addSubheading("CLÁUSULA 4ª – OBRIGAÇÕES DO ARRENDATÁRIO");
    addBody(
      `O ARRENDATÁRIO obriga-se a: (a) utilizar a área exclusivamente para a finalidade contratada; (b) conservar as benfeitorias existentes; (c) não sublocar a área sem autorização expressa do ARRENDADOR; (d) permitir vistoria periódica pelo ARRENDADOR.`
    );
    newLine(0.5);
    addSubheading("CLÁUSULA 5ª – DISPOSIÇÕES GERAIS");
    addBody(
      `O presente contrato é regido pelo Estatuto da Terra (Lei nº 4.504/1964) e pelo Decreto nº 59.566/1966. Fica eleito o foro da Comarca de ${d.cidade} para dirimir eventuais controvérsias.`
    );
    newLine(0.5);
    addBody(`${d.cidade}, ${formatDate(d.data_emissao)}.`);
    newLine(1);
    addBody("_____________________________________          _____________________________________");
    addBody(`${d.arrendador_nome}                          ${d.arrendatario_nome}`);
    addBody("Arrendador                                      Arrendatário");
  }

  function buildDeclaracaoDependencia(d: Record<string, string>) {
    addSubheading("DECLARANTE");
    addBody(`Nome: ${d.declarante_nome}     CPF: ${d.declarante_cpf}`);
    addBody(`Endereço: ${d.declarante_endereco}`);
    addDivider();
    addSubheading("DECLARAÇÃO DE DEPENDÊNCIA ECONÔMICA");
    addBody(
      `Eu, ${d.declarante_nome}, portador(a) do CPF ${d.declarante_cpf}, residente e domiciliado(a) em ${d.declarante_endereco}, DECLARO, sob as penas da lei, que ${d.dependente_nome}${d.dependente_cpf ? ", CPF " + d.dependente_cpf + "," : ""}, meu(minha) ${d.relacao}, é meu(minha) dependente econômico(a) ${d.periodo}.`
    );
    newLine(0.5);
    addBody(d.descricao);
    newLine(0.5);
    addBody(
      `A presente declaração é firmada para fins de ${d.finalidade}, estando o declarante ciente das responsabilidades civis e penais decorrentes de declaração falsa.`
    );
    newLine(0.5);
    addBody(`${d.cidade}, ${formatDate(d.data_emissao)}.`);
    newLine(1);
    addBody("___________________________________");
    addBody(`${d.declarante_nome} — Declarante`);
  }

  function buildRevisaoPensao(d: Record<string, string>) {
    addSubheading("REQUERENTE");
    addBody(`Nome: ${d.requerente_nome}     CPF: ${d.requerente_cpf}`);
    addSubheading("REQUERIDO / OUTRO GENITOR");
    addBody(`Nome: ${d.requerido_nome}`);
    addSubheading("BENEFICIÁRIO(S)");
    addBody(d.beneficiario);
    addDivider();
    addSubheading("PEDIDO DE REVISÃO DE PENSÃO ALIMENTÍCIA");
    addBody(
      `${d.requerente_nome} vem, por meio deste, REQUERER a revisão da pensão alimentícia atualmente fixada em ${formatCurrency(d.valor_atual)}, para o valor de ${formatCurrency(d.valor_solicitado)}, em razão da mudança de circunstâncias descrita a seguir:`
    );
    newLine(0.5);
    addSubheading("MOTIVO DA REVISÃO");
    addBody(d.motivo_revisao);
    newLine(0.5);
    addBody(
      `A revisão é amparada pelo art. 1.699 do Código Civil, que permite a revisão dos alimentos sempre que houver alteração na situação financeira de quem os supre ou de quem os recebe.`
    );
    if (d.data_fixacao) addBody(`Data em que a pensão foi fixada: ${formatDate(d.data_fixacao)}.`);
    newLine(0.5);
    addBody(
      `Este documento é um modelo orientativo. A ação de revisão de alimentos deverá ser ajuizada por advogado habilitado.`
    );
    newLine(0.5);
    addBody(`${d.cidade}, ${formatDate(d.data_emissao)}.`);
    newLine(1);
    addBody("___________________________________");
    addBody(`${d.requerente_nome} — Requerente`);
  }

  function buildGeneric(d: Record<string, string>) {
    addBody("DADOS INFORMADOS:");
    Object.entries(d).forEach(([k, v]) => { if (v) addBody(`${k}: ${v}`); });
  }

  function addSignatureSection() {
    checkPageBreak(40);
    newLine(2);
    addDivider();
    addSubheading("ASSINATURAS");
    newLine(1);
    addBody("___________________________________          ___________________________________");
    addBody("Assinatura                                     Assinatura");
    newLine(2);
    addBody("___________________________________          ___________________________________");
    addBody("Testemunha 1 / CPF                             Testemunha 2 / CPF");
  }

  function computeEndDate(startDate: string, years: number): string {
    try {
      const d = new Date(startDate);
      d.setFullYear(d.getFullYear() + years);
      return formatDate(d.toISOString().split("T")[0]);
    } catch {
      return "";
    }
  }
}
