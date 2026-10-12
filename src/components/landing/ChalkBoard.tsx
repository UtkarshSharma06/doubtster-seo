"use client";
import { useEffect, useRef } from "react";
import { Chalk as ChalkEngine, accelLesson, carLesson } from "@/lib/chalk";

type ChalkInstance = {
  paused: boolean;
  load(beats: unknown): void;
  showUpTo(i: number): void;
  playFrom(i: number, onBeat?: ((k: number) => void) | null, onEnd?: () => void): Promise<void>;
  hold(ms: number): Promise<boolean>;
  erase(): Promise<boolean>;
  stop(): void;
};
const Chalk = ChalkEngine as unknown as new (host: HTMLElement, cap: HTMLElement | null) => ChalkInstance;

/**
 * A wooden-frame chalkboard that writes a lesson as you watch.
 * "car": loops the depreciation lesson with captions, pauses when off screen.
 * "accel": plays the small acceleration example once when scrolled into view.
 */
export function ChalkBoard({ variant, id }: { variant: "car" | "accel"; id?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const cap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = board.current, fr = frame.current;
    if (!host || !fr) return;
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const ck = new Chalk(host, variant === "car" ? cap.current : null);
    const lesson = variant === "car" ? carLesson() : accelLesson();
    ck.load(lesson);
    let dead = false, vis = true;
    const observers: IntersectionObserver[] = [];
    const gate = () => { ck.paused = !vis || document.hidden; };

    const fonts = document.fonts?.ready
      ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))])
      : Promise.resolve();

    fonts.then(() => {
      if (dead) return;
      if (reduce) { ck.showUpTo(variant === "car" ? lesson.length : 1); return; }
      if (variant === "car") {
        const io = new IntersectionObserver((en) => { vis = en[0].isIntersecting; gate(); });
        io.observe(fr); observers.push(io);
        document.addEventListener("visibilitychange", gate);
        const cycle = () => {
          if (dead) return;
          ck.playFrom(0, null, () => {
            ck.hold(3800).then((ok: boolean) => {
              if (ok && !dead) ck.erase().then(() => ck.hold(500).then(cycle));
            });
          });
        };
        cycle();
      } else {
        const io = new IntersectionObserver((en, ob) => {
          if (en[0].isIntersecting) { ob.disconnect(); if (!dead) ck.playFrom(0); }
        });
        io.observe(fr); observers.push(io);
      }
    });

    return () => {
      dead = true;
      ck.stop();
      observers.forEach((o) => o.disconnect());
      document.removeEventListener("visibilitychange", gate);
      host.innerHTML = "";
      if (cap.current) cap.current.innerHTML = "";
    };
  }, [variant]);

  return (
    <div className="cb" id={id} ref={frame}>
      <div className="bd2">
        <div className="svgw" ref={board} />
        {variant === "car" && <div className="cap2" ref={cap} aria-live="off" />}
      </div>
      <div className="tray"><i /><i /><i /><b /></div>
    </div>
  );
}
