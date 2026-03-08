import { useEffect, useState } from "react";
import { Activity, ShieldCheck } from "lucide-react";

interface Props {
  cityName: string;
  citySlug?: string;
  serviceName?: string;
  serviceSlug?: string;
}

// Persona map by service slug
const PERSONA_MAP: Record<string, string[]> = {
  "direito-agrario":        ["Um produtor rural", "Uma empresa agro", "Um fazendeiro"],
  "pensao-alimenticia":     ["Uma mãe", "Um pai", "Uma família"],
  "divorcio-consensual":    ["Um casal", "Uma pessoa", "Um cliente"],
  "revisional-juros":       ["Um consumidor", "Uma empresa", "Um devedor"],
  "cobranca-aluguel":       ["Um proprietário", "Uma imobiliária", "Um locador"],
  "transferencia-veiculos": ["Um comprador", "Um vendedor", "Um proprietário"],
};

function getPersona(serviceSlug?: string, seed = 0): string {
  if (!serviceSlug) return seed % 2 === 0 ? "Um morador" : "Um cliente";
  const list = PERSONA_MAP[serviceSlug];
  if (!list) return seed % 2 === 0 ? "Um morador" : "Um cliente";
  return list[seed % list.length];
}

function generateRelativeTime(seed: number): string {
  const options = [
    `há ${3 + (seed % 12)} minutos`,
    `há ${1 + (seed % 3)} hora${1 + (seed % 3) > 1 ? "s" : ""}`,
    "há poucos minutos",
    `há ${20 + (seed % 40)} minutos`,
    "há cerca de 1 hora",
  ];
  return options[seed % options.length];
}

const LocalProof = ({ cityName, citySlug, serviceName, serviceSlug }: Props) => {
  const [activity, setActivity] = useState<{ persona: string; time: string } | null>(null);

  useEffect(() => {
    // Generate only on client to avoid hydration mismatch
    const seed = Math.floor(Math.random() * 100);
    setActivity({
      persona: getPersona(serviceSlug, seed),
      time: generateRelativeTime(seed),
    });
  }, [serviceSlug]);

  const serviceLabel = serviceName ?? "consultoria jurídica";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-5 w-fit max-w-full flex-wrap">
      {/* Live activity feed card */}
      <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(142_60%_45%)]/10 border border-[hsl(142_60%_45%)]/25">
        {/* Pulse dot — "live" indicator */}
        <span className="absolute -top-1.5 -left-1.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(142_60%_45%)] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(142_60%_45%)]" />
        </span>

        <div className="shrink-0 p-1 bg-[hsl(142_60%_45%)]/20 rounded-full">
          <Activity className="h-4 w-4 text-[hsl(142_60%_45%)]" />
        </div>

        <p className="text-sm text-[hsl(45_20%_95%)]/80 leading-snug">
          {activity ? (
            <>
              <span className="font-semibold text-[hsl(142_60%_45%)]">{activity.persona}</span>
              {" de "}
              <span className="font-semibold text-[hsl(45_20%_95%)]">{cityName}</span>
              {" acabou de solicitar uma análise de "}
              <span className="font-semibold text-[hsl(45_60%_55%)]">{serviceLabel}</span>
              {" · "}
              <span className="text-[hsl(45_20%_95%)]/50">{activity.time}</span>
            </>
          ) : (
            <span className="opacity-0">…</span>
          )}
        </p>
      </div>

      {/* OAB/PR verified seal */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(220_60%_50%)]/15 border border-[hsl(220_60%_50%)]/30">
        <div className="shrink-0 p-1 bg-[hsl(220_60%_50%)]/20 rounded-full">
          <ShieldCheck className="h-4 w-4 text-[hsl(220_60%_65%)]" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(220_60%_65%)]">
            Atendimento Verificado
          </span>
          <span className="text-xs font-semibold text-[hsl(45_20%_95%)]/80 mt-0.5">
            OAB/PR · Inscrição Ativa
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocalProof;
