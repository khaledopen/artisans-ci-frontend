import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0b1220] to-[#0a1020] text-gray-300">
      
      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-white text-xl font-semibold">
              ArtisanCI
            </span>
          </div>

          <p className="text-sm leading-relaxed mb-6">
            La plateforme qui connecte les artisans professionnels
            avec les clients à la recherche de services de qualité.
          </p>

          <div className="flex gap-4 text-gray-400">
            <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Services
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white cursor-pointer">Plomberie</li>
            <li className="hover:text-white cursor-pointer">Électricité</li>
            <li className="hover:text-white cursor-pointer">Serrurerie</li>
            <li className="hover:text-white cursor-pointer">Peinture</li>
            <li className="hover:text-white cursor-pointer">Tous les services</li>
          </ul>
        </div>

        {/* ENTREPRISE */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Entreprise
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white cursor-pointer">À propos</li>
            <li className="hover:text-white cursor-pointer">Devenir artisan</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Carrières</li>
            <li className="hover:text-white cursor-pointer">Presse</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Contact
          </h4>

          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-500" />
              contact@artisanci.ci
            </li>

            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-500" />
              01 41 81 60 02
            </li>

            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-500 mt-1" />
              <span>
                BINGERVILLE AKANDJE<br />
                route du zoo , 240
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* BARRE DU BAS */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          
          <span>
            © 2026 ArtisanCI. Tous droits réservés.
          </span>

          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">
              Mentions légales
            </span>
            <span className="hover:text-white cursor-pointer">
              Confidentialité
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
