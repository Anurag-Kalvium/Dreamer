export const MathUtils = {
  normalize: (value: number, min: number, max: number): number => {
    return (value - min) / (max - min);
  },

  interpolate: (normValue: number, min: number, max: number): number => {
    return min + (max - min) * normValue;
  },

  map: (value: number, min1: number, max1: number, min2: number, max2: number): number => {
    if (value < min1) value = min1;
    if (value > max1) value = max1;
    
    const normalized = MathUtils.normalize(value, min1, max1);
    return MathUtils.interpolate(normalized, min2, max2);
  },

  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  lerp: (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  },

  smoothstep: (min: number, max: number, value: number): number => {
    const x = MathUtils.clamp((value - min) / (max - min), 0, 1);
    return x * x * (3 - 2 * x);
  }
};

export default MathUtils;