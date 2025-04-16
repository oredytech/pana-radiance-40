
import { Calendar, Clock, Radio, ChevronDown } from "lucide-react";
import ProgramSchedule from "@/components/ProgramSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
  
  const isMobile = useIsMobile();
  const [selectedDay, setSelectedDay] = useState("aujourd'hui");

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Radio className="h-8 w-8 text-pana-purple" />
          <h1 className="text-3xl font-bold text-pana-purple">Grille des Programmes</h1>
        </div>

        {isMobile ? (
          <div className="w-full">
            <NavigationMenu className="w-full mb-6">
              <NavigationMenuList className="w-full justify-between border bg-white rounded-md">
                <NavigationMenuItem className="w-full">
                  <NavigationMenuTrigger className="w-full justify-between data-[state=open]:bg-pana-purple data-[state=open]:text-white">
                    <span>{selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-full">
                    <div className="w-[calc(100vw-32px)] p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-2 mb-1 hover:bg-gray-100 data-[active=true]:bg-pana-purple data-[active=true]:text-white"
                        data-active={selectedDay === "aujourd'hui"}
                        onClick={() => handleDaySelect("aujourd'hui")}
                      >
                        Aujourd'hui
                      </Button>
                      <ScrollArea className="max-h-[300px]">
                        {days.map((day) => (
                          <Button
                            key={day}
                            variant="ghost"
                            className="w-full justify-start p-2 mb-1 hover:bg-gray-100 data-[active=true]:bg-pana-purple data-[active=true]:text-white"
                            data-active={selectedDay === day.toLowerCase()}
                            onClick={() => handleDaySelect(day.toLowerCase())}
                          >
                            {day}
                          </Button>
                        ))}
                      </ScrollArea>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-6 w-6 text-pana-purple" />
                <h2 className="text-xl font-semibold text-pana-purple">
                  Programmes du {selectedDay === "aujourd'hui" ? "Jour" : selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                </h2>
              </div>
              <ProgramSchedule />
            </div>

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
                    onClick={() => handleDaySelect(day.toLowerCase())}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
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
        ) : (
          <Tabs defaultValue="aujourd'hui" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white border overflow-x-auto">
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
        )}
      </div>
    </div>
  );
};

export default Programs;
