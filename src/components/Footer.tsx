import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
const Footer = () => {
  return <footer className="bg-gray-900 text-white py-[58px]">
      <div className="container mx-auto px-4 py-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PANA RADIO</h3>
            <p className="text-gray-400">
              La voix de l'Afrique, en direct et en podcast
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {["Direct", "Programmes", "Podcasts", "Blog"].map(item => <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Légal</h3>
            <ul className="space-y-2">
              {["Mentions légales", "Politique de confidentialité", "Conditions d'utilisation"].map(item => <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              {[{
              Icon: Facebook,
              label: "Facebook"
            }, {
              Icon: Twitter,
              label: "Twitter"
            }, {
              Icon: Instagram,
              label: "Instagram"
            }, {
              Icon: Youtube,
              label: "Youtube"
            }].map(({
              Icon,
              label
            }) => <a key={label} href="#" className="text-gray-400 hover:text-white transition-colors" aria-label={label}>
                  <Icon className="h-6 w-6" />
                </a>)}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 py-[17px]">
          <p>&copy; {new Date().getFullYear()} PANA RADIO. Tous droits réservés.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;