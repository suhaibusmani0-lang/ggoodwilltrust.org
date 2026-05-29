import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, BookOpen, Stethoscope, Target, Eye, ArrowRight } from 'lucide-react';

// Imports - Ye rasta check kar lena (agar assets folder src ke andar hai)
import img1 from '../assets/hompage1.jpg';
import img2 from '../assets/hompage2.jpg';
import img3 from '../assets/hompage3.jpg';
import img4 from '../assets/hompage4.jpg';
import img5 from '../assets/hompage5.jpg';

const HomePage = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const heroImages = [img1, img2, img3, img4, img5];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="font-sans text-gray-800">
            <section className="relative h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden">
                {heroImages.map((img, index) => (
                    <img 
                        key={index}
                        src={img}
                        alt="Slider"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            index === currentImage ? 'opacity-40' : 'opacity-0'
                        }`}
                    />
                ))}
                
                {/* Content... */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-white mb-4">Empowering Lives</h1>
                </div>
            </section>
            {/* ...baaki UI... */}
        </div>
    );
};
export default HomePage;