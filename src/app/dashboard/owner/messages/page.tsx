"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Search,
  ShieldCheck,
  CheckCheck,
  Sparkles,
  CalendarCheck2,
  ArrowRight,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface Conversation {
  id: string;
  bookingId: string;
  partnerName: string;
  partnerRole: string;
  petName: string;
  serviceTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  text: string;
  sender: "ME" | "OTHER";
  createdAt: string;
}

export default function OwnerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/conversations/me");
      const list = data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        const mapped: Conversation[] = list.map((c: any) => ({
          id: c.id || c._id,
          bookingId: c.bookingId || c.booking?.id || c._id,
          partnerName: c.booking?.provider?.name || c.partnerName || "Attending Veterinarian",
          partnerRole: c.booking?.provider?.businessName || "Clinic Practice",
          petName: c.booking?.pet?.name || "Pet",
          serviceTitle: c.booking?.service?.title || "Clinical Appointment",
          lastMessage: c.lastMessage?.text || "Chat opened",
          lastMessageTime: "Today",
          unreadCount: c.unreadCount || 0,
        }));
        setConversations(mapped);
        if (!activeBookingId) {
          setActiveBookingId(mapped[0].bookingId);
        }
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when activeBookingId changes
  useEffect(() => {
    if (!activeBookingId) return;
    async function loadMessages() {
      try {
        const { data } = await apiClient.get(`/messages/booking/${activeBookingId}`);
        const raw = data?.data || [];
        if (Array.isArray(raw)) {
          setMessages(
            raw.map((m: any) => ({
              id: m._id || m.id,
              text: m.text || m.content,
              sender: m.isSender ? "ME" : "OTHER",
              createdAt: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
            }))
          );
        }
      } catch {
        // Fallback or empty thread
      }
    }
    loadMessages();
  }, [activeBookingId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeBookingId) return;

    const optimisticMsg: Message = {
      id: `client_${Date.now()}`,
      sender: "ME",
      text: inputText.trim(),
      createdAt: "Just now",
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    const messageToSend = inputText.trim();
    setInputText("");

    try {
      setSending(true);
      await apiClient.post(`/messages/booking/${activeBookingId}`, {
        text: messageToSend,
        clientMessageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to deliver message");
    } finally {
      setSending(false);
    }
  };

  const selectedConv =
    conversations.find((c) => c.bookingId === activeBookingId) ||
    conversations[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner (Liquid Glass) */}
      <div className="rounded-[13px] border border-white/80 bg-white/55 p-6 sm:p-7 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-sky-500/15 text-[#0D8BE0] text-[12px] font-semibold mb-2.5 border border-white/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Encrypted patient-clinic chat</span>
          </div>
          <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#06395F]">
            Booking care chats
          </h1>
          <p className="text-[13px] sm:text-sm text-[#06395F]/80 mt-1 max-w-xl font-normal leading-relaxed">
            Communicate directly with verified clinics, surgeons, and specialists for your active pet appointments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchConversations}
          disabled={loading}
          className="p-2.5 rounded-[11px] bg-white border border-[#06395F]/15 text-[#06395F] hover:bg-slate-50 transition shadow-2xs self-start sm:self-center"
          title="Refresh messages"
        >
          <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Main Chat Grid (Solid Surface) */}
      {conversations.length === 0 && !loading ? (
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-12 text-center space-y-4 shadow-[0_1px_2px_rgba(6,57,95,0.06)]">
          <div className="w-14 h-14 mx-auto rounded-[13px] bg-sky-50 text-[#0D8BE0] flex items-center justify-center border border-sky-100 shadow-xs">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-display text-lg font-bold text-[#06395F]">
              No active appointment chats
            </h3>
            <p className="text-[13px] text-[#06395F]/75 leading-relaxed font-normal">
              When you schedule a consultation or vaccination with a verified partner clinic, a dedicated doctor communication channel will appear here automatically.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] px-5 py-2.5 text-[13px] font-semibold text-white shadow-xs hover:-translate-y-0.5 transition"
            >
              <span>Explore partner clinics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[calc(100vh-230px)] rounded-[13px] bg-white/85 border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] overflow-hidden">
          {/* Conversations Sidebar */}
          <div className="md:col-span-5 lg:col-span-4 border-r border-[#06395F]/10 flex flex-col p-3.5 space-y-3 bg-[#F8FBFE]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#06395F]/40" />
              <input
                type="text"
                placeholder="Search appointments & doctors..."
                className="h-9 w-full rounded-[11px] border border-[#06395F]/15 bg-white pl-9 pr-3 text-[12px] text-[#06395F] outline-none placeholder:text-[#06395F]/40 focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-2xs"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 scrollbar-none">
              {conversations.map((c) => {
                const isSelected = c.bookingId === activeBookingId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveBookingId(c.bookingId)}
                    className={`w-full text-left p-3 rounded-[11px] transition duration-150 flex items-start gap-3 border ${
                      isSelected
                        ? "bg-white border-[#0D8BE0]/40 shadow-xs"
                        : "bg-white/60 border-transparent hover:bg-white text-[#06395F]/80"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-[9px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {c.partnerName[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[13px] text-[#06395F] truncate">
                          {c.partnerName}
                        </h4>
                        <span className="text-[10px] text-[#06395F]/50">
                          {c.lastMessageTime}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#0D8BE0] truncate">
                        {c.petName} • {c.serviceTitle}
                      </div>
                      <p className="text-[11px] text-[#06395F]/60 truncate mt-0.5">
                        {c.lastMessage}
                      </p>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="h-4 min-w-[16px] px-1 rounded-full bg-[#0D8BE0] text-white text-[10px] font-bold flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full bg-white">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-[#06395F]/10 flex items-center justify-between bg-white/95">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[11px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center font-bold text-sm">
                      {selectedConv.partnerName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-[#06395F]">
                          {selectedConv.partnerName}
                        </h3>
                        <StatusBadge status="ACTIVE" label="Verified Clinic" />
                      </div>
                      <p className="text-[11px] text-[#06395F]/60">
                        {selectedConv.partnerRole} • Ref: {selectedConv.bookingId}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/owner/bookings`}
                    className="text-[12px] font-semibold text-[#0D8BE0] hover:underline"
                  >
                    View booking
                  </Link>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FBFE]">
                  {messages.map((m) => {
                    const isMe = m.sender === "ME";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[78%] px-4 py-2.5 rounded-[13px] text-[13px] leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white rounded-tr-xs"
                              : "bg-white border border-[#06395F]/10 text-[#06395F] rounded-tl-xs"
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[10px] text-[#06395F]/50 mt-1 px-1">
                          {m.createdAt}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-[#06395F]/10 flex items-center gap-2 bg-white"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a clinical question or update for the veterinarian..."
                    className="flex-1 px-4 py-2.5 rounded-[11px] border border-[#06395F]/15 text-[13px] text-[#06395F] outline-none focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="px-4 py-2.5 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white font-semibold text-[13px] shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[13px] text-[#06395F]/60">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
