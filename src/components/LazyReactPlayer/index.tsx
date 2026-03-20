import { lazy, Suspense } from "react";
import type { ReactPlayerProps } from "react-player/types";

const ReactPlayerLazy = lazy(() => import("react-player"));

const PlayerSkeleton = () => (
  <div className="w-full h-full bg-black/60 animate-pulse" />
);

export const LazyReactPlayer = (props: ReactPlayerProps) => (
  <Suspense fallback={<PlayerSkeleton />}>
    <ReactPlayerLazy {...props} />
  </Suspense>
);