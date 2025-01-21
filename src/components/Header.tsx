import { useState } from "react";
import { Menu, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleDirectClick = () => {
    navigate('/direct');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button (left) */}
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

          {/* Logo (center on mobile, left on desktop) */}
          <div className="flex items-center md:order-first">
            <img
              src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png"
              alt="PANA RADIO"
              className="h-12 w-auto"
            />
          </div>

          {/* EN DIRECT Button (right on mobile, after nav on desktop) */}
          <div className="flex items-center md:order-last">
            <Button
              onClick={handleDirectClick}
              className="bg-pana-red hover:bg-pana-purple transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              EN DIRECT
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 mx-8">
            {[
              { label: "Direct", path: "/" },
              { label: "Programmes", path: "/programs" },
              { label: "Podcasts", path: "/podcasts" },
              { label: "Blog", path: "/" },
              { label: "Contact", path: "/" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="text-gray-700 hover:text-pana-red transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in">
            {[
              { label: "Direct", path: "/" },
              { label: "Programmes", path: "/programs" },
              { label: "Podcasts", path: "/podcasts" },
              { label: "Blog", path: "/" },
              { label: "Contact", path: "/" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="block py-2 text-gray-700 hover:text-pana-red transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
