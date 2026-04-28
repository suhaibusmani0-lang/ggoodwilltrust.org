import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Zap, CreditCard, Ban } from 'lucide-react';

const features = [
  {
    Icon: ArrowLeftRight,
    title: 'Flexible Terms',
    text: 'Choose terms that align with your needs.'
  },
  {
    Icon: Zap,
    title: 'Quick & Simple',
    text: 'Hassle free financing to get you behind the wheel faster.'
  },
  {
    Icon: CreditCard,
    title: 'Down Payment Assistance',
    text: 'Down payment flexibility available to make vehicle ownership affordable.'
  },
  {
    Icon: Ban,
    title: 'No Hidden Fees',
    text: 'Zero. None. Put your hard earned money towards a vehicle, not fees.'
  }
];

const FinancingSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image Collage */}
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&q=80"
              alt="Finance consultation"
              className="w-full h-56 object-cover col-span-2"
            />
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80"
              alt="Handing over car keys"
              className="w-full h-40 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&q=80"
              alt="Signing loan paperwork"
              className="w-full h-40 object-cover"
            />
          </div>

          {/* Right: Heading + Features + CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">MANY FINANCING OPTIONS FOR ALL CREDIT TYPES!</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Xen Motors Inc. can help you with your auto loan needs. Get pre-approved in as little as 15 minutes. No impact to your credit score.
            </p>

            <div className="space-y-6 mb-8">
              {features.map(({ Icon, title, text }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 bg-gray-900 text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/finance"
              className="inline-block bg-gray-900 text-white py-3 px-10 font-bold tracking-wide hover:bg-red-600 transition-colors"
              data-testid="apply-now-finance"
            >
              APPLY NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;
