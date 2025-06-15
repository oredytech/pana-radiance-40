
import { programs } from "@/data/programData";
import ProgramCard from "./ProgramCard";

const ProgramSchedule = () => {
  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <ProgramCard key={program.time} program={program} />
      ))}
    </div>
  );
};

export default ProgramSchedule;
