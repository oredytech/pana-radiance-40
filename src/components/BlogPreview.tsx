import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "L'impact de la musique africaine dans le monde",
    date: "2024-02-15",
    excerpt: "Découvrez comment les artistes africains révolutionnent la scène musicale mondiale...",
    image: "https://source.unsplash.com/random/800x600/?african-music",
  },
  {
    title: "Les nouveaux défis des médias en Afrique",
    date: "2024-02-14",
    excerpt: "Analyse des transformations digitales dans le paysage médiatique africain...",
    image: "https://source.unsplash.com/random/800x600/?media",
  },
  {
    title: "Portrait: Les voix qui font PANA RADIO",
    date: "2024-02-13",
    excerpt: "Rencontrez les animateurs qui donnent vie à vos émissions préférées...",
    image: "https://source.unsplash.com/random/800x600/?radio-host",
  },
];

const BlogPreview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pana-purple">Derniers Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.title} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Button
                variant="outline"
                className="w-full hover:bg-pana-red hover:text-white transition-colors"
              >
                Lire la suite
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPreview;