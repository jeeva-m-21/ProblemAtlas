"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: "Problem Discovery",
    description:
      "Browse a curated catalog of high-quality, real-world problems—validated for feasibility, impact, and clarity.",
  },
  {
    title: "Collaborative Solution Spaces",
    description:
      "Spin up a lightweight space around any problem and coordinate progress through external artifacts: repos, papers, datasets, prototypes.",
  },
  {
    title: "Research Gap Intelligence",
    description:
      "See the gaps, suggested approaches, and supporting sources that make a problem actionable—without the noise.",
  },
];

const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export default function HomePage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.section variants={item} className="pt-10 sm:pt-14 md:pt-20">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              ProblemAtlas
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight leading-[1.08] sm:text-5xl md:text-6xl">
              Discover problems that matter.
            </h1>
          </div>

          <div className="max-w-2xl space-y-3">
            <p className="text-pretty text-base sm:text-lg text-foreground/90 leading-relaxed">
              A modern, research-grade platform for turning real-world gaps into
              focused solution efforts.
            </p>
            <p className="text-pretty text-sm sm:text-base text-muted-foreground leading-relaxed">
              Explore curated problems across AI/ML and Developer Tools. Express
              interest, form a solution space, and collaborate through linked
              artifacts—repositories, papers, datasets, and prototypes.
            </p>
          </div>

          <motion.div
            variants={item}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/explore">Explore Problems</Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/spaces">View Solution Spaces</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.div
        variants={item}
        className="mt-12 border-t border-border/60 pt-10 sm:mt-14 sm:pt-12"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              <Card className="h-full">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-[15px]">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
