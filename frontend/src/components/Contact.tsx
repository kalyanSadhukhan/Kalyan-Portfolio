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
      `}</style>
    </section>
  );
};

export default Contact;
