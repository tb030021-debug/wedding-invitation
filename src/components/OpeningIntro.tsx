"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTRO_DURATION = 6800;
const REDUCED_MOTION_DURATION = 1400;

export default function OpeningIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? REDUCED_MOTION_DURATION : INTRO_DURATION;

    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setIsVisible(false);
    }, duration);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="opening-intro fixed inset-0 z-[100] overflow-hidden bg-ink"
      data-testid="opening-intro"
      aria-hidden="true"
    >
      <Image
        src="/images/opening-cover.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="opening-intro__image object-cover object-center"
      />
      <div className="opening-intro__shade absolute inset-0" />
      <div className="opening-intro__copy absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <p className="opening-intro__line opening-intro__line--one">
          Together is a beautiful
        </p>
        <p className="opening-intro__line opening-intro__line--two">place to be.</p>
        <p className="opening-intro__line opening-intro__line--three">
          We decided on forever!
        </p>
      </div>
    </div>
  );
}
