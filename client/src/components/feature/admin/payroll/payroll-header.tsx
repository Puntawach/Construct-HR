"use client";

import { Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isPending: boolean;
  onGenerate: () => void;
  hasRateChanges: boolean;
};

export default function PayrollHeader({
  isPending,
  onGenerate,
  hasRateChanges,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">จัดการเงินเดือน</h1>
        <p className="text-white/40 text-sm">คำนวณและตรวจสอบค่าจ้างรายเดือน</p>
      </div>

      {hasRateChanges && (
        <Button
          onClick={onGenerate}
          disabled={isPending}
          className="gap-2 bg-amber-600 hover:bg-amber-700"
        >
          {isPending ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          คำนวณใหม่
        </Button>
      )}
    </div>
  );
}
