import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";
import { AlertTriangleIcon, InfoIcon, LightbulbIcon } from "lucide-react";
import { resolveImagePath } from "@/lib/markdown";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
    const { class: _extraClass, variant, href, ...rest } = directive.attributes ?? {};

    if (directive.name === "button") {
      const target = href ?? "#signup";
      const external = /^https?:\/\//.test(target);
      data.hName = "a";
      data.hProperties = {
        ...rest,
        href: target,
        "data-md-button": variant ?? "default",
        ...(external ? { target: "_blank", rel: "noreferrer noopener" } : {}),
      };
      return;
    }

    const tag = node.type === "textDirective" ? "span" : "div";
    data.hName = tag;
    data.hProperties = {
      ...rest,
      "data-md-directive": directive.name,
      ...(variant ? { "data-variant": variant } : {}),
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

const BUTTON_VARIANT_MAP: Record<string, "default" | "secondary" | "outline" | "ghost" | "destructive" | "link"> = {
  default: "default",
  cta: "default",
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  warn: "destructive",
  link: "link",
};

function calloutIcon(variant: string | undefined) {
  if (variant === "warn") return <AlertTriangleIcon />;
  if (variant === "note") return <InfoIcon />;
  return <LightbulbIcon />;
}

function columnGridClass(variant: string | undefined) {
  if (variant === "halves") return "md:grid-cols-2";
  if (variant === "thirds") return "md:grid-cols-3";
  return "md:grid-cols-2 lg:grid-cols-3";
}

export default function MarkdownContent({ slug, body }: MarkdownContentProps) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkDirective, remarkLandingDirectives]}
          components={{
            img: ({ src, alt, ...rest }) => {
              if (!src || typeof src !== "string") return null;
              const resolved = resolveImagePath(slug, src);
              const fullWidth = (rest as Record<string, unknown>)["data-full-width"] === "true";
              return (
                <Image
                  src={resolved}
                  alt={alt ?? ""}
                  width={fullWidth ? 2400 : 1600}
                  height={fullWidth ? 1200 : 900}
                  sizes={fullWidth ? "100vw" : "(min-width: 56rem) 56rem, 100vw"}
                  className="my-6 h-auto w-full rounded-xl border"
                />
              );
            },
            a: ({ href, children, node: _node, ...rest }) => {
              const buttonVariant = (rest as Record<string, unknown>)["data-md-button"] as
                | string
                | undefined;
              const external = href?.startsWith("http");
              if (buttonVariant) {
                const variant = BUTTON_VARIANT_MAP[buttonVariant] ?? "default";
                return (
                  <Button asChild variant={variant} className="no-underline">
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer noopener" : undefined}
                    >
                      {children}
                    </a>
                  </Button>
                );
              }
              return (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer noopener" : undefined}
                  {...rest}
                >
                  {children}
                </a>
              );
            },
            div: ({ children, node: _node, ...rest }) => {
              const dir = (rest as Record<string, unknown>)["data-md-directive"] as
                | string
                | undefined;
              const variant = (rest as Record<string, unknown>)["data-variant"] as
                | string
                | undefined;
              switch (dir) {
                case "callout":
                  return (
                    <Alert className="not-prose my-6">
                      {calloutIcon(variant)}
                      <AlertDescription>{children}</AlertDescription>
                    </Alert>
                  );
                case "full-width":
                  return (
                    <div className="not-prose my-12 -mx-6 md:-mx-12 lg:-mx-24">{children}</div>
                  );
                case "wide":
                  return (
                    <div className="not-prose mx-auto my-12 max-w-5xl px-6">{children}</div>
                  );
                case "columns":
                  return (
                    <div
                      className={`not-prose my-8 grid grid-cols-1 gap-6 ${columnGridClass(variant)}`}
                    >
                      {children}
                    </div>
                  );
                case "column":
                  return <div className="flex flex-col gap-3">{children}</div>;
                case "buttons":
                  return (
                    <div className="not-prose my-6 flex flex-wrap gap-3">{children}</div>
                  );
              }
              return <div {...rest}>{children}</div>;
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </article>
    </section>
  );
}
