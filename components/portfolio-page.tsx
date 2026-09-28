"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  Download,
  Layers3,
  MapPin,
  Radio,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { capabilities, experience, profile, projects } from "@/data/portfolio";
import { Header } from "./header";
import { Reveal } from "./reveal";
import { ThermalBackground } from "./ThermalBackground";

const heroWords = ["complex", "systems", "into", "clear", "experiences."];

export function PortfolioPage() {
  const reduce = useReducedMotion();

  return (
    <>
      <ThermalBackground />
      <Header />
      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              <span className="status-dot" />
              SDE II · Bengaluru, India
            </motion.div>
            <h1 aria-label="I turn complex systems into clear experiences.">
              <span>I turn</span>{" "}
              {heroWords.map((word, index) => (
                <motion.span
                  key={word}
                  className={word === "clear" ? "accent-word" : ""}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 + index * 0.075, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="hero-intro"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.65 }}
            >
              I&apos;m {profile.name}, a software engineer building AI-powered products,
              secure distributed systems, and thoughtful enterprise interfaces.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.78 }}
            >
              <a className="button button-primary" href="#work">
                Explore my work <ArrowDown size={16} />
              </a>
              <a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">
                Résumé <Download size={15} />
              </a>
            </motion.div>
          </div>

          <motion.div
            className="hero-console"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="console-topline">
              <span><Radio size={14} /> Current focus</span>
              <span className="live-label">LIVE</span>
            </div>
            <div className="console-content">
              <p>Conversational intelligence</p>
              <h2>Helping voice agents become more useful, reliable, and human.</h2>
              <div className="waveform" aria-hidden="true">
                {[14, 28, 20, 42, 30, 54, 38, 66, 48, 72, 40, 58, 30, 46, 22, 34, 18, 28].map((height, index) => (
                  <motion.i
                    key={index}
                    style={{ height }}
                    animate={reduce ? undefined : { scaleY: [0.65, 1, 0.72] }}
                    transition={{ duration: 1.4 + (index % 4) * 0.15, repeat: Infinity, delay: index * 0.04 }}
                  />
                ))}
              </div>
              <div className="console-tags">
                <span><Check size={12} /> Evaluation</span>
                <span><Check size={12} /> Voice AI</span>
                <span><Check size={12} /> Analytics</span>
              </div>
            </div>
            <div className="console-footer">
              <span>System thinking</span>
              <span>01 / 04</span>
            </div>
          </motion.div>
        </section>

        <section className="intro-strip section-shell" aria-label="Professional summary">
          <Reveal className="intro-statement">
            <span className="section-kicker">In brief</span>
            <p>
              <strong>3+ years</strong> designing software across banking, aviation,
              SaaS, and conversational AI—from system architecture to the final interaction.
            </p>
          </Reveal>
          <Reveal className="stat-grid" delay={0.12}>
            <div><span>Core</span><strong>Java + Spring</strong></div>
            <div><span>Interface</span><strong>React + TypeScript</strong></div>
            <div><span>Now</span><strong>AI evaluation</strong></div>
          </Reveal>
        </section>

        <section className="work-section section-shell" id="work">
          <Reveal className="section-heading">
            <div>
              <span className="section-kicker">Selected work · 2023—Now</span>
              <h2>Systems with substance.</h2>
            </div>
            <p>Enterprise-grade engineering, shaped around the people who use it.</p>
          </Reveal>

          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.06}>
                <article className={`project-card accent-${project.accent}`}>
                  <div className="project-meta">
                    <span>{project.number}</span>
                    <span>{project.category}</span>
                  </div>
                  <div className="project-main">
                    <p>{project.company}</p>
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>
                  <div className="project-side">
                    <div className="project-glyph" aria-hidden="true">
                      {index === 0 ? <Sparkles /> : index === 1 ? <Layers3 /> : <Braces />}
                    </div>
                    <ul>
                      {project.highlights.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="about-section section-shell" id="about">
          <Reveal className="about-lead">
            <span className="section-kicker">How I work</span>
            <h2>Close to the problem.<br />Clear in the solution.</h2>
          </Reveal>
          <div className="about-grid">
            <Reveal className="about-copy">
              <p>
                I enjoy the part of engineering where architecture, product thinking, and
                human behaviour meet. My work spans secure backend services, distributed
                communication, data modelling, and the interfaces that make those systems usable.
              </p>
              <p>
                The goal is consistent: understand the real constraint, reduce accidental
                complexity, and leave behind software that teams can trust and extend.
              </p>
            </Reveal>
            <div className="capability-list">
              {capabilities.map((capability, index) => (
                <Reveal key={capability.title} delay={index * 0.05}>
                  <div className="capability-row">
                    <span>{capability.index}</span>
                    <h3>{capability.title}</h3>
                    <p>{capability.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="experience-section section-shell" id="experience">
          <Reveal className="section-heading experience-heading">
            <div>
              <span className="section-kicker">Experience</span>
              <h2>Built in the real world.</h2>
            </div>
            <a className="text-link" href={profile.resume} target="_blank" rel="noreferrer">
              Full résumé <ArrowUpRight size={15} />
            </a>
          </Reveal>
          <div className="timeline">
            {experience.map((item, index) => (
              <Reveal key={item.company} delay={index * 0.08}>
                <article className="timeline-row">
                  <span className="timeline-period">{item.period}</span>
                  <div>
                    <h3>{item.company}</h3>
                    <p className="timeline-role">{item.role}</p>
                  </div>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="contact-section section-shell" id="contact">
          <Reveal className="contact-card">
            <div className="contact-orbit" aria-hidden="true"><span /></div>
            <span className="section-kicker light-kicker">Have a meaningful problem?</span>
            <h2>Let&apos;s build something<br />that holds up.</h2>
            <Link className="button button-light" href="/contact">
              Start a conversation <ArrowRight size={17} />
            </Link>
            <div className="contact-meta">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span><MapPin size={14} /> {profile.location}</span>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <a className="wordmark" href="#top" aria-label="Back to top">Simson<span>.</span></a>
        <p>Designed with restraint. Engineered with intent.</p>
        <span>© {new Date().getFullYear()} Simson M.</span>
      </footer>
    </>
  );
}
