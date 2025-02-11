import { useEffect, useRef } from 'react';

interface TaskVentureLogoProps {
  width?: number;
  height?: number;
  className?: string;
  animated?: boolean;
}

export const TaskVentureLogo = ({ 
  width = 40, 
  height = 40, 
  className = '',
  animated = true 
}: TaskVentureLogoProps) => {
  const sparkleRef = useRef<SVGPathElement>(null);
  const bracketLeftRef = useRef<SVGPathElement>(null);
  const bracketRightRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!animated) return;

    // Sparkle animation
    const sparkleElement = sparkleRef.current;
    if (sparkleElement) {
      const animate = () => {
        sparkleElement.style.opacity = '1';
        setTimeout(() => {
          sparkleElement.style.opacity = '0';
        }, 100);
        setTimeout(animate, 3000);
      };
      animate();
    }

    // Bracket pulse animation
    const leftBracket = bracketLeftRef.current;
    const rightBracket = bracketRightRef.current;
    if (leftBracket && rightBracket) {
      const animateBrackets = () => {
        leftBracket.style.filter = 'drop-shadow(0 0 2px #F59E0B)';
        rightBracket.style.filter = 'drop-shadow(0 0 2px #F59E0B)';
        setTimeout(() => {
          leftBracket.style.filter = 'none';
          rightBracket.style.filter = 'none';
        }, 500);
        setTimeout(animateBrackets, 4000);
      };
      animateBrackets();
    }
  }, [animated]);

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Sword handle */}
        <rect x="18" y="20" width="4" height="12" fill="#1F2937" />
        
        {/* Sword guard */}
        <rect x="14" y="20" width="12" height="2" fill="#1F2937" />
        
        {/* Sword blade */}
        <path 
          d="M20 4L24 20H16L20 4Z" 
          fill="#F59E0B"
          className="transition-colors duration-300 hover:fill-amber-400"
        />
        
        {/* Left bracket */}
        <path
          ref={bracketLeftRef}
          d="M12 12L8 20L12 28"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        
        {/* Right bracket */}
        <path
          ref={bracketRightRef}
          d="M28 12L32 20L28 28"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        
        {/* Sparkle */}
        <path
          ref={sparkleRef}
          d="M20 2L21 3L20 4L19 3L20 2Z"
          fill="#FFFFFF"
          className="transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
        
        {/* XP particle system would be added here with more complex animation */}
      </svg>
      <div className="flex flex-col items-center mt-1 font-pixel text-sm leading-tight">
        <span className="text-gray-700">Task</span>
        <span className="font-bold text-amber-600">Venture</span>
      </div>
    </div>
  );
};
