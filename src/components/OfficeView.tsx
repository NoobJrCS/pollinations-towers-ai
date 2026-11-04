import React, { useState } from 'react';
import { Company, AIAgent, OwnerDecision } from '../types';
import { MessageSquare, Check, X, ArrowUpRight, TrendingUp, Sparkles, Building2 } from 'lucide-react';

interface OfficeViewProps {
  company: Company;
  onOpenAgentChat: (agent: AIAgent) => void;
  onDecisionAction: (decisionId: string, status: 'approved' | 'rejected') => void;
}

export const OfficeView: React.FC<OfficeViewProps> = ({
  company,
  onOpenAgentChat,
  onDecisionAction,
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'activity' | 'decisions'>('agents');

  const pendingDecisionsCount = company.decisions.filter((d) => d.status === 'pending').length;

  return (
    <div className="flex flex-col h-full bg-[#12141c]/95 border-l border-zinc-800 text-zinc-100 overflow-y-auto">
      {/* Office Header */}
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span
              className="text-xs font-mono font-bold px-2.5 py-1 rounded-md text-zinc-950 shadow-sm"
              style={{ backgroundColor: company.color }}
            >
              Floor {company.floor}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
              {company.category}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-lg text-emerald-400 text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>MRR {company.mrr}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-serif tracking-tight text-white mb-1.5 flex items-center gap-2">
          {company.name}
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          {company.tagline}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs text-zinc-400">
          <div>
            <span className="text-zinc-500">Owner: </span>
            <span className="text-zinc-200 font-medium">{company.founder}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 AI Agents Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/20 px-6">
        <button
          onClick={() => setActiveTab('agents')}
          className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 mr-6 transition-colors ${
            activeTab === 'agents'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          AI Team ({company.agents.length})
        </button>
        <button
          onClick={() => setActiveTab('decisions')}
          className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 mr-6 transition-colors flex items-center gap-1.5 ${
            activeTab === 'decisions'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Waiting for You</span>
          {pendingDecisionsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold flex items-center justify-center">
              {pendingDecisionsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Daily Work Feed
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 space-y-6">
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-400 leading-relaxed">
              These autonomous agents run this company 24/7 on Pollinations. Step up to any desk to chat and direct their work.
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {company.agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl shadow-inner">
                        {agent.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors">
                            {agent.name}
                          </h4>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">
                          {agent.role}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenAgentChat(agent)}
                      className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400 hover:text-zinc-950 text-amber-400 text-xs font-semibold transition-all flex items-center gap-1.5 border border-amber-400/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>

                  <p className="mt-2.5 text-xs text-zinc-400 leading-normal">
                    {agent.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Performance Metric</span>
                    <span className="text-zinc-300 font-semibold">{agent.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-400 leading-relaxed">
              Decisions that require human founder judgment. The agents researched the options, modeled the impact, and now wait for your approval.
            </div>

            {company.decisions.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs rounded-xl border border-dashed border-zinc-800">
                All pending jobs approved. Agents are currently executing today's roadmap.
              </div>
            ) : (
              company.decisions.map((decision) => (
                <div
                  key={decision.id}
                  className={`p-4 rounded-xl border transition-all ${
                    decision.status === 'pending'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : decision.status === 'approved'
                      ? 'bg-emerald-950/10 border-emerald-500/20 opacity-70'
                      : 'bg-red-950/10 border-red-500/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className="text-zinc-400">Proposed by {decision.proposedBy}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        decision.status === 'pending'
                          ? 'bg-amber-400/20 text-amber-300'
                          : decision.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {decision.status}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-zinc-100 mb-1.5">
                    {decision.title}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {decision.description}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/60 text-xs">
                    <div className="space-x-3 text-zinc-400 font-mono text-[11px]">
                      {decision.cost && <span>Cost: <b className="text-zinc-200">{decision.cost}</b></span>}
                      {decision.metricImpact && <span>Impact: <b className="text-emerald-400">{decision.metricImpact}</b></span>}
                    </div>

                    {decision.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDecisionAction(decision.id, 'rejected')}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onDecisionAction(decision.id, 'approved')}
                          className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400 leading-relaxed mb-2">
              Autonomous jobs completed by the agent workforce over the past 24 hours:
            </div>

            <div className="space-y-2.5">
              {company.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3 text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="text-zinc-200 font-medium leading-relaxed">
                      {task.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                      <span>{task.agentRole}</span>
                      <span>•</span>
                      <span>{task.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 text-center">
        <a
          href="https://pollinations.ai/?ref=badge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
        >
          <span>All company agents powered by</span>
          <b className="text-zinc-400">pollinations.ai</b>
        </a>
      </div>
    </div>
  );
};
