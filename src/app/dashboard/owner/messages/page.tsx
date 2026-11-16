"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Search,
  ShieldCheck,
  CheckCheck,
  Sparkles,
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
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv_1",
      bookingId: "bk_9102",
      partnerName: "Central Pet Hospital (Dr. Tanvir)",
      partnerRole: "Veterinarian",
      petName: "Milo",
      serviceTitle: "Annual Booster & Health Check",
      lastMessage: "Please bring Milo's previous vaccination card if available.",
      lastMessageTime: "11:45 AM",
      unreadCount: 1,
    },
    {
      id: "conv_2",
      bookingId: "bk_8890",
      partnerName: "Happy Paws Grooming",
      partnerRole: "Pet Groomer",
      petName: "Luna",
      serviceTitle: "Full Spa & Deshedding",
      lastMessage: "Luna did wonderfully today! Clean and fluffy.",
      lastMessageTime: "Nov 14",
      unreadCount: 0,
    },
  ]);

  const [activeBookingId, setActiveBookingId] = useState<string>("bk_9102");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "OTHER",
      text: "Assalamu alaikum! Thank you for booking with Central Pet Hospital.",
      createdAt: "11:30 AM",
    },
    {
      id: "m2",
      sender: "ME",
      text: "Walaikum assalam. Milo is a bit shy with strangers, should we arrive earlier?",
      createdAt: "11:35 AM",
    },
    {
      id: "m3",
      sender: "OTHER",
      text: "Please bring Milo's previous vaccination card if available. Arriving 5-10 minutes prior will give him time to settle.",
      createdAt: "11:45 AM",
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
              partnerName: c.booking?.provider?.name || c.partnerName || "Provider",
              partnerRole: c.booking?.provider?.businessName || "Clinic",
              petName: c.booking?.pet?.name || "Pet",
              serviceTitle: c.booking?.service?.title || "Consultation",
              lastMessage: c.lastMessage?.text || "Chat opened",
              lastMessageTime: "Today",
              unreadCount: c.unreadCount || 0,
            }))
          );
        }
      } catch (err) {
        // Fallback gracefully to demo chat
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
      </div>

      {/* Main Chat Grid (Solid Surface) */}
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
                      <span className="text-[11px] text-[#06395F]/60">
                        {c.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[12px] font-semibold text-[#0D8BE0] mt-0.5 truncate">
                      {c.petName} • {c.serviceTitle}
                    </p>

                    <p className="text-[12px] text-[#06395F]/75 mt-0.5 truncate">
                      {c.lastMessage}
                    </p>
                  </div>

                  {c.unreadCount > 0 && (
                    <span className="h-4.5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full bg-white">
          {/* Thread Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#06395F]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-[11px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center font-bold shrink-0 border border-sky-300/40">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm text-[#06395F] truncate">
                  {selectedConv.partnerName}
                </h3>
                <p className="text-[12px] text-[#06395F]/75 truncate">
                  Appointment for <strong>{selectedConv.petName}</strong> ({selectedConv.serviceTitle})
                </p>
              </div>
            </div>

            <StatusBadge status="CONFIRMED" label="Verified chat" />
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-[#FAFDFE]">
            <div className="text-center my-1">
              <span className="text-[11px] font-medium text-[#06395F]/60 bg-white px-3 py-1 rounded-[8px] border border-[#06395F]/10 shadow-2xs">
                End-to-end appointment consultation record
              </span>
            </div>

            {messages.map((m) => {
              const isMe = m.sender === "ME";
              return (
                <div
                  key={m.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-[13px] p-3 text-[13px] leading-relaxed shadow-xs ${
                      isMe
                        ? "bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white rounded-br-[3px]"
                        : "bg-white text-[#06395F] border border-[#06395F]/10 rounded-bl-[3px]"
                    }`}
                  >
                    <p>{m.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[11px] ${
                        isMe ? "text-white/80" : "text-[#06395F]/50"
                      }`}
                    >
                      <span>{m.createdAt}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />}
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
            className="p-3 border-t border-[#06395F]/10 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message to the clinic or attending vet..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-10 rounded-[11px] border border-[#06395F]/15 bg-[#F8FBFE] px-3.5 text-[13px] text-[#06395F] outline-none placeholder:text-[#06395F]/40 focus:bg-white focus:border-[#0D8BE0] focus:ring-2 focus:ring-[#0D8BE0]/20 shadow-2xs"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              aria-label="Send message"
              className="h-10 w-10 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center shadow-xs hover:-translate-y-0.5 transition active:translate-y-0 disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
