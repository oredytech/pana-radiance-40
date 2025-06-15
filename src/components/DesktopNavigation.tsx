
import { Link } from "react-router-dom";

interface NavigationItem {
  label: string;
  path: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface DesktopNavigationProps {
  handleContactClick: (e: React.MouseEvent) => void;
}

const DesktopNavigation = ({ handleContactClick }: DesktopNavigationProps) => {
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
      label: "Contact",
      path: "/#contact",
      onClick: handleContactClick
    }
  ];

  return (
    <nav className="hidden md:flex space-x-8">
      {navigationItems.map(item => (
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
  );
};

export default DesktopNavigation;
