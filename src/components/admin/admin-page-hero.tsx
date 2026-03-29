import { cn } from "@/lib/utils";

type HeroStat = {
  label: string;
  value: React.ReactNode;
  description?: string;
};

type AdminPageHeroProps = {
  badge: string;
  title: string;
  description: string;
  gradientClassName: string;
  stats?: HeroStat[];
  actions?: React.ReactNode;
  className?: string;
};

export function AdminPageHero({
  badge,
  title,
  description,
  gradientClassName,
  stats = [],
  actions,
  className,
}: AdminPageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/70 p-5 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8",
        gradientClassName,
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_26%)]" />
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <div className="eyebrow border-white/10 bg-white/10 text-slate-100">{badge}</div>
          <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            {description}
          </p>
          {actions ? <div className="mt-6 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        </div>

        {stats.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
                {stat.description ? (
                  <p className="mt-1 text-sm leading-6 text-slate-200">{stat.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
