
import { Link } from "react-router-dom";

interface NavigationItem {
  label: string;
  path: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  handleContactClick: (e: React.MouseEvent) => void;
}

const MobileNavigation = ({ isMenuOpen, setIsMenuOpen, handleContactClick }: MobileNavigationProps) => {
  const navigationItems: NavigationItem[] = [
    {
      label: "Accueil",
      path: "/"
    },
    {
      label: "Programmes",
      path: "/programs"
    },
    {
      label: "Podcasts",
      path: "/podcasts"
    },
    {
      label: "Actualités",
      path: "/articles"
    },
    {
      label: "Recherche",
      path: "/search"
    },
    {
      label: "Contact",
      path: "/#contact",
      onClick: handleContactClick
    }
  ];

  if (!isMenuOpen) return null;

  return (
    <nav className="md:hidden py-4 animate-fade-in">
      {navigationItems.map(item => (
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
  );
};

export default MobileNavigation;
