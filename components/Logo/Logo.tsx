import LogoSvg from "./LogoSvg";
import { loadLogoSvg } from "./parseLogo";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 368, height = 155, className }: LogoProps) {
  const data = loadLogoSvg();
  return <LogoSvg data={data} width={width} height={height} className={className} />;
}
