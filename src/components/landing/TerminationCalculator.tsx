import { useState } from "react";
import { Calculator, RefreshCw, MessageSquare, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TipoRescisao = "sem_justa_causa" | "pedido_demissao" | "justa_causa" | "rescisao_indireta";
type TipoAviso = "trabalhado" | "indenizado";

interface Resultado {
  saldoSalario: number;
  avisoPrevio: number;
  decimoTerceiro: number;
  feriasProporcionais: number;
  tercoFerias: number;
  feriasVencidas: number;
  tercoFeriasVencidas: number;
  multaFGTS: number;
  total: number;
}

const TerminationCalculator = () => {
  const [salario, setSalario] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDesligamento, setDataDesligamento] = useState("");
  const [tipoRescisao, setTipoRescisao] = useState<TipoRescisao | "">("");
  const [tipoAviso, setTipoAviso] = useState<TipoAviso | "">("");
  const [feriasVencidas, setFeriasVencidas] = useState("");
  const [dependentes, setDependentes] = useState("0");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    nome: "",
    whatsapp: "",
    cidade: "",
    resumo: "",
  });

  const calcular = () => {
    if (!salario || !dataAdmissao || !dataDesligamento || !tipoRescisao || !tipoAviso) return;

    setLoading(true);
    setResultado(null);

    setTimeout(() => {
      const sal = parseFloat(salario.replace(/\./g, "").replace(",", "."));
      const admissao = new Date(dataAdmissao);
      const desligamento = new Date(dataDesligamento);

      // Dias trabalhados no mês do desligamento
      const diasNoMes = desligamento.getDate();
      const diasTotalMes = new Date(desligamento.getFullYear(), desligamento.getMonth() + 1, 0).getDate();
      const saldoSalario = (sal / diasTotalMes) * diasNoMes;

      // Meses trabalhados no ano para 13º
      const mesesAno = desligamento.getMonth() + (diasNoMes >= 15 ? 1 : 0);
      const decimoTerceiro = tipoRescisao === "justa_causa" ? 0 : (sal / 12) * mesesAno;

      // Tempo de serviço em anos completos (para aviso prévio)
      const diffMs = desligamento.getTime() - admissao.getTime();
      const anosServico = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));

      // Aviso prévio: 30 dias + 3 dias por ano (máx 90 dias)
      let diasAviso = 30 + Math.min(anosServico * 3, 60);
      let avisoPrevio = 0;
      if (tipoRescisao === "sem_justa_causa" || tipoRescisao === "rescisao_indireta") {
        avisoPrevio = tipoAviso === "indenizado" ? (sal / 30) * diasAviso : 0;
      } else if (tipoRescisao === "pedido_demissao") {
        avisoPrevio = tipoAviso === "indenizado" ? (sal / 30) * 30 : 0;
      }

      // Férias proporcionais (meses desde último período aquisitivo)
      const mesesDesdeAdmissao = (desligamento.getFullYear() - admissao.getFullYear()) * 12 + (desligamento.getMonth() - admissao.getMonth());
      const mesesFeriasProporcionais = mesesDesdeAdmissao % 12 + (diasNoMes >= 15 ? 1 : 0);
      const feriasProporcionaisVal = tipoRescisao === "justa_causa" ? 0 : (sal / 12) * Math.min(mesesFeriasProporcionais, 12);
      const tercoFerias = feriasProporcionaisVal / 3;

      // Férias vencidas
      const feriasVencidasVal = feriasVencidas === "sim" ? sal : 0;
      const tercoFeriasVencidas = feriasVencidasVal / 3;

      // Multa FGTS (8% do salário * meses trabalhados * 40%)
      const mesesTotais = Math.max(mesesDesdeAdmissao, 1);
      const fgtsAcumulado = sal * 0.08 * mesesTotais;
      const multaFGTS = (tipoRescisao === "sem_justa_causa" || tipoRescisao === "rescisao_indireta")
        ? fgtsAcumulado * 0.4
        : 0;

      const total = saldoSalario + avisoPrevio + decimoTerceiro + feriasProporcionaisVal + tercoFerias + feriasVencidasVal + tercoFeriasVencidas + multaFGTS;

      setResultado({
        saldoSalario,
        avisoPrevio,
        decimoTerceiro,
        feriasProporcionais: feriasProporcionaisVal,
        tercoFerias,
        feriasVencidas: feriasVencidasVal,
        tercoFeriasVencidas,
        multaFGTS,
        total,
      });
      setLoading(false);
    }, 800);
  };

  const resetar = () => {
    setSalario("");
    setDataAdmissao("");
    setDataDesligamento("");
    setTipoRescisao("");
    setTipoAviso("");
    setFeriasVencidas("");
    setDependentes("0");
    setResultado(null);
    setShowContact(false);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const camposPreenchidos = salario && dataAdmissao && dataDesligamento && tipoRescisao && tipoAviso && feriasVencidas;

  return (
    <section className="py-20 bg-muted/50" id="calculadora">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="h-4 w-4" />
            Ferramenta Gratuita
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calculadora de Rescisão Trabalhista
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simule os valores aproximados da sua rescisão de forma rápida e gratuita.
            Preencha os dados abaixo para obter uma estimativa.
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Dados da Rescisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Salário */}
              <div className="space-y-2">
                <Label htmlFor="salario">Salário Bruto Mensal (R$)</Label>
                <Input
                  id="salario"
                  placeholder="Ex: 3500,00"
                  value={salario}
                  onChange={(e) => setSalario(e.target.value)}
                />
              </div>

              {/* Dependentes */}
              <div className="space-y-2">
                <Label htmlFor="dependentes">Quantidade de Dependentes</Label>
                <Input
                  id="dependentes"
                  type="number"
                  min="0"
                  value={dependentes}
                  onChange={(e) => setDependentes(e.target.value)}
                />
              </div>

              {/* Data Admissão */}
              <div className="space-y-2">
                <Label htmlFor="admissao">Data de Admissão</Label>
                <Input
                  id="admissao"
                  type="date"
                  value={dataAdmissao}
                  onChange={(e) => setDataAdmissao(e.target.value)}
                />
              </div>

              {/* Data Desligamento */}
              <div className="space-y-2">
                <Label htmlFor="desligamento">Data de Desligamento</Label>
                <Input
                  id="desligamento"
                  type="date"
                  value={dataDesligamento}
                  onChange={(e) => setDataDesligamento(e.target.value)}
                />
              </div>

              {/* Tipo de Rescisão */}
              <div className="space-y-2">
                <Label>Tipo de Rescisão</Label>
                <Select value={tipoRescisao} onValueChange={(v) => setTipoRescisao(v as TipoRescisao)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem_justa_causa">Demissão sem Justa Causa</SelectItem>
                    <SelectItem value="pedido_demissao">Pedido de Demissão</SelectItem>
                    <SelectItem value="justa_causa">Demissão por Justa Causa</SelectItem>
                    <SelectItem value="rescisao_indireta">Rescisão Indireta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Aviso Prévio */}
              <div className="space-y-2">
                <Label>Aviso Prévio</Label>
                <Select value={tipoAviso} onValueChange={(v) => setTipoAviso(v as TipoAviso)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalhado">Trabalhado</SelectItem>
                    <SelectItem value="indenizado">Indenizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Férias Vencidas */}
              <div className="space-y-2">
                <Label>Possui Férias Vencidas?</Label>
                <Select value={feriasVencidas} onValueChange={setFeriasVencidas}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                onClick={calcular}
                disabled={!camposPreenchidos || loading}
                className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4" />
                    Calcular Rescisão
                  </>
                )}
              </Button>
              <Button
                onClick={resetar}
                variant="outline"
                size="lg"
              >
                <RefreshCw className="h-4 w-4" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {resultado && (
          <div className="space-y-6 animate-fade-up">
            <Card className="shadow-elevated border-accent/20">
              <CardHeader>
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-accent" />
                  Resultado Estimado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Saldo de Salário", value: resultado.saldoSalario },
                    { label: "Aviso Prévio", value: resultado.avisoPrevio },
                    { label: "13º Proporcional", value: resultado.decimoTerceiro },
                    { label: "Férias Proporcionais", value: resultado.feriasProporcionais },
                    { label: "1/3 de Férias", value: resultado.tercoFerias },
                    { label: "Férias Vencidas", value: resultado.feriasVencidas },
                    { label: "1/3 Férias Vencidas", value: resultado.tercoFeriasVencidas },
                    { label: "Multa 40% FGTS", value: resultado.multaFGTS },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-3 px-4 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-6 p-5 rounded-lg bg-primary text-primary-foreground flex justify-between items-center">
                  <span className="text-lg font-serif font-semibold">Total Estimado</span>
                  <span className="text-2xl font-bold">{formatCurrency(resultado.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-accent bg-accent/5">
              <CardContent className="py-5">
                <p className="text-center text-sm text-foreground font-medium">
                  ⚠️ Este é um <strong>cálculo estimado</strong>. Para saber o valor correto do seu caso,
                  fale com um advogado especialista.
                </p>
              </CardContent>
            </Card>

            {/* CTA */}
            {!showContact ? (
              <div className="text-center">
                <Button
                  onClick={() => setShowContact(true)}
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                >
                  <MessageSquare className="h-5 w-5" />
                  Quero falar com um especialista
                </Button>
              </div>
            ) : (
              <Card className="shadow-elevated animate-fade-up">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Fale com um Especialista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        placeholder="Seu nome completo"
                        value={contactForm.nome}
                        onChange={(e) => setContactForm((p) => ({ ...p, nome: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        placeholder="(00) 00000-0000"
                        value={contactForm.whatsapp}
                        onChange={(e) => setContactForm((p) => ({ ...p, whatsapp: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        placeholder="Sua cidade"
                        value={contactForm.cidade}
                        onChange={(e) => setContactForm((p) => ({ ...p, cidade: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="resumo">Breve resumo do caso</Label>
                      <Textarea
                        id="resumo"
                        placeholder="Descreva brevemente sua situação..."
                        rows={3}
                        value={contactForm.resumo}
                        onChange={(e) => setContactForm((p) => ({ ...p, resumo: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
                    size="lg"
                    disabled={!contactForm.nome || !contactForm.whatsapp}
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Olá! Meu nome é ${contactForm.nome}, da cidade de ${contactForm.cidade}. Fiz uma simulação de rescisão no site e gostaria de uma consulta. Resumo: ${contactForm.resumo}`
                      );
                      window.open(`https://wa.me/5500000000000?text=${msg}`, "_blank");
                    }}
                  >
                    Enviar pelo WhatsApp
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TerminationCalculator;
