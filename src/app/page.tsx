import type { Metadata } from "next";
import {
  Header,
  Hero,
  Features,
  Examples,
  Notes,
  Letter,
  Questions,
  Pricing,
  Faq,
  FinalCta,
  Footer,
  LandingEffects,
} from "@/components/landing";
import JsonLd from "@/components/JsonLd";
import { FAQ } from "@/lib/faq";
import { EXAMPLES, UPLOAD_DATE } from "@/lib/examples";
import { SITE, abs } from "@/lib/site";
import "@/styles/landing.css";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  alternates: { canonical: "/" },
};

const ORG_ID = abs("/#organization");

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: abs("/brand/doubtster-icon.png"), width: 512, height: 512 },
    slogan: SITE.tagline,
    description: SITE.description,
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE.url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web browser",
    description: SITE.description,
    inLanguage: ["en", "fr", "es", "hi"],
    publisher: { "@id": ORG_ID },
    featureList: [
      "Free step-by-step answers in chat",
      "Narrated explainer videos drawn on a board",
      "Structured study notes with diagrams",
      "Flashcards from every note",
      "Maths, physics, chemistry, biology, economics, accounting and coding",
    ],
    offers: [
      { "@type": "Offer", name: "Chat", price: "0", priceCurrency: "USD", description: "Unlimited step-by-step text answers" },
      { "@type": "Offer", name: "7-day trial", price: "1.99", priceCurrency: "USD", description: "3 explainer videos for 7 days" },
      { "@type": "Offer", name: "Monthly plan", price: "7.99", priceCurrency: "USD", description: "30 video credits each month" },
      { "@type": "Offer", name: "Yearly plan", price: "59", priceCurrency: "USD", description: "Video credits for a full year" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "The Doubtster film",
    description: "A 22-second film: stuck on an integral at 3 am, ask Doubtster, watch it explained, and finally get it.",
    thumbnailUrl: [abs("/media/film.jpg")],
    contentUrl: abs("/media/film.mp4"),
    uploadDate: UPLOAD_DATE,
    duration: "PT22S",
    publisher: { "@id": ORG_ID },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Example lessons explained by Doubtster",
    itemListElement: EXAMPLES.map((e, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/examples/${e.slug}`), name: e.title })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function LandingPage() {
  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main>
        <Hero />
        <Features />
        <Examples />
        <Notes />
        <Letter />
        <Questions />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <LandingEffects />
    </>
  );
}
