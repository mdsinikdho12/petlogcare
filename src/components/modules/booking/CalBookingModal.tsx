"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Dog,
  Cat,
  CreditCard,
  Banknote,
  CheckCircle2,
  X,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

interface CalBookingModalProps {
  provider: {
    id: string;
    name: string;
    address: string;
  };
  service: {
    id: string;
    title: string;
    duration: string;
    priceBDT: number;
  };
  onClose: () => void;
}

function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-BD").format(amount)}`;
}

export function CalBookingModal({
  provider,
  service,
  onClose,
}: CalBookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Date & Time, 2: Select Pet, 3: Payment Choice & Summary, 4: 15-min Hold
  const [selectedDate, setSelectedDate] = useState("2026-11-20");
  const [selectedSlot, setSelectedSlot] = useState("10:30 AM");
  const [selectedPetId, setSelectedPetId] = useState("pet-1");
  const [notes, setNotes] = useState("");
  const [paymentOption, setPaymentOption] = useState<"PAY_NOW" | "PAY_ON_VISIT">("PAY_NOW");
  const [loading, setLoading] = useState(false);

  const availableSlots = [
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "12:00 PM",
    "03:30 PM",
    "04:00 PM",
    "05:30 PM",
    "06:00 PM",
  ];

  const userPets = [
    { id: "pet-1", name: "Miu Miu", species: "Persian Cat" },
    { id: "pet-2", name: "Rocky", species: "Golden Retriever" },
  ];

  const upfrontFee = Math.round(service.priceBDT * 0.1); // 10% confirmation fee
  const payableOnline = paymentOption === "PAY_NOW" ? service.priceBDT : upfrontFee;
  const payableAtClinic = paymentOption === "PAY_NOW" ? 0 : service.priceBDT - upfrontFee;

  const handleCreateBooking = async () => {
    try {
      setLoading(true);

      // Call backend API if connected
      try {
        await apiClient.post("/bookings", {
          providerId: provider.id,
          serviceId: service.id,
          petId: selectedPetId,
          date: selectedDate,
          timeSlot: selectedSlot,
          notes,
          paymentOption,
        });
      } catch (err) {
        // Fallback gracefully for preview flow
      }

      setStep(4);
    } catch (err) {
      toast.error("Failed to hold slot. Please try another time.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithUddoktaPay = () => {
    toast.info("Connecting to secure bKash / Nagad payment gateway...");
    setTimeout(() => {
      router.push(
        `/payment/callback?status=success&invoiceId=inv_${Date.now()}&bookingId=bk_${Date.now()}`
      );
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06395F]/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-[13px] border border-white/80 bg-white/95 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#06395F]/10">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#0D8BE0] font-semibold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time appointment scheduling</span>
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#06395F]">
              Book with {provider.name}
            </h3>
            <p className="text-[12px] text-[#06395F]/75 mt-0.5">
              Service: <strong>{service.title}</strong> ({formatBDT(service.priceBDT)})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-[9px] text-[#06395F]/60 hover:text-[#06395F] hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#06395F] px-1">
          <span className={step >= 1 ? "text-[#0D8BE0] font-bold" : "text-gray-400"}>
            1. Date &amp; slot
          </span>
          <span className="text-[#06395F]/30">→</span>
          <span className={step >= 2 ? "text-[#0D8BE0] font-bold" : "text-gray-400"}>
            2. Choose pet
          </span>
          <span className="text-[#06395F]/30">→</span>
          <span className={step >= 3 ? "text-[#0D8BE0] font-bold" : "text-gray-400"}>
            3. Payment plan
          </span>
          <span className="text-[#06395F]/30">→</span>
          <span className={step >= 4 ? "text-emerald-700 font-bold" : "text-gray-400"}>
            4. Hold &amp; confirm
          </span>
        </div>

        {/* Step 1: Pick Date & Slot */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#06395F] mb-1.5">
                Select appointment date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#06395F] mb-1.5">
                Select discrete time slot (Bangladesh Standard Time)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-[11px] border text-[12px] font-semibold transition-all ${
                      selectedSlot === slot
                        ? "bg-[#0D8BE0] text-white border-[#0D8BE0] shadow-xs"
                        : "bg-white border-[#06395F]/15 text-[#06395F] hover:border-[#0D8BE0]/40"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-xs hover:-translate-y-0.5 transition flex items-center gap-1.5"
              >
                <span>Continue to pet selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Pet & Notes */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#06395F] mb-1.5">
                Which companion pet is this visit for?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {userPets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`p-3 rounded-[11px] border text-left transition-all ${
                      selectedPetId === pet.id
                        ? "border-[#0D8BE0] bg-sky-50 text-[#06395F] ring-2 ring-[#0D8BE0]/20 shadow-xs"
                        : "border-[#06395F]/15 bg-white text-[#06395F]/80 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[13px]">{pet.name}</span>
                      {selectedPetId === pet.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#0D8BE0]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#06395F]/60">{pet.species}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#06395F] mb-1.5">
                Special symptoms or clinical notes (optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Coughing for 2 days, shy around strangers..."
                className="w-full px-3.5 py-2.5 rounded-[11px] border border-[#06395F]/15 bg-white text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-2xs"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 text-[12px] font-semibold text-[#06395F] hover:bg-slate-50 flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-2.5 px-5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-xs hover:-translate-y-0.5 transition flex items-center gap-1.5"
              >
                <span>Continue to payment plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Options & Summary */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-[12px] font-medium text-[#06395F]">
              Choose payment method
            </label>

            <div className="space-y-2.5">
              {/* Option A: Pay Now */}
              <button
                type="button"
                onClick={() => setPaymentOption("PAY_NOW")}
                className={`w-full p-3.5 rounded-[11px] border text-left transition-all ${
                  paymentOption === "PAY_NOW"
                    ? "border-[#0D8BE0] bg-sky-50/80 ring-2 ring-[#0D8BE0]/20 shadow-xs"
                    : "border-[#06395F]/15 bg-white text-[#06395F]/80 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#0D8BE0]" />
                    <span className="font-bold text-[13px] text-[#06395F]">
                      Pay 100% online now
                    </span>
                  </div>
                  <span className="font-bold text-sm text-[#0D8BE0] tabular-nums">
                    {formatBDT(service.priceBDT)}
                  </span>
                </div>
                <p className="text-[11px] text-[#06395F]/75 font-normal">
                  Pay securely with bKash, Nagad, or Visa/MasterCard. Zero payment hassle at the clinic counter.
                </p>
              </button>

              {/* Option B: Pay on Visit */}
              <button
                type="button"
                onClick={() => setPaymentOption("PAY_ON_VISIT")}
                className={`w-full p-3.5 rounded-[11px] border text-left transition-all ${
                  paymentOption === "PAY_ON_VISIT"
                    ? "border-[#0D8BE0] bg-sky-50/80 ring-2 ring-[#0D8BE0]/20 shadow-xs"
                    : "border-[#06395F]/15 bg-white text-[#06395F]/80 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-[13px] text-[#06395F]">
                      Pay on visit (10% deposit online, 90% at clinic)
                    </span>
                  </div>
                  <span className="font-bold text-sm text-emerald-700 tabular-nums">
                    {formatBDT(upfrontFee)} now
                  </span>
                </div>
                <p className="text-[11px] text-[#06395F]/75 font-normal">
                  Pay 10% platform confirmation deposit ({formatBDT(upfrontFee)}) online now to secure your slot; pay remaining {formatBDT(service.priceBDT - upfrontFee)} in cash at clinic.
                </p>
              </button>
            </div>

            {/* Price breakdown pill */}
            <div className="p-3.5 rounded-[11px] bg-[#F8FBFE] border border-[#06395F]/10 text-[12px] space-y-1.5">
              <div className="flex justify-between text-[#06395F]/75">
                <span>Appointment service fee:</span>
                <span className="tabular-nums font-medium">{formatBDT(service.priceBDT)}</span>
              </div>
              <div className="flex justify-between text-[#06395F]">
                <span>Payable online via UddoktaPay:</span>
                <span className="font-bold text-[#0D8BE0] tabular-nums">{formatBDT(payableOnline)}</span>
              </div>
              {payableAtClinic > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Payable at clinic counter:</span>
                  <span className="font-bold tabular-nums">{formatBDT(payableAtClinic)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-[11px] border border-[#06395F]/15 text-[12px] font-semibold text-[#06395F] hover:bg-slate-50 flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleCreateBooking}
                className="py-2.5 px-5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-[13px] font-semibold shadow-xs hover:-translate-y-0.5 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Hold slot for 15 minutes</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 15-Minute Slot Hold Active */}
        {step === 4 && (
          <div className="text-center py-3 space-y-3.5">
            <div className="w-12 h-12 mx-auto rounded-[11px] bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
              <Clock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Slot reserved for 15:00 minutes</span>
              </div>
              <h4 className="font-display text-base sm:text-lg font-bold text-[#06395F]">
                Your appointment slot is on hold
              </h4>
              <p className="text-[12px] text-[#06395F]/75 max-w-sm mx-auto">
                {selectedDate} at {selectedSlot} with {provider.name}. Complete payment of <strong>{formatBDT(payableOnline)}</strong> to receive instant SMS confirmation.
              </p>
            </div>

            <div className="p-3.5 rounded-[11px] bg-[#F8FBFE] border border-[#06395F]/10 max-w-sm mx-auto text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#06395F]/70">Selected pet:</span>
                <span className="font-bold text-[#06395F]">Miu Miu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#06395F]/70">Payment gateways:</span>
                <span className="font-bold text-[#0D8BE0]">bKash, Nagad, Visa, Mastercard</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handlePayWithUddoktaPay}
                className="w-full max-w-sm py-2.5 px-5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white font-semibold text-[13px] shadow-[0_4px_14px_rgba(13,150,230,0.30)] hover:-translate-y-0.5 transition flex items-center justify-center gap-2 mx-auto"
              >
                <span>Proceed to UddoktaPay checkout ({formatBDT(payableOnline)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
