import React, { useEffect, useRef, useState, memo } from 'react';

const drawSegment = (ctx, x1, y1, x2, y2, thickness, intensity = 1) => {
  // Outer glow
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(0, 191, 255, ${0.1 * intensity})`;
  ctx.lineWidth = thickness * 6;
  ctx.stroke();

  // Inner glow
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(173, 216, 230, ${0.4 * intensity})`;
  ctx.lineWidth = thickness * 2.5;
  ctx.stroke();

  // Core
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(255,255,255,${intensity})`;
  ctx.lineWidth = thickness;
  ctx.stroke();
};

const createBolt = (ctx, x1, y1, x2, y2, thickness, depth) => {
  if (depth <= 0) return;

  const segments = 10;
  let currX = x1;
  let currY = y1;

  for (let i = 0; i < segments; i++) {
    const nextX =
      currX +
      (x2 - x1) / segments +
      (Math.random() - 0.5) * (depth * 15);

    const nextY =
      currY +
      (y2 - y1) / segments +
      Math.random() * (depth * 10);

    drawSegment(
      ctx,
      currX,
      currY,
      nextX,
      nextY,
      thickness,
      0.8 + Math.random() * 0.4
    );

    if (Math.random() < 0.2 && depth > 8) {
      const branchAngle = (Math.random() - 0.5) * Math.PI / 2;
      const length = Math.random() * 120;
      const branchX = nextX + Math.cos(branchAngle) * length;
      const branchY = nextY + Math.sin(branchAngle) * length;
      createBolt(ctx, nextX, nextY, branchX, branchY, thickness * 0.5, depth - 2);
    }

    currX = nextX;
    currY = nextY;
  }
};

const LightningStrike = memo(() => {
  const canvasRef = useRef(null);
  const [flash, setFlash] = useState(false);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const startStrike = () => {
      window.dispatchEvent(new CustomEvent('lightning-strike'));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const startX = Math.random() * canvas.width;
      const endX = startX + (Math.random() - 0.5) * 200;

      setFlash(true);
      setTimeout(() => setFlash(false), 120);

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      let strikes = Math.floor(Math.random() * 3) + 2;

      const multiStrike = () => {
        if (strikes <= 0) return fadeOut();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createBolt(ctx, startX, 0, endX, canvas.height, 2 + Math.random(), 11);
        strikes--;
        setTimeout(multiStrike, 50 + Math.random() * 100);
      };

      const fadeOut = () => {
        let opacity = 1;
        const fade = () => {
          opacity -= 0.06;
          if (opacity <= 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animationFrameRef.current = null;
            scheduleNext();
          } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = `rgba(0,0,0,0.12)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            animationFrameRef.current = requestAnimationFrame(fade);
          }
        };
        animationFrameRef.current = requestAnimationFrame(fade);
      };

      multiStrike();
    };

    const scheduleNext = () => {
      timeoutRef.current = setTimeout(startStrike, 6000);
    };

    scheduleNext();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-[5] pointer-events-none transition-opacity duration-150 ${
          flash ? 'bg-white/20' : 'opacity-0'
        }`}
      />
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[5] pointer-events-none"
      />
    </>
  );
});

export default LightningStrike;
