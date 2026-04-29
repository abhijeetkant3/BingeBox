import React, { memo } from 'react';

/**
 * ThunderConvergence Component
 * Highly optimized for 60fps performance using GPU acceleration and simplified SVG filters.
 */
const ThunderConvergence = memo(({ children }) => {
  return (
    <div className="relative w-full flex items-center justify-center overflow-visible">
      
      {/* 1. OPTIMIZED BACKGROUND LAYER */}
      <div className="absolute inset-[-100px] pointer-events-none z-0 overflow-hidden">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid slice"
          style={{ willChange: 'transform' }}
        >
          <defs>
            {/* Reduced turbulence complexity for better mobile/low-end performance */}
            <filter id="fractal-scattering-opt" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="1" seed="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            
            <filter id="glow-bolt-opt">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feFlood floodColor="#dc2626" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <mask id="background-mask-opt">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <rect x="28" y="23" width="44" height="54" rx="4" ry="4" fill="black" />
            </mask>
          </defs>

          {/* BACKGROUND BOLTS - Fewer elements, faster rendering */}
          <g 
            filter="url(#fractal-scattering-opt) url(#glow-bolt-opt)" 
            opacity="0.35" 
            mask="url(#background-mask-opt)"
            style={{ willChange: 'opacity' }}
          >
            <path d="M 5,5 L 35,35" fill="none" stroke="white" strokeWidth="0.2" className="animate-bolt-fast" style={{ animationDelay: '0s' }} />
            <path d="M 95,5 L 65,35" fill="none" stroke="white" strokeWidth="0.2" className="animate-bolt-fast" style={{ animationDelay: '2.5s' }} />
            <path d="M 15,95 L 40,70" fill="none" stroke="white" strokeWidth="0.2" className="animate-bolt-fast" style={{ animationDelay: '1.2s' }} />
            <path d="M 85,95 L 60,70" fill="none" stroke="white" strokeWidth="0.2" className="animate-bolt-fast" style={{ animationDelay: '3.8s' }} />
          </g>
        </svg>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10" style={{ transform: 'translateZ(0)' }}>
        {children}
      </div>
    </div>
  );
});

ThunderConvergence.displayName = 'ThunderConvergence';

export default ThunderConvergence;
