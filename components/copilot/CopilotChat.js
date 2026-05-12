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
            className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white border-[3px] border-foreground shadow-sketch flex items-center justify-center hover:shadow-sketch-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all z-50 active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
          >
            <Sparkles className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, rotate: -1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, rotate: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 sm:w-[400px] w-[calc(100vw-32px)] h-[600px] max-h-[80vh] bg-paper border-[3px] border-foreground shadow-sketch-lg flex flex-col z-50 overflow-hidden"
            style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}
          >
            {/* Header */}
            <div className="px-4 py-4 border-b-2 border-dashed border-foreground/30 flex justify-between items-center bg-postit">
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 bg-accent text-white flex items-center justify-center border-2 border-foreground"
                  style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                >
                  <Bot className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">AI Co-Pilot</h3>
                  <p className="text-xs text-foreground/50 font-body">GullyGuide Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground/50 hover:text-accent transition-colors p-2 hover:bg-muted/50 border-2 border-transparent hover:border-foreground/20"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 notebook-lines">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  <div 
                    className={`w-8 h-8 flex-shrink-0 flex items-center justify-center text-sm border-2 border-foreground ${msg.role === "user" ? "bg-muted text-foreground" : "bg-accent text-white"}`}
                    style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                  >
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div 
                    className={`p-3 text-base font-body leading-relaxed border-2 border-foreground ${msg.role === "user" ? "bg-paper text-foreground" : "bg-postit text-foreground"}`}
                    style={{ borderRadius: msg.role === "user" ? "225px 15px 255px 15px / 15px 255px 15px 225px" : "15px 225px 15px 255px / 255px 15px 225px 15px" }}
                  >
                    {msg.content}
                    {msg.role === "assistant" && msg.content.includes("Paranthe") && (
                      <button 
                        className="mt-3 w-full py-2 bg-paper border-2 border-foreground text-foreground font-body font-bold flex items-center justify-center gap-1 hover:bg-muted transition-colors shadow-[2px_2px_0px_0px_#2d2d2d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                      >
                        <Plus className="w-4 h-4" /> Add to Itinerary
                      </button>
                    )}
                    {msg.role === "assistant" && msg.content.includes("budget") && (
                      <button 
                        className="mt-3 w-full py-2 bg-paper border-2 border-foreground text-foreground font-body font-bold flex items-center justify-center gap-1 hover:bg-muted transition-colors shadow-[2px_2px_0px_0px_#2d2d2d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                      >
                        <TrendingDown className="w-4 h-4" /> View full breakdown
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div 
                    className="w-8 h-8 flex-shrink-0 bg-accent text-white flex items-center justify-center border-2 border-foreground"
                    style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                  <div 
                    className="p-3 px-4 bg-postit border-2 border-foreground text-foreground flex gap-1.5 items-center"
                    style={{ borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px" }}
                  >
                    <span className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-foreground rounded-full animate-bounce"></span>
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
                      className="px-3 py-1.5 bg-paper border-2 border-foreground/30 hover:border-foreground text-sm font-body text-foreground transition-colors shadow-[2px_2px_0px_0px_rgba(45,45,45,0.1)] hover:shadow-[2px_2px_0px_0px_#2d2d2d]"
                      style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                    >
                      "{prompt}"
                    </button>
                 ))}
               </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t-2 border-dashed border-foreground/30 bg-background">
              <form onSubmit={handleSend} className="relative flex items-center border-2 border-foreground overflow-hidden bg-paper transition-all focus-within:border-secondary focus-within:shadow-[2px_2px_0px_0px_#2d5da1]"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your trip..."
                  className="w-full pl-4 pr-12 py-3.5 bg-transparent focus:outline-none text-base font-body text-foreground placeholder:text-foreground/30"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-accent text-white border-2 border-foreground disabled:opacity-30 disabled:bg-muted transition-colors"
                  style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
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
