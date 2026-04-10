"use client";

import { motion } from "framer-motion";

interface BuildStepProps {
  visible: boolean;
  children: React.ReactNode;
  delay?: number;
}

export function BuildStep({ visible, children, delay = 0 }: BuildStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
}
