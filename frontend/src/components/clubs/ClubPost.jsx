export default function ClubPost({ post }) {
  return (
    <div className="glass-card card-pad">
      <p>{post.content}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{new Date(post.created_at).toLocaleString()}</span>
        <span>♥ {post.like_count || 0}</span>
      </div>
    </div>
  );
}
