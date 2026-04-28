import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedVehicles from '../components/FeaturedVehicles';
import FinancingSection from '../components/FinancingSection';
import PopularBrowseSection from '../components/PopularBrowseSection';
import AboutSection from '../components/AboutSection';
import BigLogoSection from '../components/BigLogoSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <FeaturedVehicles />
      <FinancingSection />
      <PopularBrowseSection />
      <AboutSection />
      <BigLogoSection />
      <Footer />
    </div>
  );
};

export default HomePage;