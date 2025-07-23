import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export const AnimatedBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Generate particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        color: Math.floor(Math.random() * 3) + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + 100) % 100,
          y: (particle.y + particle.speedY + 100) % 100,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, hsl(213 90% 60% / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(260 85% 65% / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, hsl(180 80% 70% / 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color === 1 
              ? 'hsl(213 90% 70%)' 
              : particle.color === 2 
              ? 'hsl(260 85% 75%)' 
              : 'hsl(180 80% 70%)',
            opacity: particle.opacity,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 opacity-10"
        style={{
          background: 'linear-gradient(135deg, hsl(213 90% 60%), hsl(260 85% 65%))',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute top-1/3 right-20 w-20 h-20 opacity-10 rounded-2xl"
        style={{
          background: 'linear-gradient(45deg, hsl(180 80% 70%), hsl(213 90% 70%))',
        }}
        animate={{
          rotate: -360,
          y: [-10, 10, -10],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute bottom-32 left-1/3 w-16 h-16 opacity-10"
        style={{
          background: 'linear-gradient(135deg, hsl(213 90% 60%), hsl(260 85% 65%))',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        }}
        animate={{
          rotate: 360,
          x: [-5, 5, -5],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Subtle light rays */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            conic-gradient(from 0deg at 20% 20%, transparent 0deg, hsl(213 90% 60% / 0.1) 45deg, transparent 90deg),
            conic-gradient(from 180deg at 80% 80%, transparent 0deg, hsl(260 85% 65% / 0.1) 45deg, transparent 90deg)
          `
        }}
      />
    </div>
  );
};