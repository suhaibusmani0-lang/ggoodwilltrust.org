import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../mockData';

const ServiceCard = ({ service }) => (
  <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full" data-testid={`service-card-${service.id}`}>
    <div className="p-6 flex-1">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{service.description}</p>
    </div>
    <div className="px-6 pb-5">
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
      </div>
    </div>
    <Link
      to={service.link}
      className="block w-full text-center bg-gray-300 text-gray-800 py-3 px-6 font-medium hover:bg-gray-400 transition-colors"
    >
      {service.buttonText}
    </Link>
  </div>
);

const ServicesSection = () => {
  const topRow = services.slice(0, 3);
  const bottomRow = services.slice(3, 5);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {topRow.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {bottomRow.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
