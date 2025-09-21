import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { fetchPostById } from "@/features/posts/postsSlice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((s: RootState) => s.posts.items.find((p) => p.id === id));

  useEffect(() => {
    if (!post && id) dispatch(fetchPostById(id));
  }, [id, post, dispatch]);

  if (!id) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        {!post ? (
          <div className="grid place-items-center py-20 text-muted-foreground">Loading…</div>
        ) : (
          <article className="mx-auto max-w-3xl">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:underline">Home</Link> / <span>{post.title}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{post.title}</h1>
            <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between">
              <span>By {post.authorName}</span>
              <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
            {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-6 rounded-xl" />}
            <div className="prose prose-slate dark:prose-invert mt-6" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
