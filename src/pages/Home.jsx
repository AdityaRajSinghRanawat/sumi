import { Link } from "react-router-dom";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { AuroraText } from "@/components/ui/aurora-text";
import StaggeredMenu from "@/components/StaggeredMenu";
import ColorBends from "@/components/ColorBends";
import BorderGlow from "@/components/BorderGlow";

const HOME_MENU_ITEMS = [
  { label: "Open Explore", link: "/explore", ariaLabel: "Open explore" },
  {
    label: "List Property",
    link: "/list-property",
    ariaLabel: "List property",
  },
  { label: "Admin", link: "/admin", ariaLabel: "Open admin" },
];

const Home = () => {
  return (
    <section className="relative min-h-screen overflow-hidden text-slate-50 font-dx-grafik">
      <div className="absolute inset-0">
        <ColorBends
          className="h-full w-full"
          colors={["#3b82f6"]}
          rotation={61}
          speed={0.2}
          scale={1}
          autoRotate={0}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.15}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent={false}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(125,211,252,0.18)_0%,rgba(59,130,246,0.07)_24%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.45)_0%,rgba(2,6,23,0.62)_55%,rgba(2,6,23,0.9)_100%)]" />

      <div className="relative z-20 min-h-screen">
        <StaggeredMenu
          isFixed
          position="right"
          brandLabel="sumi."
          logoUrl=""
          menuButtonColor="#ffffff"
          openMenuButtonColor="#111111"
          colors={["#2563eb", "#8b5cf6", "#10b981"]}
          accentColor="var(--accent-500)"
          items={HOME_MENU_ITEMS}
          displaySocials={false}
          displayItemNumbering
        />

        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 pb-14 pt-28 sm:px-10 lg:px-16">
          <main className="w-full text-center">
            <h1 className="mx-auto max-w-6xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
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
              <span className="mt-7 block text-4xl font-semibold leading- sm:text-5xl md:text-5xl lg:text-6xl text-white">
                in{" "}
                <AuroraText
                  className="font-bold text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-dx-aiter"
                  colors={["#fb7185", "#f43f5e", "#be123c", "#f97316"]}
                  speed={1.05}
                >
                  Japan
                </AuroraText>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-white/90 leading-relaxed">
              <span className="block">
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
              <span className="block">
                earthquake risk, transport access, hospitals, and universities
                nearby.
              </span>
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                to="/explore"
                aria-label="Find now"
                className="relative inline-flex h-14 overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#eff6ff_0%,#60a5fa_18%,#3b82f6_42%,#8b5cf6_68%,#eff6ff_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-2 text-lg font-medium text-white backdrop-blur-3xl font-dx-grafik ">
                  Find Now
                </span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-start justify-center gap-6">
              <BorderGlow className="w-56 sm:w-64 p-0" borderRadius={16}>
                <div className="rounded-[16px] bg-[linear-gradient(180deg,rgba(9,14,31,0.6)_0%,rgba(4,8,20,0.4)_100%)] backdrop-blur-xl p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(45deg,#06b6d4 0%,#2563eb 100%)",
                      }}
                    >
                      <i
                        className="fa-solid fa-map text-xl text-white"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Interactive</div>
                    <div className="text-white/70 text-sm">Map Exploration</div>
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow className="w-56 sm:w-64 p-0" borderRadius={16}>
                <div className="rounded-[16px] bg-[linear-gradient(180deg,rgba(9,14,31,0.6)_0%,rgba(4,8,20,0.4)_100%)] backdrop-blur-xl p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(45deg,#16a34a 0%,#059669 60%,#065f46 100%)",
                      }}
                    >
                      <i
                        className="fa-solid fa-shield-halved text-xl text-white"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Safety</div>
                    <div className="text-white/70 text-sm">Risk Visibility</div>
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow className="w-56 sm:w-64 p-0" borderRadius={16}>
                <div className="rounded-[16px] bg-[linear-gradient(180deg,rgba(9,14,31,0.6)_0%,rgba(4,8,20,0.4)_100%)] backdrop-blur-xl p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(45deg,#c7b3ff 0%,#8b5cf6 50%,#5b21b6 100%)",
                      }}
                    >
                      <i
                        className="fa-solid fa-filter text-xl text-white"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Smart</div>
                    <div className="text-white/70 text-sm">
                      Location Filters
                    </div>
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow className="w-56 sm:w-64 p-0" borderRadius={16}>
                <div className="rounded-[16px] bg-[linear-gradient(180deg,rgba(9,14,31,0.6)_0%,rgba(4,8,20,0.4)_100%)] backdrop-blur-xl p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(45deg,#fb923c 0%,#f97316 100%)",
                      }}
                    >
                      <i
                        className="fa-solid fa-hospital text-xl text-white"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Nearby</div>
                    <div className="text-white/70 text-sm">
                      Schools &amp; Hospitals
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Home;
