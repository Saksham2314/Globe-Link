export default function Hero() {
  const scrollToSearch = (e) => {
    // Allow anchors to work normally when JS is disabled by preventing default
    if (e && e.preventDefault) e.preventDefault();
    const el = document.getElementById('search-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="relative w-full min-h-screen md:h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 overflow-hidden">
      {/* Animated background - simplified for mobile */}
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <div className="absolute top-0 left-0 w-48 md:w-96 h-48 md:h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-48 md:w-96 h-48 md:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* SVG Globe Background - hidden on very small screens */}
      <svg 
        viewBox="0 0 1200 600" 
        className="absolute inset-0 w-full h-full opacity-10 md:opacity-20 hidden sm:block"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#87ceeb" />
            <stop offset="100%" stopColor="#4a90e2" />
          </linearGradient>
        </defs>
        <circle cx="600" cy="300" r="280" fill="url(#oceanGradient)" />
        <circle cx="600" cy="300" r="280" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
        {/* Continents */}
        <g fill="#90ee90" opacity="0.8">
          <path d="M 300,250 Q 350,200 400,250 L 400,350 Q 350,400 300,350 Z" />
          <path d="M 700,200 Q 750,150 800,200 L 800,350 Q 750,400 700,350 Z" />
          <path d="M 520,350 Q 560,380 600,370 L 620,420 Q 570,430 520,380 Z" />
        </g>
      </svg>

      <div className="relative z-10 min-h-screen md:h-full flex flex-col items-center justify-center text-center px-4 py-8 md:py-0">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-3 md:mb-6 drop-shadow-lg leading-tight">
          Globe Link
        </h1>
        
        {/* Main description */}
        <p className="text-lg sm:text-xl md:text-3xl text-white mb-4 md:mb-8 drop-shadow-lg max-w-2xl leading-snug">
          Connect with travelers. Share experiences. Plan adventures.
        </p>
        
        {/* Secondary description */}
        <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-8 md:mb-12 max-w-xl px-2">
          Find travelers who've taken your dream journey and get real insights from those who've been there.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto mb-8 md:mb-16">
          <button onClick={scrollToSearch} className="w-full sm:w-auto px-6 sm:px-8 py-3 md:py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-lg text-sm sm:text-base">
            Explore Journeys
          </button>
          <a href="/register" className="w-full sm:w-auto px-6 sm:px-8 py-3 md:py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 active:bg-blue-900 transition-colors shadow-lg border-2 border-white text-sm sm:text-base text-center">
            Get Started
          </a>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 md:p-6 text-white">
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">✈️</div>
            <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Share Journeys</h3>
            <p className="text-xs md:text-sm text-blue-100">Document your travels and share with the community</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 md:p-6 text-white">
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">🔍</div>
            <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Find Experts</h3>
            <p className="text-xs md:text-sm text-blue-100">Get insights from experienced travelers</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 md:p-6 text-white sm:col-span-2 md:col-span-1">
            <div className="text-3xl md:text-4xl mb-2 md:mb-3">💬</div>
            <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Real Connections</h3>
            <p className="text-xs md:text-sm text-blue-100">Chat directly with fellow travelers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
