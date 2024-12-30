import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import FeaturedContent from "@/components/FeaturedContent";
import ProgramSchedule from "@/components/ProgramSchedule";
import BlogPreview from "@/components/BlogPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Radio Player */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-pana-red to-pana-purple">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              PANA RADIO
            </h1>
            <p className="text-xl text-white/90">
              La voix de l'Afrique, en direct et en podcast
            </p>
          </div>
          <RadioPlayer />
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Nos Programmes
          </h2>
          <FeaturedContent />
        </div>
      </section>

      {/* Program Schedule Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto">
          <ProgramSchedule />
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <BlogPreview />
        </div>
      </section>
    </div>
  );
};

export default Index;