import ClubPost from "./ClubPost";

export default function ClubFeed({ posts = [] }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => <ClubPost key={post.id} post={post} />)}
    </div>
  );
}
