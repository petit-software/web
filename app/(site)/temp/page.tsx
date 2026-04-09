import Logo from "@/components/Logo";
import Button from "@/components/Button";
import styles from "./page.module.css";

export default function TempPage() {
  return (
    <main className={styles.page}>
      <Logo />

      <footer className={styles.footer}>
        <div className={`centered-text ${styles.footerWrapper}`}>
          <h2 className={`type-title ${styles.footerHeading}`}>Software for Individuals and Businesses</h2>
          <Button variant="primary" disabled>Coming soon</Button>
        </div>
        <p className="type-small centered-text text-tertiary">
          Petit Software &copy; {new Date().getFullYear()}, <br /> Zurich, Switzerland.
        </p>
      </footer>
    </main>
  );
}
