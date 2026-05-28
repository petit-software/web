"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { LogoShape, LogoSvgData } from "./parseLogo";

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

function isLine(shape: LogoShape) {
  return shape.stroke != null;
}

function isGlyph(shape: LogoShape) {
  return shape.stroke == null && shape.fill === "currentColor";
}

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
      {data.shapes.map((shape, i) => {
        const line = isLine(shape);
        const glyph = isGlyph(shape);
        const variants = line ? lineVariants : glyph ? glyphVariants : undefined;
        const custom = line ? lineIndex++ : glyph ? glyphIndex++ : 0;

        const common = {
          fill: shape.fill ?? "none",
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
          strokeLinecap: shape.strokeLinecap,
          transform: shape.transform,
          variants,
          custom,
        };

        if (shape.type === "ellipse") {
          return (
            <motion.ellipse
              key={i}
              cx={shape.cx}
              cy={shape.cy}
              rx={shape.rx}
              ry={shape.ry}
              {...common}
            />
          );
        }

        return <motion.path key={i} d={shape.d} {...common} />;
      })}
    </motion.svg>
  );
}
