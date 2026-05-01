import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react'; // NAYA: ChevronDown import kiya

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Contact Info (No Changes Here) */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-red-500" />
                <div>
                  <p>45 W John Street Unit B</p>
                  <p>Hicksville, NY 11801</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-red-500" />
                <a href="tel:5167885722" className="hover:text-red-500 transition-colors">(516) 788-5722</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-red-500" />
                <a href="mailto:xenmotors@gmail.com" className="hover:text-red-500 transition-colors">xenmotors@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Business Hours (No Changes Here) */}
          <div>
            <h3 className="text-2xl font-bold mb-6">BUSINESS HOURS</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-gray-400">Closed</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Monday</span>
                <span className="font-semibold">8:00 AM - 8:00 PM EDT</span>
              </div>
              <div className="flex justify-between">
                <span>Tuesday</span>
                <span>8:00 AM - 8:00 PM EDT</span>
              </div>
              <div className="flex justify-between">
                <span>Wednesday</span>
                <span>8:00 AM - 8:00 PM EDT</span>
              </div>
              <div className="flex justify-between">
                <span>Thursday</span>
                <span>8:00 AM - 8:00 PM EDT</span>
              </div>
              <div className="flex justify-between">
                <span>Friday</span>
                <span>8:00 AM - 8:00 PM EDT</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 5:00 PM EDT</span>
              </div>
            </div>
          </div>

          {/* Map Section (No Changes Here) */}
          <div>
            <h3 className="text-2xl font-bold mb-6">DIRECTIONS</h3>
            <div className="bg-gray-800 h-64 rounded-lg overflow-hidden" data-testid="footer-map">
              <iframe
                title="Xen Motors Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.6334542159495!2d-73.5323214!3d40.72611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c280629729864d%3A0x6b77c57099712571!2s45%20W%20John%20St%20%23%20B%2C%20Hicksville%2C%20NY%2011801%2C%20USA!5e0!3m2!1sen!2sin!4v1714310000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a
              href="https://maps.google.com/?q=45+W+John+Street+Unit+B+Hicksville+NY+11801"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-red-500 hover:text-red-400 transition-colors"
              data-testid="footer-get-directions"
            >
              Get Directions →
            </a>
          </div>
        </div>

        {/* =======================================================
            NAYA CODE: Bilkul image_3bd2e3.png jaisa structure 
        ======================================================== */}
        <div className="border-t border-gray-700 pt-6">
          
          {/* Top Navbar (Centered with Dropdown arrows) */}
          <nav className="flex justify-center items-center gap-6 md:gap-8 flex-wrap mb-6 font-bold text-[15px] text-white">
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
            <Link to="/inventory" className="hover:text-red-500 transition-colors">Cars For Sale</Link>
            <Link to="/find-car" className="flex items-center gap-1 hover:text-red-500 transition-colors">Find a Car <ChevronDown size={16} strokeWidth={3} /></Link>
            <Link to="/finance" className="flex items-center gap-1 hover:text-red-500 transition-colors">Finance <ChevronDown size={16} strokeWidth={3} /></Link>
            <Link to="/services" className="flex items-center gap-1 hover:text-red-500 transition-colors">Services <ChevronDown size={16} strokeWidth={3} /></Link>
            <Link to="/warranty" className="flex items-center gap-1 hover:text-red-500 transition-colors">Warranty <ChevronDown size={16} strokeWidth={3} /></Link>
            <Link to="/contact" className="flex items-center gap-1 hover:text-red-500 transition-colors">Contact Us <ChevronDown size={16} strokeWidth={3} /></Link>
          </nav>
          
          {/* Bottom Copyright & Link Section (Left-Right Split like Image) */}
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left Side: Copyright & Terms Agreement */}
            <div className="text-center md:text-left text-white">
              <p className="font-bold text-sm mb-2">
                © 2026 Powered by <a href="https://www.zarnetic.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">Zarnetic</a>™
              </p>
              <p className="text-xs text-gray-300">
                By placing calls, you agree to the <Link to="/terms" className="underline hover:text-red-500">Terms and Conditions of Use</Link>.
              </p>
            </div>

            {/* Right Side: Sitemap, Terms & Account Login */}
            <div className="flex items-center gap-6 text-sm font-bold text-white">
              <Link to="/sitemap" className="hover:text-red-500 transition-colors">Sitemap</Link>
              <Link to="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link>
              <a 
                href="/admin/login" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-red-500 transition-colors"
                data-testid="footer-admin-login"
              >
                Account Login
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;