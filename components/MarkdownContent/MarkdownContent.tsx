import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveImagePath } from "@/lib/markdown";
import styles from "./MarkdownContent.module.css";

interface MarkdownContentProps {
  slug: string;
  body: string;
}

export default function MarkdownContent({ slug, body }: MarkdownContentProps) {
  return (
    <section className={styles.section}>
      <div className={`container-md ${styles.prose}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => {
              if (!src || typeof src !== "string") return null;
              const resolved = resolveImagePath(slug, src);
              return (
                <span className={styles.imageBlock}>
                  <Image
                    src={resolved}
                    alt={alt ?? ""}
                    width={1600}
                    height={900}
                    sizes="(min-width: 56rem) 56rem, 100vw"
                    className={styles.image}
                  />
                </span>
              );
            },
            a: ({ href, children }) => {
              const external = href?.startsWith("http");
              return (
                <a
                  href={href}
                  className={styles.link}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer noopener" : undefined}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </section>
  );
}
