import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const programs = [
  {
    time: "06:00 - 08:00",
    title: "Réveil Panafricain",
    host: "Aminata Diallo",
    description: "Le meilleur de la musique africaine pour bien commencer la journée",
  },
  {
    time: "08:00 - 10:00",
    title: "Africa News",
    host: "Kofi Mensah",
    description: "L'actualité du continent en direct",
  },
  {
    time: "10:00 - 12:00",
    title: "Culture & Traditions",
    host: "Marie Faye",
    description: "Découverte des cultures et traditions africaines",
  },
  {
    time: "14:00 - 16:00",
    title: "Business Africa",
    host: "John Okafor",
    description: "L'économie et les affaires en Afrique",
  },
  {
    time: "16:00 - 18:00",
    title: "Sport Africa",
    host: "Samuel Eto'o",
    description: "Toute l'actualité du sport africain",
  },
  {
    time: "18:00 - 20:00",
    title: "Musique du Soir",
    host: "Youssou N'Dour",
    description: "Les meilleurs sons d'Afrique",
  },
];

const ProgramSchedule = () => {
  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <Card 
          key={program.time} 
          className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-pana-purple"
        >
          <CardHeader className="py-4">
            <CardTitle className="flex justify-between items-center text-base">
              <span className="text-pana-red font-medium">{program.time}</span>
              <span className="text-lg font-semibold">{program.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Animé par {program.host}
            </p>
            <p className="text-gray-600 text-sm">{program.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgramSchedule;