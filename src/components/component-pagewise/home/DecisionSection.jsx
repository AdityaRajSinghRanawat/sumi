import React from "react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Highlighter } from "@/components/ui/highlighter";
import GradientText from "@/components/GradientText";
import { TextAnimate } from "@/components/ui/text-animate";
import { InlineReveal } from "@/components/ui/inline-reveal";

gsap.registerPlugin(ScrollTrigger);

const DecisionSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const items = sectionRef.current.querySelectorAll("[data-decision-item]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });

      tl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.12,
      });

      return () => tl.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-slate-950 text-slate-50">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="min-h-screen flex items-center justify-center py-12">
          <h2 className="mx-auto max-w-6xl text-center overflow-visible text-balance text-4xl font-extrabold leading-[1.6] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <TextAnimate
              as="span"
              animation="blurInUp"
              by="word"
              duration={0.35}
              once
              className="inline-block"
            >
              Buying a
            </TextAnimate>{" "}
            <Highlighter
              action="underline"
              color="#10b981"
              strokeWidth={7}
              padding={0}
            >
              <InlineReveal
                delay={0.08}
                duration={0.4}
                className="inline-flex flex-wrap justify-center gap-x-2 font-cigra text-4xl font-extrabold leading-snug sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <GradientText
                  className="font-cigra text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-snug"
                  colors={["#10b981", "#34d399"]}
                  animationSpeed={3}
                  direction="horizontal"
                  yoyo={true}
                >
                  home
                </GradientText>
              </InlineReveal>
            </Highlighter>{" "}
            <TextAnimate
              as="span"
              animation="blurInUp"
              by="word"
              duration={0.35}
              once
              className="inline-block"
            >
              is more than a
            </TextAnimate>{" "}
            <Highlighter
              action="underline"
              color="#ff2d55"
              strokeWidth={7}
              padding={0}
            >
              <InlineReveal
                delay={0.12}
                duration={0.4}
                className="inline-flex flex-wrap justify-center gap-x-2 font-bold text-4xl leading-snug sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <GradientText
                  className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-snug"
                  colors={["#ff2d55", "#f43f5e", "#ff7aa2"]}
                  animationSpeed={3}
                  direction="horizontal"
                  yoyo={true}
                >
                  decision
                </GradientText>
              </InlineReveal>
            </Highlighter>
          </h2>
        </div>

        <div className="w-full pb-28">
          <div className="mt-16 w-full">
            <div className="w-full border-t border-b border-slate-800">
              <div className="w-full divide-y divide-slate-800">
                <div data-decision-item className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <div className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
                      <TextAnimate
                        as="span"
                        animation="blurInUp"
                        by="character"
                        duration={0.3}
                        once
                        className="text-3xl sm:text-4xl md:text-5xl text-slate-300"
                      >
                        its where your days
                      </TextAnimate>
                      <Highlighter
                        action="underline"
                        color="#f97316"
                        strokeWidth={3}
                        padding={0}
                      >
                        <InlineReveal
                          delay={0.05}
                          duration={0.35}
                          className="inline-block font-cigra text-3xl leading-snug sm:text-4xl md:text-5xl"
                        >
                          <GradientText
                            className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                            colors={["#f97316", "#fbbf24"]}
                            animationSpeed={2.5}
                            direction="horizontal"
                            yoyo={true}
                          >
                            begin
                          </GradientText>
                        </InlineReveal>
                      </Highlighter>
                    </div>
                  </div>
                </div>

                <div data-decision-item className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <div className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
                      <TextAnimate
                        as="span"
                        animation="blurInUp"
                        by="character"
                        duration={0.3}
                        once
                        className="text-3xl sm:text-4xl md:text-5xl text-slate-300"
                      >
                        where you
                      </TextAnimate>
                      <Highlighter
                        action="underline"
                        color="#06b6d4"
                        strokeWidth={3}
                        padding={0}
                      >
                        <InlineReveal
                          delay={0.05}
                          duration={0.35}
                          className="inline-block font-cigra text-3xl leading-snug sm:text-4xl md:text-5xl"
                        >
                          <GradientText
                            className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                            colors={["#06b6d4", "#60a5fa"]}
                            animationSpeed={2.5}
                            direction="horizontal"
                            yoyo={true}
                          >
                            commute
                          </GradientText>
                        </InlineReveal>
                      </Highlighter>
                      <TextAnimate
                        as="span"
                        animation="blurInUp"
                        by="character"
                        duration={0.3}
                        once
                        className="text-3xl sm:text-4xl md:text-5xl text-slate-300"
                      >
                        from
                      </TextAnimate>
                    </div>
                  </div>
                </div>

                <div data-decision-item className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <div className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
                      <TextAnimate
                        as="span"
                        animation="blurInUp"
                        by="character"
                        duration={0.3}
                        once
                        className="text-3xl sm:text-4xl md:text-5xl text-slate-300"
                      >
                        where your children
                      </TextAnimate>
                      <Highlighter
                        action="underline"
                        color="#ff2d55"
                        strokeWidth={3}
                        padding={0}
                      >
                        <InlineReveal
                          delay={0.05}
                          duration={0.35}
                          className="inline-block font-cigra text-3xl leading-snug sm:text-4xl md:text-5xl"
                        >
                          <GradientText
                            className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                            colors={["#ff2d55", "#ff7aa2"]}
                            animationSpeed={2.5}
                            direction="horizontal"
                            yoyo={true}
                          >
                            study
                          </GradientText>
                        </InlineReveal>
                      </Highlighter>
                    </div>
                  </div>
                </div>

                <div data-decision-item className="py-10 flex justify-center">
                  <div className="max-w-4xl text-center">
                    <div className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
                      <TextAnimate
                        as="span"
                        animation="blurInUp"
                        by="character"
                        duration={0.3}
                        once
                        className="text-3xl sm:text-4xl md:text-5xl text-slate-300"
                      >
                        where
                      </TextAnimate>
                      <Highlighter
                        action="underline"
                        color="#22c55e"
                        strokeWidth={3}
                        padding={0}
                      >
                        <InlineReveal
                          delay={0.05}
                          duration={0.35}
                          className="inline-block font-cigra text-3xl leading-snug sm:text-4xl md:text-5xl"
                        >
                          <GradientText
                            className="font-cigra text-3xl sm:text-4xl md:text-5xl leading-snug"
                            colors={["#16a34a", "#4ade80"]}
                            animationSpeed={2.5}
                            direction="horizontal"
                            yoyo={true}
                          >
                            life settle
                          </GradientText>
                        </InlineReveal>
                      </Highlighter>
                    </div>
                   

                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
       <br />
                    <br />
                    <br />
                    <br /> <br />
                    <br />
                    <br />
                    <br /> <br />
                    <br />
                    <br />
                    <br /> <br />
                    <br />
                    <br />
                    <br /> <br />
                    <br />
                    <br />
                    <br />
    </section>
  );
};

export default DecisionSection;
