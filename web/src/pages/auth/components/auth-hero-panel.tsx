import { BriefcaseBusiness, Users, TrendingUp, Star } from 'lucide-react';

const AuthHeroPanel = () => {
  return (
    <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between p-10">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Gradient accent orbs */}
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-blue-500/8 blur-3xl" />

      {/* Top section */}
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-white text-zinc-950">
            <BriefcaseBusiness className="size-4" />
          </div>
          <span className="text-lg font-semibold text-white">Recruitment</span>
        </div>

        <div className="mt-16 max-w-md">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma ativa — vagas abertas agora
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Conectando talentos
            <br />
            às melhores oportunidades.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Simplifique seu processo de recrutamento e seleção com uma
            plataforma moderna, rápida e intuitiva.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative z-10 mt-auto">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <BriefcaseBusiness className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Vagas
              </span>
            </div>
            <p className="text-2xl font-bold text-white">1.2k+</p>
            <p className="text-xs text-zinc-500 mt-0.5">publicadas</p>
          </div>
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Users className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Talentos
              </span>
            </div>
            <p className="text-2xl font-bold text-white">8.5k+</p>
            <p className="text-xs text-zinc-500 mt-0.5">cadastrados</p>
          </div>
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <TrendingUp className="size-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Taxa
              </span>
            </div>
            <p className="text-2xl font-bold text-white">94%</p>
            <p className="text-xs text-zinc-500 mt-0.5">satisfação</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 backdrop-blur-sm">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="size-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            "A plataforma transformou completamente nosso processo de
            contratação. Reduzimos o tempo de seleção em 60%."
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
              MM
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Mayderson Mello
              </p>
              <p className="text-xs text-zinc-500">
                Senior Software Engineer — TechCorp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AuthHeroPanel };
