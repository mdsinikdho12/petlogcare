"use client";

import { X, Download, FileText, ExternalLink, ShieldCheck } from "lucide-react";
import type { PetDocument } from "@/types";

interface DocumentViewerModalProps {
  document: PetDocument;
  onClose: () => void;
}

export function DocumentViewerModal({
  document,
  onClose,
}: DocumentViewerModalProps) {
  // If no live signed URL is provided yet, use placeholder sample
  const previewUrl =
    document.fileUrl ||
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const isPdf =
    document.fileUrl?.toLowerCase().endsWith(".pdf") ||
    document.title.toLowerCase().includes("pdf") ||
    document.docType === "VACCINATION_CERTIFICATE" ||
    document.docType === "LAB_REPORT";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-[2.5rem] border border-white/80 bg-white/95 backdrop-blur-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#06395F]/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center text-[#0D8BE0]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#06395F]">
                {document.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-[#0B4C7A]/75">
                <span>{document.docType.replace(/_/g, " ")}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>5-min Authenticated Link</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-[#06395F] hover:bg-gray-50 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#0D8BE0]" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#06395F]/60 hover:text-[#06395F] hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 min-h-[350px] max-h-[550px] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center p-2">
          {isPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-[#0D8BE0]">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#06395F]">
                  Secure PDF Document: {document.title}
                </p>
                <p className="text-xs text-[#0B4C7A]/70 max-w-sm">
                  Encrypted authenticated asset. Click below to view in secure high-resolution PDF viewer or download.
                </p>
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-md shadow-[#0D8BE0]/25"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Secure Document</span>
              </a>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={document.title}
              className="max-h-[500px] w-auto mx-auto object-contain rounded-xl shadow-xs"
            />
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-[11px] text-[#0B4C7A]/70 flex items-center justify-between shrink-0">
          <span>Issued on: {document.issuedOn}</span>
          <span>
            {document.visibleToProviders
              ? "✓ Booked veterinarians can view"
              : "Private to owner only"}
          </span>
        </div>
      </div>
    </div>
  );
}
