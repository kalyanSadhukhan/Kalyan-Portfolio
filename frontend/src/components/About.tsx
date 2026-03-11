import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const fallbackAbout = {
  bio: "Hi, I'm a passionate developer who specialises in building scalable web applications using modern technologies like React, Node.js, and Spring Boot. I'm always eager to learn new tools and tackle complex technical challenges.",
};

export default function About() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await api.get("/api/about");
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setAbout(data);
        } else if (Array.isArray(data) && data.length > 0) {
          setAbout(data[0]);
        } else {
          setAbout(fallbackAbout);
        }
      } catch {
        setAbout(fallbackAbout);
      }
    };
    loadAbout();
  }, []);

  // Merge old three-paragraph fields into bio for backward compatibility
  const getBio = () => {
    if (!about) return "";
    if (about.bio) return about.bio;
    // Fallback for old data that may still have paragraph fields
    return [about.bioParagraph1, about.bioParagraph2, about.bioParagraph3]
      .filter(Boolean)
      .join("\n\n");
  };

  const bio = getBio();
  if (!bio) return null;

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Section header — matches Skills & Projects */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-2xl border border-white/5 animate-fade-in">
          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {bio}
          </p>
        </div>
      </div>
    </section>
  );
}