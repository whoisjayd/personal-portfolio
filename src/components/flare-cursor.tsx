"use client";

import { useEffect, useRef } from 'react';

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

export function FlareCursor() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const numPoints = 15;
  const points = useRef(Array.from({ length: numPoints }, () => ({ x: -100, y: -100 })));
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameId = useRef<number>();

  // A color gradient from Purple -> Blue -> Cyan -> Green -> Yellow
  const colors = [
    "#581c87", "#6d28d9", "#4f46e5", "#2563eb", "#0284c7", "#0891b2",
    "#0d9488", "#059669", "#16a34a", "#4d7c0f", "#84cc16", "#a3e635",
    "#eab308", "#facc15", "#fde047"
  ];
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const animateDots = () => {
      points.current[0] = { x: mousePosition.current.x, y: mousePosition.current.y };
      
      for (let i = 1; i < points.current.length; i++) {
        const currentPoint = points.current[i];
        const prevPoint = points.current[i - 1];
        // The lerp factor controls how tightly the trail follows. Higher value = tighter trail.
        currentPoint.x = lerp(currentPoint.x, prevPoint.x, 0.3);
        currentPoint.y = lerp(currentPoint.y, prevPoint.y, 0.3);
      }

      dotsRef.current.forEach((dot, index) => {
        if (dot) {
          const { x, y } = points.current[index];
          // Offset by half the size to center the dot. Base size is 24px.
          const size = 24; 
          const scale = (points.current.length - index) / points.current.length;
          dot.style.transform = `translate(${x - (size / 2)}px, ${y - (size / 2)}px) scale(${scale})`;
          dot.style.backgroundColor = colors[index % colors.length];
        }
      });
      animationFrameId.current = requestAnimationFrame(animateDots);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const frameId = requestAnimationFrame(animateDots);
    animationFrameId.current = frameId;

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {Array.from({ length: numPoints }).map((_, index) => (
        <div
          key={index}
          ref={el => (dotsRef.current[index] = el)}
          className="absolute top-0 left-0 rounded-full"
          style={{
            width: `24px`,
            height: `24px`,
            transformOrigin: 'center center',
          }}
        />
      ))}
    </div>
  );
}
