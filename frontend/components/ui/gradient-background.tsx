// GradientBackground.tsx

import React from "react";

interface GradientBackgroundProps {
  className?: string;
}

export function GradientBackground({ className }: GradientBackgroundProps) {
  return (
    <canvas
      className={`bg-gradient-to-t from-yellow-300 from-10% via-yellow-200 via-15% to-sky-200 to-35% h-full w-full absolute inset-0 ${className}`}
    ></canvas>
  );
}
