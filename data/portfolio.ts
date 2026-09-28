export const profile = {
  name: "Simson M.",
  role: "Software Development Engineer II",
  email: "simsonmoses.m@gmail.com",
  location: "Bengaluru, India",
  resume: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Simson-M-Resume.pdf`,
};

export const projects = [
  {
    number: "01",
    title: "AI Voice Bot Evaluator",
    company: "Kapture CX",
    category: "Conversational AI",
    description:
      "A configurable evaluation platform for testing voice agents across conversation quality, expected behaviours, prohibited actions, multilingual performance, and token usage.",
    highlights: ["LLM evaluation", "WebSocket audio", "Translation intelligence"],
    accent: "indigo",
  },
  {
    number: "02",
    title: "OIS-KLIA",
    company: "Malaysia Airports",
    category: "Enterprise operations",
    description:
      "Multi-stage operational workflows with secure role-aware interfaces, time-zone-safe persistence, Active Directory synchronisation, caching, and event notifications.",
    highlights: ["Spring Boot", "React", "MongoDB + Redis"],
    accent: "violet",
  },
  {
    number: "03",
    title: "SEAS Digileap",
    company: "Digital platform",
    category: "Distributed systems",
    description:
      "A four-service backend spanning user, profile, media, and digital-management domains with typed gRPC communication and tenant-aware identity.",
    highlights: ["Microservices", "gRPC + Protobuf", "Custom Keycloak SPI"],
    accent: "blue",
  },
  {
    number: "04",
    title: "HaskelAI LMS",
    company: "Independent project",
    category: "Learning platform",
    description:
      "A microservices-based learning platform supporting course delivery, learner progress, administration, asynchronous events, caching, and object storage.",
    highlights: ["Java + React", "Kafka", "Docker"],
    accent: "emerald",
  },
] as const;

export const experience = [
  {
    period: "Jul 2026 — Present",
    company: "Kapture CX",
    role: "Software Development Engineer II",
    description:
      "Building evaluation and analytics systems for conversational AI and production voice agents.",
  },
  {
    period: "Nov 2023 — Jul 2026",
    company: "Mindgraph Technologies",
    role: "Full Stack Developer",
    description:
      "Delivered secure enterprise products across aviation, banking, SaaS, and digital platforms.",
  },
] as const;

export const capabilities = [
  {
    index: "A",
    title: "Backend systems",
    text: "Java 8/17, Spring Boot, REST, gRPC, event-driven architecture, Kafka",
  },
  {
    index: "B",
    title: "Product interfaces",
    text: "React, Angular, TypeScript, Tailwind CSS, Redux, Context API",
  },
  {
    index: "C",
    title: "Data & infrastructure",
    text: "PostgreSQL, MySQL, MongoDB, Redis, AWS, Azure, Docker, Kubernetes",
  },
  {
    index: "D",
    title: "AI & security",
    text: "LLM APIs, prompt engineering, voice AI, OAuth2, JWT, RBAC, Keycloak",
  },
] as const;
