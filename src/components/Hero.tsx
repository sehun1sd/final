import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the image for smoother experience
    const img = new Image();
    img.src = "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg";
    
    // Trigger animations immediately after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-16 pb-8 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden relative">
      {/* Animated decorative elements with smooth entrance */}
      <div className={`absolute top-1/4 -left-20 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl transition-all duration-1500 ease-out ${
        isLoaded ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 -translate-x-20'
      }`}></div>
      <div className={`absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl transition-all duration-1500 ease-out delay-200 ${
        isLoaded ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-20'
      }`}></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content with staggered animations */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 z-10">
            {/* Main heading with sophisticated entrance */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
              Control Your Shopping Budget With 
              <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 inline-block transform transition-all duration-1200 ease-out delay-300 ${
                isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-90'
              }`}> Voice</span>
            </h1>
            
            {/* Description with smooth slide-up */}
            <p className={`text-gray-300 text-lg md:text-xl mb-8 leading-relaxed transform transition-all duration-1000 ease-out delay-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              VoiceCart adalah solusi ringan berbasis web yang membantu Anda melacak pengeluaran belanja secara real-time hanya dengan suara—tanpa perlu instalasi, login, atau input manual.
            </p>
            
            {/* Buttons with staggered elegant entrance */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform transition-all duration-1000 ease-out delay-700 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full flex items-center justify-center hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all duration-500 group hover:scale-105 active:scale-95 transform ${
                  isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
                }`}
                style={{ transitionDelay: isLoaded ? '800ms' : '0ms' }}
              >
                Coba Demo Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-8 py-3 bg-transparent text-white border border-gray-700 rounded-full hover:border-purple-400 hover:bg-purple-400/5 transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transform ${
                  isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                }`}
                style={{ transitionDelay: isLoaded ? '900ms' : '0ms' }}
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
          
          {/* Image section with premium loading experience */}
          <div className={`flex-1 relative z-10 w-full h-[400px] md:h-[500px] transform transition-all duration-1200 ease-out delay-1000 ${
            isLoaded ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-95'
          }`}>
            <div className="w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.2)] relative group hover:shadow-[0_0_60px_rgba(139,92,246,0.3)] transition-all duration-700">
              {/* Enhanced loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                  {/* Loading indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              )}
              
              {/* Main image with smooth reveal */}
              <img 
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg"
                alt="Smart Shopping with Voice Technology"
                className={`w-full h-full object-cover rounded-xl transition-all duration-1000 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-80' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Premium overlay effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-blue-900/20 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Subtle animated elements */}
              <div className={`absolute top-6 right-6 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-1500 delay-1200 ${
                isLoaded && imageLoaded ? 'opacity-70 animate-pulse' : 'opacity-0'
              }`}></div>
              <div className={`absolute bottom-8 left-8 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-1500 delay-1400 ${
                isLoaded && imageLoaded ? 'opacity-50 animate-pulse' : 'opacity-0'
              }`} style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2.5s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default Hero;