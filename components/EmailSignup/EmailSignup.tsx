"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./EmailSignup.module.css";

interface EmailSignupProps {
  buttonLabel?: string;
  placeholder?: string;
  tags?: string[];
  source?: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function EmailSignup({
  buttonLabel = "Get notified",
  placeholder = "you@company.com",
  tags,
  source,
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tags, source }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <input
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className={styles.input}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={styles.button}
        >
          {status === "loading" ? "Sending…" : buttonLabel}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.p
            key="success"
            className={`${styles.message} ${styles.success}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Thanks — you're on the list.
          </motion.p>
        )}
        {status === "error" && message && (
          <motion.p
            key="error"
            className={`${styles.message} ${styles.error}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
