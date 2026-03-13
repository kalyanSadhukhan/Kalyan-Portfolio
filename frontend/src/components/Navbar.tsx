import { useState, useEffect } from "react";
import { Menu, X, ShieldAlert, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Achievements", href: "#achievements" },
  { name: "Projects", href: "#projects" },
  { name: "Hobbies", href: "#hobbies" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const speakName = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Kalyan");
    utterance.lang = "en-IN";
    utterance.rate = 1.00;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — click scrolls home + speaks "Kalyan" */}
          <div className="relative group">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                speakName();
                scrollToSection("#home");
              }}
              className="flex items-center gap-1 text-2xl font-heading font-bold gradient-text focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 cursor-pointer select-none"
            >
              KS
              <Volume2 className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary transition-colors duration-200" />
            </a>
            {/* Custom tooltip */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2.5 py-1 rounded-lg bg-background/90 border border-primary/20 text-[11px] text-muted-foreground whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              🔊 Click to hear my name
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${activeSection === item.href.substring(1)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
              >
                {item.name}
              </a>
            ))}
            {isAuthenticated && (
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="ml-2 px-4 py-2 hover:bg-primary/10 text-primary hover:text-primary transition-colors gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 glass-card mt-2 rounded-lg">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${activeSection === item.href.substring(1)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  {item.name}
                </a>
              ))}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full justify-start px-4 py-3 text-primary hover:bg-primary/10 transition-colors gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Portal
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
