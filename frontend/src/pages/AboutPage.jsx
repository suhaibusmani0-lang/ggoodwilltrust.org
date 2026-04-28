import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">ABOUT XEN MOTORS INC.</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Image */}
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200" 
              alt="Xen Motors Showroom"
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
          </div>

          {/* About Content */}
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ABOUT XEN MOTORS INC.</h2>
            
            <div className="text-lg text-gray-700 leading-relaxed space-y-6">
              <p>
                At Xen Motors Inc., we take pride in the way we do business. We believe that the car buying experience should be a positive one. Your satisfaction is our top priority. We are customer-focused, which means we work with you to find the vehicle that meets your needs and budget; not our sales goals. We have been working hard in the Hicksville area to build a reputation for honest, trustworthy sales practices. We're ready to earn your business and would be proud to earn your recommendation.
              </p>

              <p>
                Stop in today and shop our great inventory, check out our affordable financing options, and see if you're ready to take home your next vehicle.
              </p>

              <div className="bg-gray-50 p-8 rounded-lg my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to You</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Over 24 years of experience in the auto industry</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Knowledgeable sales team ready to answer all your questions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Vehicle history reports to help you buy with confidence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Meticulous 185-point inspection for every vehicle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Flexible financing options for all credit types</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Top-dollar trade-in valuations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Extended warranty options available</span>
                  </li>
                </ul>
              </div>

              <p>
                We invite you to contact us today and let us try to connect you with a great vehicle. We are in the business of satisfying all our clients. Xen Motors is with you from start to finish during your vehicle purchasing process.
              </p>

              <p className="font-semibold text-xl text-gray-900">
                Ask us about our referral program for your friends and family! At Xen Motors you are getting the best vehicle and the best price saving you thousands of dollars.
              </p>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center">
              <a 
                href="/contact"
                className="inline-block bg-red-600 text-white py-4 px-12 text-lg font-bold hover:bg-red-700 transition-colors rounded-sm shadow-lg"
              >
                Contact Us Today
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;