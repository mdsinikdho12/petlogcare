"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Search,
  ShieldCheck,
  CheckCheck,
  Loader2,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

/* ---------- Liquid Glass Tokens (Design System v2) ---------- */
const glass =
  "rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 " +
  "shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]";

interface Conversation {
  id: string;
  bookingId: string;
  partnerName: string;
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. Fetch conversations on mount
  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoadingConvs(true);
        const { data } = await apiClient.get("/conversations/me");
        const list = Array.isArray(data?.data)
          ? data.data
          : data?.data?.items || [];

        if (list.length > 0) {
          const mapped: Conversation[] = list.map((c: any) => ({
            id: c.id || c._id || Math.random().toString(),
            bookingId: c.bookingId || c.booking?.id || c.booking?._id,
            partnerName:
              c.booking?.user?.name ||
              c.partner?.name ||
              c.userName ||
              "Pet Parent",
            petName: c.booking?.pet?.name || c.petName || "Pet",
            serviceTitle:
              c.booking?.serviceType?.title ||
              c.booking?.service?.title ||
              "Consultation",
            lastMessage: c.lastMessage?.text || c.lastMessage || "Chat started",
            lastMessageTime: c.lastMessage?.createdAt
              ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recent",
            unreadCount: c.unreadCount || 0,
          }));

          setConversations(mapped);
          if (mapped[0]?.bookingId) {
            setActiveBookingId(mapped[0].bookingId);
          }
        } else {
          setConversations([]);
        }
      } catch {
        setConversations([]);
      } finally {
        setLoadingConvs(false);
      }
    }

    fetchConversations();
  }, []);

  // 2. Fetch messages whenever activeBookingId changes
  useEffect(() => {
    if (!activeBookingId) {
      setMessages([]);
      return;
    }

    async function fetchMessages() {
      try {
        setLoadingMsgs(true);
        const { data } = await apiClient.get(`/messages/booking/${activeBookingId}`);
        const rawList = Array.isArray(data?.data)
          ? data.data
          : data?.data?.messages || [];

        const mapped: Message[] = rawList.map((m: any) => ({
          id: m.id || m._id || Math.random().toString(),
          sender: m.isMine || m.senderRole === "PROVIDER" ? "ME" : "OTHER",
          text: m.text || m.content || "",
          createdAt: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Just now",
        }));

        setMessages(mapped);
      } catch {
        setMessages([]);
      } finally {
        setLoadingMsgs(false);
      }
    }

    fetchMessages();
  }, [activeBookingId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeBookingId) return;

    const textToSend = inputText.trim();
    const optimisticMsg: Message = {
      id: `local_${Date.now()}`,
      sender: "ME",
      text: textToSend,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");

    try {
      setSending(true);
      await apiClient.post(`/messages/booking/${activeBookingId}`, {
        text: textToSend,
        clientMessageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      });

      // Update last message in conversation preview list
      setConversations((prev) =>
        prev.map((c) =>
          c.bookingId === activeBookingId
            ? { ...c, lastMessage: textToSend, lastMessageTime: "Just now" }
            : c
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to deliver message");
    } finally {
      setSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c.bookingId === activeBookingId);

  const filteredConversations = conversations.filter(
    (c) =>
      c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#06395F] sm:text-3xl">
          Client & Patient Messaging
        </h1>
        <p className="mt-1 text-sm text-[#0B4C7A]/75">
          Direct communication with pet owners for pre-visit triage and post-care follow-ups
        </p>
      </div>

      {/* Main Chat Container */}
      <div
        className={`grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[calc(100vh-230px)] ${glass} overflow-hidden p-2`}
      >
        {/* Conversations Sidebar */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-[#06395F]/10 flex flex-col p-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#06395F]/40" />
            <input
              type="text"
              placeholder="Search clients or pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-[11px] border border-[#06395F]/15 bg-white/80 pl-9 pr-3 text-xs text-[#06395F] outline-none placeholder:text-[#06395F]/40 focus:bg-white focus:ring-2 focus:ring-[#0D8BE0]"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loadingConvs ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#06395F]/60">
                <Loader2 className="w-5 h-5 animate-spin text-[#0D8BE0] mb-2" />
                <p className="text-xs">Loading client threads...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageSquare className="w-8 h-8 text-[#0D8BE0]/50 mx-auto mb-2" />
                <p className="text-xs font-bold text-[#06395F]">No messages yet</p>
                <p className="text-[11px] text-[#0B4C7A]/70 mt-1">
                  When pet parents message you regarding appointments, conversations will appear here.
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.bookingId === activeBookingId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveBookingId(c.bookingId)}
                    className={`w-full text-left p-3.5 rounded-[13px] transition duration-150 flex items-start gap-3 border ${
                      isSelected
                        ? "bg-white border-[#0D8BE0]/40 shadow-sm"
                        : "bg-white/40 border-white/60 hover:bg-white/70"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-[11px] bg-gradient-to-br from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {c.partnerName[0] || "P"}
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
                        {c.petName} • {c.serviceTitle}
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
              })
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full bg-white/20">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-[#06395F]/10 flex items-center justify-between bg-white/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[11px] bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
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

                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[8px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Appointment
                </span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {loadingMsgs ? (
                  <div className="flex flex-col items-center justify-center py-12 text-[#06395F]/60">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0D8BE0] mb-2" />
                    <p className="text-xs">Loading appointment messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-[#0B4C7A]/60">
                    <p className="text-xs">No messages yet in this conversation.</p>
                    <p className="text-[11px] mt-1">Send a greeting or instructions to the client.</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender === "ME";
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-[13px] p-3.5 text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? "bg-gradient-to-r from-[#2FB0FF] to-[#0D8BE0] text-white shadow-md shadow-[#0D8BE0]/20 rounded-br-xs"
                              : "bg-white text-[#06395F] border border-[#06395F]/10 shadow-2xs rounded-bl-xs"
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
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#06395F]/10 bg-white/60 backdrop-blur-md flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Reply to client or provide pre-visit advice..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-10 rounded-[11px] border border-[#06395F]/20 bg-white px-3.5 text-xs text-[#06395F] outline-none placeholder:text-[#06395F]/40 focus:ring-2 focus:ring-[#0D8BE0]"
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="h-10 px-4 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center gap-1.5 shadow-sm hover:-translate-y-0.5 transition active:translate-y-0 disabled:opacity-50 text-xs font-semibold"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#06395F]/60">
              <MessageSquare className="w-12 h-12 text-[#0D8BE0]/30 mb-3" />
              <h3 className="font-bold text-sm text-[#06395F]">Select a conversation</h3>
              <p className="text-xs text-[#0B4C7A]/70 mt-1 max-w-sm">
                Choose a client conversation from the list to view appointment details and chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
