"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { MessageSquare, ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const WB = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WB2 = "15px 225px 15px 255px / 255px 15px 225px 15px";

export default function DynamicChatPage({ params }) {
  const { user, role } = useAuth();
  const guideId = params.id;
  const [guide, setGuide] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef(null);
  const conversationId = user ? [user.uid, guideId].sort().join('_') : null;

  useEffect(() => {
    if (!guideId) return;
    const fetchGuide = async () => {
      try { const gDoc = await getDoc(doc(db, "guides", guideId)); if (gDoc.exists()) setGuide({ id: gDoc.id, ...gDoc.data() }); } catch { setError(true); }
    };
    fetchGuide();
  }, [guideId]);

  useEffect(() => {
    if (!conversationId) return;
    try {
      const q = query(collection(db, "conversations", conversationId, "messages"), orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = []; snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
        setMessages(msgs); setLoading(false);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }, () => { setError(true); setLoading(false); });
      return () => unsubscribe();
    } catch { setError(true); setLoading(false); }
  }, [conversationId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !user || !conversationId) return;
    const text = inputText; setInputText("");
    try {
      await addDoc(collection(db, "conversations", conversationId, "messages"), { senderId: user.uid, text, createdAt: serverTimestamp() });
      await setDoc(doc(db, "conversations", conversationId), { touristId: user.uid, guideId, lastMessage: text, lastMessageAt: serverTimestamp() }, { merge: true });
    } catch { setInputText(text); }
  };

  if (error) {
    return (
      <div className="w-full p-4 flex justify-center">
        <div className="bg-accent/5 text-accent px-4 py-3 border-2 border-accent text-base font-body font-bold w-full max-w-sm flex items-center justify-between" style={{ borderRadius: WB }}>
          Couldn't load messages. <button onClick={() => window.location.reload()} className="text-secondary hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-6 lg:-mx-10 -mt-6 lg:-mt-10 -mb-6 lg:-mb-10 overflow-hidden bg-background">
      {/* Header */}
      <div className="h-16 px-6 border-b-[3px] border-foreground bg-paper flex items-center justify-between z-10 shrink-0">
        {guide ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-postit border-2 border-foreground flex items-center justify-center font-heading font-bold text-foreground overflow-hidden" style={{ borderRadius: WB }}>
                {guide.photoURL ? <img src={guide.photoURL} alt={guide.name} className="w-full h-full object-cover" /> : guide.name[0].toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-paper bg-secondary" style={{ borderRadius: "50%" }}></div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground text-base">{guide.name}</h3>
              <p className="text-sm font-body text-foreground/40">{guide.city}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-muted/60 border-2 border-dashed border-foreground/10" style={{ borderRadius: WB }}></div>
            <div className="space-y-2"><div className="w-24 h-3 bg-muted/60" style={{ borderRadius: WB }}></div><div className="w-16 h-2 bg-muted/40"></div></div>
          </div>
        )}
      </div>

      {/* Chat Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col relative">
        {loading ? (
          <div className="space-y-6 max-w-lg mx-auto w-full pt-8">
            <div className="flex flex-col items-start gap-1"><div className="w-8 h-8 bg-muted/60 mb-1 animate-pulse" style={{ borderRadius: WB }}></div><div className="h-12 w-64 bg-muted/40 animate-pulse" style={{ borderRadius: WB }}></div></div>
            <div className="flex flex-col items-end gap-1"><div className="h-10 w-48 bg-accent/10 animate-pulse" style={{ borderRadius: WB2 }}></div></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-paper border-2 border-foreground flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)]" style={{ borderRadius: WB }}>
              <MessageSquare className="w-8 h-8 text-foreground/30" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-1.5">Start the conversation</h3>
            <p className="text-base font-body text-foreground/40 mb-8">Ask {guide?.name?.split(' ')[0]} about their experiences, availability, or anything you'd like to know.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["What experiences do you offer?", "Are you available this weekend?", "What should I bring?"].map((prompt, i) => (
                <button key={i} onClick={() => setInputText(prompt)}
                  className="px-4 py-2 bg-paper border-2 border-foreground text-foreground/60 text-sm font-body shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  style={{ borderRadius: WB }}>{prompt}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col">
            {messages.map((msg, idx) => {
              const isMe = msg.senderId === user?.uid;
              const timeStr = msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Sending...";
              const isFirstIncoming = !isMe && (idx === 0 || messages[idx-1].senderId === user?.uid);
              return (
                <div key={msg.id || idx} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  {isFirstIncoming && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                      <div className="w-5 h-5 bg-postit border border-foreground flex items-center justify-center text-[9px] font-heading font-bold text-foreground overflow-hidden" style={{ borderRadius: WB }}>
                        {guide?.photoURL ? <img src={guide.photoURL} className="w-full h-full object-cover" /> : guide?.name[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-body text-foreground/40">{guide?.name?.split(' ')[0]}</span>
                    </div>
                  )}
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                    className={`p-3.5 px-4 max-w-[85%] sm:max-w-md text-base font-body leading-[1.5] border-2 ${
                      isMe ? 'bg-foreground text-paper border-foreground shadow-[2px_2px_0px_0px_#ff4d4d]' : 'bg-paper text-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)]'
                    }`}
                    style={{ borderRadius: isMe ? WB2 : WB }}>
                    {msg.text}
                  </motion.div>
                  <span className={`text-xs font-body text-foreground/30 ${isMe ? 'mr-1' : 'ml-1'} mt-0.5`}>{timeStr}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-paper border-t-[3px] border-foreground shrink-0">
        <div className="relative flex items-center gap-3">
          <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} type="text"
            placeholder={`Message ${guide?.name?.split(' ')[0] || 'guide'}...`}
            className="w-full bg-background border-2 border-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 pl-4 pr-4 py-3.5 text-lg font-body text-foreground placeholder:text-foreground/30 transition-all"
            style={{ borderRadius: WB }} />
          <button onClick={sendMessage} disabled={!inputText.trim()}
            className="px-5 py-3.5 font-body text-base bg-foreground text-paper border-2 border-foreground disabled:opacity-40 shadow-[2px_2px_0px_0px_#ff4d4d] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 shrink-0"
            style={{ borderRadius: WB }}>
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
