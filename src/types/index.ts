export interface AIAgent {
  id: string;
  name: string;
  role: 'Intelligence & Research' | 'Outreach & Growth' | 'Product & Engineering' | 'Finance & Operations';
  avatar: string;
  description: string;
  systemPrompt: string;
  status: 'active' | 'analyzing' | 'idle';
  metric: string;
}

export interface AgentTask {
  id: string;
  agentRole: string;
  title: string;
  timeAgo: string;
  status: 'completed' | 'in_progress';
}

export interface OwnerDecision {
  id: string;
  title: string;
  description: string;
  cost?: string;
  metricImpact?: string;
  status: 'pending' | 'approved' | 'rejected';
  proposedBy: string;
}

export interface Company {
  id: string;
  name: string;
  floor: number;
  tagline: string;
  description: string;
  category: 'SaaS' | 'AI Tools' | 'E-commerce' | 'GreenTech' | 'Media' | 'Services' | 'Real Estate';
  founder: string;
  mrr: string;
  color: string;
  lightColor: string;
  agents: AIAgent[];
  tasks: AgentTask[];
  decisions: OwnerDecision[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentName?: string;
  content: string;
  timestamp: string;
}

export interface UserAuth {
  apiKey: string;
  isConnected: boolean;
  username?: string;
  pollenBalance?: number;
}
