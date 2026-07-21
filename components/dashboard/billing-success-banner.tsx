"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function BillingSuccessBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-strong shadow-soft-lg mb-6 flex items-center gap-4 rounded-2xl p-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
        className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      >
        <CheckCircle2 className="size-6" />
      </motion.div>
      <div>
        <p className="font-semibold">You&apos;re all set!</p>
        <p className="text-muted-foreground text-sm">
          Your plan has been updated. It may take a few seconds to reflect everywhere.
        </p>
      </div>
    </motion.div>
  );
}
