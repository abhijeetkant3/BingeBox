import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component: A reusable, responsive, and cinematically styled footer.
 * 
 * INTEGRATION INSTRUCTIONS for App.js:
 * 1. Import this component: import Footer from './components/Footer';
 * 2. Add <Footer /> at the bottom of the return block in the Home component,
 *    typically after the </main> tag and before the closing <TrailerModal /> or fragments.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full mt-10 bg-black/40 backdrop-blur-sm border-t border-gray-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          
          {/* Column 1: Brand & Attribution */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-black tracking-tighter text-red-600 uppercase italic">
              BINGE<span className="text-white">BOX</span>
            </h2>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-medium">
                © {currentYear} BingeBox Exploration. All rights reserved.
              </p>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto md:mx-0">
                This application is powered by the OMDb and TMDB APIs.
              </p>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">Explore</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  Latest
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">Support</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link to="/signin" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  Account
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  Supported Devices
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs font-bold uppercase tracking-widest active:scale-95 inline-block">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Subtle Decorative Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center md:justify-between items-center opacity-30">
          <div className="hidden md:block h-[1px] w-1/4 bg-gradient-to-r from-transparent to-gray-700"></div>
          <div className="text-[10px] text-gray-600 font-bold tracking-widest uppercase italic">
            Cinematic Experience Guaranteed
          </div>
          <div className="hidden md:block h-[1px] w-1/4 bg-gradient-to-l from-transparent to-gray-700"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
