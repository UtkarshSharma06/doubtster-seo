import Link from "next/link";
import type { CSSProperties } from "react";

export function Faq() {
  return (
<section className="faq wrap" id="faq">
  <h2>frequently asked questions</h2>
  <p className="sb">what to know about doubtster, credits, and billing.</p>
  <details open><summary>what is doubtster?</summary><p>A study helper. You ask a question, get a step by step answer in chat for free, and can turn it into a short explainer video when you want to see it worked out.</p></details>
  <details><summary>is chat really free?</summary><p>Yes. Text answers never use credits. Only generating a video does.</p></details>
  <details><summary>what happens after the $1.99 trial?</summary><p>The trial lasts 7 days and includes 3 videos. If you don't cancel before day 7, it continues as a paid plan. Trial credits expire when the trial ends.</p></details>
  <details><summary>do unused credits roll over?</summary><p>No. Plan credits reset every month. Top-up credits last 90 days and need an active paid plan.</p></details>
  <details><summary>can I get a refund if I forget to cancel?</summary><p>No. Refunds only apply to payment verification failures or account bugs on our side. Details are on the <Link href="/refund-policy">refund policy</Link> page.</p></details>
  <details><summary>can the answers be wrong?</summary><p>Yes. AI explanations can contain mistakes. Check important answers with your teacher.</p></details>
</section>

  );
}
