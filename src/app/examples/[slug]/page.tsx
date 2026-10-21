import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/landing";
import JsonLd from "@/components/JsonLd";
import { EXAMPLES, UPLOAD_DATE, getExample } from "@/lib/examples";
import { abs, appUrl } from "@/lib/site";
import "@/styles/landing.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EXAMPLES.map((e) => ({ slug: e.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = getExample((await params).slug);
  if (!e) return {};
  const url = `/examples/${e.slug}`;
  return {
    title: { absolute: `${e.seoTitle} | Doubtster` },
    description: e.description,
    keywords: e.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "video.other",
      url,
      title: e.seoTitle,
      description: e.description,
      images: [{ url: `/media/${e.video}.jpg`, width: 960, height: 540, alt: e.title }],
      videos: [{ url: `/media/${e.video}.mp4`, type: "video/mp4", width: 960, height: 540 }],
    },
    twitter: { card: "summary_large_image", title: e.seoTitle, description: e.description, images: [`/media/${e.video}.jpg`] },
  };
}

export default async function ExamplePage({ params }: Props) {
  const e = getExample((await params).slug);
  if (!e) notFound();
  const url = abs(`/examples/${e.slug}`);
  const transcript = e.chapters.map((c) => c.text).join(" ");
  const others = EXAMPLES.filter((x) => x.slug !== e.slug);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: e.title,
      description: e.description,
      thumbnailUrl: [abs(`/media/${e.video}.jpg`)],
      contentUrl: abs(`/media/${e.video}.mp4`),
      uploadDate: UPLOAD_DATE,
      duration: e.duration,
      inLanguage: "en",
      transcript,
      educationalLevel: e.subject === "coding" ? "University" : "High school and university",
      learningResourceType: "Video explanation",
      about: e.keywords.slice(0, 3),
      publisher: { "@id": abs("/#organization") },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Doubtster", item: abs("/") },
        { "@type": "ListItem", position: 2, name: "Example lessons", item: abs("/examples") },
        { "@type": "ListItem", position: 3, name: e.title, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main className="wp wrap" style={{ ["--c" as string]: e.color }}>
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="/">doubtster</a><span>/</span><a href="/examples">example lessons</a><span>/</span><span>{e.subject}</span>
        </nav>
        <span className="wp-sub">{e.subject} · video explanation · {e.durationLabel}</span>
        <h1 className="wp-h1">{e.title}</h1>
        <p className="wp-q"><b>The question:</b> {e.question}</p>

        <div className="win wp-player">
          <div className="tb"><i /><i /><i /><em>{e.slug}.mp4</em></div>
          <div className="bd">
            <video controls playsInline preload="metadata" poster={`/media/${e.video}.jpg`} width={960} height={540}>
              <source src={`/media/${e.video}.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="wp-answer"><b>Answer</b><p>{e.answer}</p></div>
        <p className="wp-lede">{e.description}</p>

        <section className="wp-tr" aria-labelledby="tr">
          <h2 id="tr">Step-by-step transcript</h2>
          {e.chapters.map((c, i) => (
            <div key={i} className="wp-ch">
              <h3>{c.heading}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </section>

        <div className="wp-cta">
          <h2>stuck on a different question?</h2>
          <p>Ask Doubtster in chat for free and get the steps. Turn it into a video like this one when you want to see it worked out.</p>
          <div className="btns"><a className="pill b" href={appUrl("/signup")}>start your trial</a><a className="pill" href={appUrl("/app")}>ask in chat, free</a></div>
        </div>

        <section aria-labelledby="more">
          <h2 id="more" className="wp-more">more example lessons</h2>
          <div className="wp-grid">
            {others.map((o) => (
              <a key={o.slug} className="wp-card" href={`/examples/${o.slug}`} style={{ ["--c" as string]: o.color }}>
                <img src={`/media/${o.video}.jpg`} alt={`${o.title}, video explanation`} width={480} height={270} loading="lazy" />
                <span className="wp-sub">{o.subject} · {o.durationLabel}</span>
                <h3>{o.title}</h3>
              </a>
            ))}
          </div>
        </section>
        <p className="ill">Made with the Doubtster video engine. AI explanations can contain mistakes, so check important answers with your teacher.</p>
      </main>
      <Footer />
    </>
  );
}
