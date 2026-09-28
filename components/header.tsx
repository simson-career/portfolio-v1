"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Experience", "#experience"],
] as const;

export function Header() {
  return (
    <motion.header
      className="site-header"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <a className="wordmark" href="#top" aria-label="Simson home">
        Simson<span>.</span>
      </a>
      <nav aria-label="Primary navigation">
        {navItems.map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Link className="header-contact" href="/contact">
          Let&apos;s talk <ArrowUpRight size={15} />
        </Link>
      </div>
    </motion.header>
  );
}
