"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { MessageSquare, ArrowRight, XCircle, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
      try {
        const gDoc = await getDoc(doc(db, "guides", guideId));
        if (gDoc.exists()) {
          setGuide({ id: gDoc.id, ...gDoc.data() });
        }
      } catch (e) {
         setError(true);
      }
    };
    fetchGuide();
  }, [guideId]);

  useEffect(() => {
    if (!conversationId) return;

    try {
       const q = query(
         collection(db, "conversations", conversationId, "messages"),
         orderBy("createdAt", "asc")
       );
       
       const unsubscribe = onSnapshot(q, (snapshot) => {
         const msgs = [];
         snapshot.forEach(doc => {
           msgs.push({ id: doc.id, ...doc.data() });
         });
         setMessages(msgs);
         setLoading(false);
         setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
         }, 100);
       }, (err) => {
         console.error(err);
         setError(true);
         setLoading(false);
       });

       return () => unsubscribe();
    } catch (err) {
       setError(true);
       setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !user || !conversationId) return;
    
    const text = inputText;
    // Optimistic UI clear
    setInputText("");

    try {
      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        senderId: user.uid,
        text,
        createdAt: serverTimestamp()
      });

      await setDoc(doc(db, "conversations", conversationId), {
        touristId: user.uid,
        guideId: guideId,
        lastMessage: text,
        lastMessageAt: serverTimestamp()
      }, { merge: true });
    } catch(e) {
      console.error("Message send failure:", e);
      setInputText(text); // revert
    }
  };

  const handleQuickPrompt = (prompt) => {
     setInputText(prompt);
  };

  if (error) {
     return (
       <div className="w-full p-4 flex justify-center">
         <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 text-sm font-bold w-full max-w-sm flex items-center justify-between">
           Couldn't load messages. <button onClick={() => window.location.reload()} className="text-[#534AB7] hover:underline">Retry</button>
         </div>
       </div>
     );
  }

  const isTourist = role === "tourist";
  const PRIMARY_HEX = isTourist ? "#534AB7" : "#0F6E56";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 -mb-6 lg:-mb-8 overflow-hidden bg-zinc-50 dark:bg-zinc-950/50">
      
      {/* Dynamic Header */}
      <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between z-10 shadow-sm shrink-0">
         {guide ? (
           <div className="flex items-center gap-3">
             <div className="relative">
               <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-600 dark:text-zinc-300 overflow-hidden">
                 {guide.photoURL ? <img src={guide.photoURL} alt={guide.name} className="w-full h-full object-cover" /> : guide.name[0].toUpperCase()}
               </div>
               <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-zinc-950 rounded-full bg-green-500"></div>
             </div>
             <div>
               <h3 className="font-bold text-zinc-900 dark:text-white text-[15px] leading-tight">{guide.name}</h3>
               <p className="text-xs font-semibold text-zinc-500">{guide.city}</p>
             </div>
           </div>
         ) : (
           <div className="flex items-center gap-3 animate-pulse">
             <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
             <div className="space-y-2"><div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-800 rounded"></div><div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-800 rounded"></div></div>
           </div>
         )}
      </div>

      {/* Chat Thread Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col relative">
        {loading ? (
          <div className="space-y-6 max-w-lg mx-auto w-full pt-8">
             <div className="flex flex-col items-start gap-1">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-1 animate-pulse"></div>
                <div className="h-12 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-bl-sm animate-pulse"></div>
             </div>
             <div className="flex flex-col items-end gap-1">
                <div className="h-10 w-48 bg-[#534AB7]/20 rounded-2xl rounded-br-sm animate-pulse"></div>
             </div>
             <div className="flex flex-col items-start gap-1">
                <div className="h-16 w-72 bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-bl-sm animate-pulse"></div>
             </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-500">
             <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 shadow-sm">
                <MessageSquare className="w-8 h-8 text-zinc-400 stroke-[1.5]" />
             </div>
             <h3 className="font-bold text-zinc-900 dark:text-white text-[16px] mb-1.5">Start the conversation</h3>
             <p className="text-[13px] text-zinc-500 font-medium mb-8 leading-relaxed">
               Ask {guide?.name.split(' ')[0]} about their experiences, availability, or anything you'd like to know.
             </p>
             <div className="flex flex-wrap justify-center gap-2">
                {["What experiences do you offer?", "Are you available this weekend?", "What should I bring?"].map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-bold rounded-full shadow-sm hover:border-zinc-300 transition-colors"
                  >
                     {prompt}
                  </button>
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
                      <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-600 overflow-hidden">
                        {guide?.photoURL ? <img src={guide.photoURL} className="w-full h-full object-cover" /> : guide?.name[0].toUpperCase()}
                      </div>
                      <span className="text-[11px] text-zinc-500 font-medium">{guide?.name.split(' ')[0]}</span>
                    </div>
                  )}
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3.5 px-4 max-w-[85%] sm:max-w-md text-[14px] font-medium leading-[1.4] ${
                      isMe 
                      ? 'bg-[#534AB7] text-white rounded-[16px] rounded-br-[4px] shadow-sm' 
                      : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-[16px] rounded-bl-[4px] shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                  <span className={`text-[10px] text-zinc-400 font-semibold ${isMe ? 'mr-1' : 'ml-1'} mt-0.5`}>{timeStr}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Persistent Input Bar */}
      <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
         <div className="relative flex items-center">
            <input 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              type="text"
              placeholder={`Message ${guide?.name.split(' ')[0] || 'guide'}...`}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-[#534AB7] dark:focus:border-[#534AB7] rounded-xl pl-4 pr-16 py-3.5 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none transition-all shadow-sm"
            />
            <button 
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="absolute right-2 px-4 py-2 font-bold text-xs bg-[#534AB7] disabled:opacity-40 text-white rounded-lg transition-colors hover:bg-[#433b9b]"
            >
              Send
            </button>
         </div>
      </div>
    </div>
  );
}
