import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import FeaturedContent from "@/components/FeaturedContent";
import ProgramSchedule from "@/components/ProgramSchedule";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Radio Player */}
      <section className="py-12 px-4 bg-gradient-to-br from-pana-red to-pana-purple">
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

      {/* Latest Articles Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <BlogPreview />
        </div>
      </section>

      {/* More Articles Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles Grid */}
            <div className="lg:w-3/4">
              <h2 className="text-2xl font-bold text-pana-purple mb-8">Plus d'articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 15 }).map((_, index) => (
                  <a 
                    href="#" 
                    key={index} 
                    className="relative group aspect-[4/3] overflow-hidden rounded-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add your article link logic here
                      console.log(`Clicked article ${index + 6}`);
                    }}
                  >
                    <img
                      src="https://source.unsplash.com/random/800x600/?african-music"
                      alt="Article thumbnail"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                    <h3 className="absolute bottom-4 left-4 right-4 text-white font-semibold text-lg line-clamp-2 group-hover:underline">
                      Article {index + 6}
                    </h3>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Sidebar />
            </div>
          </div>
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

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Contact />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;