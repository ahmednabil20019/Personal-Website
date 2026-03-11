import { useEffect, useRef, useState } from 'react';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface SkillNetworkProps {
  skills: SkillNode[];
}

export const SkillNetwork = ({ skills }: SkillNetworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize positions if not set
    const nodes = skills.map((skill) => ({
      ...skill,
      x: skill.x || Math.random() * canvas.width,
      y: skill.y || Math.random() * canvas.height,
      vx: skill.vx || (Math.random() - 0.5) * 1,
      vy: skill.vy || (Math.random() - 0.5) * 1,
    }));

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update positions
      nodes.forEach((node) => {
        node.x! += node.vx!;
        node.y! += node.vy!;

        if (node.x! < 20 || node.x! > canvas.width - 20) node.vx! *= -1;
        if (node.y! < 20 || node.y! > canvas.height - 20) node.vy! *= -1;
      });

      // Draw connections
      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach((node2) => {
          const dx = node2.x! - node1.x!;
          const dy = node2.y! - node1.y!;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / 200)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node1.x!, node1.y!);
            ctx.lineTo(node2.x!, node2.y!);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isHovered = hoveredSkill === node.id;
        const radius = isHovered ? 8 : 5;

        ctx.fillStyle = isHovered ? 'rgba(139, 92, 246, 1)' : 'rgba(139, 92, 246, 0.6)';
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow for hovered
        if (isHovered) {
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [hoveredSkill, skills]);

  return (
    <div className="relative w-full h-96 bg-secondary/20 rounded-lg overflow-hidden border border-primary/10">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-4 pointer-events-none">
        {skills.map((skill) => (
          <div
            key={skill.id}
            onMouseEnter={() => setHoveredSkill(skill.id)}
            onMouseLeave={() => setHoveredSkill(null)}
            className="px-3 py-1 rounded-full bg-primary/20 border border-primary/50 cursor-pointer hover:bg-primary/40 transition-all text-xs font-medium pointer-events-auto"
          >
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
};
