import { useQuery } from "@tanstack/react-query";
import { fetchLatestComments } from "@/services/wordpress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Sidebar = () => {
  const { toast } = useToast();
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["latestComments"],
    queryFn: () => fetchLatestComments(10),
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

  return (
    <div className="space-y-8">
      {/* Recent Comments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-pana-purple">
            Derniers Commentaires
          </CardTitle>
          <Link to="/comments">
            <Button variant="ghost" size="sm" className="text-pana-purple">
              Voir tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-gray-500">Chargement des commentaires...</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs font-medium text-pana-purple">
                      {comment.author_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.date).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advertisement Section */}
      <Card className="bg-gradient-to-br from-pana-orange to-pana-red text-white">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">Publicité</h3>
          <div className="aspect-[4/3] bg-black/10 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-sm text-white/70">Espace Publicitaire</span>
          </div>
          <p className="text-sm text-white/90">
            Intéressé par cet espace publicitaire ? Contactez-nous pour plus d'informations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;