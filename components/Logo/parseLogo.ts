import fs from "node:fs";
import path from "node:path";

export interface LogoPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "round" | "butt" | "square";
}

export interface LogoSvgData {
  viewBox: string;
  paths: LogoPath[];
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

let cached: LogoSvgData | null = null;

export function loadLogoSvg(): LogoSvgData {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "public/images/petit-label.svg");
  const raw = fs.readFileSync(filePath, "utf-8");

  const viewBoxMatch = raw.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 129 54";

  const paths: LogoPath[] = [];
  const pathRe = /<path\s+([^/]+?)\s*\/>/g;
  let m: RegExpExecArray | null;
  while ((m = pathRe.exec(raw)) !== null) {
    const attrs = parseAttrs(m[1]);
    if (!attrs.d) continue;
    paths.push({
      d: attrs.d,
      fill: attrs.fill,
      stroke: attrs.stroke,
      strokeWidth: attrs["stroke-width"] ? Number(attrs["stroke-width"]) : undefined,
      strokeLinecap: attrs["stroke-linecap"] as LogoPath["strokeLinecap"],
    });
  }

  cached = { viewBox, paths };
  return cached;
}
