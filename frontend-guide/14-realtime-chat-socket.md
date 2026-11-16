# Frontend Guide 14: Real-Time Chat & Socket.IO Messaging

> **Branch / Goal:** 1-to-1 Booking-Linked Chat Threads, Socket.IO Events & Safety Filter Warnings  
> **Backend Integration:** `/api/v1/conversations/*`, `/api/v1/messages/*`, Socket.IO server at `/`

---

## 1. Chat Lifecycle & Security Rules

1. **One Chat Per Booking:** Conversations are linked directly to `bookingId`.
2. **When Chat Opens:** Only after the booking confirmation fee is paid (`feePaidAt` set). Prior to payment, attempting to open chat returns 409.
3. **When Chat Becomes Read-Only:** 7 days after the appointment reaches a terminal state (`COMPLETED`, `CANCELLED`, `NO_SHOW`, `REFUNDED`). Once expired, inputs are disabled with a banner: *"This chat is now read-only."*
4. **Safety Filter:** The backend strictly rejects messages containing:
   - Phone numbers (BD mobiles, Bengali digits ০-৯, international + format).
   - Email addresses (including `(at)` and `(dot)` evasions).
   - External links (URLs, WhatsApp, Telegram, Facebook handles).
   - *If detected, the API returns 400: "For your safety, phone numbers, email addresses and external contact links cannot be shared in chat."*

---

## 2. Socket.IO Client Setup (`src/lib/socket/client.ts`)

```typescript
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store/authStore';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = useAuthStore.getState().accessToken;
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

    socket = io(socketUrl, {
      transports: ['websocket'],
      auth: { token },
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  const token = useAuthStore.getState().accessToken;
  if (token && !s.connected) {
    s.auth = { token };
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

---

## 3. Conversation Thread & Message Screen (`src/app/dashboard/(shared)/messages/[bookingId]/page.tsx`)

### Layout Breakdown:
- **Header:**
  - Counterpart Name (Owner name or Business name).
  - Booking Summary Badge: Service title, Date, Time, Status.
  - Link to Booking Detail.
- **Security Notice Banner:**
  - *"🛡️ For your protection, never share personal phone numbers, bank details, or off-platform payment links."*
- **Scrollable Message History (`GET /messages/booking/:bookingId`):**
  - Messages grouped by date.
  - Message bubble: text, timestamp, delivery status checkmark.
  - Role-discriminated styling: My messages (brand teal, right-aligned) vs Counterpart (slate grey, left-aligned).
- **Message Input Area:**
  - Textarea (auto-expanding, max 2,000 characters).
  - Send button (handles Enter to send, Shift+Enter for newline).

### Real-Time Event Integration Hook (`useBookingChat.ts`)
```typescript
import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket/client';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export function useBookingChat(bookingId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const socket = getSocket();

  // 1. Join Socket Booking Room on Mount
  useEffect(() => {
    socket.emit('chat:join', { bookingId }, (response: any) => {
      if (!response.ok) {
        toast.error(response.error || 'Could not join chat room');
      }
    });

    // 2. Listen for Inbound Messages
    socket.on('chat:message', (incoming: any) => {
      if (incoming.bookingId === bookingId) {
        setMessages((prev) => [...prev, incoming]);
        // Mark as read immediately if window is open
        socket.emit('chat:read', { bookingId, seq: incoming.seq });
      }
    });

    return () => {
      socket.emit('chat:leave', { bookingId });
      socket.off('chat:message');
    };
  }, [bookingId]);

  // 3. Send Message Function
  const sendMessage = async (text: string) => {
    const clientMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Client-side quick safety regex check before sending
    if (/(\+?8801[3-9]\d{8}|01[3-9]\d{8}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i.test(text)) {
      toast.warning('Phone numbers and emails cannot be shared in chat for safety.');
      return;
    }

    socket.emit('chat:send', { bookingId, text, clientMessageId }, (response: any) => {
      if (!response.ok) {
        toast.error(response.error);
      }
    });
  };

  return { messages, sendMessage };
}
```
