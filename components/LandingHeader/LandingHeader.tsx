import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./LandingHeader.module.css";

export default function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Petit — home">
          <LogoMark height={36} />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
