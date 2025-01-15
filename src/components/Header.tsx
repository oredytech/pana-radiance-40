import { useState } from "react";
import { Menu, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const togglePlay = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png"
              alt="PANA RADIO"
              className="h-12 w-auto"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* EN DIRECT Button */}
            <Button
              onClick={togglePlay}
              className="bg-pana-red hover:bg-pana-purple transition-colors hidden md:flex"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              EN DIRECT
            </Button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {["Direct", "Programmes", "Podcasts", "Blog", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-700 hover:text-pana-red transition-colors duration-200"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in">
            <Button
              onClick={togglePlay}
              className="bg-pana-red hover:bg-pana-purple transition-colors w-full mb-4"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              EN DIRECT
            </Button>
            {["Direct", "Programmes", "Podcasts", "Blog", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-2 text-gray-700 hover:text-pana-red transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;