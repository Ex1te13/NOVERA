"use client";

import { motion } from "framer-motion";
import { srcSet, u } from "@/data/images";
import { ease } from "./ui";

export function PageHero({
  eyebrow,
  title,
  accent,
  text,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  text?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 md:pt-44">
      {image && (
        <>
          <motion.img
            src={u(image, 1920)}
            srcSet={srcSet(image)}
            sizes="100vw"
            fetchPriority="high"
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease }}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
        </>
      )}
      <div className="container-x relative pb-16 md:pb-24">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="eyebrow eyebrow-dot">
          {eyebrow}
        </motion.p>
        <h1 className="h-display mt-6 text-5xl md:text-7xl lg:text-8xl">
          <span className="block overflow-hidden">
            <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.1 }}>
              {title}
            </motion.span>
          </span>
          {accent && (
            <span className="block overflow-hidden">
              <motion.span
                className="h-serif block normal-case tracking-normal text-moss-400"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.2 }}
              >
                {accent}
              </motion.span>
            </span>
          )}
        </h1>
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="mt-8 max-w-xl text-lg text-mist"
          >
            {text}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
