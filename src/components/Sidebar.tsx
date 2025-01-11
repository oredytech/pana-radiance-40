import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentComments = [
  {
    author: "Marie K.",
    content: "J'adore votre émission matinale ! Continuez comme ça !",
    date: "2024-02-15",
  },
  {
    author: "Jean P.",
    content: "La playlist d'hier était incroyable. Merci pour ces découvertes !",
    date: "2024-02-14",
  },
  {
    author: "Sophie M.",
    content: "Le débat sur la culture africaine était très enrichissant.",
    date: "2024-02-13",
  },
];

const Sidebar = () => {
  return (
    <div className="space-y-8">
      {/* Recent Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-pana-purple">
            Derniers Commentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentComments.map((comment, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <p className="text-sm text-gray-600">{comment.content}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs font-medium text-pana-purple">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.date).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
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