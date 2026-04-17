"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
  variant = "danger",
  isPending = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  const confirmStyle = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    default: "bg-blue-600 hover:bg-blue-700 text-white",
  }[variant];

  const iconColor = {
    danger: "text-red-400",
    warning: "text-amber-400",
    default: "text-blue-400",
  }[variant];

  const iconBg = {
    danger: "bg-red-500/10",
    warning: "bg-amber-500/10",
    default: "bg-blue-500/10",
  }[variant];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
          >
            <AlertTriangle size={18} className={iconColor} />
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-white/50 mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            className="flex-1 border-white/10 text-white/70 hover:bg-white/5"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            className={`flex-1 ${confirmStyle}`}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "กำลังดำเนินการ..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
