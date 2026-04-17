import { ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface AncButtonProps {
  children: ReactNode;
  className?: string;
}

export default function AncButton({ children, className }: AncButtonProps) {
  return (
    <Button className={cn("bg-blue-800 px-4 py-2 h-fit", className)}>
      {children}
    </Button>
  );
}
