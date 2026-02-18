import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight, ArrowLeft, RotateCcw, Clock, User, Briefcase,
  Calendar, AlertTriangle, CheckCircle2, TrendingUp, Shield, MessageCircle
} from "lucide-react";

type Sex = "male" | "female" | "";
type WorkType = "clt" | "autonomo" | "servidor" | "rural" | "";
type SimType = "idade" | "tempo" | "ambas" | "";

interface SimData {
  age: number;
  sex: Sex;
  contributionYears: number;
  isContributing: string;
  workType: WorkType;
  simType: SimType;
  avgSalary: string;
  stopDate: string;
}

interface ContactData {
  name: string;
  whatsapp: string;
  email: string;
}

type Step = "intro" | "age" | "sex" | "contribution" | "contributing" | "workType" | "simType" | "extras" | "result" | "contact";

const STEPS: Step[] = ["age", "sex", "contribution", "contributing", "workType", "simType", "extras"];

// Brazilian retirement rules (simplified 2024+)
const calculateRetirement = (data: SimData) => {
  const { age, sex, contributionYears, workType, simType, avgSalary } = data;
  const isMale = sex === "male";
  const isRural = workType === "rural";

  // Minimum age rules
  const minAgeByAge = isRural ? (isMale ? 60 : 55) : (isMale ? 65 : 62);
  const minContribByAge = isRural ? 15 : (isMale ? 20 : 15);

  // By contribution time (transition rule - points)
  const pointsNeeded = isMale ? 101 : 91; // 2024+ final values
  const minContribByTime = isMale ? 35 : 30;
  const currentPoints = age + contributionYears;

  // Estimate remaining years
  const remainingByAge = Math.max(0, minAgeByAge - age);
  const remainingContribByAge = Math.max(0, minContribByAge - contributionYears);
  const yearsToRetireByAge = Math.max(remainingByAge, remainingContribByAge);

  const remainingContribByTime = Math.max(0, minContribByTime - contributionYears);
  // Each year that passes adds 2 points (1 age + 1 contribution)
  const remainingPointsByTime = Math.max(0, Math.ceil((pointsNeeded - currentPoints) / 2));
  const yearsToRetireByTime = Math.max(remainingContribByTime, remainingPointsByTime);

  const retireAgeByAge = age + yearsToRetireByAge;
  const retireAgeByTime = age + yearsToRetireByTime;

  // Best option
  let bestYears = yearsToRetireByAge;
  let bestRule = "Aposentadoria por Idade";
  let retireAge = retireAgeByAge;

  if (simType === "tempo" || simType === "ambas") {
    if (yearsToRetireByTime < yearsToRetireByAge) {
      bestYears = yearsToRetireByTime;
      bestRule = "Aposentadoria por Tempo de Contribuição (Regra de Pontos)";
      retireAge = retireAgeByTime;
    }
  }
  if (simType === "idade") {
    bestYears = yearsToRetireByAge;
    bestRule = "Aposentadoria por Idade";
    retireAge = retireAgeByAge;
  }

  // Estimate benefit value
  let estimatedBenefit = 0;
  if (avgSalary) {
    const salary = Number(avgSalary);
    // 60% + 2% per year above minimum contribution
    const totalContribAtRetirement = contributionYears + bestYears;
    const minContrib = isMale ? 20 : 15;
    const extraYears = Math.max(0, totalContribAtRetirement - minContrib);
    const percentage = Math.min(100, 60 + extraYears * 2);
    estimatedBenefit = (salary * percentage) / 100;
  }

  // Progress percentage
  const totalNeeded = contributionYears + bestYears;
  const progressPercent = totalNeeded > 0 ? Math.min(100, (contributionYears / totalNeeded) * 100) : 0;

  // Alerts
  const alerts: string[] = [];
  if (contributionYears >= 10 && bestYears > 5) {
    alerts.push("Pode ser vantajoso revisar contribuições anteriores");
  }
  if (age >= (isMale ? 60 : 57) && contributionYears >= (isMale ? 30 : 25)) {
    alerts.push("Pode haver direito adquirido em regras de transição");
  }
  if (bestYears > 10) {
    alerts.push("Possível necessidade de planejamento previdenciário antecipado");
  }
  if (workType === "autonomo") {
    alerts.push("Contribuições como autônomo precisam ser verificadas junto ao INSS");
  }

  return {
    yearsToRetireByAge,
    yearsToRetireByTime,
    bestYears,
    bestRule,
    retireAge,
    estimatedBenefit,
    progressPercent,
    alerts,
    currentPoints,
    pointsNeeded,
  };
};

