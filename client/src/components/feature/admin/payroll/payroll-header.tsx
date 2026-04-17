"use client";

import { FileSpreadsheet, Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  hasSummary: boolean;
  isPending: boolean;
  onGenerate: () => void;
};

export default function PayrollHeader({
  hasSummary,
  isPending,
  onGenerate,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Payroll Processing</h1>
        <p className="text-white/40 text-sm">
          Review and finalize monthly wages
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onGenerate}
          disabled={isPending}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {hasSummary ? "Regenerate" : "Generate Payroll"}
        </Button>

        <Button
          variant="outline"
          className="gap-2 border-white/10 text-white/70 hover:bg-white/5"
        >
          <FileSpreadsheet size={16} />
          Export
        </Button>
      </div>
    </div>
  );
}
