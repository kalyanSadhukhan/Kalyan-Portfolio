import { useEffect, useState } from "react";
import { GraduationCap, Award, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { api } from "../lib/api";

interface Education {
  id: string | number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  gradeScore?: string;
  marksheetUrl?: string;
}

interface Certification {
  id: string | number;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl: string;
}

export const EducationCertifications = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eduData, certData] = await Promise.all([
          api.get('/api/education'),
          api.get('/api/certifications'),
        ]);

        if (Array.isArray(eduData)) {
            // Sort to show latest first based on endDate
            setEducation(eduData.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()));
        }
        if (Array.isArray(certData)) {
            setCertifications(certData.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()));
        }
      } catch (error) {
        console.error("Failed to fetch education/certifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </section>
    );
  }

  // Do not render section if there's no data
  if (education.length === 0 && certifications.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-20 px-4 bg-black/95 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none opacity-50 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16">
                
                {/* Left Column: Education Timeline */}
                <div className="space-y-8 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-xl rounded-tr-none border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                            <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Education</h2>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">My Academic Journey</p>
                        </div>
                    </div>

                    <div className="relative border-l border-primary/20 pl-6 ml-4 space-y-10 before:absolute before:inset-y-0 before:-left-px before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-primary/20 before:to-transparent">
                        {education.map((edu) => (
                            <div key={edu.id} className="relative group perspective-1000">
                                {/* Timeline Dot indicator */}
                                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(var(--primary),0.8)] transition-all duration-300 z-10" />
                                
                                <div className="glass-card p-6 border border-white/5 rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 bg-gradient-to-br from-white/[0.03] to-transparent">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                                            {edu.degree}
                                            {edu.marksheetUrl && (
                                                <a
                                                    href={edu.marksheetUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                    aria-label="View marksheet"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full w-fit">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {edu.startDate && edu.endDate 
                                                    ? `${edu.startDate.substring(0, 4)} - ${edu.endDate.substring(0, 4)}` 
                                                    : edu.startDate 
                                                        ? `${edu.startDate.substring(0, 4)} - Present` 
                                                        : edu.endDate 
                                                            ? edu.endDate.substring(0, 4) 
                                                            : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
                                        {edu.institution}
                                    </p>
                                    {edu.gradeScore && (
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full mb-2">
                                            <span>🎓</span>
                                            <span>{edu.gradeScore}</span>
                                        </div>
                                    )}
                                    {edu.description && (
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Certifications */}
                <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-xl rounded-tr-none border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                            <Award className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Certifications</h2>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">Professional Credentials</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="group relative glass-card p-3 border border-white/5 rounded-xl transition-all duration-500 hover:bg-white/[0.03] hover:border-primary/30 hover:shadow-[0_4px_15px_-4px_rgba(var(--primary),0.25)] overflow-hidden flex items-center justify-between gap-3">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150" />
                                
                                <div className="relative z-10 flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors truncate">{cert.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-1">
                                        <span className="truncate">{cert.issuingOrganization}</span>
                                        <span className="text-white/20">•</span>
                                        <span className="flex items-center gap-1 shrink-0">
                                            <Calendar className="w-3 h-3" />
                                            {cert.issueDate
                                                ? (() => {
                                                    const d = new Date(cert.issueDate);
                                                    return isNaN(d.getTime())
                                                        ? cert.issueDate
                                                        : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                  })()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {cert.credentialUrl && (
                                    <div className="relative z-10 shrink-0">
                                        <a 
                                            href={cert.credentialUrl} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="flex items-center justify-center p-2 bg-white/5 rounded-lg text-muted-foreground hover:text-white hover:bg-secondary/20 transition-all shadow-sm"
                                            aria-label={`View credential for ${cert.name}`}
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};
