import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Code, Wrench, BookOpen, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export const Skills = () => {
  const [dynamicSkills, setDynamicSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.get('/api/skills');
        if (Array.isArray(data)) {
          // Sort skills by displayOrder before grouping
          const sortedData = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setDynamicSkills(sortedData);
        }
      } catch (error) {
        console.error("Failed to fetch skills data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);
  const defaultCategories = [
    {
      icon: Code,
      title: "Programming Languages",
      skills: [],
      color: "primary",
    },
    {
      icon: Wrench,
      title: "Tools & Platforms",
      skills: [],
      color: "accent",
    },
    {
      icon: BookOpen,
      title: "Core Concepts",
      skills: [],
      color: "primary",
    },
  ];

  // Map dynamic skills into categories
  const mappedCategories = defaultCategories.map(cat => ({
    ...cat,
    skills: dynamicSkills.filter(skill => skill.category === cat.title)
  }));

  // Fallback if no dynamic skills
  const skillCategories = dynamicSkills.length > 0 ? mappedCategories : [
    {
      icon: Code,
      title: "Programming Languages",
      skills: [
        { name: "Java", url: "https://www.geeksforgeeks.org/java/" },
        { name: "C", url: "https://www.geeksforgeeks.org/c-programming-language/" },
        { name: "C++", url: "https://www.geeksforgeeks.org/c-plus-plus/" },
        { name: "Python", url: "https://www.geeksforgeeks.org/python-programming-language/" },
        { name: "SQL", url: "https://www.geeksforgeeks.org/sql-tutorial/" },
        { name: "HTML", url: "https://www.geeksforgeeks.org/html-tutorials/" },
        { name: "CSS", url: "https://www.geeksforgeeks.org/css-tutorials/" },
        { name: "JavaScript", url: "https://www.geeksforgeeks.org/javascript/" },
      ],
      color: "primary",
    },
    {
      icon: Wrench,
      title: "Tools & Platforms",
      skills: [
        { name: "GitHub", url: "https://www.geeksforgeeks.org/what-is-github-and-how-to-use-it/" },
        { name: "VS Code", url: "https://www.geeksforgeeks.org/visual-studio-code-tutorials/" },
        { name: "IntelliJ IDEA", url: "https://www.geeksforgeeks.org/intellij-idea-tutorial/" },
        { name: "Lovable", url: "https://www.lovable.so/" },
        { name: "n8n", url: "https://n8n.io/" },
      ],
      color: "accent",
    },
    {
      icon: BookOpen,
      title: "Core Concepts",
      skills: [
        { name: "OOP", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
        { name: "DBMS", url: "https://www.geeksforgeeks.org/dbms/" },
        { name: "DSA", url: "https://www.geeksforgeeks.org/data-structures/" },
        { name: "AI/ML", url: "https://www.geeksforgeeks.org/machine-learning/" },
        { name: "OS", url: "https://www.geeksforgeeks.org/operating-systems/" },
        { name: "Web Development", url: "https://www.geeksforgeeks.org/web-development/" },
      ],
      color: "primary",
    },
  ];

  const highlightedProject = {
    title: "Hotel Reservation System",
    tech: ["Java", "JDBC", "SQL", "GitHub"],
    points: [
      "Complete CRUD operations for bookings, updates, and reservations",
      "Robust database integration with optimized queries",
      "Menu-driven console interface for seamless user interaction",
      "Centralized configuration for easy deployment",
    ],
    githubLink: "https://github.com/kalyanSadhukhan/Hotel-Reservation-System",
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Skills grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {skillCategories.map((category, index) => (
              category.skills.length > 0 && (
                <div
                  key={category.title}
                  className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-${category.color}/10 rounded-lg flex items-center justify-center`}>
                      <category.icon className={`h-5 w-5 text-${category.color}`} />
                    </div>
                    <h3 className="font-heading font-semibold text-lg">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill: any) => (
                      <a
                        key={skill.name}
                        href={skill.url || '#'}
                        target={skill.url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Badge
                          variant="secondary"
                          className="bg-muted/50 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          {skill.name}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
