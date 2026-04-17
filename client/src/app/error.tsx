"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            ไม่สามารถโหลดหน้านี้ได้ กรุณาลองใหม่
          </p>
        </div>
        <Button onClick={reset} className="w-full">
          ลองใหม่
        </Button>
      </div>
    </div>
  );
}
