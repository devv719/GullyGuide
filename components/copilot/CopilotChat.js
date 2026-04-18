"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Plus, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi! I'm your GullyGuide AI Co-pilot. I can help you plan your itinerary, track your budget, or find local hidden gems. What are we planning today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response Delay
    setTimeout(() => {
      let aiContent = "I'm currently running in mock mode because my Claude API key wasn't provided, but I'll still help you out!";
      
      const lowerInput = userMessage.content.toLowerCase();
      if (lowerInput.includes("delhi") || lowerInput.includes("food")) {
        aiContent = "For authentic food in Delhi, I highly recommend checking out Paranthe Wali Gali in Chandni Chowk! A typical meal there fits perfectly into a budget of ₹300-₹500.";
      } else if (lowerInput.includes("budget")) {
        aiContent = "Looking at your current active trip, you've spent ₹1,200 out of ₹6,000 for your 3-day trip. You're well within your daily limit of ₹2,000! Great job.";
      } else if (lowerInput.includes("itinerary")) {
        aiContent = "I can definitely optimize your Day 2. Since you're going to South Delhi, maybe add Deer Park before hitting Hauz Khas Village. It's free and beautiful!";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: aiContent }]);
      setIsTyping(false);
    }, 1500);
  };

  const PRESET_PROMPTS = [
    "Suggest food in Delhi",
    "Review my budget",
    "Optimise my itinerary"
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50 group hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 sm:w-[400px] w-[calc(100vw-32px)] h-[600px] max-h-[80vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-teal-50 dark:bg-teal-900/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">AI Co-Pilot</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">GullyGuide Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${msg.role === "user" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "bg-primary text-white"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tr-sm" : "bg-teal-50 border border-teal-100 text-teal-900 dark:bg-teal-900/20 dark:border-teal-900/30 dark:text-teal-50 rounded-tl-sm"}`}>
                    {msg.content}
                    {msg.role === "assistant" && msg.content.includes("Paranthe") && (
                      <button className="mt-3 w-full py-2 bg-white/50 dark:bg-black/20 border border-teal-200 dark:border-teal-800 rounded-xl text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center gap-1 hover:bg-white dark:hover:bg-black/40 transition-colors">
                        <Plus className="w-4 h-4" /> Add to Itinerary
                      </button>
                    )}
                    {msg.role === "assistant" && msg.content.includes("budget") && (
                      <button className="mt-3 w-full py-2 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-amber-800 dark:text-amber-500 font-bold flex items-center justify-center gap-1 hover:bg-white dark:hover:bg-black/40 transition-colors">
                        <TrendingDown className="w-4 h-4" /> View full breakdown
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-primary text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 px-4 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 rounded-tl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
               <div className="px-4 pb-2 flex flex-wrap gap-2">
                 {PRESET_PROMPTS.map((prompt, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(prompt)}
                      className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:border-primary/50 hover:text-primary dark:hover:border-primary/50 text-xs font-semibold rounded-lg text-zinc-600 dark:text-zinc-400 transition-colors"
                    >
                      "{prompt}"
                    </button>
                 ))}
               </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <form onSubmit={handleSend} className="relative flex items-center border border-zinc-200 dark:border-zinc-800 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your trip..."
                  className="w-full pl-4 pr-12 py-3.5 bg-transparent focus:outline-none text-sm dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
