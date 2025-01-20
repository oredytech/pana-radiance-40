import { Calendar, Clock, Radio } from "lucide-react";
import ProgramSchedule from "@/components/ProgramSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";

const Programs = () => {
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Radio className="h-8 w-8 text-pana-purple" />
          <h1 className="text-3xl font-bold text-pana-purple">Grille des Programmes</h1>
        </div>

        <Tabs defaultValue="aujourd'hui" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-white border">
            <TabsTrigger value="aujourd'hui" className="data-[state=active]:bg-pana-purple data-[state=active]:text-white">
              Aujourd'hui
            </TabsTrigger>
            {days.map((day) => (
              <TabsTrigger 
                key={day} 
                value={day.toLowerCase()}
                className="data-[state=active]:bg-pana-purple data-[state=active]:text-white"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="aujourd'hui" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="h-6 w-6 text-pana-purple" />
                    <h2 className="text-xl font-semibold text-pana-purple">
                      Programmes du Jour
                    </h2>
                  </div>
                  <ProgramSchedule />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="h-6 w-6 text-pana-purple" />
                    <h2 className="text-xl font-semibold text-pana-purple">
                      Cette Semaine
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {days.map((day) => (
                      <button
                        key={day}
                        className="w-full text-left px-4 py-3 rounded hover:bg-gray-50 transition-colors"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-pana-purple mb-4">
                    Émissions à la une
                  </h2>
                  <div className="space-y-4">
                    {["Réveil Panafricain", "Africa News", "Culture & Traditions"].map(
                      (show) => (
                        <div
                          key={show}
                          className="p-4 border rounded-lg hover:border-pana-purple transition-colors cursor-pointer"
                        >
                          <h3 className="font-medium">{show}</h3>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {days.map((day) => (
            <TabsContent key={day} value={day.toLowerCase()}>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-pana-purple mb-6">
                  Programmes du {day}
                </h2>
                <ProgramSchedule />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Programs;