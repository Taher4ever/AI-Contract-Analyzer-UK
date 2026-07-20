"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";

const FadeInStaggerContext = createContext(false);

const viewport = { once: true, margin: "0px 0px -120px" } as const;

export function FadeIn(props: HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();
  const isInsideStagger = useContext(FadeInStaggerContext);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...(isInsideStagger
        ? {}
        : { initial: "hidden", whileInView: "visible", viewport })}
      {...props}
    />
  );
}

export function FadeInStagger({
  faster = false,
  ...props
}: HTMLMotionProps<"div"> & { faster?: boolean }) {
  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={{ staggerChildren: faster ? 0.08 : 0.15 }}
        {...props}
      />
    </FadeInStaggerContext.Provider>
  );
}

export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px" });
  const spring = useSpring(0, { stiffness: 90, damping: 24 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      spring.set(shouldReduceMotion ? value : 0);
      spring.set(value);
    }
  }, [isInView, value, spring, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(value.toFixed(decimals));
      return;
    }
    return spring.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
  }, [spring, decimals, shouldReduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
