import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, bySlug } from "@/content/articles";
import { CATS, boardLines } from "@/lib/blog";
import { CARD_STYLE } from "@/components/blog/cardStyle";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHero } from "@/components/post/ArticleHero";
import { ArticleBody } from "@/components/post/ArticleBody";
import { ReadingTools } from "@/components/post/ReadingTools";
import "@/styles/post.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = bySlug((await params).slug);
  if (!a) return {};
  return {
    title: `${a.title} | Doubtster Blog`,
    description: a.excerpt,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { title: a.title, description: a.excerpt, type: "article" },
  };
}

const lines = (slug: string) => boardLines(slug).map((l, k) => <span key={l + k}>{l}</span>);

export default async function ArticlePage({ params }: Props) {
  const a = bySlug((await params).slug);
  if (!a) notFound();
  const i = ARTICLES.indexOf(a);
  const next = ARTICLES[(i + 1) % ARTICLES.length];
  const prev = ARTICLES[(i - 1 + ARTICLES.length) % ARTICLES.length];
  const cat = CATS[a.cat];
  const related = ARTICLES.filter((x) => x !== a && x !== next && x.cat !== a.cat).slice(0, 3);
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt, articleSection: cat.label };
  const secs = a.sections.map((s) => ({ id: s.id, heading: s.heading }));

  return (
    <div className="pg-post">
      <a className="skip" href="#main">Skip to article</a>
      <Header blog progress />
      <main id="main">
        <ArticleHero a={a} />

        <div className="cols3">
          <ReadingTools sections={secs} title={a.title} slug={a.slug} />
          <ArticleBody a={a} />
          <aside className="glance" aria-label="At a glance">
            <div className="note-y">
              <h2>at a glance</h2>
              <dl>
                <dt>Topic</dt><dd>{cat.label}</dd>
                {a.subject && (<><dt>Subject</dt><dd>{a.subject}</dd></>)}
                <dt>Reading time</dt><dd>{a.minutes} minutes</dd>
              </dl>
              <ul>{a.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </aside>
        </div>

        <section className="after" aria-label="Keep reading">
          <Link href={`/blog/${next.slug}`} className="upnext">
            <div className="win">
              <div className="tb"><i /><i /><i /><em>up-next.md</em></div>
              <div className="bdy">
                <div className="bd2x" aria-hidden="true">{lines(next.slug)}</div>
                <div className="tx"><p className="eb">up next</p><h2>{next.title}</h2><p>{next.excerpt}</p></div>
              </div>
            </div>
          </Link>
          <p className="prev">Previous: <Link href={`/blog/${prev.slug}`}>{prev.title}</Link></p>
          <h2 className="rel">more to read</h2>
          <div className="rg">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="gc" style={{ ["--c" as string]: CARD_STYLE[r.cat].fg }}>
                <div className="win">
                  <div className="tb"><i /><i /><i /><em>{r.slug.slice(0, 22)}.md</em></div>
                  <div className="in2">
                    <p className="mt"><b>{CATS[r.cat].tag}</b><span>{r.minutes} min</span></p>
                    <h3>{r.title}</h3>
                    <p className="x">{r.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="cta sky">
          <div className="wrap">
            <h2>see it worked out on screen</h2>
            <p>Chat is always free. Videos start with a $1.99 trial.</p>
            <div className="btns">
              <a className="pill w" href="https://app.doubtster.com" target="_blank" rel="noopener noreferrer">start your trial</a>
              <Link className="pill" href="/blog">back to the blog</Link>
            </div>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </main>
      <Footer
        resources={[
          { href: "/blog", label: "blog" },
          { href: "/blog/start-here-how-doubtster-works", label: "start here" },
          { href: "/blog/credits-explained", label: "credits" },
        ]}
      />
    </div>
  );
}
