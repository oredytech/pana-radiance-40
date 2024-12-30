import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featuredContent = [
  {
    title: "Le Journal",
    time: "7h00 - 8h30",
    description: "L'actualité panafricaine en direct",
  },
  {
    title: "Culture & Société",
    time: "10h00 - 11h30",
    description: "Découvrez la richesse culturelle africaine",
  },
  {
    title: "Économie",
    time: "14h00 - 15h30",
    description: "Analyses et perspectives économiques",
  },
  {
    title: "Sport",
    time: "18h00 - 19h30",
    description: "Toute l'actualité sportive",
  },
];

const FeaturedContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredContent.map((content) => (
        <Card key={content.title} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-pana-purple">
              {content.title}
            </CardTitle>
            <p className="text-sm text-gray-500">{content.time}</p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{content.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedContent;