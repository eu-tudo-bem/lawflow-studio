import { useState } from "react";
import { Calculator, RefreshCw, MessageSquare, Loader2, Clock, Moon, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Resultado {
  horaNormal: number;
  horaExtraDevida: number;
  valorHorasExtrasDevido: number;
  adicionalNoturnoDevido: number;
  totalMensalDevido: number;
  diferencaMensal: number;
  projecao5Anos: number;
}

const OvertimeSimulator = () => {
  // Campos obrigatórios
  const [salario, setSalario] = useState("");
  const [jornada, setJornada] = useState("44");
  const [horasExtrasMes, setHorasExtrasMes] = useState("");
  const [horasExtrasPagas, setHorasExtrasPagas] = useState("");
  const [trabalhaNoturno, setTrabalhaNoturno] = useState("");
  const [horasNoturnasMes, setHorasNoturnasMes] = useState("");
  const [recebeAdicionalNoturno, setRecebeAdicionalNoturno] = useState("");

  // Campos opcionais
  const [tempoEmpresaAnos, setTempoEmpresaAnos] = useState("");
  const [tempoEmpresaMeses, setTempoEmpresaMeses] = useState("");
  const [percentualAdicional, setPercentualAdicional] = useState("");

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadForm, setLeadForm] = useState({ nome: "", whatsapp: "", email: "" });
  const [step, setStep] = useState<"intro" | "form" | "result">("intro");

  const calcular = () => {
    if (!salario || !horasExtrasMes || !horasExtrasPagas || !trabalhaNoturno) return;
    if (trabalhaNoturno === "sim" && (!horasNoturnasMes || !recebeAdicionalNoturno)) return;

    setLoading(true);
    setTimeout(() => {
      const sal = parseFloat(salario.replace(/\./g, "").replace(",", "."));
      const jornadaSemanal = parseFloat(jornada);
      const horasMensais = (jornadaSemanal / 6) * 30; // ~220h para 44h semanais
      const horaNormal = sal / horasMensais;

      const qtdHorasExtras = parseFloat(horasExtrasMes);
      const horaExtra50 = horaNormal * 1.5;
      const valorHorasExtrasDevido = qtdHorasExtras * horaExtra50;

      let adicionalNoturnoDevido = 0;
      if (trabalhaNoturno === "sim") {
        const qtdHorasNoturnas = parseFloat(horasNoturnasMes || "0");
        const adicionalPct = percentualAdicional ? parseFloat(percentualAdicional) / 100 : 0.2;
        adicionalNoturnoDevido = qtdHorasNoturnas * horaNormal * adicionalPct;
      }

      const totalMensalDevido = valorHorasExtrasDevido + adicionalNoturnoDevido;

      // Diferença: se não paga, é tudo; se paga parcialmente, estima 40% de diferença
      let diferencaMensal = 0;
      if (horasExtrasPagas === "nao") {
        diferencaMensal = valorHorasExtrasDevido;
      } else if (horasExtrasPagas === "parcialmente") {
        diferencaMensal = valorHorasExtrasDevido * 0.4;
      }

      if (trabalhaNoturno === "sim" && recebeAdicionalNoturno !== "sim") {
        diferencaMensal += adicionalNoturnoDevido;
      }

      const projecao5Anos = diferencaMensal * 60; // 5 anos = 60 meses

      setResultado({
        horaNormal,
        horaExtraDevida: horaExtra50,
        valorHorasExtrasDevido,
        adicionalNoturnoDevido,
        totalMensalDevido,
        diferencaMensal,
        projecao5Anos,
      });
      setLoading(false);
      setStep("result");
    }, 1000);
  };

  const resetar = () => {
    setSalario("");
    setJornada("44");
    setHorasExtrasMes("");
    setHorasExtrasPagas("");
    setTrabalhaNoturno("");
    setHorasNoturnasMes("");
    setRecebeAdicionalNoturno("");
    setTempoEmpresaAnos("");
    setTempoEmpresaMeses("");
    setPercentualAdicional("");
    setResultado(null);
    setShowLead(false);
    setStep("intro");
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const camposPreenchidos =
    salario &&
    horasExtrasMes &&
    horasExtrasPagas &&
    trabalhaNoturno &&
    (trabalhaNoturno !== "sim" || (horasNoturnasMes && recebeAdicionalNoturno));

  // Intro screen
  if (step === "intro") {
    return (
      <section className="py-20 bg-muted/50" id="simulador">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
              Ferramenta Gratuita
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Você pode estar deixando dinheiro na mesa.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubra em 2 minutos se suas horas extras e adicional noturno estão sendo pagos corretamente.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-lg px-8 py-6"
              onClick={() => setStep("form")}
            >
              <Calculator className="h-5 w-5" />
              Calcular agora gratuitamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/50" id="simulador">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="h-4 w-4" />
            Ferramenta Gratuita
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simulador de Horas Extras e Adicional Noturno
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha seus dados abaixo para descobrir se está recebendo corretamente.
          </p>
        </div>

        {step === "form" && (
          <>
            {/* Formulário */}
            <Card className="shadow-elevated mb-8 animate-fade-up">
              <CardHeader>
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Dados do Trabalho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Campos obrigatórios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ot-salario">Salário Bruto Mensal (R$) *</Label>
                    <Input
                      id="ot-salario"
                      placeholder="Ex: 3.500,00"
                      value={salario}
                      onChange={(e) => setSalario(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ot-jornada">Jornada Contratual (horas/semana) *</Label>
                    <Select value={jornada} onValueChange={setJornada}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="44">44 horas semanais</SelectItem>
                        <SelectItem value="40">40 horas semanais</SelectItem>
                        <SelectItem value="36">36 horas semanais</SelectItem>
                        <SelectItem value="30">30 horas semanais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ot-horas-extras">Média de horas extras por mês *</Label>
                    <Input
                      id="ot-horas-extras"
                      type="number"
                      min="0"
                      placeholder="Ex: 20"
                      value={horasExtrasMes}
                      onChange={(e) => setHorasExtrasMes(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas extras são pagas? *</Label>
                    <RadioGroup value={horasExtrasPagas} onValueChange={setHorasExtrasPagas} className="flex gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="sim" id="he-sim" />
                        <Label htmlFor="he-sim" className="cursor-pointer">Sim</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="nao" id="he-nao" />
                        <Label htmlFor="he-nao" className="cursor-pointer">Não</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="parcialmente" id="he-parcial" />
                        <Label htmlFor="he-parcial" className="cursor-pointer">Parcialmente</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Seção noturna */}
                <div className="border-t pt-6">
                  <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                    <Moon className="h-4 w-4 text-accent" />
                    Trabalho Noturno
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Trabalha no período noturno? *</Label>
                      <RadioGroup value={trabalhaNoturno} onValueChange={setTrabalhaNoturno} className="flex gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="sim" id="tn-sim" />
                          <Label htmlFor="tn-sim" className="cursor-pointer">Sim</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="nao" id="tn-nao" />
                          <Label htmlFor="tn-nao" className="cursor-pointer">Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {trabalhaNoturno === "sim" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="ot-horas-noturnas">Média de horas noturnas por mês *</Label>
                          <Input
                            id="ot-horas-noturnas"
                            type="number"
                            min="0"
                            placeholder="Ex: 40"
                            value={horasNoturnasMes}
                            onChange={(e) => setHorasNoturnasMes(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Recebe adicional noturno? *</Label>
                          <RadioGroup value={recebeAdicionalNoturno} onValueChange={setRecebeAdicionalNoturno} className="flex gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="sim" id="an-sim" />
                              <Label htmlFor="an-sim" className="cursor-pointer">Sim</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="nao" id="an-nao" />
                              <Label htmlFor="an-nao" className="cursor-pointer">Não</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="nao_sei" id="an-ns" />
                              <Label htmlFor="an-ns" className="cursor-pointer">Não sei</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Campos opcionais */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Campos opcionais (para melhor estimativa)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ot-anos">Tempo na empresa (anos)</Label>
                      <Input
                        id="ot-anos"
                        type="number"
                        min="0"
                        placeholder="Ex: 3"
                        value={tempoEmpresaAnos}
                        onChange={(e) => setTempoEmpresaAnos(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ot-meses">Tempo na empresa (meses)</Label>
                      <Input
                        id="ot-meses"
                        type="number"
                        min="0"
                        max="11"
                        placeholder="Ex: 6"
                        value={tempoEmpresaMeses}
                        onChange={(e) => setTempoEmpresaMeses(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ot-pct">% adicional pago (se souber)</Label>
                      <Input
                        id="ot-pct"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Ex: 20"
                        value={percentualAdicional}
                        onChange={(e) => setPercentualAdicional(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
                        Calcular Agora
                      </>
                    )}
                  </Button>
                  <Button onClick={resetar} variant="outline" size="lg">
                    <RefreshCw className="h-4 w-4" />
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Resultado */}
        {step === "result" && resultado && (
          <div className="space-y-6 animate-fade-up">
            <Card className="shadow-elevated border-accent/20">
              <CardHeader>
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Resultado da Simulação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Valor da hora normal", value: resultado.horaNormal },
                    { label: "Valor da hora extra (50%)", value: resultado.horaExtraDevida },
                    { label: "Total horas extras / mês", value: resultado.valorHorasExtrasDevido },
                    { label: "Adicional noturno / mês", value: resultado.adicionalNoturnoDevido },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3 px-4 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>

                {/* Total mensal devido */}
                <div className="mt-6 p-5 rounded-lg bg-primary text-primary-foreground flex justify-between items-center">
                  <span className="text-lg font-serif font-semibold">Total mensal que deveria receber</span>
                  <span className="text-2xl font-bold">{formatCurrency(resultado.totalMensalDevido)}</span>
                </div>

                {/* Diferença */}
                {resultado.diferencaMensal > 0 && (
                  <>
                    <div className="mt-4 p-5 rounded-lg bg-destructive/10 border border-destructive/20 flex justify-between items-center">
                      <span className="text-lg font-serif font-semibold text-destructive">Diferença estimada mensal</span>
                      <span className="text-2xl font-bold text-destructive">{formatCurrency(resultado.diferencaMensal)}</span>
                    </div>

                    {/* Projeção 5 anos */}
                    <div className="mt-4 p-6 rounded-lg bg-accent/10 border-2 border-accent text-center">
                      <p className="text-sm text-muted-foreground mb-1">Possível valor a recuperar (últimos 5 anos)</p>
                      <p className="text-4xl font-bold text-accent font-serif">{formatCurrency(resultado.projecao5Anos)}</p>
                      <p className="text-sm text-muted-foreground mt-2">Esse valor pode aumentar após análise detalhada.</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-accent bg-accent/5">
              <CardContent className="py-5">
                <p className="text-center text-sm text-foreground">
                  ⚠️ Simulação estimada com base nas regras gerais da <strong>CLT</strong>. Pode variar conforme convenção coletiva.
                </p>
              </CardContent>
            </Card>

            {/* Urgência */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <span>Prazo para reclamar direitos trabalhistas: <strong>até 2 anos após sair da empresa.</strong></span>
            </div>

            {/* CTA Lead */}
            {!showLead ? (
              <div className="text-center">
                <Button
                  onClick={() => setShowLead(true)}
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-lg px-8 py-6"
                >
                  <MessageSquare className="h-5 w-5" />
                  Quero uma análise gratuita do meu caso
                </Button>
              </div>
            ) : (
              <Card className="shadow-elevated animate-fade-up">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">
                    Receba gratuitamente uma análise estratégica com advogado trabalhista
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead-nome">Nome *</Label>
                      <Input
                        id="lead-nome"
                        placeholder="Seu nome completo"
                        value={leadForm.nome}
                        onChange={(e) => setLeadForm((p) => ({ ...p, nome: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-whatsapp">WhatsApp *</Label>
                      <Input
                        id="lead-whatsapp"
                        placeholder="(00) 00000-0000"
                        value={leadForm.whatsapp}
                        onChange={(e) => setLeadForm((p) => ({ ...p, whatsapp: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="lead-email">E-mail *</Label>
                      <Input
                        id="lead-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
                    size="lg"
                    disabled={!leadForm.nome || !leadForm.whatsapp || !leadForm.email}
                    onClick={() => {
                      const diferenca = resultado ? formatCurrency(resultado.diferencaMensal) : "";
                      const projecao = resultado ? formatCurrency(resultado.projecao5Anos) : "";
                      const msg = encodeURIComponent(
                        `Olá! Meu nome é ${leadForm.nome}. Fiz a simulação de horas extras no site.\n\nDiferença mensal estimada: ${diferenca}\nProjeção 5 anos: ${projecao}\n\nGostaria de uma análise gratuita do meu caso.\n\nTag: Interesse Trabalhista – Horas Extras`
                      );
                      window.open(`https://wa.me/5500000000000?text=${msg}`, "_blank");
                    }}
                  >
                    Enviar e falar com advogado
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Voltar */}
            <div className="text-center">
              <Button onClick={() => setStep("form")} variant="ghost" size="sm">
                ← Voltar ao formulário
              </Button>
              <Button onClick={resetar} variant="ghost" size="sm">
                Nova simulação
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OvertimeSimulator;
