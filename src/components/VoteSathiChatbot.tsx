import React, { useState, useRef, useEffect } from 'react';
import { Language, User as UserType } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { Bot, Send, X, Sparkles, MessageSquare, Globe, RefreshCw, User, ShieldCheck } from 'lucide-react';

interface VoteSathiChatbotProps {
  language: Language;
  currentUser?: UserType | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const VoteSathiChatbot: React.FC<VoteSathiChatbotProps> = ({ language, currentUser }) => {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: language === 'hi'
        ? `नमस्ते ${currentUser ? currentUser.fullName : ''}! मैं वोटसाथी (VoteSathi) हूँ, आपका समर्पित निर्वाचन सहायता सहायक। आपके मतसेतु सत्र में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?`
        : `Namaste ${currentUser ? currentUser.fullName : ''}! I am VoteSathi, your dedicated election & verification AI assistant. Welcome to your authenticated Matsetu session. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language })
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Thank you for asking. Please check the dashboard for live updates.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'To vote: 1. Register with valid EPIC Voter ID. 2. Login with 2FA OTP. 3. Navigate to Voter Dashboard. 4. Select candidate and click Cast Vote.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
          title="Ask VoteSathi AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <span className="font-bold text-xs pr-1 hidden sm:inline">Ask VoteSathi</span>
        </button>
      )}

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[520px] max-h-[85vh] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  {t.chatTitle}
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0.2 rounded font-mono">
                    Gemini AI
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">{t.chatSubtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-slate-50 p-2 border-b border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSendMessage(t.prompt1)}
              className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors"
            >
              {t.prompt1}
            </button>
            <button
              onClick={() => handleSendMessage(t.prompt2)}
              className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors"
            >
              {t.prompt2}
            </button>
            <button
              onClick={() => handleSendMessage(t.prompt3)}
              className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors"
            >
              {t.prompt3}
            </button>
            <button
              onClick={() => handleSendMessage(t.prompt4)}
              className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors"
            >
              {t.prompt4}
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[9px] mt-1 block text-right font-mono ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 bg-slate-800 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>VoteSathi is formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
