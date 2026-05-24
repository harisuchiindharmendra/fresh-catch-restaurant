'use client';

import { useSceneStore } from '@/store/scene-store';
import { scenes } from '@/lib/config';

export default function SideInfoPanel() {
  const activeScene = useSceneStore((s) => s.activeScene);
  const progress = useSceneStore((s) => s.scrollProgress);
  const scene = scenes[Math.min(activeScene, scenes.length - 1)];

  return (
    <aside className="hidden lg:flex fixed right-8 xl:right-12 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-6 pointer-events-none">
      <div className="relative">
        <div className="text-right space-y-2 transition-all duration-700">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
            {scene.chapter}
          </p>
          <p
            key={scene.id}
            className="font-serif text-3xl text-ivory animate-fade-up"
          >
            {scene.title}
          </p>
          <p className="text-xs text-muted max-w-[200px] ml-auto leading-relaxed">
            {scene.caption}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 mt-6">
        {scenes.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            <span
              className={`text-[10px] tracking-widest transition-colors duration-500 ${
                i === activeScene ? 'text-ivory' : 'text-muted/40'
              }`}
            >
              {s.index}
            </span>
            <span
              className={`block h-px transition-all duration-700 ${
                i === activeScene ? 'w-16 bg-gold' : 'w-6 bg-ivory/15'
              }`}
            />
          </div>
        ))}
      </div>

      <div className="absolute -left-8 top-0 bottom-0 w-px bg-ivory/5">
        <div
          className="w-full bg-gradient-to-b from-gold/80 to-gold/0 transition-[height] duration-300 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </aside>
  );
}
