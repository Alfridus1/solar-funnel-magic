import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Kontakt</h3>
            <div className="space-y-2">
              <a href="tel:+4908919469588" className="flex items-center gap-2 text-gray-600 hover:text-solar-orange">
                <Phone className="h-4 w-4" />
                089 / 194 69 588
              </a>
              <a href="mailto:info@coppen.de" className="flex items-center gap-2 text-gray-600 hover:text-solar-orange">
                <Mail className="h-4 w-4" />
                info@coppen.de
              </a>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <address className="not-italic">
                  Coppen Solar GmbH<br />
                  Landsberger Straße 400<br />
                  81241 München
                </address>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Unternehmen</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-solar-orange">Über uns</Link>
              </li>
              <li>
                <Link to="/career" className="text-gray-600 hover:text-solar-orange">Karriere</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-solar-orange">Kontakt</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-solar-orange">Blog</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-solar-orange">FAQ</Link>
              </li>
              <li>
                <Link to="/financing" className="text-gray-600 hover:text-solar-orange">Finanzierung</Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-600 hover:text-solar-orange">Garantie</Link>
              </li>
              <li>
                <Link to="/references" className="text-gray-600 hover:text-solar-orange">Referenzen</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Folgen Sie uns</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-solar-orange">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-solar-orange">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-solar-orange">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-sm text-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link to="/privacy" className="hover:text-solar-orange">Datenschutz</Link>
              <Link to="/imprint" className="hover:text-solar-orange">Impressum</Link>
              <Link to="/terms" className="hover:text-solar-orange">AGB</Link>
            </div>
            <div>
              © {new Date().getFullYear()} Coppen Solar GmbH. Alle Rechte vorbehalten.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};