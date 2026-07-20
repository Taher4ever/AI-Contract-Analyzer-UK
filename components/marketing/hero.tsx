"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldAlert, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";

const trustItems = ["Built for UK contracts", "Tenancy", "Employment", "Freelance", "NDAs"];

function RiskRing({ score }: { score: number }) {
  const shouldReduceMotion = useReducedMotion();
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative size-24">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          className="stroke-muted"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          className="stroke-amber-500"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: shouldReduceMotion
              ? circumference * (1 - score / 100)
              : circumference,
          }}
          whileInView={{
            strokeDashoffset: circumference * (1 - score / 100),
          }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums">{score}</span>
        <span className="text-muted-foreground text-[10px]">/ 100</span>
      </div>
    </div>
  );
}

function AnalysisMockup() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="glass-strong shadow-soft-lg w-full max-w-md rounded-2xl p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Risk score
          </p>
          <p className="mt-1 text-sm font-semibold">
            Tenancy-Agreement.pdf
          </p>
          <Badge
            variant="secondary"
            className="mt-2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400"
          >
            Medium risk
          </Badge>
        </div>
        <RiskRing score={72} />
      </div>

      <div className="mt-5 space-y-2.5">
        <div className="bg-background/60 flex items-start gap-2.5 rounded-xl border p-3">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-xs font-semibold">Break clause — 6 months</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              You can only leave early after month six, with two months&apos;
              notice.
            </p>
          </div>
        </div>
        <div className="bg-background/60 flex items-start gap-2.5 rounded-xl border p-3">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-red-500" />
          <div>
            <p className="text-xs font-semibold">Deposit above legal cap</p>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              Six weeks&apos; deposit exceeds the five-week limit under the
              Tenant Fees Act 2019.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Rent review", "Notice period", "Repairs", "Subletting"].map(
          (chip) => (
            <span
              key={chip}
              className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[11px] font-medium"
            >
              {chip}
            </span>
          )
        )}
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-primary/20 absolute top-[-12rem] left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <Container className="grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
        <FadeInStagger>
          <FadeIn>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              AI contract analysis for the UK
            </Badge>
          </FadeIn>
          <FadeIn>
            <h1 className="font-display mt-6 text-5xl leading-[1.08] tracking-tight text-balance sm:text-6xl">
              Understand Any Contract in{" "}
              <span className="text-primary italic">Minutes</span>
            </h1>
          </FadeIn>
          <FadeIn>
            <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed text-pretty">
              Upload a legal document and receive a plain-English explanation,
              risk analysis, and key clauses.
            </p>
          </FadeIn>
          <FadeIn className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="shadow-soft rounded-full"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Analyze Contract
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full"
              nativeButton={false}
              render={<Link href="/#how-it-works" />}
            >
              See how it works
            </Button>
          </FadeIn>
          <FadeIn className="mt-10">
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {trustItems.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-border">
                      ·
                    </span>
                  )}
                  {item}
                </span>
              ))}
            </p>
          </FadeIn>
        </FadeInStagger>

        <FadeIn className="flex justify-center lg:justify-end">
          <AnalysisMockup />
        </FadeIn>
      </Container>
    </section>
  );
}
