// components/blocks/hero/hero-flex-lottie.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

const LottiePlayer = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => null,
});

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

type AnimationData = Record<string, unknown> | null;

type HeroFlexLottieProps = {
  src?: string | null;
  loop?: boolean | null;
  autoplay?: boolean | null;
  speed?: number | null;
  ariaLabel?: string | null;
  className?: string;
  style?: CSSProperties;
  objectFit?: "contain" | "cover";
  preserveAspectRatio?: string;
};

export function HeroFlexLottie({
  src,
  loop,
  autoplay,
  speed,
  ariaLabel,
  className,
  style,
  objectFit = "contain",
  preserveAspectRatio,
}: HeroFlexLottieProps) {
  const [animationData, setAnimationData] = useState<AnimationData>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const playerRef = useRef<LottieRefCurrentProps>(null);

  const ariaProps = useMemo(() => {
    const label = ariaLabel?.trim();
    if (!label) {
      return { "aria-hidden": true } as const;
    }

    return {
      role: "img" as const,
      "aria-label": label,
    };
  }, [ariaLabel]);

  useEffect(() => {
    if (!src) {
      setAnimationData(null);
      return () => undefined;
    }

    const controller = new AbortController();
    const { signal } = controller;

    async function loadAnimation(currentSrc: string) {
      try {
        const response = await fetch(currentSrc, { signal });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as AnimationData;
        setAnimationData(data);
      } catch (error) {
        if ((error as { name?: string } | undefined)?.name !== "AbortError") {
          setAnimationData(null);
        }
      }
    }

    setAnimationData(null);
    void loadAnimation(src);

    return () => {
      controller.abort();
    };
  }, [src]);

  useEffect(() => {
    if (!playerRef.current || typeof speed !== "number" || speed <= 0) {
      return;
    }

    playerRef.current.setSpeed(speed);
  }, [speed, animationData]);

  const rendererSettings = preserveAspectRatio
    ? { preserveAspectRatio }
    : undefined;

  if (!src) {
    return null;
  }

  if (!animationData) {
    return (
      <div
        className={className}
        style={{
          ...style,
          backgroundColor: "rgba(255,255,255,0.08)",
        }}
        aria-hidden
      />
    );
  }

  const resolvedLoop = prefersReducedMotion ? false : loop ?? true;
  const resolvedAutoplay = prefersReducedMotion ? false : autoplay ?? true;

  return (
    <div
      className={className}
      style={{
        ...style,
        overflow: "hidden",
        display: "flex",
      }}
    >
      <LottiePlayer
        lottieRef={playerRef}
        animationData={animationData}
        loop={resolvedLoop}
        autoplay={resolvedAutoplay}
        style={{ width: "100%", height: "100%", objectFit }}
        rendererSettings={rendererSettings}
        {...ariaProps}
      />
    </div>
  );
}
