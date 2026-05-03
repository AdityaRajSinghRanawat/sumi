import { AuroraText } from "@/components/ui/aurora-text";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import BorderMagicLink from "@/components/ui/border-magic-link";
import BorderGlow from "@/components/BorderGlow";

const BORDER_MAGIC_COLORS = [
  "#eff6ff",
  "#60a5fa",
  "#3b82f6",
  "#8b5cf6",
  "#eff6ff",
];

const LandingPage = () => {
  return (
    <section className="relative min-h-screen overflow-hidden text-slate-50 font-dx-grafik">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_16%,rgba(125,211,252,0.18)_0%,rgba(59,130,246,0.07)_24%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.45)_0%,rgba(2,6,23,0.62)_55%,rgba(2,6,23,0.9)_100%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 pb-14 pt-28 sm:px-10 lg:px-16">
        <main className="w-full text-center">
          <h1 className="mx-auto max-w-6xl overflow-visible text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="inline-flex flex-wrap items-center justify-center gap-2 pb-1 md:gap-3">
              <LayoutTextFlip
                text="Find the right place to"
                words={["Live", "Study", "Work"]}
                duration={2200}
                textClassName="text-white/95 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl"
                wordContainerClassName="overflow-visible rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(9,14,31,0.82)_0%,rgba(4,8,20,0.86)_100%)] backdrop-blur-xl px-6 py-4 text-4xl leading-[1.15] shadow-[0_20px_50px_rgba(2,6,23,0.42)] ring-1 ring-white/10 sm:text-5xl md:text-6xl lg:text-7xl font-extrabold"
                wordClassName="font-extrabold tracking-tight leading-[1.16] font-cigra"
                wordColors={[
                  ["#06b6d4", "#1e40af"],
                  ["#10b981", "#065f46"],
                  ["#fb923c", "#92400e"],
                ]}
              />
            </span>
            <span className="mt-7 block overflow-visible text-4xl font-semibold leading-[1.05] text-white sm:text-5xl md:text-5xl lg:text-6xl">
              <span className="font-semibold text-white" style={{ color: "#ffffff", opacity: 1 }}>
                in{" "}
              </span>
              <AuroraText
                className="font-bold text-5xl font-dx-aiter sm:text-6xl md:text-6xl lg:text-7xl"
                colors={["#fb7185", "#f43f5e", "#be123c", "#f97316"]}
                speed={1.05}
              >
                Japan
              </AuroraText>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
            <span className="block text-slate-300">
              Interactive property discovery with{" "}
              <AuroraText
                className="font-bold"
                colors={["#60a5fa", "#3b82f6", "#8b5cf6"]}
                speed={1.1}
                angle={45}
              >
                AI-based
              </AuroraText>{" "}
              scoring,
            </span>
            <span className="block text-slate-300">
              earthquake risk, transport access, hospitals, and universities nearby.
            </span>
          </p>

          <div className="mt-6 flex justify-center">
            <BorderMagicLink to="/explore" ariaLabel="Find now" colors={BORDER_MAGIC_COLORS}>
              Find Now
            </BorderMagicLink>
          </div>

          <div className="mt-10 flex flex-wrap items-start justify-center gap-6">
            <BorderGlow className="w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
              <div className="flex items-center gap-4 p-4">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: "linear-gradient(45deg,#06b6d4 0%,#2563eb 100%)" }}>
                    <i className="fa-solid fa-map text-xl text-white" aria-hidden />
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Interactive</div>
                  <div className="text-sm text-white/70">Map Exploration</div>
                </div>
              </div>
            </BorderGlow>

            <BorderGlow className="w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
              <div className="flex items-center gap-4 p-4">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: "linear-gradient(45deg,#16a34a 0%,#059669 60%,#065f46 100%)" }}>
                    <i className="fa-solid fa-shield-halved text-xl text-white" aria-hidden />
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Safety</div>
                  <div className="text-sm text-white/70">Risk Visibility</div>
                </div>
              </div>
            </BorderGlow>

            <BorderGlow className="w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
              <div className="flex items-center gap-4 p-4">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: "linear-gradient(45deg,#c7b3ff 0%,#8b5cf6 50%,#5b21b6 100%)" }}>
                    <i className="fa-solid fa-filter text-xl text-white" aria-hidden />
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Smart</div>
                  <div className="text-sm text-white/70">Location Filters</div>
                </div>
              </div>
            </BorderGlow>

            <BorderGlow className="w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
              <div className="flex items-center gap-4 p-4">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: "linear-gradient(45deg,#fb923c 0%,#f97316 100%)" }}>
                    <i className="fa-solid fa-hospital text-xl text-white" aria-hidden />
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Nearby</div>
                  <div className="text-sm text-white/70">Schools &amp; Hospitals</div>
                </div>
              </div>
            </BorderGlow>
          </div>
        </main>
      </div>
    </section>
  );
};

export default LandingPage;