import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export const AdminChatModal = ({ open, onClose, messages = [], onSendMessage }: any) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [open, messages]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-[#2c0e3b]/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[400px] h-full bg-white shadow-2xl flex flex-col slide-left">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#4A1C6B]" />
            <div>
              <h3 className="font-semibold text-[#4A1C6B]">Admin Chat</h3>
              <p className="text-[10px] text-gray-500">Sister Reemah usually replies in minutes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 text-[#4A1C6B] rounded-full hover:bg-gray-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-xs mt-10">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Send a message to inquire about our premium imports.
            </div>
          ) : (
            messages.map((m: any, i: number) => {
              const isAdmin = m.isAdminResponse;
              return (
                <div key={i} className={`flex flex-col ${!isAdmin ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${!isAdmin ? "bg-[#4A1C6B] text-white rounded-br-none" : "bg-white border border-gray-200 text-[#4A1C6B] rounded-bl-none"}`}>
                    {m.text}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-mono">
                    {new Date(m.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2 pb-safe">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) {
                onSendMessage(text);
                setText("");
              }
            }}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#D4A017] bg-gray-50"
          />
          <button
            onClick={() => {
              if (text.trim()) {
                onSendMessage(text);
                setText("");
              }
            }}
            className="bg-[#D4A017] text-white p-3 rounded-full flex items-center justify-center hover:opacity-90 transition"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
