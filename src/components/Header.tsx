
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import ScrollingNewsBanner from "./ScrollingNewsBanner";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import HeaderActions from "./HeaderActions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Gérer l'affichage de l'en-tête au scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll vers le bas - cacher l'en-tête
        setIsHeaderVisible(false);
      } else {
        // Scroll vers le haut - afficher l'en-tête
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#contact');
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-[9px] transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-0">
          <div className="flex items-center justify-between h-16">
            {/* Menu hamburger à gauche sur mobile */}
            <div className="flex items-center">
              <div className="md:hidden mr-3">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>

              {/* Logo toujours à gauche - maintenant cliquable */}
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png" 
                  alt="PANA RADIO" 
                  className="h-12 w-auto rounded-[7px] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleLogoClick}
                />
              </div>
            </div>

            {/* Navigation desktop au centre */}
            <DesktopNavigation handleContactClick={handleContactClick} />

            {/* Icônes à droite */}
            <HeaderActions />
          </div>

          <MobileNavigation 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            handleContactClick={handleContactClick}
          />
        </div>
      </header>
      
      {/* Bande de défilement des actualités - reste fixe en haut */}
      <div className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        isHeaderVisible ? 'top-16' : 'top-0'
      }`}>
        <ScrollingNewsBanner />
      </div>
    </>
  );
};

export default Header;
