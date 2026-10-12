import Link from "next/link";
import { Clock } from "./Clock";

type Props = {
  /** Highlight the blog link. */
  blog?: boolean;
  /** Right-hand link, defaults to "start trial". */
  cta?: { href: string; label: string };
  /** Adds the reading progress bar under the menu. Give the inner <i> an id the page script can drive. */
  progress?: boolean;
};

export function Header({ blog, cta = { href: "/signup", label: "start trial" }, progress }: Props) {
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
          <Link href={cta.href}>{cta.label}</Link>
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
