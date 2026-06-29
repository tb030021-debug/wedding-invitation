"use client";

import { useEffect, useRef } from "react";

type Heart = {
  x: number;
  y: number;
  size: number;
  fall: number;
  drift: number;
  sway: number;
  swaySpeed: number;
  flutterSpeed: number;
  phase: number;
  color: string;
  opacity: number;
};

const colors = ["#d7c2a3", "#e3d1b6", "#cbb08d", "#f0e2cc"];

function makeHearts(count: number): Heart[] {
  return Array.from({ length: count }, (_, index) => ({
    x: ((index * 0.41 + 0.08) % 1) * 0.88 + 0.06,
    y: (index * 0.19 + 0.03) % 1,
    size: 4.2 + (index % 5) * 0.85,
    fall: 28 + (index % 5) * 5.5,
    drift: (index % 2 === 0 ? 1 : -1) * (1.8 + (index % 4) * 0.8),
    sway: 14 + (index % 5) * 4,
    swaySpeed: 0.65 + (index % 5) * 0.11,
    flutterSpeed: 1.8 + (index % 4) * 0.35,
    phase: index * 1.57,
    color: colors[index % colors.length],
    opacity: 0.48 + (index % 4) * 0.08
  }));
}

function drawHeart(
  context: CanvasRenderingContext2D,
  heart: Heart,
  x: number,
  y: number,
  time: number
) {
  const { size, phase, color, opacity } = heart;
  const flutter = time * heart.flutterSpeed + phase;
  const turn = Math.sin(flutter) * 0.6;
  const foreshortening = 0.55 + Math.abs(Math.cos(flutter)) * 0.45;

  context.save();
  context.translate(x, y);
  context.rotate(turn);
  context.scale(foreshortening, 1);
  context.globalAlpha = opacity;
  context.fillStyle = color;
  context.shadowColor = "rgba(111, 84, 52, 0.2)";
  context.shadowBlur = 2.5;

  context.beginPath();
  context.moveTo(0, size * 0.9);
  context.bezierCurveTo(-size * 1.25, size * 0.12, -size * 1.08, -size * 0.72, -size * 0.42, -size * 0.72);
  context.bezierCurveTo(-size * 0.12, -size * 0.72, 0, -size * 0.48, 0, -size * 0.25);
  context.bezierCurveTo(0, -size * 0.48, size * 0.12, -size * 0.72, size * 0.42, -size * 0.72);
  context.bezierCurveTo(size * 1.08, -size * 0.72, size * 1.25, size * 0.12, 0, size * 0.9);
  context.closePath();
  context.fill();

  context.shadowBlur = 0;
  context.globalAlpha = opacity * 0.35;
  context.strokeStyle = "#aa8d68";
  context.lineWidth = Math.max(0.45, size * 0.07);
  context.beginPath();
  context.moveTo(0, -size * 0.2);
  context.lineTo(0, size * 0.58);
  context.stroke();
  context.restore();
}

export default function CardHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = canvas?.closest<HTMLElement>("[data-heart-card]");

    if (!canvas || !card) {
      return;
    }

    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!context || reducedMotion.matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameId = 0;
    let previousTime = 0;
    let hearts = makeHearts(13);

    const resize = () => {
      const cardRect = card.getBoundingClientRect();
      width = cardRect.width;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      hearts = makeHearts(width < 420 ? 13 : 16);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.left = `${cardRect.left}px`;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const animate = (timestamp: number) => {
      frameId = window.requestAnimationFrame(animate);

      if (document.hidden || timestamp - previousTime < 32) {
        return;
      }

      const elapsed = previousTime ? Math.min((timestamp - previousTime) / 1000, 0.08) : 0;
      const time = timestamp / 1000;
      previousTime = timestamp;
      const cardRect = card.getBoundingClientRect();

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const clipTop = Math.max(0, cardRect.top);
      const clipBottom = Math.min(height, cardRect.bottom);

      if (clipBottom <= clipTop) {
        return;
      }

      context.save();
      context.beginPath();
      context.rect(0, clipTop, width, clipBottom - clipTop);
      context.clip();

      for (const heart of hearts) {
        heart.y += (heart.fall * elapsed) / height;
        heart.x += (heart.drift * elapsed) / width;

        if (heart.y > 1.05) {
          heart.y = -0.05;
          heart.x = 0.08 + Math.random() * 0.84;
        }

        if (heart.x < 0.03) {
          heart.x = 0.97;
        } else if (heart.x > 0.97) {
          heart.x = 0.03;
        }

        const x =
          heart.x * width +
          Math.sin(time * heart.swaySpeed + heart.phase) * heart.sway;
        const y = heart.y * height;

        drawHeart(context, heart, x, y, time);
      }

      context.restore();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(card);
    window.addEventListener("resize", resize);
    resize();
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 z-20"
      aria-hidden="true"
    />
  );
}
