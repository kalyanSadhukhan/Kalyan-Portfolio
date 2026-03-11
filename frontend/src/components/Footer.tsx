import { Github, Linkedin, Instagram, Mail, Phone } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/kalyan-sadhukhan",
      label: "LinkedIn",
    },
    {
      icon: Github,
      href: "https://github.com/kalyanSadhukhan",
      label: "GitHub",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/KalyanSadhukh14",
      label: "Twitter",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/swag_vampi/",
      label: "Instagram",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Resume", href: "#view-resume" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold gradient-text">
              Kalyan Sadhukhan
            </h3>
            <p className="text-muted-foreground">
              Building reliable software with clean design and solid fundamentals.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-primary/10 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <social.icon className="h-5 w-5 text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-md w-fit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href === "#home") {
                      scrollToTop();
                    } else if (link.href === "#view-resume") {
                      // Scroll to top, then highlight the View Resume button
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setTimeout(() => {
                        const btn = document.getElementById("view-resume-btn");
                        if (btn) {
                          btn.scrollIntoView({ behavior: "smooth", block: "center" });
                          btn.focus({ preventScroll: true });
                          // Brief highlight pulse
                          btn.classList.add("ring-2", "ring-primary", "ring-offset-2");
                          setTimeout(() => btn.classList.remove("ring-2", "ring-primary", "ring-offset-2"), 1500);
                        }
                      }, 400);
                    } else {
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg">Get in Touch</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:sadhukhankalyan21@gmail.com"
                  className="text-sm hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                >
                  sadhukhankalyan21@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+918017771992"
                  className="text-sm hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                >
                  +91 8017771992
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-1 flex-wrap">
            <span>© {currentYear} Kalyan Sadhukhan | All Rights Reserved</span>
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 text-sm text-primary hover:text-accent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2"
          >
            Back to top ↑
            </button>
        </div>
      </div>
    </footer>
  );
};
