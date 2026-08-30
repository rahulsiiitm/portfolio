"use client";

import { useEffect, useRef, type RefObject } from "react";

type Gsap = typeof import("gsap").default;
type ScrollTrigger = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Setup = (gsap: Gsap, ScrollTrigger: ScrollTrigger) => void | (() => void);

export function useGsapWhenVisible(
  targetRef: RefObject<Element | null>,
  setup: Setup,
  rootMargin = "500px 0px",
) {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    let cancelled = false;
    let cleanup: void | (() => void);

    const load = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      cleanup = setupRef.current(gsap, ScrollTrigger);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void load();
      },
      { rootMargin },
    );
    observer.observe(target);

    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [rootMargin, targetRef]);
}
