import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import api from "@/utils/api";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/subscribe", { email });
      setDone(true);
    } catch (e) {
      alert("Invalid email");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-xl">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Subscribe</h1>
        <p className="text-muted-foreground mb-6">Get the latest articles from Blog-Daily Drift directly to your inbox.</p>
        {done ? (
          <div className="rounded-md border bg-secondary p-4">You're subscribed! 🎉</div>
        ) : (
          <form onSubmit={onSubmit} className="flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 rounded-md border px-3 py-2" />
            <button className="rounded-md bg-primary text-primary-foreground px-4">Subscribe</button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
