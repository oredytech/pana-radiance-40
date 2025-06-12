
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
    <div className="bg-pana-red text-white py-1 overflow-hidden relative h-[20px]">
      <div className="flex items-center h-full">
        {/* Titre fixe à gauche avec un style amélioré */}
        <div className="bg-gradient-to-r from-white to-gray-100 text-pana-red px-2 py-0.5 font-bold text-xs whitespace-nowrap mr-3 z-10 rounded-r-lg shadow-md border-l-4 border-yellow-400">
          À LA UNE
        </div>
        
        {/* Contenu défilant */}
        <div className="flex animate-scroll whitespace-nowrap h-full items-center">
          {repeatedPosts.map((post, index) => (
            <Link
              key={`${post.id}-${index}`}
              to={`/${getSlug(post.title.rendered)}`}
              className="inline-flex items-center mx-4 hover:text-gray-200 transition-colors duration-200 h-full"
            >
              <img
                src={getImageUrl(post)}
                alt=""
                className="w-4 h-4 rounded object-cover mr-2 flex-shrink-0"
              />
              <span className="text-xs font-medium truncate">
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
