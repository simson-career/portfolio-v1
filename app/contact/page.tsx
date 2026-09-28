import type { Metadata } from "next";
import { ContactPage } from "@/components/contact-page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Simson M. about software engineering opportunities, product collaborations, and technical conversations.",
};

export default function Page() {
  return <ContactPage />;
}
