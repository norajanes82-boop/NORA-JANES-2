
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { Message, DataSummary, DataRow } from './types';
import { generateAIResponse } from './geminiService';

interface AIChatPanelProps {
  summary: DataSummary | null;
  fullData: DataRow[];
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ summary, fullData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Selamat datang! Saya Analytica. Saya telah memproses kesemua baris data anda. Anda boleh bertanya apa sahaja tentang statistik atau perbandingan daerah.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !summary || isTyping) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseContent = await generateAIResponse(input, summary, messages, fullData);
    const botMsg: Message = { role: 'model', content: responseContent, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white"><Bot size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-800">Analytica AI</h3>
            <p className="text-xs text-slate-500">{summary ? `Data Penuh: ${summary.rowCount} Baris` : 'Menunggu data...'}</p>
          </div>
        </div>
        <button onClick={() => setMessages([messages[0]])} className="p-2 text-slate-400 hover:text-indigo-600"><RefreshCw size={18} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>{msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}</div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && <div className="flex gap-2 items-center text-slate-400 text-sm italic"><Loader2 className="animate-spin" size={14} /> Menganalisis data...</div>}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="relative">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Tanya soalan data penuh..." className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm outline-none" />
          <button onClick={handleSend} disabled={isTyping || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center disabled:bg-slate-300"><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
