import React, { useEffect, useState, useRef } from 'react';

const MouseSpotlight = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Use refs for the ring to enable smoother animation without frequent re-renders for the trailing effect if needed,
  // but for simplicity and React 18+, state with CSS transition is often sufficient and cleaner.
  // However, for that "perfect" trail, a ref-based approach with requestAnimationFrame is better for the ring.
  const ringRef = useRef(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const requestRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      // Check if target is interactive (link, button, input, or has pointer cursor)
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Smooth trail for the ring
  useEffect(() => {
    const animateRing = () => {
      if (!ringRef.current) return;
      
      // Lerp factor - lower is slower/smoother trail
      const ease = 0.15;
      
      ringPos.current.x += (mousePos.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.y - ringPos.current.y) * ease;
      
      ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      
      requestRef.current = requestAnimationFrame(animateRing);
    };
    
    requestRef.current = requestAnimationFrame(animateRing);
    
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePos]);

  return (
    <>
      {/* Main Dot - Follows perfectly */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className={`
            bg-white rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]
            ${isHovering ? 'w-2 h-2 opacity-50' : 'w-3 h-3 opacity-100'}
            ${isClicking ? 'scale-75' : 'scale-100'}
          `}
        />
      </div>

      {/* Trailing Ring - Follows with delay */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] mix-blend-difference top-0 left-0"
      >
        <div 
          className={`
            border-2 rounded-full transition-all duration-300 ease-out
            ${isHovering 
              ? 'w-12 h-12 border-blue-400 bg-blue-400/10' 
              : 'w-8 h-8 border-blue-500/50 bg-transparent'}
            ${isClicking ? 'scale-90 border-blue-600' : 'scale-100'}
          `}
        />
      </div>
    </>
  );
};

export default MouseSpotlight;
