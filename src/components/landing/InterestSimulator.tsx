import { useState } from "react";
import { whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, RotateCcw, Shield, TrendingDown, FileSearch } from "lucide-react";

const MARKET_RATES: Record<string, { min: number; max: number; label: string }> = {
  vehicle: { min: 1.2, max: 2.2, label: "Veículo" },
  property: { min: 0.6, max: 1.2, label: "Imóvel" },
  personal: { min: 2.5, max: 6.0, label: "Empréstimo Pessoal" },
  other: { min: 1.5, max: 4.0, label: "Outro" },
};

type Step = "intro" | "type" | "amount" | "installment" | "rate" | "delay" | "result" | "contact";

const InterestSimulator = () => {
  const [step, setStep] = useState<Step>("intro");
  const [data, setData] = useState({
    type: "",
    amount: "",
    installmentValue: "",
    installmentCount: "",
    knownRate: "",
    hasDelay: "",
    name: "",
    whatsapp: "",
    city: "",
    bank: "",
  });

  const steps: Step[] = ["type", "amount", "installment", "rate", "delay"];
  const currentIndex = steps.indexOf(step);
  const progress = step === "intro" ? 0 : step === "result" || step === "contact" ? 100 : ((currentIndex + 1) / steps.length) * 100;

  const canAdvance = () => {
    switch (step) {
      case "type": return !!data.type;
      case "amount": return !!data.amount && Number(data.amount) > 0;
      case "installment": return !!data.installmentValue && !!data.installmentCount && Number(data.installmentValue) > 0 && Number(data.installmentCount) > 0;
      case "rate": return true;
      case "delay": return !!data.hasDelay;
      default: return true;
    }
  };

  const next = () => {
    const i = currentIndex;
    if (i < steps.length - 1) setStep(steps[i + 1]);
    else setStep("result");
  };

  const prev = () => {
    const i = currentIndex;
    if (i > 0) setStep(steps[i - 1]);
  };

  const calculateResult = () => {
    const amount = Number(data.amount);
    const installment = Number(data.installmentValue);
    const count = Number(data.installmentCount);
    const totalPaid = installment * count;
    const totalInterest = totalPaid - amount;
    const effectiveMonthlyRate = totalInterest > 0 ? ((totalPaid / amount) ** (1 / count) - 1) * 100 : 0;
    const market = MARKET_RATES[data.type] || MARKET_RATES.other;
    const isAboveAverage = effectiveMonthlyRate > market.max;
    const fairInstallment = amount * (market.max / 100 * (1 + market.max / 100) ** count) / ((1 + market.max / 100) ** count - 1);
    const potentialSavings = isAboveAverage ? Math.max(0, (installment - fairInstallment) * count) : 0;

    return { effectiveMonthlyRate, market, isAboveAverage, totalPaid, totalInterest, potentialSavings };
  };

  const handleContact = () => {
    const result = calculateResult();
    const msg = `Olá, fiz a simulação de juros no site e gostaria de uma análise do meu contrato.\n\nNome: ${data.name}\nCidade: ${data.city}\nBanco/Financeira: ${data.bank}\nTipo: ${MARKET_RATES[data.type]?.label || "Outro"}\nValor financiado: R$ ${Number(data.amount).toLocaleString("pt-BR")}\nParcela: R$ ${Number(data.installmentValue).toLocaleString("pt-BR")}\nQtd parcelas: ${data.installmentCount}\nTaxa estimada: ${result.effectiveMonthlyRate.toFixed(2)}% a.m.\nEconomia potencial: R$ ${result.potentialSavings.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
    window.open(`https://wa.me/5541995808145?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const reset = () => {
    setStep("intro");
    setData({ type: "", amount: "", installmentValue: "", installmentCount: "", knownRate: "", hasDelay: "", name: "", whatsapp: "", city: "", bank: "" });
  };

  const contactValid = data.name && data.whatsapp && data.city && data.bank;

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mx-auto">
              <Shield className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              Veja se você pode estar pagando juros abusivos
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Informe alguns dados do seu financiamento e receba uma análise inicial em segundos.
            </p>
            <Button size="lg" onClick={() => setStep("type")} className="mt-4 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              Começar simulação <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        );

      case "type":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Qual tipo de financiamento?</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(MARKET_RATES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setData({ ...data, type: key })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${data.type === key ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"}`}
                >
                  <span className="font-medium text-foreground">{val.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">Taxa média: {val.min}% – {val.max}% a.m.</p>
                </button>
              ))}
            </div>
          </div>
        );

      case "amount":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Qual o valor financiado?</h3>
            <p className="text-sm text-muted-foreground">Informe o valor total do bem ou empréstimo, sem entrada.</p>
            <div>
              <Label>Valor financiado (R$)</Label>
              <Input type="number" placeholder="Ex: 50000" value={data.amount} onChange={e => setData({ ...data, amount: e.target.value })} className="mt-2 text-lg" />
            </div>
          </div>
        );

      case "installment":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Dados da parcela</h3>
            <div className="space-y-4">
              <div>
                <Label>Valor da parcela mensal (R$)</Label>
                <Input type="number" placeholder="Ex: 1200" value={data.installmentValue} onChange={e => setData({ ...data, installmentValue: e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Quantidade de parcelas</Label>
                <Input type="number" placeholder="Ex: 48" value={data.installmentCount} onChange={e => setData({ ...data, installmentCount: e.target.value })} className="mt-2" />
              </div>
            </div>
          </div>
        );

      case "rate":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Taxa de juros do contrato</h3>
            <p className="text-sm text-muted-foreground">Se souber a taxa mensal informada no contrato, preencha abaixo. Caso não saiba, pode avançar.</p>
            <div>
              <Label>Taxa mensal informada (% a.m.) — opcional</Label>
              <Input type="number" step="0.01" placeholder="Ex: 1.99" value={data.knownRate} onChange={e => setData({ ...data, knownRate: e.target.value })} className="mt-2" />
            </div>
          </div>
        );

      case "delay":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Houve atraso ou negativação?</h3>
            <p className="text-sm text-muted-foreground">Já houve atraso ou negativação relacionada a esse contrato?</p>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setData({ ...data, hasDelay: opt.value })}
                  className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${data.hasDelay === opt.value ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      case "result": {
        const r = calculateResult();
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${r.isAboveAverage ? "bg-destructive/10 border border-destructive/20" : "bg-accent/50 border border-accent"}`}>
              <div className="flex items-start gap-3">
                {r.isAboveAverage ? <AlertTriangle className="h-6 w-6 text-destructive mt-1 shrink-0" /> : <CheckCircle className="h-6 w-6 text-primary mt-1 shrink-0" />}
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {r.isAboveAverage ? "Atenção: pode haver indícios de cobrança acima da média" : "Seus juros parecem dentro da média de mercado"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {r.isAboveAverage
                      ? "Com base nos dados informados, os valores do seu financiamento podem estar acima das taxas normalmente praticadas. Uma análise contratual pode identificar possibilidade de revisão e redução das parcelas."
                      : "Somente a análise detalhada do contrato pode confirmar se existem cobranças revisáveis."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Taxa estimada</p>
                  <p className="text-2xl font-bold text-foreground">{r.effectiveMonthlyRate.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">ao mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Média de mercado</p>
                  <p className="text-2xl font-bold text-foreground">{r.market.min}% – {r.market.max}%</p>
                  <p className="text-xs text-muted-foreground">ao mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total pago</p>
                  <p className="text-xl font-bold text-foreground">R$ {r.totalPaid.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</p>
                </CardContent>
              </Card>
              {r.isAboveAverage && r.potentialSavings > 0 && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">Economia potencial</p>
                    <p className="text-xl font-bold text-primary">R$ {r.potentialSavings.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-muted-foreground">estimativa</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground bg-muted/50 p-4 rounded-xl">
              <div className="flex items-start gap-2"><FileSearch className="h-3.5 w-3.5 mt-0.5 shrink-0" /> <span>Cada caso depende da análise do contrato original</span></div>
              <div className="flex items-start gap-2"><TrendingDown className="h-3.5 w-3.5 mt-0.5 shrink-0" /> <span>Valores são estimativas e podem variar conforme decisão judicial</span></div>
              <div className="flex items-start gap-2"><Shield className="h-3.5 w-3.5 mt-0.5 shrink-0" /> <span>Uma revisão contratual pode identificar cobranças indevidas</span></div>
            </div>

            <Button size="lg" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold" onClick={() => setStep("contact")}>
              Quero que um advogado analise meu contrato <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full gap-2" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Refazer simulação
            </Button>
          </div>
        );
      }

      case "contact":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Receba orientação especializada</h3>
            <p className="text-sm text-muted-foreground">Preencha seus dados para falar com um advogado sobre a revisão do seu contrato.</p>
            <div className="space-y-4">
              <div><Label>Nome completo</Label><Input placeholder="Seu nome" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="mt-1" /></div>
              <div><Label>WhatsApp</Label><Input placeholder="(11) 99999-9999" value={data.whatsapp} onChange={e => setData({ ...data, whatsapp: e.target.value })} className="mt-1" /></div>
              <div><Label>Cidade</Label><Input placeholder="Sua cidade" value={data.city} onChange={e => setData({ ...data, city: e.target.value })} className="mt-1" /></div>
              <div><Label>Banco ou financeira</Label><Input placeholder="Ex: Bradesco, BV, Santander" value={data.bank} onChange={e => setData({ ...data, bank: e.target.value })} className="mt-1" /></div>
            </div>
            <Button size="lg" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold" disabled={!contactValid} onClick={handleContact}>
              Receber orientação <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full gap-2" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Refazer simulação
            </Button>
          </div>
        );
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        {step !== "intro" && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 md:p-10">
            {renderStep()}
            {!["intro", "result", "contact"].includes(step) && (
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prev} disabled={currentIndex === 0} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </Button>
                <Button onClick={next} disabled={!canAdvance()} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  Avançar <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Este simulador oferece apenas uma estimativa inicial. Não constitui parecer jurídico.
          A análise definitiva depende da avaliação do contrato por um profissional habilitado.
        </p>
      </div>
    </section>
  );
};

export default InterestSimulator;
