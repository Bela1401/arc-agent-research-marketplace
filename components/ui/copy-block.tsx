"use client";

import { useState } from "react";

interface CopyBlockProps {
  title: string;
  eyebrow?: string;
  description: string;
  value: string;
}

export function CopyBlock({ title, eyebrow, description, value }: CopyBlockProps) {
  const [copyState, setCopyState] = useState<"idle" | "done" | "error">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("done");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  return (
    <article className="copy-block">
      <div className="copy-block__header">
        <div>
          {eyebrow ? <span className="eyebrow eyebrow--soft">{eyebrow}</span> : null}
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <button className="button button--ghost" onClick={handleCopy} type="button">
          {copyState === "done" ? "Copied" : copyState === "error" ? "Retry copy" : "Copy text"}
        </button>
      </div>
      <pre className="copy-block__body">{value}</pre>
    </article>
  );
}
