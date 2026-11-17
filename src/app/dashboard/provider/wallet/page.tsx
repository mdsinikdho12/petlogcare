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
  History,
  Loader2,
  Trash2,
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

const bdt = (amount: number) =>
  `৳${new Intl.NumberFormat("en-BD").format(Math.round(amount || 0))}`;

interface WalletData {
  availableBalance: number;
  escrowBalance: number;
  totalEarnings: number;
  currency: string;
}

interface LedgerEntry {
  id?: string;
  _id?: string;
  type: string;
  amount: number;
  runningBalance: number;
  description?: string;
  reason?: string;
  createdAt: string;
}

interface PayoutMethod {
  id?: string;
  _id?: string;
  type: "BKASH" | "BANK";
  accountNumber: string;
  accountName: string;
  accountType?: "PERSONAL" | "MERCHANT";
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  isDefault?: boolean;
}

export default function ProviderWalletPage() {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletData>({
    availableBalance: 0,
    escrowBalance: 0,
    totalEarnings: 0,
    currency: "BDT",
  });

  const [methods, setMethods] = useState<PayoutMethod[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);

  const [activeTab, setActiveTab] = useState<"ledger" | "methods">("ledger");
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add Method Form State
  const [newMethodType, setNewMethodType] = useState<"BKASH" | "BANK">("BKASH");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<"PERSONAL" | "MERCHANT">("PERSONAL");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wRes, lRes, mRes] = await Promise.allSettled([
        apiClient.get("/wallet/me"),
        apiClient.get("/wallet/me/ledger"),
        apiClient.get("/payouts/methods/me"),
      ]);

      if (wRes.status === "fulfilled" && wRes.value.data?.data) {
        const d = wRes.value.data.data;
        setWallet({
          availableBalance: d.availableBalance ?? d.balance ?? 0,
          escrowBalance: d.escrowBalance ?? d.pendingBalance ?? 0,
          totalEarnings: d.totalEarnings ?? d.lifetimeEarnings ?? 0,
          currency: d.currency || "BDT",
        });
      }
      if (lRes.status === "fulfilled" && lRes.value.data?.data) {
        const items = Array.isArray(lRes.value.data.data)
          ? lRes.value.data.data
          : lRes.value.data.data.items || [];
        setLedger(items);
      }
      if (mRes.status === "fulfilled" && mRes.value.data?.data) {
        const meths = Array.isArray(mRes.value.data.data)
          ? mRes.value.data.data
          : mRes.value.data.data.methods || [];
        setMethods(meths);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountName || !currentPassword) {
      toast.error("Please fill in all required fields including your password");
      return;
    }

    try {
      setSubmitting(true);
      const payload: Record<string, any> = {
        type: newMethodType,
        accountNumber,
        accountName,
        accountType: newMethodType === "BKASH" ? accountType : undefined,
        currentPassword,
      };

      if (newMethodType === "BANK") {
        if (!bankName) {
          toast.error("Please enter the Bank name");
          setSubmitting(false);
          return;
        }
        payload.bankName = bankName;
        if (branchName) payload.branchName = branchName;
        if (routingNumber) payload.routingNumber = routingNumber;
      }

      await apiClient.post("/payouts/methods/me", payload);

      toast.success("Payout method saved successfully!");
      setShowAddMethodModal(false);
      setAccountNumber("");
      setAccountName("");
      setBankName("");
      setBranchName("");
      setRoutingNumber("");
      setCurrentPassword("");

      // Refresh methods
      const mRes = await apiClient.get("/payouts/methods/me");
      if (mRes.data?.data) {
        setMethods(
          Array.isArray(mRes.data.data) ? mRes.data.data : mRes.data.data.methods || []
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add payout method");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!confirm("Are you sure you want to remove this payout method?")) return;
    try {
      await apiClient.delete(`/payouts/methods/me/${id}`);
      toast.success("Payout method removed");
      setMethods((prev) => prev.filter((m) => (m.id || m._id) !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove payout method");
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
            Real-time balance, verified payouts, and audit-logged ledger transactions
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
            <div className="w-8 h-8 rounded-[11px] bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#06395F]">
              {loading ? "..." : bdt(wallet.availableBalance)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-[8px] border border-emerald-200">
              Eligible
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0B4C7A]/60">
            Cleared for automatic or manual disbursement
          </p>
        </div>

        {/* Escrow Balance */}
        <div className={`${glass} p-6 relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#0B4C7A]/80 uppercase tracking-wider">
              In Escrow Hold
            </span>
            <div className="w-8 h-8 rounded-[11px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#06395F]">
              {loading ? "..." : bdt(wallet.escrowBalance)}
            </span>
            <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-[8px] border border-sky-200">
              Hold
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0B4C7A]/60">
            Auto-clears after completed appointment dispute window
          </p>
        </div>

        {/* Lifetime Earnings */}
        <div className={`${glass} p-6 relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#0B4C7A]/80 uppercase tracking-wider">
              Lifetime Earnings
            </span>
            <div className="w-8 h-8 rounded-[11px] bg-violet-500/15 text-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#06395F]">
              {loading ? "..." : bdt(wallet.totalEarnings)}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0B4C7A]/60">
            Cumulative gross earnings on PetCareLog
          </p>
        </div>
      </div>

      {/* Segmented Controller */}
      <div className="flex items-center gap-2 p-1.5 rounded-[13px] bg-sky-100/60 border border-white/80 w-fit">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-2 px-4 py-2 rounded-[11px] text-xs font-semibold transition ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-[11px] text-xs font-semibold transition ${
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
                Every payout and booking credit is recorded in real time
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#06395F]/60">
              <Loader2 className="w-6 h-6 animate-spin text-[#0D8BE0] mb-2" />
              <p className="text-xs">Loading ledger entries...</p>
            </div>
          ) : ledger.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center mb-3">
                <History className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#06395F]">No transactions yet</p>
              <p className="text-xs text-[#0B4C7A]/70 mt-1 max-w-sm">
                As appointments are confirmed and completed, your revenue and payout history will appear here.
              </p>
            </div>
          ) : (
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
                  {ledger.map((item, idx) => {
                    const id = item.id || item._id || `led-${idx}`;
                    const isPositive = Number(item.amount) > 0;
                    return (
                      <tr key={id} className="group hover:bg-white/30 transition">
                        <td className="py-3.5 pl-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-[8px] flex items-center justify-center ${
                                isPositive
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : "bg-rose-500/15 text-rose-600"
                              }`}
                            >
                              {isPositive ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            <span className="text-xs font-semibold text-[#06395F]">
                              {item.type || "TRANSACTION"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-xs text-[#06395F] font-medium">
                          {item.description || item.reason || "Appointment service settlement"}
                        </td>
                        <td className="py-3.5 text-xs text-[#0B4C7A]/70">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("en-BD", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recent"}
                        </td>
                        <td
                          className={`py-3.5 text-right font-semibold text-xs ${
                            isPositive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isPositive ? `+${bdt(item.amount)}` : `-${bdt(Math.abs(item.amount))}`}
                        </td>
                        <td className="py-3.5 text-right font-bold text-xs text-[#06395F] pr-1">
                          {bdt(item.runningBalance ?? 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Payout Methods */}
      {activeTab === "methods" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {methods.map((pm, idx) => {
            const id = pm.id || pm._id || `pm-${idx}`;
            return (
              <div key={id} className={`${glass} p-6 relative`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[13px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center border border-white/80 shadow-sm">
                      {pm.type === "BANK" ? (
                        <Building className="w-6 h-6" />
                      ) : (
                        <Smartphone className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#06395F] text-base">
                          {pm.type === "BANK" ? pm.bankName || "Bank Transfer" : "bKash"}
                        </h3>
                        {pm.isDefault && (
                          <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] px-2 py-0.5 rounded-[8px] shadow-2xs">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#0B4C7A]/70 mt-0.5 font-medium">
                        A/C: {pm.accountNumber}
                      </p>
                      {pm.branchName && (
                        <p className="text-[11px] text-[#0B4C7A]/60">
                          Branch: {pm.branchName}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMethod(id)}
                    className="p-1.5 rounded-[8px] text-[#06395F]/40 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove method"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between text-xs text-[#0B4C7A]/80">
                  <span>
                    Holder: <strong>{pm.accountName}</strong>
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add Payout Method Card */}
          <button
            onClick={() => setShowAddMethodModal(true)}
            className="rounded-[13px] border-2 border-dashed border-sky-300/80 bg-white/30 p-6 flex flex-col items-center justify-center text-center hover:bg-white/50 transition group"
          >
            <div className="w-12 h-12 rounded-[13px] bg-sky-100 flex items-center justify-center text-[#0D8BE0] mb-3 group-hover:scale-105 transition">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#06395F]">Add Payout Account</h4>
            <p className="text-xs text-[#0B4C7A]/70 mt-1 max-w-xs">
              Connect bKash or Bangladeshi bank account for direct disbursements
            </p>
          </button>
        </div>
      )}

      {/* Add Payout Method Modal */}
      {showAddMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-[13px] border border-white/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
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
                <div className="grid grid-cols-2 gap-2">
                  {(["BKASH", "BANK"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewMethodType(type)}
                      className={`py-2 px-3 rounded-[11px] text-xs font-bold transition border ${
                        newMethodType === type
                          ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white border-transparent shadow-sm"
                          : "bg-white/70 text-[#06395F] border-[#06395F]/15 hover:bg-white"
                      }`}
                    >
                      {type === "BKASH" ? "bKash Personal / Merchant" : "Bank Transfer"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-semibold text-[#06395F] mb-1">
                  {newMethodType === "BANK" ? "Bank Account Number" : "bKash Mobile Number"}
                </label>
                <input
                  type="text"
                  placeholder={newMethodType === "BANK" ? "e.g. 1102938472910" : "017XXXXXXXX"}
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

              {newMethodType === "BKASH" ? (
                <div>
                  <label className="block text-xs font-semibold text-[#06395F] mb-1">
                    Account Type
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className={inputCls}
                  >
                    <option value="PERSONAL">Personal Account</option>
                    <option value="MERCHANT">Merchant Account</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#06395F] mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BRAC Bank PLC, City Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#06395F] mb-1">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dhanmondi"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#06395F] mb-1">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        placeholder="9-digit routing"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-[#06395F] mb-1">
                  Confirm Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter account password to authorize"
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
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Payout Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
