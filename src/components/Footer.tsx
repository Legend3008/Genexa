
import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ChevronRight,
  Heart,
  Shield,
  Clock
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-teal-400 pt-16 pb-8 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white flex items-center mb-6 hover:text-blue-100 transition-colors duration-300">
              <span className="text-blue-100">Health</span>
              <span>Sync</span>
            </Link>
            <p className="text-blue-50 mb-6">
              Revolutionizing healthcare with cutting-edge technology, ensuring better care for all.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-500 transition-colors duration-300 hover:border-white transform hover:-translate-y-1"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-500 transition-colors duration-300 hover:border-white transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-500 transition-colors duration-300 hover:border-white transform hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-500 transition-colors duration-300 hover:border-white transform hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-blue-50 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-blue-200 group-hover:translate-x-1 transition-transform duration-300" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/mission" 
                  className="text-blue-50 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-blue-200 group-hover:translate-x-1 transition-transform duration-300" />
                  Our Mission
                </Link>
              </li>
              <li>
                <Link 
                  to="/appointments" 
                  className="text-blue-50 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-blue-200 group-hover:translate-x-1 transition-transform duration-300" />
                  Appointments
                </Link>
              </li>
              <li>
                <Link 
                  to="/consultation" 
                  className="text-blue-50 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-blue-200 group-hover:translate-x-1 transition-transform duration-300" />
                  Virtual Consult
                </Link>
              </li>
              <li>
                <Link 
                  to="/map" 
                  className="text-blue-50 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-blue-200 group-hover:translate-x-1 transition-transform duration-300" />
                  3D Map
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <Heart size={18} className="text-blue-200 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-blue-50 group-hover:text-white transition-colors duration-300">AI-Powered Diagnostics</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Shield size={18} className="text-blue-200 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-blue-50 group-hover:text-white transition-colors duration-300">Blockchain Medical Records</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Clock size={18} className="text-blue-200 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-blue-50 group-hover:text-white transition-colors duration-300">24/7 Emergency Services</span>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-blue-200 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-blue-50 group-hover:text-white transition-colors duration-300">Real-time Facility Mapping</span>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin 
                  size={18} 
                  className="text-blue-200 mr-3 mt-1 flex-shrink-0 group-hover:text-white transition-colors duration-300" 
                />
                <span className="text-blue-50 group-hover:text-white transition-colors duration-300">
                  123 Innovation Drive, Medical District<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center group">
                <Phone 
                  size={18} 
                  className="text-blue-200 mr-3 flex-shrink-0 group-hover:text-white transition-colors duration-300" 
                />
                <a 
                  href="tel:+18001234567" 
                  className="text-blue-50 hover:text-white transition-colors duration-300"
                >
                  1-800-HEALTHSYNC
                </a>
              </li>
              <li className="flex items-center group">
                <Mail 
                  size={18} 
                  className="text-blue-200 mr-3 flex-shrink-0 group-hover:text-white transition-colors duration-300" 
                />
                <a 
                  href="mailto:info@healthsync.com" 
                  className="text-blue-50 hover:text-white transition-colors duration-300"
                >
                  info@healthsync.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-50 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} HealthSync. All rights reserved. | HIPAA Compliant
            </p>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-blue-50 hover:text-white transition-colors duration-300 text-sm hover-underline"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-blue-50 hover:text-white transition-colors duration-300 text-sm hover-underline"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-blue-50 hover:text-white transition-colors duration-300 text-sm hover-underline"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
