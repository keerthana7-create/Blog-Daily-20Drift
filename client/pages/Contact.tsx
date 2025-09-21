import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return alert("Please fill all fields");
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Contact Us</h1>
        {sent ? (
          <div className="rounded-md border bg-secondary p-4">Thanks! We'll get back to you soon.</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-md border px-3 py-2" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full rounded-md border px-3 py-2" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="min-h-[160px] w-full rounded-md border px-3 py-2" />
            <button className="rounded-md bg-primary text-primary-foreground px-4 py-2">Send</button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
