import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";
import { resolveImagePath } from "@/lib/markdown";
import styles from "./MarkdownContent.module.css";

interface MarkdownContentProps {
  slug: string;
  body: string;
}

const DIRECTIVE_NAMES = new Set([
  "full-width",
  "wide",
  "columns",
  "column",
  "callout",
  "button",
  "buttons",
]);

const remarkLandingDirectives: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node) => {
    if (
      node.type !== "containerDirective" &&
      node.type !== "leafDirective" &&
      node.type !== "textDirective"
    ) {
      return;
    }
    const directive = node as typeof node & {
      name: string;
      attributes?: Record<string, string>;
      data?: Record<string, unknown>;
    };
    if (!DIRECTIVE_NAMES.has(directive.name)) return;

    const data = directive.data ?? (directive.data = {});
    const { class: extraClass, variant, href, ...rest } = directive.attributes ?? {};
    const variantClass = variant ? ` md-${directive.name}--${variant}` : "";
    const className = `md-${directive.name}${variantClass}${extraClass ? ` ${extraClass}` : ""}`;

    if (directive.name === "button") {
      const target = href ?? "#signup";
      const external = /^https?:\/\//.test(target);
      const baseVariant = variant ?? "cta";
      data.hName = "a";
      data.hProperties = {
        ...rest,
        href: target,
        className: `md-button md-button--${baseVariant}${extraClass ? ` ${extraClass}` : ""}`,
        ...(external ? { target: "_blank", rel: "noreferrer noopener" } : {}),
      };
      return;
    }

    const tag = node.type === "textDirective" ? "span" : "div";
    data.hName = tag;
    data.hProperties = {
      ...rest,
      className,
    };

    if (directive.name === "full-width") {
      visit(node, "image", (img) => {
        const imgData = img.data ?? (img.data = {});
        const props = (imgData.hProperties ?? {}) as Record<string, unknown>;
        imgData.hProperties = { ...props, "data-full-width": "true" };
      });
    }
  });
};

export default function MarkdownContent({ slug, body }: MarkdownContentProps) {
  return (
    <section className={styles.section}>
      <div className={`container-md ${styles.prose}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkDirective, remarkLandingDirectives]}
          components={{
            img: ({ src, alt, ...rest }) => {
              if (!src || typeof src !== "string") return null;
              const resolved = resolveImagePath(slug, src);
              const fullWidth =
                (rest as Record<string, unknown>)["data-full-width"] === "true";
              return (
                <span
                  className={`${styles.imageBlock}${
                    fullWidth ? ` ${styles.imageBlockFullWidth}` : ""
                  }`}
                >
                  <Image
                    src={resolved}
                    alt={alt ?? ""}
                    width={fullWidth ? 2400 : 1600}
                    height={fullWidth ? 1200 : 900}
                    sizes={fullWidth ? "100vw" : "(min-width: 56rem) 56rem, 100vw"}
                    className={styles.image}
                  />
                </span>
              );
            },
            a: ({ href, children, className, node: _node, ...rest }) => {
              const external = href?.startsWith("http");
              const isButton =
                typeof className === "string" && className.includes("md-button");
              return (
                <a
                  href={href}
                  className={isButton ? className : styles.link}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer noopener" : undefined}
                  {...rest}
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
