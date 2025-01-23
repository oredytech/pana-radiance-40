import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllComments } from "@/services/wordpress";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Comments = () => {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["comments", page],
    queryFn: () => fetchAllComments(page),
    keepPreviousData: true,
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les commentaires",
          variant: "destructive",
        });
      },
    },
  });

  const comments = data?.comments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-16 pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Tous les commentaires
        </h1>
        
        <div className="space-y-6">
          {isLoading ? (
            <p className="text-center text-gray-500">Chargement des commentaires...</p>
          ) : (
            <>
              {comments.map((comment) => (
                <Card key={comment.id} className="p-6">
                  <div className="space-y-2">
                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-pana-purple">
                        {comment.author_name}
                      </span>
                      <span className="text-gray-500">
                        {new Date(comment.date).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
              
              {page < totalPages && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                    className="bg-pana-purple hover:bg-pana-purple/90"
                  >
                    {isFetching ? "Chargement..." : "Plus de commentaires"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Comments;