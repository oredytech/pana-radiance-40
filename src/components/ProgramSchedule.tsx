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
];

const ProgramSchedule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-pana-purple" />
        <h2 className="text-2xl font-bold text-pana-purple">Programme du Jour</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program) => (
          <Card key={program.time} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-pana-red">{program.time}</span>
                <span className="text-lg font-medium">{program.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Animé par {program.host}
              </p>
              <p className="text-gray-600">{program.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramSchedule;