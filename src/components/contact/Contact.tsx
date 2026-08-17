import React, { useState } from 'react';
import { PortfolioConfig } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ContactProps {
  config: PortfolioConfig;
}

export const Contact: React.FC<ContactProps> = ({ config }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('sending');

    const success = await api.sendContactMessage({ name, email, message });

    if (success) {
      setStatus('success');
      showToast('Message sent successfully!', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      // Fallback to mailto
      setStatus('success');
      showToast('Opening mail client...', 'info');
      setTimeout(() => {
        window.location.href = `mailto:${config.email || 'parane.enzo@gmail.com'}?subject=Inquiry from ${encodeURIComponent(
          name
        )}&body=${encodeURIComponent(message)}%0A%0AReply to: ${encodeURIComponent(email)}`;
        setName('');
        setEmail('');
        setMessage('');
        setStatus('idle');
      }, 1000);
    }
  };

  return (
    <section id="contact" className="section-card py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Headline & Minimalist Contact Form */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-6">Let's Talk</p>
            <h2 className="font-display text-5xl font-normal mb-6 leading-tight">
              Open for
              <br />
              <span className="italic text-accent">work.</span>
            </h2>
            <p className="text-sm opacity-60 leading-relaxed mb-8 max-w-sm">
              {config.contactText ||
                "I am currently looking for full-time roles in web development. Feel free to reach out if you think we'd be a good fit!"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mt-8 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-ink/20 dark:border-cream/20 py-2 text-xs focus:outline-none focus:border-accent transition-colors duration-300 placeholder-ink/40 dark:placeholder-cream/40 text-ink dark:text-cream"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-ink/20 dark:border-cream/20 py-2 text-xs focus:outline-none focus:border-accent transition-colors duration-300 placeholder-ink/40 dark:placeholder-cream/40 text-ink dark:text-cream"
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-ink/20 dark:border-cream/20 py-2 text-xs focus:outline-none focus:border-accent transition-colors duration-300 placeholder-ink/40 dark:placeholder-cream/40 resize-none text-ink dark:text-cream"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full inline-flex items-center justify-center gap-3 px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 border border-transparent ${
                  status === 'success'
                    ? 'bg-emerald-600 text-cream'
                    : status === 'sending'
                    ? 'bg-accent text-cream opacity-90'
                    : 'bg-ink text-cream dark:bg-cream dark:text-ink hover:opacity-90'
                }`}
              >
                <span>
                  {status === 'sending'
                    ? 'Sending...'
                    : status === 'success'
                    ? 'Message Saved!'
                    : 'Send Message'}
                </span>
                <span>{status === 'sending' ? '⋯' : status === 'success' ? '✓' : '→'}</span>
              </button>
            </form>
          </div>

          {/* Right: Direct Links & Resume CV Downloads */}
          <div className="space-y-0">
            <a
              href={`mailto:${config.email || 'parane.enzo@gmail.com'}`}
              className="flex items-center justify-between py-5 border-t border-ink/10 dark:border-cream/10 group"
            >
              <span className="text-xs uppercase tracking-widest opacity-40">Email</span>
              <span className="text-sm group-hover:text-accent transition-colors">
                {config.email || 'parane.enzo@gmail.com'} ↗
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/enzo-daniela-685374324/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-5 border-t border-ink/10 dark:border-cream/10 group"
            >
              <span className="text-xs uppercase tracking-widest opacity-40">LinkedIn</span>
              <span className="text-sm group-hover:text-accent transition-colors">Enzo Daniela ↗</span>
            </a>

            <a
              href="https://github.com/EnzoSoti"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-5 border-t border-ink/10 dark:border-cream/10 group"
            >
              <span className="text-xs uppercase tracking-widest opacity-40">GitHub</span>
              <span className="text-sm group-hover:text-accent transition-colors">EnzoSoti ↗</span>
            </a>

            <a
              href="https://www.facebook.com/enzo.daniela.31/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-5 border-t border-b border-ink/10 dark:border-cream/10 group"
            >
              <span className="text-xs uppercase tracking-widest opacity-40">Facebook</span>
              <span className="text-sm group-hover:text-accent transition-colors">Enzo Daniela ↗</span>
            </a>

            <div className="pt-6">
              <div className="flex gap-3">
                <a
                  href="/doc/Enzo%20Daniela%20Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 border border-ink/20 dark:border-cream/20 text-xs tracking-widest uppercase hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
                >
                  View PDF
                </a>
                <a
                  href="/doc/Enzo%20Daniela%20Resume.pdf"
                  download="Enzo Daniela Resume.pdf"
                  className="px-5 py-2.5 border border-ink/20 dark:border-cream/20 text-xs tracking-widest uppercase hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
                >
                  Download CV
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
