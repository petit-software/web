import LandingHeader from "@/components/LandingHeader";
import Logo from "@/components/Logo";

export default function TempPage() {
  return (
    <>
      <LandingHeader showLogo={false} />
      <main className="relative flex min-h-dvh flex-col items-center justify-center">
        <Logo />
      </main>
    </>
  );
}
