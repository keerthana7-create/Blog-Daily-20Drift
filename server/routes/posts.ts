import { RequestHandler } from "express";

export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  state: "draft" | "published";
}

const authors = [
  { id: "u1", name: "Alex Rivera" },
  { id: "u2", name: "Morgan Lee" },
  { id: "u3", name: "Riley Chen" },
];

const sampleTags = ["react", "typescript", "redux", "design", "security", "devops", "css", "ui", "performance"]; 

function generatePosts(count = 24): Post[] {
  const out: Post[] = [];
  for (let i = 0; i < count; i++) {
    const author = authors[i % authors.length];
    const id = `p${i + 1}`;
    const tags = [sampleTags[i % sampleTags.length], sampleTags[(i + 3) % sampleTags.length]];
    const createdAt = new Date(Date.now() - i * 86400000).toISOString();
    out.push({
      id,
      title: `Building with React ${i + 1}`,
      content:
        `<p>Learn modern React patterns with hooks, performance tips, and production-ready techniques.</p><p>This article covers state management, <strong>accessibility</strong>, and architecture guidance for scalable apps.</p>`,
      tags,
      imageUrl: `https://picsum.photos/seed/react-${i}/800/400`,
      authorId: author.id,
      authorName: author.name,
      createdAt,
      updatedAt: createdAt,
      state: "published",
    });
  }
  return out;
}

const DB: { posts: Post[] } = { posts: generatePosts() };

export const listPosts: RequestHandler = (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
  const limit = Math.max(1, parseInt(String(req.query.limit ?? "9"), 10));
  const search = String(req.query.search ?? "").toLowerCase();
  const tag = req.query.tag ? String(req.query.tag) : undefined;
  const author = req.query.author ? String(req.query.author) : undefined;

  let items = DB.posts.filter((p) => p.state === "published");
  if (search) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.content.toLowerCase().includes(search) ||
        p.tags.some((t) => t.toLowerCase().includes(search))
    );
  }
  if (tag) items = items.filter((p) => p.tags.includes(tag));
  if (author) items = items.filter((p) => p.authorId === author);

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  res.json({ items: paged, total, page, limit });
};

export const getPost: RequestHandler = (req, res) => {
  const { id } = req.params;
  const found = DB.posts.find((p) => p.id === id);
  if (!found) return res.status(404).json({ message: "Not Found" });
  res.json(found);
};
