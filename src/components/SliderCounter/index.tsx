import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface SliderCounterProps {
  currentIndex: number;
  totalCount: number;
  onScroll: (direction: "up" | "down") => void;
}

const SliderCounter: React.FC<SliderCounterProps> = ({
  currentIndex,
  totalCount,
  onScroll,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="absolute left-4 md:left-8 top-1/3 transform -translate-y-1/3 flex flex-col items-center text-white z-10">
      <button
        onClick={() => onScroll("up")}
        disabled={currentIndex === 0}
        className="disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-opacity"
        aria-label="Попередній слайд"
      >
        <ChevronUp size={24} strokeWidth={1.5} />
      </button>

      <div className="py-3 text-center select-none flex flex-col items-center">
        <div className="text-lg font-semibold tracking-wider">
          {String(currentIndex + 1).padStart(2, "0")}
        </div>
        <div className="h-10 sm:h-16 w-px my-2 bg-white/40"></div>{" "}
        <div className="text-base text-white/60 tracking-wider">
          {String(totalCount).padStart(2, "0")}
        </div>
      </div>
      <button
        onClick={() => onScroll("down")}
        disabled={currentIndex === totalCount - 1}
        className="disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-opacity"
        aria-label="Наступний слайд"
      >
        <ChevronDown size={24} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default SliderCounter;
