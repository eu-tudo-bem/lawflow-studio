import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, RotateCcw, Scale, MessageCircle, AlertTriangle, CheckCircle2, Users, Baby, Briefcase, Heart, Shield } from "lucide-react";

type UserRole = "payer" | "receiver" | "";
type Custody = "receiver" | "shared" | "other" | "";
type ExistingAlimony = "none" | "judicial" | "informal" | "";
type AgeRange = "0-5" | "6-12" | "13-18" | "18+";

interface SimulatorData {
  role: UserRole;
  childrenCount: number;
  childrenAges: AgeRange[];
  payerIncome: number;
  hasExtraExpenses: boolean;
  extraExpensesValue: number;
  existingAlimony: ExistingAlimony;
  custody: Custody;
}

interface ContactForm {
  name: string;
  whatsapp: string;
  city: string;
  hasProcess: boolean;
}

const TOTAL_STEPS = 7;

const AlimonySimulator = () => {
  const [phase, setPhase] = useState<"intro" | "questions" | "result" | "contact">("intro");
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SimulatorData>({
    role: "",
    childrenCount: 1,
    childrenAges: [],
    payerIncome: 0,
    hasExtraExpenses: false,
    extraExpensesValue: 0,
    existingAlimony: "",
    custody: "",
  });
  const [contact, setContact] = useState<ContactForm>({
    name: "",
    whatsapp: "",
    city: "",
    hasProcess: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const progress = (step / TOTAL_STEPS) * 100;

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return data.role !== "";
      case 2: return data.childrenCount > 0;
      case 3: return data.childrenAges.length > 0;
      case 4: return data.payerIncome > 0;
      case 5: return true;
      case 6: return data.existingAlimony !== "";
      case 7: return data.custody !== "";
      default: return false;
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setPhase("result");
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else setPhase("intro");
  };

  const calculateEstimate = () => {
    const income = data.payerIncome;
    let minPercent = 0;
    let maxPercent = 0;

    // Base percentage per child count
    if (data.childrenCount === 1) {
      minPercent = 15;
      maxPercent = 25;
    } else if (data.childrenCount === 2) {
      minPercent = 25;
      maxPercent = 33;
    } else {
      minPercent = 30;
      maxPercent = 40;
    }

    // Adjust for young children
    const hasYoungChildren = data.childrenAges.some(a => a === "0-5");
    if (hasYoungChildren) {
      minPercent += 2;
      maxPercent += 3;
    }

    // Adjust for shared custody
    if (data.custody === "shared") {
      minPercent = Math.max(10, minPercent - 5);
      maxPercent = Math.max(15, maxPercent - 5);
    }

    // Adjust for extra expenses
    if (data.hasExtraExpenses && data.extraExpensesValue > 0) {
      const extraPercent = (data.extraExpensesValue / income) * 100;
      maxPercent += Math.min(extraPercent, 10);
    }

    // Cap
    maxPercent = Math.min(maxPercent, 50);

    const minValue = (income * minPercent) / 100;
    const maxValue = (income * maxPercent) / 100;

    return { minPercent, maxPercent, minValue, maxValue };
  };

  const handleContactSubmit = () => {
    if (!contact.name || !contact.whatsapp || !contact.city) return;

    const estimate = calculateEstimate();
    const message = encodeURIComponent(
      `Olá! Fiz a simulação de pensão alimentícia no site.\n\n` +
      `Nome: ${contact.name}\n` +
      `Cidade: ${contact.city}\n` +
      `Filhos: ${data.childrenCount}\n` +
      `Estimativa: R$ ${estimate.minValue.toFixed(0)} a R$ ${estimate.maxValue.toFixed(0)}\n` +
      `Processo existente: ${contact.hasProcess ? "Sim" : "Não"}\n\n` +
      `Gostaria de uma análise detalhada do meu caso.`
    );
    window.open(`https://wa.me/5511900000000?text=${message}`, "_blank");
    setSubmitted(true);
  };

  const reset = () => {
    setPhase("intro");
    setStep(1);
    setData({
      role: "", childrenCount: 1, childrenAges: [], payerIncome: 0,
      hasExtraExpenses: false, extraExpensesValue: 0, existingAlimony: "", custody: "",
    });
    setContact({ name: "", whatsapp: "", city: "", hasProcess: false });
    setSubmitted(false);
  };

  const OptionButton = ({ selected, onClick, icon, label }: { selected: boolean; onClick: () => void; icon?: React.ReactNode; label: string }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? "border-accent bg-accent/10 text-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:bg-muted/50"
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="font-medium">{label}</span>
      {selected && <CheckCircle2 className="ml-auto h-5 w-5 text-accent shrink-0" />}
    </button>
  );

  // INTRO
  if (phase === "intro") {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-8">
            <Scale className="h-10 w-10 text-accent" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Descubra uma estimativa da pensão alimentícia em menos de 1 minuto
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
            Responda perguntas rápidas e receba uma análise inicial baseada nas informações fornecidas.
          </p>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 shadow-gold"
            onClick={() => setPhase("questions")}
          >
            Começar simulação
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-muted-foreground mt-8">
            Simulação gratuita e sem compromisso. Seus dados são confidenciais.
          </p>
        </div>
      </section>
    );
  }

  // QUESTIONS
  if (phase === "questions") {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Pergunta {step} de {TOTAL_STEPS}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-elevated border-border/50">
            <CardContent className="p-6 md:p-8">
              {/* Step 1 - Role */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="h-6 w-6 text-accent" />
                    <h2 className="font-serif text-xl font-semibold text-foreground">Você é:</h2>
                  </div>
                  <OptionButton selected={data.role === "payer"} onClick={() => setData({ ...data, role: "payer" })} label="Quem vai pagar a pensão" />
                  <OptionButton selected={data.role === "receiver"} onClick={() => setData({ ...data, role: "receiver" })} label="Quem vai receber a pensão" />
                </div>
              )}

              {/* Step 2 - Children count */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Baby className="h-6 w-6 text-accent" />
                    <h2 className="font-serif text-xl font-semibold text-foreground">Quantos filhos precisam de pensão?</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setData({ ...data, childrenCount: Math.max(1, data.childrenCount - 1) })}>-</Button>
                    <span className="text-3xl font-bold text-foreground w-12 text-center">{data.childrenCount}</span>
                    <Button variant="outline" size="icon" onClick={() => setData({ ...data, childrenCount: Math.min(10, data.childrenCount + 1) })}>+</Button>
                  </div>
                </div>
              )}

              {/* Step 3 - Children ages */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Baby className="h-6 w-6 text-accent" />
                    <h2 className="font-serif text-xl font-semibold text-foreground">Qual a faixa etária dos filhos?</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Selecione todas que se aplicam</p>
                  {(["0-5", "6-12", "13-18", "18+"] as AgeRange[]).map((age) => (
                    <OptionButton
                      key={age}
                      selected={data.childrenAges.includes(age)}
                      onClick={() => {
                        const ages = data.childrenAges.includes(age)
                          ? data.childrenAges.filter(a => a !== age)
                          : [...data.childrenAges, age];
                        setData({ ...data, childrenAges: ages });
                      }}
                      label={age === "18+" ? "Maior de 18 anos" : `${age} anos`}
                    />
                  ))}
                </div>
              )}

              {/* Step 4 - Income */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="h-6 w-6 text-accent" />
                    <h2 className="font-serif text-xl font-semibold text-foreground">Renda mensal aproximada de quem pagará</h2>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                    <Input
                      type="number"
                      placeholder="Ex: 3000"
                      value={data.payerIncome || ""}
                      onChange={(e) => setData({ ...data, payerIncome: Number(e.target.value) })}
                      className="pl-12 text-lg h-14"
                      min={0}
                    />
                  </div>
                </div>
              )}

              {/* Step 5 - Extra expenses */}
              {step === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="h-6 w-6 text-accent" />
                    <h2 className="font-serif text-xl font-semibold text-foreground">Existem despesas extras?</h2>
                  </div>
                  <p className="text-sm text-muted-foreground -mt-2 mb-4">Escola particular, plano de saúde, atividades extracurriculares, etc.</p>
                  <OptionButton selected={data.hasExtraExpenses === false} onClick={() => setData({ ...data, hasExtraExpenses: false, extraExpensesValue: 0 })} label="Não" />
                  <OptionButton selected={data.hasExtraExpenses === true} onClick={() => setData({ ...data, hasExtraExpenses: true })} label="Sim" />
                  {data.hasExtraExpenses && (
                    <div className="pt-2">
                      <Label className="text-sm text-muted-foreground">Valor estimado das despesas extras (opcional)</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                        <Input
                          type="number"
                          placeholder="Ex: 500"
                          value={data.extraExpensesValue || ""}
                          onChange={(e) => setData({ ...data, extraExpensesValue: Number(e.target.value) })}
                          className="pl-12"
                          min={0}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 6 - Existing alimony */}
              {step === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-accent" />
                    <h2 className="font-serif text-xl font-semibold text-foreground">Já existe pensão definida?</h2>
                  </div>
                  <OptionButton selected={data.existingAlimony === "none"} onClick={() => setData({ ...data, existingAlimony: "none" })} label="Não" />
                  <OptionButton selected={data.existingAlimony === "judicial"} onClick={() => setData({ ...data, existingAlimony: "judicial" })} label="Sim, judicial" />
                  <OptionButton selected={data.existingAlimony === "informal"} onClick={() => setData({ ...data, existingAlimony: "informal" })} label="Sim, acordo informal" />
                </div>
              )}

              {/* Step 7 - Custody */}
              {step === 7 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="h-6 w-6 text-accent" />
                    <h2 className="font-serif text-xl font-semibold text-foreground">A guarda é:</h2>
                  </div>
                  <OptionButton selected={data.custody === "receiver"} onClick={() => setData({ ...data, custody: "receiver" })} label="Com quem vai receber" />
                  <OptionButton selected={data.custody === "shared"} onClick={() => setData({ ...data, custody: "shared" })} label="Compartilhada" />
                  <OptionButton selected={data.custody === "other"} onClick={() => setData({ ...data, custody: "other" })} label="Outra situação" />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button variant="ghost" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!canAdvance()}
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {step === TOTAL_STEPS ? "Ver resultado" : "Próximo"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // RESULT
  if (phase === "result") {
    const estimate = calculateEstimate();

    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-elevated border-border/50 overflow-hidden">
            <div className="bg-primary p-6 md:p-8 text-primary-foreground">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
                Veja o possível cenário para seu caso
              </h2>
              <p className="text-primary-foreground/70 text-sm">
                Resultado baseado nas informações que você forneceu
              </p>
            </div>
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Estimate */}
              <div className="bg-accent/10 rounded-xl p-6 text-center border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Estimativa de pensão mensal</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    R$ {estimate.minValue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-muted-foreground">a</span>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    R$ {estimate.maxValue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Entre {estimate.minPercent.toFixed(0)}% e {estimate.maxPercent.toFixed(0)}% da renda informada
                </p>
              </div>

              {/* Observations */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-accent" /> Observações importantes
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    Despesas extras (saúde, educação) podem alterar significativamente o valor
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    Cada juiz pode definir de forma diferente conforme o caso concreto
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    Documentos e provas influenciam diretamente na decisão
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    A capacidade financeira real de quem paga é determinante
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-muted rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Aviso:</strong> Este é um cálculo estimado com base em parâmetros gerais.
                  Para saber o valor correto e adequado ao seu caso, consulte um advogado especializado.
                </p>
              </div>

              {/* CTA */}
              <div className="space-y-3 pt-2">
                <Button
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 shadow-gold"
                  onClick={() => setPhase("contact")}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Receber análise detalhada do meu caso
                </Button>
                <Button variant="ghost" className="w-full" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Refazer simulação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // CONTACT
  if (phase === "contact") {
    if (submitted) {
      return (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-lg text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Mensagem enviada!
            </h2>
            <p className="text-muted-foreground mb-8">
              Nossa equipe entrará em contato em breve para uma análise detalhada do seu caso.
            </p>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" /> Nova simulação
            </Button>
          </div>
        </section>
      );
    }

    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="shadow-elevated border-border/50">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2">
                Receba sua análise personalizada
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Preencha seus dados para que um especialista entre em contato.
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Nome completo</Label>
                  <Input
                    placeholder="Seu nome"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    className="mt-1"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={contact.whatsapp}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                    className="mt-1"
                    maxLength={20}
                  />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input
                    placeholder="Sua cidade"
                    value={contact.city}
                    onChange={(e) => setContact({ ...contact, city: e.target.value })}
                    className="mt-1"
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Já existe processo judicial?</Label>
                  <div className="flex gap-3">
                    <OptionButton selected={contact.hasProcess === false} onClick={() => setContact({ ...contact, hasProcess: false })} label="Não" />
                    <OptionButton selected={contact.hasProcess === true} onClick={() => setContact({ ...contact, hasProcess: true })} label="Sim" />
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                  onClick={handleContactSubmit}
                  disabled={!contact.name || !contact.whatsapp || !contact.city}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar com especialista
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setPhase("result")}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao resultado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return null;
};

export default AlimonySimulator;
