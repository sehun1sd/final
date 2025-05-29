import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-16 pb-8 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden relative">
      {/* Animated decorative elements */}
      <div
        className={`absolute top-1/4 -left-20 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl transition-all duration-1500 ease-out ${
          isLoaded
            ? 'opacity-100 scale-100 translate-x-0'
            : 'opacity-0 scale-50 -translate-x-20'
        }`}
      ></div>
      <div
        className={`absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl transition-all duration-1500 ease-out delay-200 ${
          isLoaded
            ? 'opacity-100 scale-100 translate-x-0'
            : 'opacity-0 scale-50 translate-x-20'
        }`}
      ></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 z-10">
            {/* Main heading */}
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 ease-out ${
                isLoaded
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              }`}
            >
              Control Your Shopping Budget With
              <span
                className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 inline-block transform transition-all duration-1200 ease-out delay-300 ${
                  isLoaded
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-8 opacity-0 scale-90'
                }`}
              >
                {' '}
                Voice
              </span>
            </h1>

            {/* Description */}
            <p
              className={`text-gray-300 text-lg md:text-xl mb-8 leading-relaxed transform transition-all duration-1000 ease-out delay-500 ${
                isLoaded
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              VoiceCart adalah solusi ringan berbasis web yang membantu Anda
              melacak pengeluaran belanja secara real-time hanya dengan
              suara—tanpa perlu instalasi, login, atau input manual.
            </p>

            {/* Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform transition-all duration-1000 ease-out delay-700 ${
                isLoaded
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <button
                onClick={() =>
                  document
                    .getElementById('demo')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full flex items-center justify-center hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all duration-500 group hover:scale-105 active:scale-95 transform ${
                  isLoaded
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-6 opacity-0'
                }`}
                style={{ transitionDelay: isLoaded ? '800ms' : '0ms' }}
              >
                Coba Demo Sekarang
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById('features')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className={`px-8 py-3 bg-transparent text-white border border-gray-700 rounded-full hover:border-purple-400 hover:bg-purple-400/5 transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transform ${
                  isLoaded
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-6 opacity-0'
                }`}
                style={{ transitionDelay: isLoaded ? '900ms' : '0ms' }}
              >
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          {/* SVG Image Section */}
          <div
            className={`flex-1 relative z-10 max-w-[400px] mx-auto lg:mx-0 transform transition-all duration-1000 ease-out delay-1000 ${
              isLoaded
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-8 opacity-0 scale-90'
            }`}
          >
            {/* Main SVG container with hover effects */}
            <div className="relative group">
              <img
                src="/src/images/person-rocket.svg"
                alt="Smart shopping with voice technology"
                className={`w-full h-auto max-w-full transition-all duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2 floating ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3))',
                  transition: 'all 0.7s ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter =
                    'drop-shadow(0 15px 40px rgba(139, 92, 246, 0.5))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter =
                    'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3))';
                }}
              />

              {/* Gradient shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shimmer"></div>

              {/* Subtle glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700 -z-10 scale-110"></div>
            </div>

            {/* Floating decorative elements */}
            <div
              className={`absolute -top-4 -right-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1500 delay-1200 floating-delayed ${
                isLoaded ? 'opacity-70' : 'opacity-0'
              }`}
            ></div>
            <div
              className={`absolute -bottom-6 -left-6 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-1500 delay-1400 floating-slow ${
                isLoaded ? 'opacity-50' : 'opacity-0'
              }`}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
          }
        }
        
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        
      `}</style>
    </section>
  );
};

export default Hero;