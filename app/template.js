"use client";

import { motion } from "framer-motion";
import { pageTransitionVariant } from "@/lib/animations";

export default function Template({ children }) {
  return (
    <motion.div
      variants={pageTransitionVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex-1 w-full"
    >
      {children}
    </motion.div>
  );
}
