"use client";
import { useState, type CSSProperties } from "react";
import { NOTES } from "@/content/notes";

type Note = { id: string; tab: string; t: string; tb: string; file: string; title: string; html: string; cap: string; svg: string; cards: [string, string][] };

/** Tabbed "generated note" window: notes, a hand built diagram, and flip flashcards. */
export function NotesViewer() {
  const notes = NOTES as Note[];
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const n = notes[i];
  const vars = { "--t": n.t, "--tb": n.tb } as CSSProperties;

  return (
    <div className="win nwin">
      <div className="tb"><i /><i /><i /><em>{n.file}</em></div>
      <div className="bd">
        <div className="ntabs" role="tablist" aria-label="Subjects">
          {notes.map((x, j) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={j === i}
              className={j === i ? "on" : undefined}
              style={{ "--t": x.t, "--tb": x.tb } as CSSProperties}
              onClick={() => setI(j)}
            >
              <i />
              {x.tab}
            </button>
          ))}
        </div>
        <div className="nbody">
          <article className="nin" style={vars}>
            <span className="chip2">{n.tab}</span>
            <h4>{n.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: n.html }} />
          </article>
          <figure className="nfig">
            <div dangerouslySetInnerHTML={{ __html: n.svg }} />
            <figcaption>{n.cap}</figcaption>
          </figure>
        </div>
        <div className="ncards">
          <div className="nch"><b>flashcards from this note</b><span>click a card to flip it</span></div>
          <div className="cardrow" style={vars}>
            {n.cards.map((c, k) => {
              const key = `${n.id}-${k}`;
              return (
                <button
                  key={key}
                  type="button"
                  className={"fcd" + (flipped[key] ? " flip" : "")}
                  aria-label={`Flashcard ${k + 1}, click to flip`}
                  onClick={() => setFlipped((f) => ({ ...f, [key]: !f[key] }))}
                >
                  <span className="cfi">
                    <span className="cff"><small>QUESTION</small>{c[0]}</span>
                    <span className="cfb"><small>ANSWER</small>{c[1]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
