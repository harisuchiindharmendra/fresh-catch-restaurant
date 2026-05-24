import { create } from 'zustand';

interface SceneState {
  activeScene: number;
  setActiveScene: (i: number) => void;
  scrollProgress: number;
  setScrollProgress: (p: number) => void;
  velocityBucket: number;
  setVelocityBucket: (v: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeScene: 0,
  setActiveScene: (activeScene) => set({ activeScene }),
  scrollProgress: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  velocityBucket: 0,
  setVelocityBucket: (velocityBucket) => set({ velocityBucket }),
}));
