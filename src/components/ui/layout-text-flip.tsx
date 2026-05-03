"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
  textClassName,
  wordContainerClassName,
  wordClassName,
  wordColors,
}: {
  text: string;
  words: string[];
  duration?: number;
  textClassName?: string;
  wordContainerClassName?: string;
  wordClassName?: string;
  wordColors?: Array<string[]>;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.span
        layoutId="subtext"
        className={cn(
          "text-2xl font-bold tracking-tight drop-shadow-lg md:text-4xl",
          textClassName,
        )}
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className={cn(
          "relative w-fit overflow-visible rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(6,11,23,0.82)_0%,rgba(9,14,31,0.72)_100%)] px-5 py-3 font-sans text-2xl font-bold tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_48px_rgba(0,0,0,0.42)] ring-1 ring-white/10 backdrop-blur-2xl backdrop-saturate-150 md:text-4xl",
          wordContainerClassName,
        )}
      >
        <span className="relative inline-grid place-items-center overflow-visible">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={currentIndex}
              initial={{ y: -40, filter: "blur(10px)" }}
              animate={{
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
              transition={{
                duration: 0.5,
              }}
              className={cn("inline-flex items-center whitespace-nowrap px-[0.12em] py-[0.12em] -mx-[0.12em] -my-[0.12em] leading-[1.24] [text-rendering:geometricPrecision] drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]", wordClassName)}
              style={(() => {
                const wc = wordColors && wordColors[currentIndex];
                if (!wc || !wc.length) return undefined;
                return {
                  backgroundImage: `linear-gradient(90deg, ${wc.join(',')})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                };
              })()}
            >
              {words[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </>
  );
};
