"use client";

import { AlertCircle, ArrowUpRight, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { FormEvent, useRef, useState } from "react";
import {
  contactSchema,
  contactSubjects,
  type ContactInput,
} from "@/lib/contact-schema";

type FieldErrors = Partial<Record<keyof ContactInput, string>>;
type SubmitState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initialValues: ContactInput = {
  name: "",
  email: "",
  subject: "Job Opportunity",
  message: "",
  website: "",
};

export function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [values, setValues] = useState<ContactInput>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle" });
  const [isPending, setIsPending] = useState(false);
  const pendingRef = useRef(false);

  const updateField = <Key extends keyof ContactInput>(
    field: Key,
    value: ContactInput[Key],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (submitState.type !== "idle") setSubmitState({ type: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingRef.current) return;

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactInput;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setSubmitState({ type: "error", message: "Please review the highlighted fields." });
      return;
    }

    pendingRef.current = true;
    setIsPending(true);
    setErrors({});
    setSubmitState({ type: "idle" });

    try {
      if (!reduceMotion) {
        await new Promise((resolve) => window.setTimeout(resolve, 260));
      }

      // GitHub Pages has no server runtime. Hand the validated message to the
      // visitor's email client without uploading its contents anywhere.
      if (!parsed.data.website) {
        const subject = encodeURIComponent(`[Portfolio] ${parsed.data.subject}`);
        const body = encodeURIComponent(
          `Hi Simson,\n\n${parsed.data.message}\n\n— ${parsed.data.name}\n${parsed.data.email}`,
        );
        window.location.assign(
          `mailto:simsonmoses.m@gmail.com?subject=${subject}&body=${body}`,
        );
      }

      setSubmitState({
        type: "success",
        message: parsed.data.website
          ? "Thanks — your message is ready."
          : "Email draft opened. Review it, then send it from your email app.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "I couldn’t open your email app. Please use the direct email link instead.",
      });
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  return (
    <motion.div
      className="contact-form-card"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="form-card-heading">
        <div>
          <span className="contact-index">02 / MESSAGE</span>
          <h2>Tell me what you&apos;re thinking.</h2>
        </div>
        <span className="secure-note">Private by default</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <Field
            id="name"
            label="Name"
            error={errors.name}
          >
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>
        </div>

        <Field id="subject" label="Subject" error={errors.subject}>
          <select
            id="subject"
            name="subject"
            value={values.subject}
            onChange={(event) =>
              updateField("subject", event.target.value as ContactInput["subject"])
            }
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          >
            {contactSubjects.map((subject) => (
              <option value={subject} key={subject}>{subject}</option>
            ))}
          </select>
        </Field>

        <Field id="message" label="Message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="A little context, what you're hoping to build, and where I might help..."
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : "message-count"}
          />
          <span className="character-count" id="message-count">
            {values.message.length} / 3000
          </span>
        </Field>

        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </div>

        <div className="form-submit-row">
          <button className="send-button" type="submit" disabled={isPending}>
            <span>{isPending ? "Preparing" : "Open email draft"}</span>
            {isPending ? (
              <LoaderCircle className="loading-icon" size={17} />
            ) : (
              <Send size={16} />
            )}
          </button>
          <p>
            Nothing is uploaded. Or email directly at{" "}
            <a href="mailto:simsonmoses.m@gmail.com">
              simsonmoses.m@gmail.com <ArrowUpRight size={13} />
            </a>
          </p>
        </div>

        <div className="form-notification" aria-live="polite" aria-atomic="true">
          {submitState.type !== "idle" && (
            <motion.div
              className={`notification notification-${submitState.type}`}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {submitState.type === "success" ? (
                <CheckCircle2 size={17} />
              ) : (
                <AlertCircle size={17} />
              )}
              <span>{submitState.message}</span>
            </motion.div>
          )}
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="field-control">{children}</div>
      {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}
