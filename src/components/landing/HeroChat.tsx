"use client";
import { useRef, useState } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";

const PHRASES = [
  "why does ice float?",
  "solve 2x + 5 = 17, step by step",
  "explain recursion with an example",
  "what is the difference between mitosis and meiosis?",
  "a car costs 30,000 and loses 15% a year. what is it worth after 6 years?",
];
const CHIPS = ["why does ice float?", "solve 2x + 5 = 17", "explain recursion"];

/** The hero chat box. Types example questions until the visitor clicks in, then sends them to app.doubtster.com */
export function HeroChat() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const paused = focused || value.length > 0;
  const typed = useTypewriter(PHRASES, paused);

  return (
    <div className="hchat" id="hchat">
      <div className="hc-top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/doubtster-icon.svg" alt="" />
        <span>ask doubtster</span>
        <span className="free">chat is free</span>
      </div>
      <form
        ref={form}
        action="https://app.doubtster.com"
        target="_blank"
        method="get"
        onSubmit={(e) => { if (!value.trim()) { e.preventDefault(); (form.current?.elements.namedItem("q") as HTMLElement | null)?.focus(); } }}
      >
        <div className="tw">
          {!paused && (
            <div className="ty" aria-hidden="true">
              {typed}
              <i />
            </div>
          )}
          <textarea
            name="q"
            rows={2}
            aria-label="Ask a question"
            maxLength={300}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.current?.requestSubmit(); }
            }}
          />
        </div>
        <button className="send" type="submit" aria-label="Ask">&#8593;</button>
      </form>
      <div className="chips">
        {CHIPS.map((c) => (
          <button key={c} type="button" onClick={() => setValue(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}
