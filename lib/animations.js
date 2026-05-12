// Hand-Drawn Framer Motion Variants
// Playful, snappy, paper-like — no smooth springs or blur transitions.

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 30, rotate: -1 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const fadeLeftVariant = {
  hidden: { opacity: 0, x: -30, rotate: 1 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Container for staggering children (cards, list items)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Fast stagger for text characters or quick UI lists
export const fastStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
};

// Page transitions — paper shuffle feel
export const pageTransitionVariant = {
  hidden: { opacity: 0, y: 12, rotate: -0.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    rotate: 0.5,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Card entrance — paper dropping onto desk
export const cardRevealVariant = {
  hidden: { opacity: 0, y: 40, rotate: -2, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Dropdown suggestion list
export const dropdownVariant = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

// Individual list items for staggered entrance
export const listItemVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Grid cards stagger container
export const gridStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
};

// Grid card item — paper-drop with slight rotation
export const gridCardVariant = {
  hidden: { opacity: 0, y: 25, rotate: -1 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Skeleton shimmer
export const skeletonPulse = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};
