"use client";

import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Code2, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { ThermalBackground } from "./ThermalBackground";
import { ThemeToggle } from "./theme-toggle";

const contactLinks = [
  {
    label: "Email",
    value: "simsonmoses.m@gmail.com",
    href: "mailto:simsonmoses.m@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "Connect professionally",
    href: "https://www.linkedin.com/in/simsonmoses",
    icon: BriefcaseBusiness,
  },
  {
    label: "GitHub",
    value: "Explore my code",
    href: "https://github.com/simsonmoses",
    icon: Code2,
  },
] as const;

export function ContactPage() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <ThermalBackground />
      <header className="contact-header section-shell">
        <Link className="wordmark" href="/" aria-label="Simson home">Simson<span>.</span></Link>
        <div className="contact-header-actions">
          <ThemeToggle />
          <Link className="back-home" href="/">
            <ArrowLeft size={15} /> Back home
          </Link>
        </div>
      </header>

      <main className="contact-page section-shell">
        <section className="contact-hero">
          <motion.div
            className="contact-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span>Contact</span>
            <i />
            <span>Bengaluru · Available globally</span>
          </motion.div>
          <h1 aria-label="Let's build something meaningful.">
            {["Let's build", "something", "meaningful."].map((line, index) => (
              <motion.span
                key={line}
                className={line === "meaningful." ? "contact-accent" : ""}
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.72,
                  delay: 0.18 + index * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.48 }}
          >
            Have an interesting project, engineering opportunity, or collaboration in mind?
            I&apos;d love to hear about it.
          </motion.p>
        </section>

        <section className="contact-layout" aria-label="Contact Simson">
          <motion.aside
            className="contact-info-card"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.27, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="contact-index">01 / CONNECT</span>
            <div className="availability-row">
              <span className="status-dot" />
              Open to thoughtful work
            </div>
            <p className="info-intro">
              The best conversations usually start with a clear problem and a little curiosity.
            </p>

            <div className="contact-link-list">
              {contactLinks.map(({ label, value, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span className="contact-link-icon"><Icon size={17} /></span>
                  <span>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </span>
                  <ArrowUpRight className="contact-link-arrow" size={16} />
                </a>
              ))}
            </div>

            <div className="contact-location">
              <MapPin size={15} />
              <span><small>Based in</small>Bengaluru, India</span>
            </div>
          </motion.aside>

          <ContactForm />
        </section>
      </main>

      <footer className="contact-footer section-shell">
        <span>© {new Date().getFullYear()} Simson M.</span>
        <span>Good software starts with a good conversation.</span>
      </footer>
    </>
  );
}
