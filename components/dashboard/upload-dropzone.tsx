"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { UpgradeDialog } from "@/components/dashboard/upgrade-dialog";
import { uploadContract } from "@/app/(app)/dashboard/upload/actions";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const PROCESSING_STEPS = ["Uploading…", "Extracting text…", "Preparing analysis…"];

type Status = "idle" | "uploading" | "done";

function isValidFile(file: File) {
  const name = file.name.toLowerCase();
  const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  return hasValidExt && file.size > 0 && file.size <= MAX_FILE_SIZE;
}

export function UploadDropzone() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (status !== "uploading") return;
    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PROCESSING_STEPS.length - 1));
    }, 1100);
    return () => clearInterval(interval);
  }, [status]);

  const rejectFile = useCallback((message: string) => {
    toast.error(message);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!isValidFile(file)) {
        rejectFile(
          file.size > MAX_FILE_SIZE
            ? "File must be under 10MB."
            : "Only PDF and DOCX files are supported."
        );
        return;
      }

      setStatus("uploading");
      const formData = new FormData();
      formData.set("file", file);

      startTransition(async () => {
        const result = await uploadContract(formData);
        if (!result.success) {
          setStatus("idle");
          if (result.code === "limit_reached") {
            setLimitDialogOpen(true);
          } else {
            toast.error(result.error);
          }
          return;
        }
        setStatus("done");
        const contractId = result.contractId;
        setTimeout(() => router.push(`/dashboard/contracts/${contractId}`), 900);
      });
    },
    [rejectFile, router]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          dragCounter.current += 1;
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragCounter.current -= 1;
          if (dragCounter.current <= 0) setIsDragging(false);
        }}
        onDrop={onDrop}
        onClick={() => status === "idle" && inputRef.current?.click()}
        className={cn(
          "glass shadow-soft flex min-h-72 flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all",
          status === "idle" ? "cursor-pointer" : "cursor-default",
          isDragging ? "border-primary shadow-soft-lg scale-[1.01]" : "border-border",
          shake && "animate-shake motion-reduce:animate-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
            event.target.value = "";
          }}
        />

        {status === "idle" && (
          <>
            <div className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-2xl">
              <UploadCloud className="size-7" />
            </div>
            <p className="mt-5 font-semibold">Drag & drop your contract here</p>
            <p className="text-muted-foreground mt-1 text-sm">
              or click to browse — PDF or DOCX, up to 10MB
            </p>
          </>
        )}

        {status === "uploading" && (
          <>
            <Loader2 className="text-primary size-10 animate-spin" />
            <p className="mt-5 font-semibold">{PROCESSING_STEPS[stepIndex]}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              This usually takes a few seconds.
            </p>
          </>
        )}

        {status === "done" && (
          <>
            <CheckCircle2 className="text-primary size-10" />
            <p className="mt-5 font-semibold">Done! Taking you to your contract…</p>
          </>
        )}
      </div>

      <UpgradeDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        title="You've reached your free plan limit"
        description="Free plans include 3 documents a month. Upgrade to Pro for unlimited analysis."
      />
    </>
  );
}
