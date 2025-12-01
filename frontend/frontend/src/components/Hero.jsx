export default function Hero() {
  const scrollToSearch = (e) => {
    // Allow anchors to work normally when JS is disabled by preventing default
    if (e && e.preventDefault) e.preventDefault();
    const el = document.getElementById('search-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* SVG Globe Background */}
      <svg 
        viewBox="0 0 1200 600" 
        className="absolute inset-0 w-full h-full opacity-20"
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

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          Globe Link
        </h1>
        <p className="text-2xl md:text-3xl text-white mb-8 drop-shadow-lg max-w-2xl">
          Connect with travelers. Share experiences. Plan adventures.
        </p>
        <p className="text-lg text-blue-100 mb-12 max-w-xl">
          Find travelers who've taken your dream journey and get real insights from those who've been there.
        </p>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          <a href="#search-section" onClick={scrollToSearch} className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
            Explore Journeys
          </a>
          <a href="/register" className="px-8 py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors shadow-lg border-2 border-white">
            Get Started
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-4xl mb-3">✈️</div>
            <h3 className="font-bold text-lg mb-2">Share Journeys</h3>
            <p className="text-sm text-blue-100">Document your travels and share with the community</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-2">Find Experts</h3>
            <p className="text-sm text-blue-100">Get insights from experienced travelers</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">Real Connections</h3>
            <p className="text-sm text-blue-100">Chat directly with fellow travelers</p>
          </div>
        </div>

        {/* single pretty Explore Journeys CTA retained above */}
      </div>
    </div>
  );
}
