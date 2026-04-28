import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight uppercase">At Xen Motors, You are the Priority!</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Xen Motors Inc. has a great selection of reliable, used vehicles from many of the leading auto brands. Our knowledgeable sales team has over 24 years of experience in the auto industry and can answer your questions as well as provide a vehicle history report to help you buy with confidence.
              </p>
              <p>
                We invite you to contact us today and let us try to connect you with a great vehicle. We are in the business of satisfying all our clients. Xen Motors is with you from start to finish during your vehicle purchasing process.
              </p>
              <p className="font-semibold">
                Ask us about our referral program for your friends and family! At Xen Motors you are getting the best vehicle and the best price saving you thousands of dollars.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-block mt-8 bg-gray-900 text-white py-3 px-8 font-bold tracking-wide hover:bg-red-600 transition-colors"
              data-testid="about-message-us"
            >
              QUESTIONS? MESSAGE US!
            </Link>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"
              alt="White luxury car"
              className="w-full h-auto object-cover shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
