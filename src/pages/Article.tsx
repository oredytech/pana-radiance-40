
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getImageUrl, stripHtml, getSlug } from "@/utils/textUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Share, MessageCircle } from "lucide-react";

const Article = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article",
          variant: "destructive",
        });
      },
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Commentaire envoyé",
      description: "Votre commentaire a été envoyé avec succès et est en attente de modération.",
    });
  };

  if (isLoadingPosts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const post = posts?.find(p => {
    const postSlug = getSlug(p.title.rendered);
    console.log(`Comparing: "${postSlug}" with "${slug}"`);
    return postSlug === slug;
  });

  if (!post) {
    console.log("Article non trouvé:", slug);
    console.log("Articles disponibles:", posts?.map(p => getSlug(p.title.rendered)));
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Article non trouvé</h1>
            <p className="text-gray-600">Désolé, l'article que vous recherchez n'existe pas ou a été déplacé.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recentPosts = posts?.filter(p => p.id !== post.id).slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Featured image taking full width */}
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <img
              src={getImageUrl(post)}
              alt={stripHtml(post.title.rendered)}
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="w-full lg:w-2/3">
              <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <h1 
                    className="text-3xl font-bold mb-4" 
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                  />
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  />
                </div>
              </article>

              <div className="my-6">
                <h3 className="text-lg font-semibold mb-3">Partager cet article</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#25D366] hover:bg-[#25D366]/80 text-white border-none"
                    onClick={() => window.open(`https://wa.me/?text=${window.location.href}`, '_blank')}
                  >
                    <MessageCircle />
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 text-white border-none"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                  >
                    <Facebook />
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#E4405F] hover:bg-[#E4405F]/80 text-white border-none"
                    onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                  >
                    <Instagram />
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#0077B5] hover:bg-[#0077B5]/80 text-white border-none"
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                  >
                    <Linkedin />
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-gray-700 hover:bg-gray-700/80 text-white border-none"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: stripHtml(post.title.rendered),
                          url: window.location.href
                        })
                      }
                    }}
                  >
                    <Share />
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold mb-4">Laisser un commentaire</h2>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
                    <Input id="name" placeholder="Votre nom" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <Input id="email" type="email" placeholder="Votre email" required />
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium mb-1">Commentaire</label>
                    <Textarea id="comment" placeholder="Écrivez votre commentaire ici..." rows={4} required />
                  </div>
                  <Button type="submit" className="bg-pana-red hover:bg-pana-red/80">
                    Envoyer le commentaire
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Articles récents</h2>
                <div className="space-y-4">
                  {recentPosts.map(recentPost => (
                    <Card key={recentPost.id} className="overflow-hidden">
                      <div className="h-36 bg-gray-200 relative">
                        <img 
                          src={getImageUrl(recentPost)} 
                          alt={stripHtml(recentPost.title.rendered)} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <a 
                          href={`/article/${getSlug(recentPost.title.rendered)}`}
                          className="font-medium hover:text-pana-red transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: recentPost.title.rendered }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Catégories</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
                      Actualités
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
                      Culture
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
                      Musique
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
                      Politique
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
                      Sport
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="pb-[70px]">
        <Footer />
      </div>
    </div>
  );
};

export default Article;
