import React, { useState, useRef, useEffect } from 'react';
import { AIAgent, Company, ChatMessage } from '../types';
import { X, Send, Bot, Sparkles, AlertCircle, Key } from 'lucide-react';

interface AgentChatModalProps {
  agent: AIAgent;
  company: Company;
  apiKey: string;
  onClose: () => void;
  onPromptConnect: () => void;
}

export const AgentChatModal: React.FC<AgentChatModalProps> = ({
  agent,
  company,
  apiKey,
  onClose,
  onPromptConnect,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      agentName: agent.name,
      content: `Hello! I am ${agent.name}, ${agent.role} for ${company.name}. How can I assist you with our operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isLoading) return;

    if (!apiKey) {
      setError('Please connect your Pollen API Key to chat with company agents.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai',
          temperature: 0.6,
          messages: [
            {
              role: 'system',
              content: `${agent.systemPrompt} You work at ${company.name} (Floor ${company.floor}). Keep your answers focused, practical, concise, and stay fully in character as an autonomous company agent.`,
            },
            ...messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Pollinations API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response received.';

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentName: agent.name,
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setError(err.message || 'Failed to communicate with agent.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#14161f] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl shadow-inner">
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-zinc-100">{agent.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {company.name} • Floor {company.floor}
                </span>
              </div>
              <div className="text-xs text-zinc-400 font-mono">{agent.role}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if no key connected */}
        {!apiKey && (
          <div className="p-3 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Connect Pollen key to chat with this agent.</span>
            </div>
            <button
              onClick={onPromptConnect}
              className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs"
            >
              Connect BYOP
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-950/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mb-1 px-1">
                <span>{msg.sender === 'user' ? 'You' : msg.agentName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono p-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{agent.name} is formulating response...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Direct ${agent.name}...`}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 text-center font-mono">
            Powered by Pollinations AI • Paid with your own Pollen
          </div>
        </form>
      </div>
    </div>
  );
};