const RetirementSimulator = () => {
  const [step, setStep] = useState<Step>("intro");
  const [data, setData] = useState<SimData>({
    age: 0,
    sex: "",
    contributionYears: 0,
    isContributing: "",
    workType: "",
    simType: "",
    avgSalary: "",
    stopDate: "",
  });
  const [contact, setContact] = useState<ContactData>({ name: "", whatsapp: "", email: "" });

  const currentIndex = STEPS.indexOf(step);
  const progress = step === "intro" ? 0 : step === "result" || step === "contact" ? 100 : ((currentIndex + 1) / STEPS.length) * 100;

  const canAdvance = () => {
    switch (step) {
      case "age": return data.age > 0 && data.age < 100;
      case "sex": return data.sex !== "";
      case "contribution": return data.contributionYears >= 0;
      case "contributing": return data.isContributing !== "";
      case "workType": return data.workType !== "";
      case "simType": return data.simType !== "";
      case "extras": return true;
      default: return true;
    }
  };

  const next = () => {
    const i = currentIndex;
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
    else setStep("result");
  };

  const prev = () => {
    const i = currentIndex;
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const reset = () => {
    setStep("intro");
    setData({ age: 0, sex: "", contributionYears: 0, isContributing: "", workType: "", simType: "", avgSalary: "", stopDate: "" });
    setContact({ name: "", whatsapp: "", email: "" });
  };

  const handleContact = () => {
    const r = calculateRetirement(data);
    const msg = `Olá! Fiz a simulação de aposentadoria no site.\n\nNome: ${contact.name}\nE-mail: ${contact.email}\nIdade: ${data.age} anos\nTempo de contribuição: ${data.contributionYears} anos\nRegra indicada: ${r.bestRule}\nTempo restante estimado: ${r.bestYears} anos\n${r.estimatedBenefit > 0 ? `Benefício estimado: R$ ${r.estimatedBenefit.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : ""}\n\nGostaria de uma análise detalhada do meu caso.`;
    window.open(`https://wa.me/5511900000000?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const contactValid = contact.name && contact.whatsapp && contact.email;

  const OptionButton = ({ selected, onClick, label, sublabel }: { selected: boolean; onClick: () => void; label: string; sublabel?: string }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? "border-accent bg-accent/10 text-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:bg-muted/50"
      }`}
    >
      <div>
        <span className="font-medium">{label}</span>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
      {selected && <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />}
    </button>
  );

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mx-auto">
              <Clock className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-foreground leading-tight">
              Descubra quando você pode se aposentar e quanto pode receber
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Simulação rápida com base nas regras atuais da Previdência.
            </p>
            <Button size="lg" onClick={() => setStep("age")} className="mt-4 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-lg px-10 py-6">
              Fazer simulação gratuita <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-6">
              Gratuito e sem compromisso. Seus dados são confidenciais.
            </p>
          </div>
        );

      case "age":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Qual sua idade atual?</h2>
            </div>
            <Input
              type="number"
              placeholder="Ex: 45"
              value={data.age || ""}
              onChange={(e) => setData({ ...data, age: Number(e.target.value) })}
              className="text-lg h-14"
              min={16}
              max={99}
            />
          </div>
        );

      case "sex":
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Sexo</h2>
            </div>
            <OptionButton selected={data.sex === "male"} onClick={() => setData({ ...data, sex: "male" })} label="Masculino" />
            <OptionButton selected={data.sex === "female"} onClick={() => setData({ ...data, sex: "female" })} label="Feminino" />
          </div>
        );

      case "contribution":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Tempo total de contribuição (anos)</h2>
            </div>
            <Input
              type="number"
              placeholder="Ex: 20"
              value={data.contributionYears || ""}
              onChange={(e) => setData({ ...data, contributionYears: Number(e.target.value) })}
              className="text-lg h-14"
              min={0}
              max={50}
            />
            <p className="text-sm text-muted-foreground">Conte todos os períodos em que houve contribuição ao INSS.</p>
          </div>
        );

      case "contributing":
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Está contribuindo atualmente?</h2>
            </div>
            <OptionButton selected={data.isContributing === "yes"} onClick={() => setData({ ...data, isContributing: "yes" })} label="Sim" />
            <OptionButton selected={data.isContributing === "no"} onClick={() => setData({ ...data, isContributing: "no" })} label="Não" />
          </div>
        );

      case "workType":
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Tipo de trabalho</h2>
            </div>
            <OptionButton selected={data.workType === "clt"} onClick={() => setData({ ...data, workType: "clt" })} label="CLT" sublabel="Carteira assinada" />
            <OptionButton selected={data.workType === "autonomo"} onClick={() => setData({ ...data, workType: "autonomo" })} label="Autônomo" sublabel="Contribuinte individual" />
            <OptionButton selected={data.workType === "servidor"} onClick={() => setData({ ...data, workType: "servidor" })} label="Servidor Público" sublabel="Regime próprio" />
            <OptionButton selected={data.workType === "rural"} onClick={() => setData({ ...data, workType: "rural" })} label="Rural" sublabel="Trabalhador rural" />
          </div>
        );

      case "simType":
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-xl font-semibold text-foreground">O que deseja simular?</h2>
            </div>
            <OptionButton selected={data.simType === "idade"} onClick={() => setData({ ...data, simType: "idade" })} label="Aposentadoria por Idade" />
            <OptionButton selected={data.simType === "tempo"} onClick={() => setData({ ...data, simType: "tempo" })} label="Aposentadoria por Tempo de Contribuição" />
            <OptionButton selected={data.simType === "ambas"} onClick={() => setData({ ...data, simType: "ambas" })} label="Ambas (mais vantajosa)" sublabel="Recomendado" />
          </div>
        );

      case "extras":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-accent" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Informações complementares</h2>
            </div>
            <p className="text-sm text-muted-foreground">Estes campos são opcionais mas ajudam a refinar a estimativa.</p>
            <div>
              <Label>Média salarial aproximada (R$)</Label>
              <Input
                type="number"
                placeholder="Ex: 3500"
                value={data.avgSalary}
                onChange={(e) => setData({ ...data, avgSalary: e.target.value })}
                className="mt-2"
                min={0}
              />
            </div>
            <div>
              <Label>Data prevista para parar de contribuir (opcional)</Label>
              <Input
                type="date"
                value={data.stopDate}
                onChange={(e) => setData({ ...data, stopDate: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case "result": {
        const r = calculateRetirement(data);
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <h2 className="font-serif text-2xl font-bold mb-1">Resultado da sua simulação</h2>
              <p className="text-primary-foreground/70 text-sm">Estimativa baseada nas regras atuais da Previdência</p>
            </div>

            {/* Timeline progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso até a aposentadoria</span>
                <span className="font-semibold text-foreground">{r.progressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={r.progressPercent} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{data.contributionYears} anos contribuídos</span>
                <span>Faltam ~{r.bestYears} anos</span>
              </div>
            </div>

            {/* Key info cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Idade prevista</p>
                  <p className="text-3xl font-bold text-foreground">{r.retireAge}</p>
                  <p className="text-xs text-muted-foreground">anos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Tempo restante</p>
                  <p className="text-3xl font-bold text-accent">{r.bestYears}</p>
                  <p className="text-xs text-muted-foreground">{r.bestYears === 1 ? "ano" : "anos"}</p>
                </CardContent>
              </Card>
              {r.estimatedBenefit > 0 && (
                <Card className="col-span-2 border-accent/30 bg-accent/5">
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Benefício estimado</p>
                    <p className="text-3xl font-bold text-foreground">R$ {r.estimatedBenefit.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-muted-foreground">valor mensal aproximado</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Best rule */}
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Regra mais vantajosa identificada</p>
                  <p className="text-sm text-muted-foreground mt-1">{r.bestRule}</p>
                  {data.simType === "ambas" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Por idade: {r.yearsToRetireByAge} anos · Por tempo: {r.yearsToRetireByTime} anos
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Alerts */}
            {r.alerts.length > 0 && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Você pode estar deixando dinheiro na mesa
                </p>
                {r.alerts.map((alert, i) => (
                  <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span> {alert}
                  </p>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-4 rounded-xl space-y-1">
              <p>• Esta é uma simulação estimada e não substitui análise jurídica individual.</p>
              <p>• Valores e prazos podem variar conforme histórico contributivo real.</p>
              <p>• Regras de transição podem oferecer cenários diferentes.</p>
            </div>

            <Button size="lg" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold" onClick={() => setStep("contact")}>
              Receber análise detalhada com advogado especialista <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full gap-2" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Refazer simulação
            </Button>
          </div>
        );
      }

      case "contact":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-2">
              <MessageCircle className="h-10 w-10 text-accent mx-auto mb-3" />
              <h3 className="text-xl font-serif font-semibold text-foreground">Receba gratuitamente uma análise estratégica do seu caso</h3>
              <p className="text-sm text-muted-foreground mt-2">Preencha seus dados e um especialista entrará em contato.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nome completo</Label>
                <Input placeholder="Seu nome" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input placeholder="(11) 99999-9999" value={contact.whatsapp} onChange={e => setContact({ ...contact, whatsapp: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input type="email" placeholder="seu@email.com" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} className="mt-1" />
              </div>
            </div>
            <Button size="lg" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold" disabled={!contactValid} onClick={handleContact}>
              Falar com especialista <ArrowRight className="h-4 w-4" />
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
        {!["intro", "result", "contact"].includes(step) && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Pergunta {currentIndex + 1} de {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Card className="shadow-elevated border-border/50">
          <CardContent className="p-6 md:p-10">
            {renderStep()}
            {!["intro", "result", "contact"].includes(step) && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button variant="ghost" onClick={currentIndex === 0 ? () => setStep("intro") : prev} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </Button>
                <Button onClick={next} disabled={!canAdvance()} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  {currentIndex === STEPS.length - 1 ? "Ver resultado" : "Próximo"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Este simulador oferece apenas uma estimativa inicial baseada em regras gerais. Não constitui parecer jurídico.
          A análise definitiva depende da avaliação individualizada por profissional habilitado.
        </p>
      </div>
    </section>
  );
};

export default RetirementSimulator;
