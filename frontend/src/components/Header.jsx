import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationData = [
    { label: 'INVENTORY', items: [
      { label: 'All Inventory', path: '/inventory' },
      { label: 'Coupe', path: '/inventory?bodyType=Coupe' },
      { label: 'Minivan', path: '/inventory?bodyType=Minivan' },
      { label: 'Pickup', path: '/inventory?bodyType=Pickup' },
      { label: 'Sedan', path: '/inventory?bodyType=Sedan' },
      { label: 'SUV', path: '/inventory?bodyType=SUV' },
      { label: 'Wagon', path: '/inventory?bodyType=Wagon' }
    ]},
    { label: 'FIND A CAR', items: [
      { label: 'Start Your Vehicle Purchase', path: '/start-your-vehicle-purchase' },
      { label: 'Find a Car', path: '/find-a-car' }
    ]},
    { label: 'FINANCE', items: [
      { label: 'Loan Application', path: '/finance' },
      { label: 'Value My Trade', path: '/trade-in' }
    ]},
    { label: 'SERVICES', items: [
      { label: 'Service Dept', path: '/services/service-dept' },
      { label: 'Parts Dept', path: '/services/parts-dept' },
      { label: 'Body Shop', path: '/services/body-shop' },
      { label: 'Glass Installation and Repair', path: '/services/glass' }
    ]},
    { label: 'WARRANTY', items: [
      { label: 'Request Warranty Information', path: '/warranty/info' },
      { label: 'Schedule Warranty Appt', path: '/warranty/schedule' }
    ]},
    { label: 'CONTACT US', items: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Schedule Visit', path: '/schedule-visit' },
      { label: 'Referral Program', path: '/referral' }
    ]}
  ];

  const NavDropdown = ({ label, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <button className="px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors font-bold text-sm flex items-center gap-1 uppercase">
          {label} <ChevronDown size={14} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 min-w-[250px] z-50">
            {items.map((item, index) => (
              <Link key={index} to={item.path} className="block px-6 py-3 text-sm text-gray-700 hover:bg-red-600 hover:text-white transition-colors border-b border-gray-50 last:border-b-0">
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const MobileAccordion = ({ label, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-gray-800">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 px-6 text-white font-bold text-sm uppercase">
          {label} <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="bg-gray-800 py-2">
            {items.map((item, index) => (
              <Link key={index} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-10 text-gray-300 text-sm hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    /* FIXED: Sticky class hata di hai, ab ye scroll karne par upar chala jayega */
    <header className="w-full relative z-[100] shadow-sm bg-white">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-center items-center text-[10px] md:text-xs text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8 gap-y-1">
            <a href="tel:5167885722" className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <Phone size={14} /> (516) 788-5722
            </a>
            <a href="#map" className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <MapPin size={14} /> 45 W JOHN STREET UNIT B | HICKSVILLE, NY 11801
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://customer-assets.emergentagent.com/job_vehicle-xen/artifacts/orscmp93_XenMotors_Logo.jpg"
              alt="Xen Motors Inc."
              className="h-10 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center">
            <Link to="/" className="px-4 py-3 bg-gray-900 text-white hover:bg-red-600 transition-colors font-bold text-sm mr-1">
              HOME
            </Link>
            {navigationData.map((nav, idx) => (
              <NavDropdown key={idx} label={nav.label} items={nav.items} />
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden p-2 text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 z-[1000] xl:hidden overflow-y-auto max-h-[80vh]">
          <nav className="flex flex-col pb-10">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 px-6 text-white font-bold text-sm border-b border-gray-800">
              HOME
            </Link>
            {navigationData.map((nav, idx) => (
              <MobileAccordion key={idx} label={nav.label} items={nav.items} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;