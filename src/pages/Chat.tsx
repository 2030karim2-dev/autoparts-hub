import { useState, useRef, useEffect } from "react";
import { ArrowRight, Send, Bot, User, Paperclip, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  time: string;
}

const quickReplies = [
  "أريد تتبع طلبي",
  "هل القطعة متوفرة؟",
  "أريد إرجاع منتج",
  "كيف أختار القطعة المناسبة؟",
];

const autoReplies: Record<string, string> = {
  "أريد تتبع طلبي": "يمكنك تتبع طلبك من صفحة الطلبات. ما هو رقم الطلب؟",
  "هل القطعة متوفرة؟": "أرسل لنا رقم OEM أو اسم القطعة وسنتحقق من التوفر فوراً.",
  "أريد إرجاع منتج": "يمكنك إرجاع المنتج خلال 7 أيام من الاستلام. هل تريد بدء طلب إرجاع؟",
  "كيف أختار القطعة المناسبة؟": "أدخل موديل سيارتك وسنة الصنع وسنعرض لك القطع المتوافقة تلقائياً.",
};

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "مرحباً بك في دعم قطع الغيار! كيف يمكنني مساعدتك؟", sender: "support", time: "الآن" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text, sender: "user", time: "الآن" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Auto reply
    setTimeout(() => {
      const reply = autoReplies[text] || "شكراً لتواصلك! سيقوم أحد ممثلي خدمة العملاء بالرد عليك قريباً.";
      const supportMsg: Message = { id: (Date.now() + 1).toString(), text: reply, sender: "support", time: "الآن" };
      setMessages((prev) => [...prev, supportMsg]);
    }, 800);
  };

  return (
    <AppLayout>
      <header className="bg-primary text-primary-foreground px-4 flex items-center justify-between h-[var(--nav-height)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform"><ArrowRight className="w-5 h-5" /></button>
        <div className="text-center">
          <h1 className="text-sm font-bold">الدعم الفني</h1>
          <p className="text-[10px] opacity-80">● متصل الآن</p>
        </div>
        <div className="w-5" />
      </header>

      {/* Messages */}
      <div className="flex-1 px-4 py-3 space-y-3 min-h-[50vh]" dir="rtl">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""} animate-fade-in-up`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === "support" ? "bg-primary/10" : "bg-secondary"
            }`}>
              {msg.sender === "support" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
              msg.sender === "support"
                ? "bg-card shadow-sm rounded-tr-sm"
                : "bg-primary text-primary-foreground rounded-tl-sm"
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "support" ? "text-muted-foreground" : "opacity-70"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide" dir="rtl">
          {quickReplies.map((text) => (
            <button
              key={text}
              onClick={() => sendMessage(text)}
              className="shrink-0 text-xs font-medium bg-primary/10 text-primary px-3 py-2 rounded-full active:scale-95 transition-transform"
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-[var(--bottom-nav-height)] bg-card border-t border-border px-3 py-2.5 flex items-center gap-2" dir="rtl">
        <button className="w-9 h-9 flex items-center justify-center text-muted-foreground active:scale-95">
          <Paperclip className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center text-muted-foreground active:scale-95">
          <Image className="w-4 h-4" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          className="flex-1 h-10 rounded-full bg-secondary px-4 text-sm outline-none"
          placeholder="اكتب رسالتك..."
        />
        <button
          onClick={() => sendMessage(input)}
          className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </AppLayout>
  );
};

export default Chat;
