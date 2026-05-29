import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Petit — home" className="inline-flex items-center">
          <LogoMark height={36} />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
