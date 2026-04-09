import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 128, height = 128, className }: LogoProps) {
  return (
    <Image
      src="/images/logo.svg"
      alt="Petit"
      width={width}
      height={height}
      className={className}
      unoptimized
      priority
    />
  );
}
