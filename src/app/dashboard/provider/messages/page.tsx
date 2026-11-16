"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Search,
  User,
  Clock,
  ShieldCheck,
  CheckCheck,
  Check,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

/* ---------- Liquid Glass Tokens ---------- */
const glass =
  "rounded-[2rem] border border-white/70 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 " +
  "shadow-[0_10px_40px_rgba(1,95,160,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]";

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

export default function ProviderMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv_1",
      bookingId: "bk_9102",
      partnerName: "Rafiqul Islam",
      partnerRole: "Pet Parent",
      petName: "Milo (Golden Retriever)",
      serviceTitle: "Annual Booster & Health Check",
      lastMessage: "Walaikum assalam. Milo is a bit shy with strangers, should we arrive earlier?",
      lastMessageTime: "11:35 AM",
      unreadCount: 1,
    },
    {
      id: "conv_2",
      bookingId: "bk_8890",
      partnerName: "Nusrat Jahan",
      partnerRole: "Pet Parent",
      petName: "Luna (Persian Cat)",
      serviceTitle: "Full Spa & Deshedding",
      lastMessage: "Thank you so much! Luna is doing great at home.",
      lastMessageTime: "Nov 14",
      unreadCount: 0,
    },
  ]);

  const [activeBookingId, setActiveBookingId] = useState<string>("bk_9102");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "ME",
      text: "Assalamu alaikum! Thank you for booking with Central Pet Hospital.",
      createdAt: "11:30 AM",
    },
    {
      id: "m2",
      sender: "OTHER",
      text: "Walaikum assalam. Milo is a bit shy with strangers, should we arrive earlier?",
      createdAt: "11:35 AM",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const { data } = await apiClient.get("/conversations/me");
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setConversations(
            data.data.map((c: any) => ({
              id: c.id,
              bookingId: c.bookingId || c.booking?.id,
              partnerName: c.booking?.user?.name || c.partnerName || "Pet Parent",
              partnerRole: "Pet Parent",
              petName: c.booking?.pet?.name || "Pet",
              serviceTitle: c.booking?.service?.title || "Appointment",
              lastMessage: c.lastMessage?.text || "Chat opened",
              lastMessageTime: "Today",
              unreadCount: c.unreadCount || 0,
            }))
          );
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    fetchConversations();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

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

  const selectedConv = conversations.find((c) => c.bookingId === activeBookingId) || conversations[0];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#06395F] sm:text-3xl">
          Client Patient Messaging
        </h1>
        <p className="mt-1 text-sm text-[#0B4C7A]/75">
          Communicate with pet owners before and after their scheduled clinic visits
        </p>
      </div>

      {/* Main Chat Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[calc(100vh-220px)] ${glass} overflow-hidden p-2`}>
        {/* Conversations Sidebar */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-white/60 flex flex-col p-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#06395F]/40" />
            <input
              type="text"
              placeholder="Search clients or pets..."
              className="h-9 w-full rounded-xl border border-white/80 bg-white/75 pl-9 pr-3 text-xs text-[#06395F] outline-none placeholder:text-[#06395F]/40 focus:bg-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {conversations.map((c) => {
              const isSelected = c.bookingId === activeBookingId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveBookingId(c.bookingId)}
                  className={`w-full text-left p-3.5 rounded-2xl transition duration-150 flex items-start gap-3 border ${
                    isSelected
                      ? "bg-white/90 border-[#0D8BE0]/30 shadow-md shadow-[#0D8BE0]/10"
                      : "bg-white/40 border-white/60 hover:bg-white/60"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {c.partnerName[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#06395F] truncate">
                        {c.partnerName}
                      </h4>
                      <span className="text-[10px] text-[#0B4C7A]/60">
                        {c.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-[#0D8BE0] mt-0.5 truncate">
                      {c.petName}
                    </p>

                    <p className="text-xs text-[#0B4C7A]/75 mt-1 truncate">
                      {c.lastMessage}
                    </p>
                  </div>

                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full bg-white/20">
          {/* Thread Header */}
          <div className="p-4 border-b border-white/60 flex items-center justify-between bg-white/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#06395F]">
                  {selectedConv.partnerName}
                </h3>
                <p className="text-[11px] text-[#0B4C7A]/70">
                  Patient: <strong>{selectedConv.petName}</strong> • {selectedConv.serviceTitle}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Client Verified
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => {
              const isMe = m.sender === "ME";
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white shadow-md shadow-[#0D8BE0]/20 rounded-br-xs"
                        : "bg-white/90 text-[#06395F] border border-white/80 shadow-xs rounded-bl-xs"
                    }`}
                  >
                    <p>{m.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMe ? "text-white/80" : "text-[#0B4C7A]/50"
                      }`}
                    >
                      <span>{m.createdAt}</span>
                      {isMe && <CheckCheck className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/60 bg-white/40 backdrop-blur-md flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Reply to client or give pre-visit instructions..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-11 rounded-full border border-white/80 bg-white/90 px-4 text-xs sm:text-sm text-[#06395F] outline-none placeholder:text-[#06395F]/40 focus:ring-2 focus:ring-[#0D96E6]"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="h-11 w-11 rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center shadow-md hover:-translate-y-0.5 transition active:translate-y-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
