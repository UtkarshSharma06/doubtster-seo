"use client";
import { useState, type CSSProperties } from "react";
import Link from "next/link";

const P = {
  m: { t: "monthly plan", p: "$7.99", u: "per month", c: "each month", v: "about $0.27 a video", s: "Yearly is $59, about 38% less than 12 months of monthly." },
  a: { t: "yearly plan", p: "$59", u: "per year", c: "released monthly", v: "about $0.16 a video", s: "That is about 38% less than 12 months of monthly." },
} as const;

export function Pricing() {
  const [k, setK] = useState<"m" | "a">("m");
  const o = P[k];
  return (
<section className="sky" id="pricing"><div className="wrap">
    <div className="head">
      <h2>doubtster, your way</h2>
      <p>Chat is free. Videos run on credits. Cancel anytime.</p>
      <div className="tog" role="group" aria-label="billing"><button onClick={() => setK("m")} className={k === "m" ? "on" : undefined}>monthly</button><button onClick={() => setK("a")} className={k === "a" ? "on" : undefined}>yearly</button></div>
    </div>
    <div className="prices">
      <div className="pc"><h3>chat</h3><div className="s">ask until you get it</div><div className="p">$0</div><div className="u">free, always</div><Link className="go" href="/signup">start asking</Link><small className="i">includes</small><ul><li>Unlimited text answers</li><li>Step by step working</li><li>Every subject</li></ul></div>
      <div className="pc pop"><span className="pp">starter</span><h3>trial</h3><div className="s">try the videos</div><div className="p">$1.99</div><div className="u">for 7 days</div><Link className="go b" href="/signup">start trial</Link><small className="i">includes</small><ul><li>3 explainer videos</li><li>Renews as a paid plan after day 7</li><li>Trial credits expire when the trial ends</li></ul></div>
      <div className="pc"><h3>{o.t}</h3><div className="s">after the trial</div><div className="p">{o.p}</div><div className="u">{o.u}</div><Link className="go" href="/signup">choose plan</Link><small className="i">includes</small><ul><li>30 video credits <span>{o.c}</span></li><li>{o.v}</li><li>Credits reset monthly, no rollover</li></ul></div>
    </div>
    <div className="term"><span><b>&lt; top-ups &gt;</b>  10 credits for $4.99 or 25 for $9.99. Valid 90 days, paid plans only.</span><Link href="#faq">how credits work</Link></div>
    <p className="fine">{o.s}</p>
    <p className="fine">Forgot to cancel? That charge isn't refundable. Refunds only cover payment errors or account bugs on our side. <Link href="/refund-policy">Refund policy</Link></p>
  </div></section>

  );
}
