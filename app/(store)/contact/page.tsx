import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ContactForm } from "@/components/store/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with MA Fabrics — questions on fabric, orders, or bulk requirements.",
};

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["whatsapp_number", "shop_address"] } },
  });
  const whatsappNumber = settings.find((s) => s.key === "whatsapp_number")?.value ?? "";
  const shopAddress = settings.find((s) => s.key === "shop_address")?.value ?? "Lahore, Pakistan";

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-3 font-display text-4xl text-navy">Contact us</h1>
      <p className="mb-12 max-w-lg text-sm text-navy/60">
        Questions about fabric, an order, or bulk requirements — send us a message and we'll get back to you.
      </p>

      <div className="grid gap-12 sm:grid-cols-2">
        <ContactForm whatsappNumber={whatsappNumber} />
        <div className="space-y-6 text-sm text-navy/70">
          <div>
            <h2 className="mb-1 font-display text-base text-navy">WhatsApp</h2>
            <p>The fastest way to reach us — chat directly for fabric or order questions.</p>
          </div>
          <div>
            <h2 className="mb-1 font-display text-base text-navy">Location</h2>
            <p>{shopAddress}</p>
          </div>
          <div>
            <h2 className="mb-1 font-display text-base text-navy">Hours</h2>
            <p>Monday – Saturday, 10am – 7pm PKT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
