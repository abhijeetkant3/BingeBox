import React, { useEffect, useRef } from 'react';

const FireEffect = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    });
    resizeCanvas();

    const smokeParticles = [];

    class Smoke {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        // Start from below the screen
        this.y = canvas.height + Math.random() * 200;
        this.size = Math.random() * 60 + 40;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.life = 1.0;
        this.decay = Math.random() * 0.003 + 0.0015;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02;
        // Randomize shades of grey/black
        const grey = Math.floor(Math.random() * 30 + 20);
        this.color = `rgba(${grey}, ${grey}, ${grey},`;
      }

      update() {
        this.y -= this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.3 + this.speedX;

        // Mouse interaction: drift away from cursor
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) {
          const force = (200 - distance) / 200;
          this.x += (dx / distance) * force * 3;
        }

        this.life -= this.decay;
        this.size += 0.15; // Smoke expands as it rises

        if (this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        if (this.life <= 0) return;

        // To make it "not circular" and "real", we use a soft radial gradient
        // this creates a "puff" look instead of a solid circle
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        const alpha = this.life * 0.3; // Low opacity for realism
        gradient.addColorStop(0, `${this.color} ${alpha})`);
        gradient.addColorStop(0.5, `${this.color} ${alpha * 0.5})`);
        gradient.addColorStop(1, `${this.color} 0)`);

        ctx.fillStyle = gradient;
        
        // Drawing a slightly larger area than the gradient to ensure no clipping
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize smoke particles (Increased count for a thick "fog" feel)
    for (let i = 0; i < 120; i++) {
      smokeParticles.push(new Smoke());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Realistic smoke doesn't need additive blending, source-over is better
      ctx.globalCompositeOperation = 'source-over';
      
      smokeParticles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[2] pointer-events-none"
    />
  );
};

export default FireEffect;