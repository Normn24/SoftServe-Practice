import { useEffect, useState } from "react";

export const useTrailerAutoplay = (
  isActive: boolean,
  delayMs: number = 5000
): boolean => {
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowTrailer(false);
      return;
    }

    const timer = setTimeout(() => setShowTrailer(true), delayMs);
    return () => clearTimeout(timer);
  }, [isActive, delayMs]);

  return showTrailer;
};