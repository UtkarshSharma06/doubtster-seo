import type { Metadata } from "next";
import { Header, Footer } from "@/components/landing";
import JsonLd from "@/components/JsonLd";
import { EXAMPLES } from "@/lib/examples";
import { abs } from "@/lib/site";
import "@/styles/landing.css";

export const metadata: Metadata = {
  title: "Example Lessons: Step-by-Step Video Explanations",
  description:
    "Watch real Doubtster lessons: an integral by parts, a block on an incline with friction, the median of two sorted arrays and semiconservative DNA replication, each with a full transcript.",
  alternates: { canonical: "/examples" },
  openGraph: { url: "/examples", images: ["/media/maths-integration-by-parts.jpg"] },
};

export default function ExamplesIndex() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Doubtster", item: abs("/") },
            { "@type": "ListItem", position: 2, name: "Example lessons", item: abs("/examples") },
          ],
        }}
      />
      <Header />
      <main className="wp wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><a href="/">doubtster</a><span>/</span><span>example lessons</span></nav>
        <h1 className="wp-h1">example lessons, explained step by step</h1>
        <p className="wp-lede">Every lesson below was made by the Doubtster video engine: a voice explains each step and why, while the working is written on the board. Each page has the full video and transcript.</p>
        <div className="wp-grid">
          {EXAMPLES.map((e) => (
            <a key={e.slug} className="wp-card" href={`/examples/${e.slug}`} style={{ ["--c" as string]: e.color }}>
              <img src={`/media/${e.video}.jpg`} alt={`${e.title}, video explanation`} width={480} height={270} loading="lazy" />
              <span className="wp-sub">{e.subject} · {e.durationLabel}</span>
              <h2>{e.title}</h2>
              <p>{e.description}</p>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
