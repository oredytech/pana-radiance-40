import ProgramSchedule from "@/components/ProgramSchedule";

const Programs = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-pana-purple mb-8">Nos Programmes</h1>
      <div className="max-w-4xl mx-auto">
        <ProgramSchedule />
      </div>
    </div>
  );
};

export default Programs;