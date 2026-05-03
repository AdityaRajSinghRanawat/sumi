import React from "react";
import { Highlighter } from "@/components/ui/highlighter";
import GradientText from "@/components/GradientText";

const DecisionSection = () => {
  return (
    <section className="w-full bg-slate-950 py-28 text-slate-50">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <h2 className="mx-auto max-w-6xl text-center overflow-visible text-balance text-4xl font-extrabold leading-[1.6] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Buying a{' '}
          <Highlighter action="underline" color="#10b981" strokeWidth={7} padding={0}>
            <GradientText
              className="font-cigra text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-snug"
              colors={["#10b981", "#34d399"]}
              animationSpeed={3}
              direction="horizontal"
              yoyo={true}
            >
              home
            </GradientText>
          </Highlighter>{' '}
          is more than a{' '}
          <Highlighter action="underline" color="#ff2d55" strokeWidth={7} padding={0}>
            <GradientText
              className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-snug"
              colors={["#ff2d55", "#f43f5e", "#ff7aa2"]}
              animationSpeed={3}
              direction="horizontal"
              yoyo={true}
            >
              decision
            </GradientText>
          </Highlighter>
        </h2>

        <div className="mt-12 w-full">
          <div className="mt-16 w-full">
            <div className="w-full border-t border-b border-slate-800">
              <div className="w-full divide-y divide-slate-800">
                <div className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <span className="block text-3xl sm:text-4xl md:text-5xl text-slate-300">its where your days{' '}
                      <Highlighter action="underline" color="#f97316" strokeWidth={3} padding={0}>
                        <GradientText
                          className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                          colors={["#f97316", "#fbbf24"]}
                          animationSpeed={2.5}
                          direction="horizontal"
                          yoyo={true}
                        >
                          begin
                        </GradientText>
                      </Highlighter>
                    </span>
                  </div>
                </div>

                <div className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <span className="block text-3xl sm:text-4xl md:text-5xl text-slate-300">where you{' '}
                      <Highlighter action="underline" color="#06b6d4" strokeWidth={3} padding={0}>
                        <GradientText
                          className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                          colors={["#06b6d4", "#60a5fa"]}
                          animationSpeed={2.5}
                          direction="horizontal"
                          yoyo={true}
                        >
                          commute
                        </GradientText>
                      </Highlighter>{' '}from</span>
                  </div>
                </div>

                <div className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <span className="block text-3xl sm:text-4xl md:text-5xl text-slate-300">where your children{' '}
                      <Highlighter action="underline" color="#ff2d55" strokeWidth={3} padding={0}>
                        <GradientText
                          className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                          colors={["#ff2d55", "#ff7aa2"]}
                          animationSpeed={2.5}
                          direction="horizontal"
                          yoyo={true}
                        >
                          study
                        </GradientText>
                      </Highlighter>
                    </span>
                  </div>
                </div>

                <div className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <span className="block text-3xl sm:text-4xl md:text-5xl text-slate-300">where{' '}
                      <Highlighter action="underline" color="#fb923c" strokeWidth={3} padding={0}>
                        <GradientText
                          className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                          colors={["#fb923c", "#fbbf24"]}
                          animationSpeed={2.5}
                          direction="horizontal"
                          yoyo={true}
                        >
                          life settle
                        </GradientText>
                      </Highlighter>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecisionSection;
