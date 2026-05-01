import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react';

// NAYA COMPONENT: Footer me upar khulne wale dropdown ke liye
const FooterDropdown = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className="relative" 
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 hover:text-red-500 transition-colors py-2 cursor-pointer">
        {label} <ChevronDown size={16} strokeWidth={3} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-gray-700 shadow-2xl min-w-[220px] z-50 py-2 rounded-sm">
          {items.map((item, index) => (
            <Link 
              key={index} 
              to={item.path} 
              onClick={() => {
                window.scrollTo(0, 0); // Click karne par page top par jayega
                setIsOpen(false);
              }}
              className="block px-5 py-2.5 text-sm font-normal text-white hover:bg-gray-800 hover:text-red-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  // Page top par bhejne ke liye helper function
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Contact Info */}
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

          {/* Business Hours */}
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

          {/* Map Section */}
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
            UPDATED: Links with window.scrollTo aur Hover Dropdowns
        ======================================================== */}
        <div className="border-t border-gray-700 pt-6">
          
          <nav className="flex justify-center items-center gap-6 md:gap-8 flex-wrap mb-6 font-bold text-[15px] text-white">
            <Link to="/" onClick={scrollToTop} className="hover:text-red-500 transition-colors py-2">Home</Link>
            <Link to="/inventory" onClick={scrollToTop} className="hover:text-red-500 transition-colors py-2">Cars For Sale</Link>
            
            <FooterDropdown label="Find a Car" items={[
              { label: 'Start Your Vehicle Purchase', path: '/start-your-vehicle-purchase' },
              { label: 'Car Finder', path: '/find-car' }
            ]} />
            
            <FooterDropdown label="Finance" items={[
              { label: 'Loan Application', path: '/finance' },
              { label: 'Value My Trade', path: '/trade-in' }
            ]} />
            
            <FooterDropdown label="Services" items={[
              { label: 'Service Dept', path: '/services/service-dept' },
              { label: 'Parts Dept', path: '/services/parts-dept' },
              { label: 'Body Shop', path: '/services/body-shop' },
              { label: 'Glass Installation and Repair', path: '/services/glass' }
            ]} />
            
            <FooterDropdown label="Warranty" items={[
              { label: 'Request Warranty Information', path: '/warranty/info' },
              { label: 'Schedule Warranty Appt', path: '/warranty/schedule' }
            ]} />
            
            <FooterDropdown label="Contact Us" items={[
              { label: 'About Us', path: '/about' },
              { label: 'Contact', path: '/contact' },
              { label: 'Schedule Visit', path: '/schedule-visit' },
              { label: 'Referral Program', path: '/referral' }
            ]} />
          </nav>
          
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left Side: Developed By Zarnetic */}
            <div className="text-center md:text-left text-white">
              <p className="font-bold text-sm mb-2">
                © {new Date().getFullYear()} Developed by <a href="https://www.zarnetic.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">Zarnetic</a>™
              </p>
              <p className="text-xs text-gray-300">
                By placing calls, you agree to the <Link to="/terms" onClick={scrollToTop} className="underline hover:text-red-500">Terms and Conditions of Use</Link>.
              </p>
            </div>

            {/* Right Side: Sitemap, Terms & Account Login */}
            <div className="flex items-center gap-6 text-sm font-bold text-white">
              <Link to="/sitemap" onClick={scrollToTop} className="hover:text-red-500 transition-colors">Sitemap</Link>
              <Link to="/terms" onClick={scrollToTop} className="hover:text-red-500 transition-colors">Terms & Conditions</Link>
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