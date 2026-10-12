import Link from "next/link";
import { Year } from "./Year";

export function Footer({ mark = true, resources }: { mark?: boolean; resources?: { href: string; label: string }[] }) {
  const res = resources ?? [
    { href: "/blog", label: "blog" },
    { href: "/#faq", label: "faq" },
  ];
  return (
    <footer>
      <div className="cols">
        <div>
          <h4>product</h4>
          <Link href="/#features">features</Link>
          <Link href="/#pricing">pricing</Link>
          <a href="https://app.doubtster.com" target="_blank" rel="noopener noreferrer">start trial</a>
          <a href="https://app.doubtster.com" target="_blank" rel="noopener noreferrer">log in</a>
        </div>
        <div>
          <h4>resources</h4>
          {res.map((r) => (
            <Link key={r.href} href={r.href}>{r.label}</Link>
          ))}
        </div>
        <div>
          <h4>legal</h4>
          <Link href="/terms">terms</Link>
          <Link href="/privacy">privacy</Link>
          <Link href="/refund-policy">refund policy</Link>
        </div>
        <div>
          <h4>disclaimer</h4>
          <p>AI explanations can contain mistakes. Check important answers with your teacher.</p>
        </div>
      </div>
      {mark && <div className="mark" aria-hidden="true">doubtster</div>}
      <div className="copy" style={mark ? undefined : { marginTop: 30 }}>
        © <Year /> Doubtster
      </div>
    </footer>
  );
}
