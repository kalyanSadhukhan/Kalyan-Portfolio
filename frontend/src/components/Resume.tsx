import { Button } from "@/components/ui/button";
import { Download, ExternalLink, GraduationCap, Award, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ResumePDF from "@/assets/Kalyan_Sadhukhan_Resume.pdf";

export const Resume = () => {
  const education = [
    {
      degree: "B.Tech in Computer Science & Engineering (AI & ML)",
      institution: "Alliance University",
      period: "2023 - 2027",
      grade: "CGPA: 8.85",
    },
    {
      degree: "12th Grade (ISC)",
      institution: "Secondary Education",
      period: "2022",
      grade: "92.5%",
    },
    {
      degree: "10th Grade (ICSE)",
      institution: "Secondary Education",
      period: "2020",
      grade: "94%",
    },
  ];

  const certifications = [
    "IBM Operating System Administration & Security",
    "Critical Thinking Skills for University Success (University of Sydney)",
    "Introduction to Database Systems (IIT Madras, NPTEL)",
    "Microsoft Azure AI Fundamentals (AI-900)",
    "Data Structures & Algorithms (Apna College)",
  ];

  const achievements = [
    {
      title: "Blind Coding Competition",
      organization: "Microsoft Azure Developer Club",
      type: "Participant",
    },
    {
      title: "Brain Byte Quiz",
      organization: "Microsoft Azure Developer Club",
      type: "Participant",
    },
    {
      title: "Pi Day Mathematics Quiz",
      organization: "Infinity Club",
      type: "Winner",
    },
  ];

  return (
    <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            My <span className="gradient-text">Resume</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6" />
          <div className="flex flex-wrap justify-center gap-4">
            <Button
  size="lg"
  className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300 hover:scale-105"
  onClick={() => window.open(ResumePDF, "_blank", "noopener,noreferrer")}
>
  <ExternalLink className="mr-2 h-5 w-5" />
  Open PDF
</Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              asChild
            >
              <a href="/Kalyan_Sadhukhan_Resume.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </a>
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Education */}
          <div className="glass-card p-8 rounded-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Education</h3>
            </div>
            <div className="space-y-6">
              {education.map((item, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors duration-300">
                  <h4 className="font-heading font-semibold text-lg mb-1">{item.degree}</h4>
                  <p className="text-muted-foreground mb-1">{item.institution}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="secondary">{item.period}</Badge>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {item.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="glass-card p-8 rounded-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Certifications</h3>
            </div>
            <ul className="space-y-3">
              {certifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-3 text-foreground/90">
                  <span className="text-accent mt-1 text-lg">✓</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div className="glass-card p-8 rounded-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Achievements & Participation</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                >
                  <h4 className="font-heading font-semibold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.organization}</p>
                  <Badge variant="outline" className="border-primary/30">
                    {achievement.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
