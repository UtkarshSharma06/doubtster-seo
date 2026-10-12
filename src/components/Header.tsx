import Link from "next/link";
import { Clock } from "./Clock";

type Props = {
  /** Highlight the blog link. */
  blog?: boolean;
  /** Right-hand link, defaults to "start trial". */
  cta?: { href: string; label: string; external?: boolean };
  /** Adds the reading progress bar under the menu. Give the inner <i> an id the page script can drive. */
  progress?: boolean;
};

export function Header({ blog, cta = { href: "https://app.doubtster.com", label: "start trial", external: true }, progress }: Props) {
  const isExternal = cta.external ?? cta.href.startsWith("http");
  return (
    <header className="bar">
      <div className="in">
        <Link className="brand" href="/" aria-label="Doubtster home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark.png" alt="Doubtster" height={22} />
        </Link>
        <nav aria-label="Main">
          <Link href="/#features">features</Link>
          <Link href="/#pricing">pricing</Link>
          <Link href="/#faq">faq</Link>
          <Link href="/blog" aria-current={blog ? "page" : undefined}>blog</Link>
        </nav>
        <div className="logo" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-128.png" alt="" width={28} height={28} />
        </div>
        <div className="r">
          <span><Clock /></span>
          <a href="https://app.doubtster.com" target="_blank" rel="noopener noreferrer">log in</a>
          {isExternal ? (
            <a href={cta.href} target="_blank" rel="noopener noreferrer">{cta.label}</a>
          ) : (
            <Link href={cta.href}>{cta.label}</Link>
          )}
        </div>
        {progress && (
          <div className="pbar" aria-hidden="true">
            <i id="pbar" />
          </div>
        )}
      </div>
    </header>
  );
}
