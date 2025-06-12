
import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/services/wordpress";
import { stripHtml, getSlug } from "@/utils/textUtils";
import { Link } from "react-router-dom";

const ScrollingNewsBanner = () => {
  const { data: recentPosts } = useQuery({
    queryKey: ["recent-posts-banner"],
    queryFn: () => fetchRecentPosts(10),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-pana-red text-white py-2 overflow-hidden relative">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* Dupliquer les articles pour créer un défilement continu */}
        {[...recentPosts, ...recentPosts, ...recentPosts].map((post, index) => (
          <Link
            key={`${post.id}-${index}`}
            to={`/${getSlug(post.title.rendered)}`}
            className="inline-flex items-center mx-8 hover:text-gray-200 transition-colors duration-200"
          >
            <span className="text-sm font-medium">
              🔥 {stripHtml(post.title.rendered)}
            </span>
          </Link>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScrollingNewsBanner;
