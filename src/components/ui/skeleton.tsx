import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.4rem] bg-slate-200/70 before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.62),transparent)] before:animate-[shimmer_1.6s_infinite]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
