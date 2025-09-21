import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { listPosts, getPost, createPost, updatePost, deletePost, getAuthor } from "./routes/posts";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Blog API
  app.get("/api/posts", listPosts);
  app.get("/api/posts/:id", getPost);
  app.post("/api/posts", createPost);
  app.put("/api/posts/:id", updatePost);
  app.delete("/api/posts/:id", deletePost);
  app.get("/api/authors/:id", getAuthor);

  return app;
}
