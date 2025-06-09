declare module 'vanta/dist/vanta.halo.min' {
  import * as THREE from 'three';
  
  interface VantaHaloSettings {
    el: string | HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    backgroundColor?: number;
    size?: number;
  }

  interface VantaEffect {
    destroy: () => void;
    setOptions: (options: Partial<VantaHaloSettings>) => void;
  }

  const HALO: (options: VantaHaloSettings) => VantaEffect;
  export = HALO;
}
