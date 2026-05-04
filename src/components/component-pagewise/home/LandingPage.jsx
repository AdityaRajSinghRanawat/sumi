import { useEffect, useRef } from "react";
import { AuroraText } from "@/components/ui/aurora-text";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import BorderMagicLink from "@/components/ui/border-magic-link";
import BorderGlow from "@/components/BorderGlow";
import { TextAnimate } from "@/components/ui/text-animate";
import gsap from "gsap";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion } from "motion/react";

const BORDER_MAGIC_COLORS = [
  "#eff6ff",
  "#60a5fa",
  "#3b82f6",
  "#8b5cf6",
  "#eff6ff",
];

const LandingPage = () => {
  const cardsRef = useRef(null);

  useEffect(() => {
    const root = cardsRef.current;
    if (!root) return;
    const cards = root.querySelectorAll('.landing-card');
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
    // sequence after hero pieces; use delay only (kept longer so navbar/hero finish first)
    tl.delay(2.6);
    tl.to(cards, { opacity: 1, y: 0, stagger: 0.12 });

    return () => tl.kill();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden text-slate-50 font-dx-grafik">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_16%,rgba(125,211,252,0.18)_0%,rgba(59,130,246,0.07)_24%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.45)_0%,rgba(2,6,23,0.62)_55%,rgba(2,6,23,0.9)_100%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 pb-14 pt-28 sm:px-10 lg:px-16">
        <main className="w-full text-center">
          <h1 className="mx-auto max-w-6xl overflow-visible text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="inline-flex flex-wrap items-center justify-center gap-2 pb-1 md:gap-3">
              <motion.div
                className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
              >
                <LayoutTextFlip
                text="Find the right place to "
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
              </motion.div>{" "}
            </span>
            <span className="mt-2 block overflow-visible text-4xl font-semibold leading-[1.05] text-white sm:text-5xl md:text-5xl lg:text-6xl">
              <BlurFade inView={false} direction="up" delay={0.6} duration={0.45}>
                <span className="inline-block">
                  <TextAnimate as="span" animation="blurInUp" by="character" duration={0.4} once className="inline-block">
                    <span className="font-semibold text-white" style={{ color: "#ffffff", opacity: 1 }}>in </span>
                  </TextAnimate>
                  <TextAnimate as="span" animation="blurInUp" by="character" duration={0.5} once className="inline-block">
                    <AuroraText
                      className="font-bold text-5xl font-dx-aiter sm:text-6xl md:text-6xl lg:text-7xl"
                      colors={["#fb7185", "#f43f5e", "#be123c", "#f97316"]}
                      speed={1.05}
                    >
                      Japan
                    </AuroraText>
                  </TextAnimate>
                </span>
              </BlurFade>
            </span>
          </h1>

          <BlurFade inView={false} direction="up" delay={1.3} duration={0.45}>
            <TextAnimate as="p" by="word" animation="slideUp" duration={0.45} once className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300">
              <span className="block text-slate-300">
                Interactive property discovery with{' '}
                <AuroraText
                  className="font-bold"
                  colors={["#60a5fa", "#3b82f6", "#8b5cf6"]}
                  speed={1.1}
                  angle={45}
                >
                  AI-based
                </AuroraText>{' '}
                scoring,
              </span>
              <span className="block text-slate-300">
                earthquake risk, transport access, hospitals, and universities nearby.
              </span>
            </TextAnimate>
          </BlurFade>

          <div className="mt-6 flex justify-center">
            <BlurFade inView={false} direction="up" delay={2.0} duration={0.45}>
              <div className="flex justify-center">
                <BorderMagicLink to="/explore" ariaLabel="Find now" colors={BORDER_MAGIC_COLORS}>
                  Find Now
                </BorderMagicLink>
              </div>
            </BlurFade>
          </div>

          <div ref={cardsRef} className="mt-10 flex flex-wrap items-start justify-center gap-6">
            <BorderGlow className="landing-card w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
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


            <BorderGlow className="landing-card w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
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


            <BorderGlow className="landing-card w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
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


            <BorderGlow className="landing-card w-56 p-0 sm:w-64" borderRadius={16} colors={BORDER_MAGIC_COLORS} glowColor="232 95 72">
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