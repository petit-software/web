import fs from "node:fs";
import path from "node:path";

interface SharedAttrs {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "round" | "butt" | "square";
  transform?: string;
}

export interface LogoPath extends SharedAttrs {
  type: "path";
  d: string;
}

export interface LogoEllipse extends SharedAttrs {
  type: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export type LogoShape = LogoPath | LogoEllipse;

export interface LogoSvgData {
  viewBox: string;
  shapes: LogoShape[];
}

function parseAttrs(input: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([\w-]+)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    out[m[1]] = m[2];
  }
  return out;
}

function themeColor(value: string | undefined): string | undefined {
  if (!value) return value;
  const v = value.toLowerCase();
  if (v === "black" || v === "#000" || v === "#000000") return "currentColor";
  return value;
}

function readShared(attrs: Record<string, string>): SharedAttrs {
  return {
    fill: themeColor(attrs.fill),
    stroke: themeColor(attrs.stroke),
    strokeWidth: attrs["stroke-width"] ? Number(attrs["stroke-width"]) : undefined,
    strokeLinecap: attrs["stroke-linecap"] as SharedAttrs["strokeLinecap"],
    transform: attrs.transform,
  };
}

export function loadLogoSvg(): LogoSvgData {
  const filePath = path.join(process.cwd(), "public/images/petit-label.svg");
  const raw = fs.readFileSync(filePath, "utf-8");

  const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 380 160";

  const shapes: LogoShape[] = [];
  const elementRe = /<(path|ellipse)\s+([^/]+?)\s*\/>/g;
  let m: RegExpExecArray | null;
  while ((m = elementRe.exec(raw)) !== null) {
    const tag = m[1];
    const attrs = parseAttrs(m[2]);
    const shared = readShared(attrs);

    if (tag === "path") {
      if (!attrs.d) continue;
      shapes.push({ type: "path", d: attrs.d, ...shared });
    } else if (tag === "ellipse") {
      shapes.push({
        type: "ellipse",
        cx: Number(attrs.cx ?? 0),
        cy: Number(attrs.cy ?? 0),
        rx: Number(attrs.rx ?? 0),
        ry: Number(attrs.ry ?? 0),
        ...shared,
      });
    }
  }

  return { viewBox, shapes };
}
