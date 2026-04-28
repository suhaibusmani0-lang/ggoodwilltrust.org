import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
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

        {/* Navigation Links */}
        <div className="border-t border-gray-800 pt-8">
          <nav className="flex justify-center items-center gap-8 flex-wrap mb-8">
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
            <Link to="/inventory" className="hover:text-red-500 transition-colors">Cars For Sale</Link>
            <Link to="/find-car" className="hover:text-red-500 transition-colors">Find a Car</Link>
            <Link to="/finance" className="hover:text-red-500 transition-colors">Finance</Link>
            <Link to="/services" className="hover:text-red-500 transition-colors">Services</Link>
            <Link to="/warranty" className="hover:text-red-500 transition-colors">Warranty</Link>
            <Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link>
          </nav>
          
          {/* Copyright + Branding Section */}
          <div className="border-t border-gray-800/50 pt-8 flex flex-col items-center gap-4">
            <div className="text-center text-sm text-gray-400">
              <p>© 2026 Xen Motors Inc. All rights reserved.</p>
              <p className="mt-1">
                Developed by{' '}
                <a 
                  href="https://www.zarnetic.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-500 transition-colors font-semibold"
                >
                  Zarnetic
                </a>
              </p>
            </div>

            <a
              href="/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-red-500 transition-all text-[10px] tracking-widest uppercase rounded-sm"
              data-testid="footer-admin-login"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;