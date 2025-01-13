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
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <img
                      src="https://source.unsplash.com/random/800x600/?african-music"
                      alt="Article thumbnail"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        Article {index + 6}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
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