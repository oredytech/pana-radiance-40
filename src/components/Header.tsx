
import { useState } from "react";
import { Menu, X, Play, Pause, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ScrollingNewsBanner from "./ScrollingNewsBanner";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    currentPodcast,
    stopPodcast
  } = usePodcastPlayer();

  const handleDirectClick = () => {
    if (currentPodcast) {
      stopPodcast();
    }
    if (window.globalAudio) {
      if (window.globalAudio.paused) {
        window.globalAudio.play().catch(error => {
          console.error("Playback error:", error);
        });
      } else {
        window.globalAudio.pause();
      }
    }
    navigate('/direct');
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#contact');
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const isPlaying = window.globalAudio ? !window.globalAudio.paused : false;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-[9px]">
        <div className="container mx-auto px-0">
          <div className="flex items-center justify-between h-16">
            {/* Menu hamburger à gauche sur mobile */}
            <div className="flex items-center">
              <div className="md:hidden mr-3">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>

              {/* Logo toujours à gauche */}
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png" 
                  alt="PANA RADIO" 
                  className="h-12 w-auto rounded-[7px]"
                />
              </div>
            </div>

            {/* Navigation desktop au centre */}
            <nav className="hidden md:flex space-x-8">
              {[{
                label: "Accueil",
                path: "/"
              }, {
                label: "Programmes",
                path: "/programs"
              }, {
                label: "Podcasts",
                path: "/podcasts"
              }, {
                label: "Actualités",
                path: "/articles"
              }, {
                label: "Contact",
                path: "/#contact",
                onClick: handleContactClick
              }].map(item => (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  onClick={item.onClick}
                  className="text-gray-700 hover:text-pana-red transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Icônes à droite */}
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSearchClick}
                className="hover:text-pana-red"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleDirectClick} 
                className="bg-pana-red hover:bg-pana-purple transition-colors animate-pulse"
                size={isMobile ? "icon" : "default"}
                aria-label={isMobile ? (isPlaying ? "Pause" : "Play") : undefined}
              >
                {isMobile ? (
                  isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />
                ) : (
                  <>
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    EN DIRECT {isPlaying && "• EN COURS"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden py-4 animate-fade-in">
              {[{
                label: "Accueil",
                path: "/"
              }, {
                label: "Programmes",
                path: "/programs"
              }, {
                label: "Podcasts",
                path: "/podcasts"
              }, {
                label: "Actualités",
                path: "/articles"
              }, {
                label: "Recherche",
                path: "/search"
              }, {
                label: "Contact",
                path: "/#contact",
                onClick: handleContactClick
              }].map(item => (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    item.onClick?.(e);
                  }}
                  className="block py-2 text-gray-700 hover:text-pana-red transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      
      {/* Bande de défilement des actualités */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <ScrollingNewsBanner />
      </div>
    </>
  );
};

export default Header;
