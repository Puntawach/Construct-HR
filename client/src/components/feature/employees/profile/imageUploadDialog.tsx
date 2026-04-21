"use client";
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActionResult } from "@/lib/actions/action.type";
import { FileImage, Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useRef, useState, useTransition } from "react";

// ... rest เหมือนเดิมทุกอย่าง
type ImageUploadDialogProps = {
  initialUrl?: string | null;
  trigger: ReactNode;
  title: string;
  onUpload: (file: File) => Promise<ActionResult>;
};

export default function ImageUploadDialog({
  trigger,
  initialUrl,
  title,
  onUpload,
}: ImageUploadDialogProps) {
  const fileInputEl = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleClickUpload = () => {
    startTransition(async () => {
      if (file) {
        await onUpload(file);
        setOpen(false);
        setFile(null);
        router.refresh();
      }
    });
  };

  const imageUrl = file ? URL.createObjectURL(file) : initialUrl;

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 bg-black/40 z-100 flex justify-center items-center">
          <Loader className="animate-spin text-primary" />
        </div>
      )}
      <Dialog
        open={open}
        onOpenChange={(current) => {
          if (current === false) {
            setFile(null);
            if (fileInputEl.current) fileInputEl.current.value = "";
          }
          setOpen(current);
        }}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className="sm:max-w-3xl"
          onInteractOutside={(e) => {
            if (isPending) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (isPending) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div>
            <div className="relative aspect-square w-48 mx-auto rounded-full overflow-hidden bg-muted flex justify-center items-center">
              {imageUrl ? (
                <Image
                  alt="cover"
                  src={imageUrl}
                  fill
                  className="object-cover"
                />
              ) : (
                <FileImage className="size-20 text-muted-foreground" />
              )}
              {/* <Image alt="cover" src="/cover.jpeg" fill /> */}
            </div>
          </div>
          <DialogFooter className="justify-self-start">
            <div className="space-x-2">
              {file && (
                <Button onClick={handleClickUpload} disabled={isPending}>
                  Upload
                </Button>
              )}
              <Button
                onClick={() => fileInputEl.current?.click()}
                variant="outline"
                disabled={isPending}
              >
                Choose photo
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input
        type="file"
        className="hidden"
        ref={fileInputEl}
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />
    </>
  );
}
