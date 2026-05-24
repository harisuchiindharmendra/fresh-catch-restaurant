'use client';

type PointerState = {
  x: number;
  y: number;
  nx: number;
  ny: number;
  lerpX: number;
  lerpY: number;
  lerpNX: number;
  lerpNY: number;
  vx: number;
  vy: number;
  speed: number;
  active: boolean;
};

export const pointer: PointerState = {
  x: 0,
  y: 0,
  nx: 0.5,
  ny: 0.5,
  lerpX: 0,
  lerpY: 0,
  lerpNX: 0.5,
  lerpNY: 0.5,
  vx: 0,
  vy: 0,
  speed: 0,
  active: false,
};

let started = false;

export const startPointerTracking = () => {
  if (started || typeof window === 'undefined') return;
  started = true;

  const onMove = (e: PointerEvent) => {
    const lastX = pointer.x;
    const lastY = pointer.y;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.nx = e.clientX / window.innerWidth;
    pointer.ny = e.clientY / window.innerHeight;
    pointer.vx = pointer.x - lastX;
    pointer.vy = pointer.y - lastY;
    pointer.active = true;
  };

  const onLeave = () => {
    pointer.active = false;
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave, { passive: true });

  const tick = () => {
    pointer.lerpX += (pointer.x - pointer.lerpX) * 0.12;
    pointer.lerpY += (pointer.y - pointer.lerpY) * 0.12;
    pointer.lerpNX += (pointer.nx - pointer.lerpNX) * 0.08;
    pointer.lerpNY += (pointer.ny - pointer.lerpNY) * 0.08;
    pointer.speed = pointer.speed * 0.85 + Math.hypot(pointer.vx, pointer.vy) * 0.15;
    pointer.vx *= 0.85;
    pointer.vy *= 0.85;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
