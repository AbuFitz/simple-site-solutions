import { PAGE_MODULES } from "../three/kit/pageTextures";

/**
 * Pure CSS composition of the assembled page. It is the first frame of the hero,
 * and the whole experience when WebGL is unavailable, reduced, or data-saving.
 */
export function PagePoster({ tilt = true, className = "" }: { tilt?: boolean; className?: string }) {
  const total = PAGE_MODULES.reduce((a, m) => a + m.h, 0);
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`} style={{ perspective: "1400px" }}>
      <div
        className="relative aspect-[3.2/6] h-[78%] max-h-[78%]"
        style={{
          transform: tilt ? "rotateY(-24deg) rotateX(7deg) rotateZ(0.4deg)" : undefined,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute -inset-[40%] -z-10 rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, hsl(158 82% 58% / 0.28), transparent)" }}
        />
        <div className="flex h-full flex-col gap-[1.2%]">
          {PAGE_MODULES.map((m, i) => (
            <div
              key={m.key}
              className="relative overflow-hidden rounded-[7px] bg-[#ece9df] shadow-[0_1px_0_#c9c5b6,0_14px_30px_-16px_rgba(0,0,0,0.8)]"
              style={{ flex: `${m.h / total} 1 0` }}
            >
              <div className="absolute inset-0 p-[7%]">
                {m.key === "hero" ? (
                  <div className="flex h-full gap-[7%]">
                    <div className="flex-1 space-y-[6%] pt-[6%]">
                      <div className="h-[11%] w-[90%] rounded-full bg-[#0c100e]" />
                      <div className="h-[11%] w-[62%] rounded-full bg-[#1fa878]" />
                      <div className="h-[5%] w-[85%] rounded-full bg-[#0c100e]/15" />
                      <div className="h-[13%] w-[44%] rounded-full bg-[#1fa878]" />
                    </div>
                    <div className="w-[34%] rounded-xl bg-gradient-to-br from-[#0e1a15] to-[#1f6f52]" />
                  </div>
                ) : m.key === "services" || m.key === "work" ? (
                  <div className="grid h-full grid-cols-3 gap-[4%] pt-[10%]">
                    {[0, 1, 2].map((n) => (
                      <div key={n} className={`rounded-lg ${m.key === "work" ? "bg-[#0c100e]/20" : "border border-[#0c100e]/15"}`} />
                    ))}
                  </div>
                ) : m.key === "cta" ? (
                  <div className="h-full rounded-xl bg-gradient-to-r from-[#1fa878] to-[#4df2b2]" />
                ) : (
                  <div className="flex h-full items-center gap-[4%]">
                    <div className="h-[28%] w-[8%] rounded-md bg-[#1fa878]" />
                    <div className="h-[16%] w-[26%] rounded-full bg-[#0c100e]/60" />
                    <div className="ml-auto h-[22%] w-[18%] rounded-full bg-[#1fa878]" />
                  </div>
                )}
              </div>
              <span className="sr-only">{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
