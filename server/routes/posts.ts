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

interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
}

const authors: Author[] = [
  { id: "u1", name: "Alex Rivera", avatarUrl: "https://i.pravatar.cc/100?img=1", bio: "Frontend engineer and writer." },
  { id: "u2", name: "Morgan Lee", avatarUrl: "https://i.pravatar.cc/100?img=2", bio: "Product designer exploring UX and systems." },
  { id: "u3", name: "Riley Chen", avatarUrl: "https://i.pravatar.cc/100?img=3", bio: "Full‑stack developer and DevOps tinkerer." },
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

function currentUserId(req: any) {
  return (req.headers["x-user-id"] as string) || "u1";
}

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

export const createPost: RequestHandler = (req, res) => {
  const userId = currentUserId(req);
  const author = authors.find((a) => a.id === userId) || authors[0];
  const { title, content, tags, imageUrl, state } = req.body || {};
  if (!title || !content) return res.status(400).json({ message: "title and content required" });
  const id = `p${Date.now()}`;
  const now = new Date().toISOString();
  const post: Post = {
    id,
    title,
    content,
    tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    imageUrl,
    authorId: author.id,
    authorName: author.name,
    createdAt: now,
    updatedAt: now,
    state: state === "draft" ? "draft" : "published",
  };
  DB.posts.unshift(post);
  res.status(201).json(post);
};

export const updatePost: RequestHandler = (req, res) => {
  const userId = currentUserId(req);
  const { id } = req.params;
  const post = DB.posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ message: "Not Found" });
  if (post.authorId !== userId) return res.status(403).json({ message: "Forbidden" });
  const { title, content, tags, imageUrl, state } = req.body || {};
  if (title) post.title = title;
  if (content) post.content = content;
  if (tags) post.tags = Array.isArray(tags) ? tags : String(tags).split(",").map((t) => t.trim()).filter(Boolean);
  if (imageUrl !== undefined) post.imageUrl = imageUrl;
  if (state) post.state = state === "draft" ? "draft" : "published";
  post.updatedAt = new Date().toISOString();
  res.json(post);
};

export const deletePost: RequestHandler = (req, res) => {
  const userId = currentUserId(req);
  const { id } = req.params;
  const idx = DB.posts.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not Found" });
  if (DB.posts[idx].authorId !== userId) return res.status(403).json({ message: "Forbidden" });
  const [removed] = DB.posts.splice(idx, 1);
  res.json(removed);
};

export const getAuthor: RequestHandler = (req, res) => {
  const { id } = req.params;
  const author = authors.find((a) => a.id === id);
  if (!author) return res.status(404).json({ message: "Not Found" });
  const posts = DB.posts.filter((p) => p.authorId === id && p.state === "published");
  res.json({ ...author, postsCount: posts.length });
};
