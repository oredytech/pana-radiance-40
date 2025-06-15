
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Program } from "@/data/programData";

interface ProgramCardProps {
  program: Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-pana-purple">
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
  );
};

export default ProgramCard;
