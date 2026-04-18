import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, Send, CheckCircle2, XCircle } from 'lucide-react';
import { z } from 'zod';

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Initialize EmailJS
  // SECURITY NOTE: EmailJS keys are exposed in client code by design.
  // To mitigate abuse, configure domain restrictions in your EmailJS dashboard:
  // https://dashboard.emailjs.com/admin/account
  useEffect(() => {
    emailjs.init('wuUEv4cGU7SKdcbJL');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});
    setStatus('idle');

    // Client-side rate limiting: prevent submissions within 5 seconds
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      setValidationErrors({ submit: 'Please wait a few seconds before submitting again' });
      return;
    }

    // Validate form data
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        'service_0nw6n8n',
        'template_76ibe46',
        {
          from_name: validation.data.name,
          from_email: validation.data.email,
          message: validation.data.message,
        }
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setLastSubmitTime(now);
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Get In <span className="text-blue-400">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 hover:opacity-80 transition-opacity">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">Email</p>
                    <a href="mailto:sadhukhankalyan21@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                      sadhukhankalyan21@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 hover:opacity-80 transition-opacity">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">Phone</p>
                    <a href="tel:+918017771992" className="text-gray-400 hover:text-blue-400 transition-colors">
                      +91 8017771992
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4 hover:opacity-80 transition-opacity">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-blue-400"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">WhatsApp</p>
                    <a
                      href="https://wa.me/918017771992?text=Hi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label="Chat on WhatsApp"
                    >
                      Chat with me
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Your name"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    validationErrors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-700 focus:border-blue-400'
                  }`}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    validationErrors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-700 focus:border-blue-400'
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows={6}
                  placeholder="Your message…"
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                    validationErrors.message ? 'border-red-400 focus:border-red-400' : 'border-gray-700 focus:border-blue-400'
                  }`}
                />
                {validationErrors.message && (
                  <p className="mt-1 text-sm text-red-400">{validationErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-blue-400 hover:bg-blue-500 text-black font-medium rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {/* General Error Message */}
              {validationErrors.submit && (
                <p className="text-sm text-red-400 text-center">{validationErrors.submit}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification - Bottom Right Corner */}
      {status === 'success' && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-in-up">
          <div className="bg-gray-900 border border-blue-400 rounded-xl shadow-2xl p-4 min-w-[320px] backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-blue-400/20 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">Message Sent Successfully!</p>
                <p className="text-sm text-gray-400">I'll get back to you as soon as possible.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-in-up">
          <div className="bg-gray-900 border border-red-400 rounded-xl shadow-2xl p-4 min-w-[320px] backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-red-400/20 p-2 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">Failed to Send Message</p>
                <p className="text-sm text-gray-400">Please try again or email me directly.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/918017771992?text=Hi"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="whatsapp-fab"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="whatsapp-fab-icon"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* CSS Animation */}
      <style>{`
        @keyframes slide-in-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.4s ease-out;
        }

        /* WhatsApp Floating Action Button — uses portfolio primary blue theme */
        .whatsapp-fab {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.5rem;
          height: 3.5rem;
          background: hsl(206 100% 64%); /* --primary */
          border-radius: 50%;
          box-shadow: 0 4px 20px hsl(206 100% 64% / 0.4); /* --glow-primary */
          text-decoration: none;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          animation: whatsapp-fab-pulse 2.5s infinite;
        }

        .whatsapp-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px hsl(206 100% 64% / 0.65);
          animation: none;
        }

        .whatsapp-fab-icon {
          width: 1.75rem;
          height: 1.75rem;
          color: hsl(225 15% 6%); /* --primary-foreground (dark ink, matches submit button text) */
          flex-shrink: 0;
        }

        @keyframes whatsapp-fab-pulse {
          0%   { box-shadow: 0 0 0 0 hsl(206 100% 64% / 0.5); }
          70%  { box-shadow: 0 0 0 12px hsl(206 100% 64% / 0); }
          100% { box-shadow: 0 0 0 0 hsl(206 100% 64% / 0); }
        }

        @media (max-width: 640px) {
          .whatsapp-fab {
            bottom: 1.25rem;
            left: 1.25rem;
            width: 3rem;
            height: 3rem;
          }
          .whatsapp-fab-icon {
            width: 1.5rem;
            height: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
