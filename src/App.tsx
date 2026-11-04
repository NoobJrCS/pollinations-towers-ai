import React, { useState, useEffect } from 'react';
import { INITIAL_COMPANIES } from './data/companies';
import { Company, AIAgent } from './types';
import { ThreeTower } from './components/ThreeTower';
import { OfficeView } from './components/OfficeView';
import { AgentChatModal } from './components/AgentChatModal';
import { DirectoryView } from './components/DirectoryView';
import { RentalModal } from './components/RentalModal';
import { BYOPModal } from './components/BYOPModal';
import {
  Building2,
  ChevronUp,
  ChevronDown,
  Layers,
  Plus,
  Key,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('towers_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [activeChatAgent, setActiveChatAgent] = useState<{ agent: AIAgent; company: Company } | null>(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isBYOPOpen, setIsBYOPOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('pollinations_api_key') || '';
  });

  // Save companies and API key to localStorage
  useEffect(() => {
    localStorage.setItem('towers_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('pollinations_api_key', apiKey);
  }, [apiKey]);

  const currentCompany = companies.find((c) => c.floor === selectedFloor) || companies[0];

  const handleSelectFloor = (floor: number) => {
    if (floor >= 1 && floor <= companies.length) {
      setSelectedFloor(floor);
    }
  };

  const handleDecisionAction = (decisionId: string, status: 'approved' | 'rejected') => {
    setCompanies((prev) =>
      prev.map((comp) => {
        if (comp.floor !== selectedFloor) return comp;
        return {
          ...comp,
          decisions: comp.decisions.map((d) => (d.id === decisionId ? { ...d, status } : d)),
          tasks:
            status === 'approved'
              ? [
                  {
                    id: `task-approved-${Date.now()}`,
                    agentRole: 'Finance & Operations',
                    title: `Approved: "${comp.decisions.find((d) => d.id === decisionId)?.title}"`,
                    timeAgo: 'Just now',
                    status: 'completed',
                  },
                  ...comp.tasks,
                ]
              : comp.tasks,
        };
      })
    );
  };

  const handleAddCompany = (newCompany: Company) => {
    setCompanies((prev) => [...prev, newCompany]);
    setSelectedFloor(newCompany.floor);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c0e14] text-zinc-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 px-6 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 shadow-md">
            <Building2 className="w-5 h-5 fill-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 font-serif">
                TOWERS <span className="font-sans text-xs text-amber-400 font-semibold">AI</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                {companies.length} Floors
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Every floor is one company, run by one person and their AI agents.
            </p>
          </div>
        </div>

        {/* Elevator Floor Controller */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => handleSelectFloor(selectedFloor - 1)}
            disabled={selectedFloor <= 1}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Go down 1 floor"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="px-3 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <span>FL {selectedFloor}</span>
            <span className="text-zinc-600 font-normal">/</span>
            <span className="text-zinc-400">{companies.length}</span>
          </div>

          <button
            onClick={() => handleSelectFloor(selectedFloor + 1)}
            disabled={selectedFloor >= companies.length}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Go up 1 floor"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Actions & BYOP */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDirectoryOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-zinc-800 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Directory</span>
          </button>

          <button
            onClick={() => setIsRentalModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rent Office</span>
          </button>

          {/* BYOP Connect Status */}
          <button
            onClick={() => setIsBYOPOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
              apiKey
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-400/50 hover:text-amber-300'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'BYOP Active' : 'Connect Pollen'}</span>
          </button>
        </div>
      </header>

      {/* Main Experience Viewport */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left: 3D Skyscraper */}
        <div className="flex-1 h-1/2 md:h-full relative overflow-hidden">
          <ThreeTower
            companies={companies}
            selectedFloor={selectedFloor}
            onSelectFloor={handleSelectFloor}
          />
        </div>

        {/* Right: Office Interior View */}
        <div className="w-full md:w-[460px] lg:w-[500px] h-1/2 md:h-full shrink-0 shadow-2xl z-10">
          <OfficeView
            company={currentCompany}
            onOpenAgentChat={(agent) => setActiveChatAgent({ agent, company: currentCompany })}
            onDecisionAction={handleDecisionAction}
          />
        </div>
      </main>

      {/* Modals */}
      {activeChatAgent && (
        <AgentChatModal
          agent={activeChatAgent.agent}
          company={activeChatAgent.company}
          apiKey={apiKey}
          onClose={() => setActiveChatAgent(null)}
          onPromptConnect={() => setIsBYOPOpen(true)}
        />
      )}

      {isDirectoryOpen && (
        <DirectoryView
          companies={companies}
          onSelectFloor={handleSelectFloor}
          onOpenRentModal={() => {
            setIsDirectoryOpen(false);
            setIsRentalModalOpen(true);
          }}
          onClose={() => setIsDirectoryOpen(false)}
        />
      )}

      {isRentalModalOpen && (
        <RentalModal
          currentFloorCount={companies.length}
          apiKey={apiKey}
          onAddCompany={handleAddCompany}
          onClose={() => setIsRentalModalOpen(false)}
        />
      )}

      {isBYOPOpen && (
        <BYOPModal
          apiKey={apiKey}
          onSaveKey={setApiKey}
          onClose={() => setIsBYOPOpen(false)}
        />
      )}
    </div>
  );
};
