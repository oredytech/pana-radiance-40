import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "L'impact de la musique africaine dans le monde",
    date: "2024-02-15",
    excerpt: "Découvrez comment les artistes africains révolutionnent la scène musicale mondiale...",
    image: "https://source.unsplash.com/random/800x600/?african-music",
    featured: true,
  },
  {
    title: "Les nouveaux défis des médias en Afrique",
    date: "2024-02-14",
    excerpt: "Analyse des transformations digitales dans le paysage médiatique africain...",
    image: "https://source.unsplash.com/random/400x400/?media",
  },
  {
    title: "Portrait: Les voix qui font PANA RADIO",
    date: "2024-02-13",
    excerpt: "Rencontrez les animateurs qui donnent vie à vos émissions préférées...",
    image: "https://source.unsplash.com/random/400x400/?radio-host",
  },
  {
    title: "La révolution du podcast en Afrique",
    date: "2024-02-12",
    excerpt: "Comment le podcast transforme la consommation des médias...",
    image: "https://source.unsplash.com/random/400x400/?podcast",
  },
  {
    title: "Les tendances musicales de 2024",
    date: "2024-02-11",
    excerpt: "Les nouveaux sons qui façonnent la musique africaine...",
    image: "https://source.unsplash.com/random/400x400/?music-trend",
  },
];

const BlogPreview = () => {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pana-purple">Derniers Articles</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Featured Post */}
        <Card className="lg:col-span-3 overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            className="w-full h-[400px] object-cover"
          />
          <CardHeader>
            <CardTitle className="text-2xl">{featuredPost.title}</CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(featuredPost.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
            <Button
              variant="outline"
              className="w-full hover:bg-pana-red hover:text-white transition-colors"
            >
              Lire la suite
            </Button>
          </CardContent>
        </Card>

        {/* Other Posts Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          {otherPosts.map((post) => (
            <Card key={post.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-32 object-cover"
              />
              <CardHeader className="p-4">
                <CardTitle className="text-sm">{post.title}</CardTitle>
                <p className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
