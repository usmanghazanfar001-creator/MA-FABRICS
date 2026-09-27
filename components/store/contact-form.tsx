"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digitsOnly = whatsappNumber.replace(/[^\d]/g, "");
    const text = `Hello MA Fabrics,\n\n${form.message}\n\n— ${form.name} (${form.email})`;
    window.open(`https://wa.me/${digitsOnly}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm text-navy">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-navy">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-navy">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
      </div>
      <Button type="submit" className="w-full">Send via WhatsApp</Button>
    </form>
  );
}
