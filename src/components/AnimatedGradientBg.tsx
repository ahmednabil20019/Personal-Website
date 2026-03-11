import { useEffect, useRef } from 'react';

export const AnimatedGradientBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.0005;

      // Create animated gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      // Use primary and accent colors with animation
      const hue1 = 271 + Math.sin(time) * 20;
      const hue2 = 189 + Math.cos(time * 0.7) * 20;
      
      gradient.addColorStop(0, `hsl(${hue1}, 81%, 56%)`);
      gradient.addColorStop(0.5, `hsl(${hue2}, 85%, 57%)`);
      gradient.addColorStop(1, `hsl(${hue1 + 30}, 81%, 56%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-20"
    />
  );
};
