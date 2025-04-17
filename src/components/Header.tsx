import { useState } from "react";
import { Menu, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
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

  const isPlaying = window.globalAudio ? !window.globalAudio.paused : false;

  return <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-[9px]">
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between h-16">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="flex items-center md:order-first">
            <img 
              src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png" 
              alt="PANA RADIO" 
              className="h-12 w-auto rounded-[7px]"
            />
          </div>

          <div className="flex items-center md:order-last">
            <Button onClick={handleDirectClick} className="bg-pana-red hover:bg-pana-purple transition-colors mx-[10px]">
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              EN DIRECT {isPlaying && "• EN COURS"}
            </Button>
          </div>

          <nav className="hidden md:flex space-x-8 mx-8">
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
            path: "/"
          }].map(item => <Link key={item.label} to={item.path} className="text-gray-700 hover:text-pana-red transition-colors duration-200">
                {item.label}
              </Link>)}
          </nav>
        </div>

        {isMenuOpen && <nav className="md:hidden py-4 animate-fade-in">
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
          path: "/"
        }].map(item => <Link key={item.label} to={item.path} className="block py-2 text-gray-700 hover:text-pana-red transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>)}
          </nav>}
      </div>
    </header>;
};

export default Header;
