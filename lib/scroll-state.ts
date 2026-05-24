'use client';

type ScrollState = {
  scroll: number;
  progress: number;
  velocity: number;
  lerpVelocity: number;
  direction: 1 | -1 | 0;
};

export const scrollState: ScrollState = {
  scroll: 0,
  progress: 0,
  velocity: 0,
  lerpVelocity: 0,
  direction: 0,
};

let started = false;
export const startVelocityDecay = () => {
  if (started || typeof window === 'undefined') return;
  started = true;
  const tick = () => {
    scrollState.lerpVelocity += (scrollState.velocity - scrollState.lerpVelocity) * 0.12;
    scrollState.velocity *= 0.92;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
