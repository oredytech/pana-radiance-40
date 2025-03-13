
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesGrid from "@/components/ArticlesGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock categories for now - in a real app, these would come from WordPress
const categories = [
  { id: "all", name: "Tous les articles" },
  { id: "actualites", name: "Actualités" },
  { id: "musique", name: "Musique" },
  { id: "culture", name: "Culture" },
  { id: "societe", name: "Société" }
];

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  const postsPerPage = 12;

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive",
        });
      },
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Erreur de chargement</h2>
          <p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter posts by category (in a real app, this would use WordPress category IDs)
  // For now, we'll just simulate categories by dividing the posts
  const getFilteredPosts = () => {
    if (!posts) return [];
    
    if (activeCategory === "all") return posts;
    
    // Mock category filtering (in a real app, posts would have category data)
    const postsLength = posts.length;
    switch (activeCategory) {
      case "actualites":
        return posts.filter((_, index) => index % 5 === 0);
      case "musique":
        return posts.filter((_, index) => index % 5 === 1);
      case "culture":
        return posts.filter((_, index) => index % 5 === 2);
      case "societe":
        return posts.filter((_, index) => index % 5 === 3 || index % 5 === 4);
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Get current page posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the edges
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="pt-[104px] pb-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Tous nos articles</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="w-full flex overflow-x-auto pb-2 mb-6 justify-start md:justify-center">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="min-w-fit px-4 py-2 data-[state=active]:bg-pana-red data-[state=active]:text-white"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-4">
                  {isLoading ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pana-red mx-auto mb-4"></div>
                        <p>Chargement des articles...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ArticlesGrid 
                        posts={currentPosts}
                        isLoading={isLoading}
                        getImageUrl={getImageUrl}
                        stripHtml={stripHtml}
                        getSlug={getSlug}
                        truncateText={truncateText}
                        displayCount={12}
                      />
                      
                      {filteredPosts.length > 0 ? (
                        <Pagination className="mt-8">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => paginate(currentPage - 1)} 
                                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                aria-disabled={currentPage === 1}
                              />
                            </PaginationItem>
                            
                            {getPageNumbers().map((pageNumber, index) => (
                              pageNumber === 'ellipsis-start' || pageNumber === 'ellipsis-end' ? (
                                <PaginationItem key={`ellipsis-${index}`}>
                                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                                </PaginationItem>
                              ) : (
                                <PaginationItem key={`page-${pageNumber}`}>
                                  <PaginationLink 
                                    isActive={currentPage === pageNumber} 
                                    onClick={() => paginate(Number(pageNumber))}
                                  >
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              )
                            ))}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => paginate(currentPage + 1)} 
                                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                aria-disabled={currentPage === totalPages}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      ) : (
                        <div className="text-center py-12">
                          <p>Aucun article trouvé dans cette catégorie.</p>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Articles;
