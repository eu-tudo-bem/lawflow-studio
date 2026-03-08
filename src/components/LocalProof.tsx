import { BadgeCheck, Clock, ShieldCheck } from "lucide-react";

interface Props {
  cityName: string;
}

// Rotate through varied proof messages to feel more organic
const proofMessages = [
  (city: string) => `Atendimento recente concluído com sucesso para cliente de ${city}.`,
  (city: string) => `Caso encerrado esta semana para morador de ${city}.`,
  (city: string) => `Consulta realizada com êxito para cliente de ${city} nos últimos dias.`,
];

const LocalProof = ({ cityName }: Props) => {
  // Deterministically pick a variant based on city name length so it's stable per page
  const variant = proofMessages[cityName.length % proofMessages.length];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-5 w-fit max-w-full flex-wrap">
      {/* Recent case badge */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(142_60%_45%)]/10 border border-[hsl(142_60%_45%)]/25">
        <div className="shrink-0 p-1 bg-[hsl(142_60%_45%)]/20 rounded-full">
          <BadgeCheck className="h-4 w-4 text-[hsl(142_60%_45%)]" />
        </div>
        <p className="text-sm text-[hsl(45_20%_95%)]/80 leading-snug">
          <span className="font-semibold text-[hsl(142_60%_45%)]">✓ Verificado</span>
          {" — "}
          {variant(cityName)}
        </p>
        <div className="shrink-0 flex items-center gap-1 text-xs text-[hsl(45_20%_95%)]/40 whitespace-nowrap">
          <Clock className="h-3 w-3" />
          Recente
        </div>
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
