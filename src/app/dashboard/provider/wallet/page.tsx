"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  Plus,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  ExternalLink,
  History,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

/* ---------- Liquid Glass Tokens (Design System v2) ---------- */
const glass =
  "rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 " +
  "shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]";

const primaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] " +
  "px-5 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(13,150,230,0.30)] " +
  "transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

const secondaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[11px] border border-[#06395F]/15 bg-white " +
  "px-4 text-xs font-semibold text-[#06395F] shadow-2xs transition hover:bg-slate-50";

const inputCls =
  "h-10 w-full rounded-[11px] border border-[#06395F]/20 bg-white px-3.5 text-xs text-[#06395F] " +
  "shadow-2xs outline-none transition placeholder:text-[#06395F]/35 " +
  "focus:bg-white focus:ring-2 focus:ring-[#0D8BE0]";

interface WalletData {
  availableBalance: number;
  escrowBalance: number;
  totalEarnings: number;
  currency: string;
}

interface LedgerEntry {
  id: string;
  type: "EARNING" | "PAYOUT" | "REFUND" | "PLATFORM_FEE";
  amount: number;
  runningBalance: number;
  description: string;
  createdAt: string;
}

interface PayoutMethod {
  id: string;
  type: "BKASH" | "NAGAD" | "BANK";
  accountNumber: string;
  accountName: string;
  accountType?: "PERSONAL" | "MERCHANT";
  isDefault: boolean;
}

export default function ProviderWalletPage() {
  const [wallet, setWallet] = useState<WalletData>({
    availableBalance: 42500,
    escrowBalance: 6800,
    totalEarnings: 158400,
    currency: "BDT",
  });

  const [methods, setMethods] = useState<PayoutMethod[]>([
    {
      id: "pm_1",
      type: "BKASH",
      accountNumber: "017***5678",
      accountName: "Dr. Tanvir Ahmed",
      accountType: "PERSONAL",
      isDefault: true,
    },
  ]);

  const [ledger, setLedger] = useState<LedgerEntry[]>([
    {
      id: "led_1",
      type: "EARNING",
      amount: 1200,
      runningBalance: 42500,
      description: "Booking #BK-8291 complete (Max vaccination)",
      createdAt: "Today at 02:30 PM",
    },
    {
      id: "led_2",
      type: "EARNING",
      amount: 3500,
      runningBalance: 41300,
      description: "Booking #BK-8240 complete (Dental prophylaxis)",
      createdAt: "Yesterday",
    },
    {
      id: "led_3",
      type: "PAYOUT",
      amount: -25000,
      runningBalance: 37800,
      description: "Disbursed to bKash (017***5678)",
      createdAt: "Nov 12, 2026",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"ledger" | "methods">("ledger");
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add Method Form State
  const [newMethodType, setNewMethodType] = useState<"BKASH" | "NAGAD" | "BANK">("BKASH");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [wRes, lRes, mRes] = await Promise.allSettled([
          apiClient.get("/wallet/me"),
          apiClient.get("/wallet/me/ledger"),
          apiClient.get("/payouts/methods/me"),
        ]);

        if (wRes.status === "fulfilled" && wRes.value.data?.data) {
          setWallet(wRes.value.data.data);
        }
        if (lRes.status === "fulfilled" && lRes.value.data?.data) {
          setLedger(lRes.value.data.data);
        }
        if (mRes.status === "fulfilled" && mRes.value.data?.data) {
          setMethods(mRes.value.data.data);
        }
      } catch (err) {
        // Fallback to sample data for demo presentation
      }
    }
    loadData();
  }, []);

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountName || !currentPassword) {
      toast.error("Please fill in all required fields including password");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post("/payouts/methods/me", {
        type: newMethodType,
        accountNumber,
        accountName,
        accountType: "PERSONAL",
        currentPassword,
      });

      toast.success("Payout method saved successfully!");
      setShowAddMethodModal(false);
      setAccountNumber("");
      setAccountName("");
      setCurrentPassword("");

      // Refresh methods
      const mRes = await apiClient.get("/payouts/methods/me");
      if (mRes.data?.data) setMethods(mRes.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add payout method");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#06395F] sm:text-3xl">
            Wallet & Earnings
          </h1>
          <p className="mt-1 text-sm text-[#0B4C7A]/75">
            Transparent revenue tracking, UddoktaPay settlement and automated disbursements
          </p>
        </div>

        <button
          onClick={() => setShowAddMethodModal(true)}
          className={primaryBtn}
        >
          <Plus className="h-4 w-4" />
          Add Payout Method
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Available Balance */}
        <div className={`${glass} p-6 relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#0B4C7A]/80 uppercase tracking-wider">
              Available For Payout
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#06395F]">
              ৳{wallet.availableBalance.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[8px] border border-emerald-200">
              Eligible
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0B4C7A]/60">
            Past 48h dispute protection period
          </p>
        </div>

        {/* Escrow Balance */}
        <div className={`${glass} p-6 relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#0B4C7A]/80 uppercase tracking-wider">
              In Escrow Hold
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#06395F]">
              ৳{wallet.escrowBalance.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-[8px] border border-sky-200">
              48h Hold
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0B4C7A]/60">
            Releases to available balance after visit dispute window
          </p>
        </div>

        {/* Lifetime Earnings */}
        <div className={`${glass} p-6 relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#0B4C7A]/80 uppercase tracking-wider">
              Lifetime Earnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#06395F]">
              ৳{wallet.totalEarnings.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0B4C7A]/60">
            Gross revenue generated on PetCareLog
          </p>
        </div>
      </div>

      {/* Segmented Controller */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-sky-100/60 border border-white/80 w-fit">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "ledger"
              ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white shadow-sm"
              : "bg-transparent text-[#06395F]/75 hover:bg-white/40"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Earnings Ledger & Transactions
        </button>
        <button
          onClick={() => setActiveTab("methods")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "methods"
              ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white shadow-sm"
              : "bg-transparent text-[#06395F]/75 hover:bg-white/40"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Payout Accounts ({methods.length})
        </button>
      </div>

      {/* Tab 1: Ledger */}
      {activeTab === "ledger" && (
        <div className={`${glass} p-6 sm:p-8`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-[#06395F]">
                Running Balance Ledger
              </h2>
              <p className="text-xs text-[#0B4C7A]/75">
                Every transaction and payout is cryptographically logged
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/60 text-xs font-semibold text-[#0B4C7A]/70">
                  <th className="pb-3 pl-1">Type</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right pr-1">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {ledger.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/30 transition">
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            item.amount > 0
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-rose-500/15 text-rose-600"
                          }`}
                        >
                          {item.amount > 0 ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#06395F]">
                          {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-[#06395F] font-medium">
                      {item.description}
                    </td>
                    <td className="py-3.5 text-xs text-[#0B4C7A]/70">
                      {item.createdAt}
                    </td>
                    <td
                      className={`py-3.5 text-right font-semibold text-xs ${
                        item.amount > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {item.amount > 0 ? `+৳${item.amount}` : `-৳${Math.abs(item.amount)}`}
                    </td>
                    <td className="py-3.5 text-right font-bold text-xs text-[#06395F] pr-1">
                      ৳{item.runningBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Payout Methods */}
      {activeTab === "methods" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {methods.map((pm) => (
            <div key={pm.id} className={`${glass} p-6 relative`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center border border-white/80 shadow-sm">
                    {pm.type === "BANK" ? (
                      <Building className="w-6 h-6" />
                    ) : (
                      <Smartphone className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#06395F] text-base">
                        {pm.type === "BKASH" ? "bKash" : pm.type === "NAGAD" ? "Nagad" : "Bank Transfer"}
                      </h3>
                      {pm.isDefault && (
                        <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] px-2 py-0.5 rounded-full shadow-xs">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0B4C7A]/70 mt-0.5 font-medium">
                      Account: {pm.accountNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between text-xs text-[#0B4C7A]/80">
                <span>Account Holder: <strong>{pm.accountName}</strong></span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          ))}

          {/* Add Payout Method Card */}
          <button
            onClick={() => setShowAddMethodModal(true)}
            className="rounded-[2rem] border-2 border-dashed border-sky-300/80 bg-white/30 p-6 flex flex-col items-center justify-center text-center hover:bg-white/50 transition group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-[#0D8BE0] mb-3 group-hover:scale-105 transition">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#06395F]">Add Payout Account</h4>
            <p className="text-xs text-[#0B4C7A]/70 mt-1 max-w-xs">
              Connect bKash, Nagad or Bangladeshi bank account for direct disbursements
            </p>
          </button>
        </div>
      )}

      {/* Add Payout Method Modal */}
      {showAddMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[13px] border border-white/80 bg-white/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <h2 className="font-display text-xl font-bold text-[#06395F]">
              Add Payout Account
            </h2>
            <p className="text-xs text-[#0B4C7A]/75 mt-1">
              For security, entering your current password is required.
            </p>

            <form onSubmit={handleAddMethod} className="mt-5 space-y-4">
              {/* Method Type */}
              <div>
                <label className="block text-xs font-semibold text-[#06395F] mb-1.5">
                  Method Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["BKASH", "NAGAD", "BANK"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewMethodType(type)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        newMethodType === type
                          ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white border-transparent shadow-sm"
                          : "bg-white/70 text-[#06395F] border-white/80 hover:bg-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-semibold text-[#06395F] mb-1">
                  Account / Mobile Number
                </label>
                <input
                  type="text"
                  placeholder={newMethodType === "BANK" ? "Bank Account Number" : "017XXXXXXXX"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-xs font-semibold text-[#06395F] mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Tanvir Ahmed"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-[#06395F] mb-1">
                  Confirm Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputCls}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#06395F]/50 hover:text-[#06395F]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMethodModal(false)}
                  className={secondaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={primaryBtn}
                >
                  {submitting ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
