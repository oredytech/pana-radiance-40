
import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/services/wordpress";
import { stripHtml, getSlug, getImageUrl } from "@/utils/textUtils";
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

  // Créer plusieurs copies pour un défilement vraiment infini
  const repeatedPosts = Array(5).fill(recentPosts).flat();

  return (
    <div className="bg-pana-red text-white py-3 overflow-hidden relative">
      <div className="flex items-center">
        {/* Titre fixe à gauche */}
        <div className="bg-white text-pana-red px-4 py-1 font-bold text-sm whitespace-nowrap mr-4 z-10">
          À LA UNE :
        </div>
        
        {/* Contenu défilant */}
        <div className="flex animate-scroll whitespace-nowrap">
          {repeatedPosts.map((post, index) => (
            <Link
              key={`${post.id}-${index}`}
              to={`/${getSlug(post.title.rendered)}`}
              className="inline-flex items-center mx-6 hover:text-gray-200 transition-colors duration-200"
            >
              <img
                src={getImageUrl(post)}
                alt=""
                className="w-8 h-8 rounded object-cover mr-3"
              />
              <span className="text-sm font-medium">
                {stripHtml(post.title.rendered)}
              </span>
            </Link>
          ))}
        </div>
      </div>
      
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
          .animate-scroll {
            animation: scroll 120s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ScrollingNewsBanner;
