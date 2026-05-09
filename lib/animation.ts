export const EASING = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
};

export const DURATION = {
  fast: 0.12,
  base: 0.18,
  slow: 0.32,
};

export const MOTION = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.base, ease: EASING.standard },
  },
  softRise: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: { duration: DURATION.slow, ease: EASING.standard },
  },
  hoverLift: {
    whileHover: { y: -1 },
    transition: { duration: DURATION.fast, ease: EASING.standard },
  },
};
