import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ChevronDown } from 'lucide-react';

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const inventoryItems = [
    { label: 'All Inventory', path: '/inventory' },
    { label: 'Coupe', path: '/inventory?bodyType=Coupe' },
    { label: 'Minivan', path: '/inventory?bodyType=Minivan' },
    { label: 'Pickup', path: '/inventory?bodyType=Pickup' },
    { label: 'Sedan', path: '/inventory?bodyType=Sedan' },
    { label: 'SUV', path: '/inventory?bodyType=SUV' },
    { label: 'Wagon', path: '/inventory?bodyType=Wagon' }
  ];

  const findACarItems = [
    { label: 'Start Your Vehicle Purchase', path: '/start-your-vehicle-purchase' },
    { label: 'Find a Car', path: '/find-a-car' }
  ];

  const financeItems = [
    { label: 'Loan Application', path: '/finance' },
    { label: 'Value My Trade', path: '/trade-in' }
  ];

  const servicesItems = [
    { label: 'Service Dept', path: '/services/service-dept' },
    { label: 'Parts Dept', path: '/services/parts-dept' },
    { label: 'Body Shop', path: '/services/body-shop' },
    { label: 'Glass Installation and Repair', path: '/services/glass' }
  ];

  const warrantyItems = [
    { label: 'Request Warranty Information', path: '/warranty/info' },
    { label: 'Schedule Warranty Appt', path: '/warranty/schedule' }
  ];

  const contactItems = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Schedule Visit', path: '/schedule-visit' },
    { label: 'Referral Program', path: '/referral' }
  ];

  const NavDropdown = ({ label, items, isActive }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className={`px-6 py-3 ${isActive ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-100'} transition-colors font-medium flex items-center gap-1`}>
          {label}
          <ChevronDown size={16} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 min-w-[250px] z-50">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block px-6 py-3 text-gray-900 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-center items-center text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <a href="tel:5167885722" className="flex items-center gap-2 hover:text-red-500 transition-colors" data-testid="top-phone">
              <Phone size={16} />
              (516) 788-5722
            </a>
            <a href="#map" className="flex items-center gap-2 hover:text-red-500 transition-colors" data-testid="top-address">
              <MapPin size={16} />
              45 W JOHN STREET UNIT B | HICKSVILLE, NY 11801
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center" data-testid="header-logo">
              <img
                src="https://customer-assets.emergentagent.com/job_vehicle-xen/artifacts/orscmp93_XenMotors_Logo.jpg"
                alt="Xen Motors Inc."
                className="h-14 md:h-16 w-auto object-contain"
              />
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <Link to="/" className="px-6 py-3 bg-gray-900 text-white hover:bg-red-600 transition-colors font-medium">
                HOME
              </Link>
              <NavDropdown label="INVENTORY" items={inventoryItems} />
              <NavDropdown label="FIND A CAR" items={findACarItems} />
              <NavDropdown label="FINANCE" items={financeItems} />
              <NavDropdown label="SERVICES" items={servicesItems} />
              <NavDropdown label="WARRANTY" items={warrantyItems} />
              <NavDropdown label="CONTACT US" items={contactItems} />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;