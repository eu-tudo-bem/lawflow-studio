import { Link } from "react-router-dom";
import { FileText, ArrowRight, CheckCircle } from "lucide-react";
import { DOCUMENT_READY_SERVICES } from "@/data/documentReadyServices";
import { getServiceCitySlug } from "@/data/localSEOCities";

interface Props {
  citySlug: string;
  cityName: string;
}

/**
 * Seção "Casos que podem ser analisados com documentos" para as páginas de cidade
 * (escritório de advocacia em [cidade]). Lista os 10 serviços documentais com cards
 * informativos e link para a página serviço + cidade correspondente.
 *
 * Linguagem alinhada à publicidade da OAB: informativa, sem promessa de resultado.
 */
const DocumentReadyCasesSection = ({ citySlug, cityName }: Props) => {
  return (
    <section className="py-16 bg-[hsl(220_30%_97%)] border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[hsl(45_60%_55%)] text-sm font-semibold mb-3">
            <FileText className="h-4 w-4" />
            Análise documental inicial
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
            Casos que podem ser analisados com documentos
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Algumas situações jurídicas podem começar com uma análise documental simples.
            Se você tem extratos, prints, contratos, comprovantes ou notificações,
            nossa equipe pode avaliar o melhor caminho jurídico para o seu caso em{" "}
            <strong className="text-foreground">{cityName}</strong> e em todo o Paraná.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOCUMENT_READY_SERVICES.map((s) => {
            const href = `/${getServiceCitySlug(s.slug, citySlug)}`;
            return (
              <Link
                key={s.slug}
                to={href}
                className="group flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border hover:border-[hsl(45_60%_55%)] hover:shadow-lg transition-all"
                title={`Advogado para ${s.shortName.toLowerCase()} em ${cityName}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl" aria-hidden="true">{s.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[hsl(45_60%_55%)] bg-[hsl(45_60%_55%)]/10 px-2 py-1 rounded-full">
                    {s.area}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground leading-snug group-hover:text-[hsl(45_60%_55%)] transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.shortDescription}
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">
                    Documentos comuns:
                  </p>
                  <ul className="space-y-1">
                    {s.documents.slice(0, 4).map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="h-3 w-3 text-[hsl(45_60%_55%)] shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                  <span className="text-xs font-semibold text-[hsl(45_60%_55%)] group-hover:underline">
                    Ver documentos necessários
                  </span>
                  <ArrowRight className="h-4 w-4 text-[hsl(45_60%_55%)] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/casos-com-documentos-prontos-parana"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(45_60%_55%)] hover:underline"
          >
            Ver hub completo: Casos com documentos prontos no Paraná
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DocumentReadyCasesSection;
