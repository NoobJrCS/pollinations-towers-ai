import React, { useState } from 'react';
import { Company, AIAgent } from '../types';
import { X, Sparkles, Building, Check, ArrowRight } from 'lucide-react';

interface RentalModalProps {
  currentFloorCount: number;
  apiKey: string;
  onAddCompany: (newCompany: Company) => void;
  onClose: () => void;
}

export const RentalModal: React.FC<RentalModalProps> = ({
  currentFloorCount,
  apiKey,
  onAddCompany,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Company['category']>('SaaS');
  const [pitch, setPitch] = useState('');
  const [founder, setFounder] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const nextFloor = currentFloorCount + 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pitch.trim() || !founder.trim()) return;

    setIsGenerating(true);

    const colors = ['#0284c7', '#7c3aed', '#ea580c', '#059669', '#e11d48', '#d97706'];
    const chosenColor = colors[nextFloor % colors.length];

    // Default template agents
    let generatedAgents: AIAgent[] = [
      {
        id: `agent-${nextFloor}-1`,
        name: `${name.split(' ')[0]} Researcher`,
        role: 'Intelligence & Research',
        avatar: '🔍',
        description: `Monitors market intelligence, competitor pricing, and industry benchmarks for ${name}.`,
        systemPrompt: `You are the lead intelligence agent for ${name}, an autonomous company in the tower. Pitch: ${pitch}.`,
        status: 'active',
        metric: 'Market Scout Active',
      },
      {
        id: `agent-${nextFloor}-2`,
        name: `${name.split(' ')[0]} Growth`,
        role: 'Outreach & Growth',
        avatar: '📣',
        description: `Automates customer discovery, ad experiments, and B2B partnerships for ${name}.`,
        systemPrompt: `You are the growth and outreach agent for ${name}. You run marketing campaigns.`,
        status: 'active',
        metric: 'Campaigns Ready',
      },
      {
        id: `agent-${nextFloor}-3`,
        name: `${name.split(' ')[0]} Builder`,
        role: 'Product & Engineering',
        avatar: '⚙️',
        description: `Builds and maintains software pipelines and core products for ${name}.`,
        systemPrompt: `You are the product and engineering builder for ${name}.`,
        status: 'active',
        metric: '100% Pipeline Ready',
      },
      {
        id: `agent-${nextFloor}-4`,
        name: `${name.split(' ')[0]} Controller`,
        role: 'Finance & Operations',
        avatar: '📈',
        description: `Audits unit margins, cash flow, and recurring revenue retention for ${name}.`,
        systemPrompt: `You are the financial controller agent for ${name}.`,
        status: 'idle',
        metric: '$0 MRR (Launch Phase)',
      },
    ];

    // If an API key is available, query Pollinations to generate customized agent personas!
    if (apiKey) {
      try {
        const prompt = `Generate 4 concise AI agent personas for a new business named "${name}" in the "${category}" space.
Business pitch: "${pitch}".
Return a JSON array of 4 objects with keys: name, role (must be one of: "Intelligence & Research", "Outreach & Growth", "Product & Engineering", "Finance & Operations"), avatar (single emoji), description (one sentence), metric (short 3-word metric). Return ONLY raw JSON without markdown.`;

        const res = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai',
            temperature: 0.5,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data.choices?.[0]?.message?.content?.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length >= 4) {
            generatedAgents = parsed.slice(0, 4).map((p: any, i: number) => ({
              id: `agent-${nextFloor}-${i}`,
              name: p.name || `Agent ${i + 1}`,
              role: p.role || 'Intelligence & Research',
              avatar: p.avatar || '🤖',
              description: p.description || `Specialized agent for ${name}`,
              systemPrompt: `You are ${p.name}, working at ${name}. Business pitch: ${pitch}.`,
              status: 'active',
              metric: p.metric || 'Ready to deploy',
            }));
          }
        }
      } catch {
        // Fall back to default template agents
      }
    }

    const newCompany: Company = {
      id: `company-${nextFloor}`,
      floor: nextFloor,
      name,
      tagline: pitch,
      description: `${pitch} Founded by ${founder} on Floor ${nextFloor} of Towers AI.`,
      category,
      founder,
      mrr: '$1,200',
      color: chosenColor,
      lightColor: chosenColor,
      agents: generatedAgents,
      tasks: [
        {
          id: `t-${nextFloor}-1`,
          agentRole: 'Intelligence & Research',
          title: `Initialized market positioning map for ${name}`,
          timeAgo: 'Just now',
          status: 'completed',
        },
        {
          id: `t-${nextFloor}-2`,
          agentRole: 'Product & Engineering',
          title: `Deployed floor office runtime on Pollinations Network`,
          timeAgo: 'Just now',
          status: 'completed',
        },
      ],
      decisions: [
        {
          id: `d-${nextFloor}-1`,
          title: 'Launch Initial Customer Acquisition Experiment',
          description: `The growth agent prepared a $100 test campaign across target customer channels for ${name}.`,
          cost: '$100',
          metricImpact: '+50 First Users',
          status: 'pending',
          proposedBy: generatedAgents[1]?.name || 'Growth Agent',
        },
      ],
    };

    setIsGenerating(false);
    onAddCompany(newCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#141620] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>Tower Office Lease</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white">
              Rent Floor {nextFloor} of Towers
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. EcoRoute Logistics, RoastBox, HealthSync"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              >
                <option value="SaaS">SaaS</option>
                <option value="AI Tools">AI Tools</option>
                <option value="GreenTech">GreenTech</option>
                <option value="Media">Media</option>
                <option value="Services">Services</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Founder Name
              </label>
              <input
                type="text"
                required
                value={founder}
                onChange={(e) => setFounder(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              One-Sentence Pitch
            </label>
            <textarea
              required
              rows={3}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="What does your company do and who pays for it? (e.g. AI that automatically drafts responses to hotel reviews and manages disputes)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Towers AI will automatically provision a team of 4 specialized AI agents (Research, Outreach, Engineering, Finance) running on Pollinations to start executing work for your business.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-950/30 border-t-zinc-950 animate-spin" />
                  <span>Provisioning Floor...</span>
                </>
              ) : (
                <>
                  <span>Sign Lease & Build Floor</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
