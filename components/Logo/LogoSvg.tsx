"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { LogoSvgData } from "./parseLogo";

interface LogoSvgProps {
  data: LogoSvgData;
  width: number;
  height: number;
  className?: string;
}

const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: 0.1 + i * 0.15,
        duration: 1.6,
        ease: [0.65, 0, 0.35, 1],
      },
      opacity: {
        delay: 0.1 + i * 0.15,
        duration: 0.3,
      },
    },
  }),
};

const glyphVariants: Variants = {
  hidden: { opacity: 0, y: 2 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.9 + i * 0.04,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function LogoSvg({ data, width, height, className }: LogoSvgProps) {
  const reduce = useReducedMotion();

  let lineIndex = 0;
  let glyphIndex = 0;

  return (
    <motion.svg
      viewBox={data.viewBox}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Petit"
      className={className}
      initial={reduce ? "visible" : "hidden"}
      animate="visible"
      style={{ display: "block" }}
    >
      {data.paths.map((p, i) => {
        const isLine = p.stroke != null;
        const isGlyph = p.fill === "black";
        const variants = isLine ? lineVariants : isGlyph ? glyphVariants : undefined;
        const custom = isLine ? lineIndex++ : isGlyph ? glyphIndex++ : 0;

        return (
          <motion.path
            key={i}
            d={p.d}
            fill={p.fill ?? "none"}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeLinecap={p.strokeLinecap}
            variants={variants}
            custom={custom}
          />
        );
      })}
    </motion.svg>
  );
}
