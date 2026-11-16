// src/components/dashboard/ConfirmDialog.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, AlertCircle, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  icon?: React.ElementType;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  icon: CustomIcon,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const Icon = CustomIcon || (isDestructive ? AlertTriangle : AlertCircle);

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus confirmation button on open
    setTimeout(() => confirmBtnRef.current?.focus(), 50);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#06395F]/30 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal / Bottom Sheet */}
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/80 bg-white/95 p-6 sm:p-8",
          "shadow-[0_24px_70px_rgba(1,95,160,0.25),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "backdrop-blur-2xl backdrop-saturate-150 z-10 transition-transform duration-200"
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
              isDestructive
                ? "border-rose-200/80 bg-rose-500/15 text-rose-600"
                : "border-sky-200/80 bg-sky-500/15 text-[#0D8BE0]"
            )}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <h2
              id="confirm-dialog-title"
              className="font-display text-lg font-bold tracking-tight text-[#06395F]"
            >
              {title}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-light leading-relaxed text-[#0B4C7A]/80">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-[#06395F]/50 hover:bg-white hover:text-[#06395F] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex h-10 items-center justify-center rounded-full border border-white/80 bg-white/70 px-5 text-xs font-semibold text-[#06395F] hover:bg-white shadow-xs transition"
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold text-white shadow-md transition disabled:opacity-50",
              isDestructive
                ? "bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-500/25"
                : "bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] hover:from-[#259DE6] hover:to-[#0A77C2] shadow-[#0D8BE0]/30"
            )}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
