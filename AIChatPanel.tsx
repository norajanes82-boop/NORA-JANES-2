
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { Message, DataSummary, DataRow } from '../types';
import { generateAIResponse } from '../services/geminiService';

interface AIChatPanelProps {
  summary: DataSummary | null;
  fullData: DataRow[];
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ summary, fullData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Selamat datang! Saya Analytica. Saya telah membaca kesemua data yang anda berikan. Sila tanya soalan spesifik atau minta saya buat analisis bagi keseluruhan dataset ini.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !summary || isTyping) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseContent = await generateAIResponse(input, summary, messages, fullData);

    const botMsg: Message = {
      role: 'model',
      content: responseContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Analytica AI</h3>
            <p className="text-xs text-slate-500">
              {summary ? `Menganalisis: ${summary.rowCount} baris data` : 'Menunggu fail...'}
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          title="Kosongkan perbualan"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap markdown-content">
                  {msg.content}
                </div>
                <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-slate-400 text-sm italic">
              <Loader2 className="animate-spin" size={16} />
              Analytica sedang menganalisis data penuh...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100">
        {!summary ? (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
            <p className="text-xs text-amber-700">Sila muat naik fail untuk membolehkan AI membaca data penuh.</p>
          </div>
        ) : (
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya Analytica tentang apa-apa dalam data..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatPanel;
