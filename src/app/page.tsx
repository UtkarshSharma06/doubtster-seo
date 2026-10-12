import type { Metadata } from "next";
import "@/styles/landing.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { NotesSection } from "@/components/landing/NotesSection";
import { Letter } from "@/components/landing/Letter";
import { Feedback } from "@/components/landing/Feedback";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";

export const metadata: Metadata = {
  title: { absolute: "Doubtster | stuck on a question? watch it explained" },
  description: "A study buddy that explains it on video. Ask in chat for free, get step by step answers, and turn any answer into a short explainer video.",
};

export default function Home() {
  return (
    <div className="pg-landing">
      <Header />
      <main>
        <Hero />
        <Features />
        <NotesSection />
        <Letter />
        <Feedback />
        <Pricing />
        <Faq />
      </main>
      <Footer resources={[{ href: "/blog", label: "blog" }, { href: "#faq", label: "faq" }]} />
    </div>
  );
}
