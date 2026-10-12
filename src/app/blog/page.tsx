import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogHome } from "@/components/blog/BlogHome";
import "@/styles/blog.css";

export const metadata: Metadata = {
  title: "Doubtster Blog | guides, ideas and worked examples",
  description: "How to get the most from Doubtster, how we build it, and how to study better.",
};

export default function BlogPage() {
  return (
    <div className="pg-blog">
      <a className="skip" href="#main">Skip to content</a>
      <Header blog />
      <BlogHome />
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
