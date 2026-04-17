"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function MonthNavigator({ month, year, onPrev, onNext }: Props) {
  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-xl shrink-0">
      <Button
        variant="ghost"
        onClick={onPrev}
        className="text-white/60 hover:text-white hover:bg-white/10"
      >
        <ChevronLeft size={20} />
      </Button>
      <h2 className="text-base font-bold text-white">{monthName}</h2>
      <Button
        variant="ghost"
        onClick={onNext}
        className="text-white/60 hover:text-white hover:bg-white/10"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}
