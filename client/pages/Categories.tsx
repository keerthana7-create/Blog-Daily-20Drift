import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";

interface TagItem { tag: string; count: number }

export default function Categories() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/tags").then(({ data }) => setTags(data.items));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Categories</h1>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tags.map((t) => (
            <button key={t.tag} onClick={() => navigate(`/?tag=${encodeURIComponent(t.tag)}`)} className="rounded-xl border p-4 text-left hover:shadow-sm transition">
              <div className="font-semibold">#{t.tag}</div>
              <div className="text-sm text-muted-foreground">{t.count} posts</div>
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
