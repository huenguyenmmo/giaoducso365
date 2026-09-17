import React from 'react';

interface WavyDividerProps {
  fillColor?: string;
  flip?: boolean;
  className?: string;
}

export const WavyDivider: React.FC<WavyDividerProps> = ({ 
  fillColor = "#FDFBF7", 
  flip = false,
  className = "" 
}) => {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg 
        className="relative block w-full h-8 md:h-12 lg:h-16" 
        data-name="Layer 1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z" 
          fill={fillColor}
        ></path>
      </svg>
    </div>
  );
};
