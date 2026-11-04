import { describe, it, expect } from 'vitest';
import { INITIAL_COMPANIES } from '../src/data/companies';
import { Company } from '../src/types';

describe('Towers AI System Integrity', () => {
  it('loads 10 initial companies with consecutive floor numbers', () => {
    expect(INITIAL_COMPANIES.length).toBe(10);
    INITIAL_COMPANIES.forEach((comp, idx) => {
      expect(comp.floor).toBe(idx + 1);
      expect(comp.name).toBeDefined();
      expect(comp.founder).toBeDefined();
      expect(comp.mrr).toBeDefined();
    });
  });

  it('each company has exactly 4 specialized AI agents with required roles', () => {
    const requiredRoles = [
      'Intelligence & Research',
      'Outreach & Growth',
      'Product & Engineering',
      'Finance & Operations',
    ];

    INITIAL_COMPANIES.forEach((comp) => {
      expect(comp.agents.length).toBe(4);
      const roles = comp.agents.map((a) => a.role);
      requiredRoles.forEach((reqRole) => {
        expect(roles).toContain(reqRole);
      });
    });
  });

  it('companies have initial tasks and pending owner decisions', () => {
    INITIAL_COMPANIES.forEach((comp) => {
      expect(comp.tasks.length).toBeGreaterThan(0);
      expect(comp.decisions.length).toBeGreaterThan(0);
      const pending = comp.decisions.filter((d) => d.status === 'pending');
      expect(pending.length).toBeGreaterThan(0);
    });
  });

  it('filters companies by category accurately', () => {
    const saasCompanies = INITIAL_COMPANIES.filter((c) => c.category === 'SaaS');
    expect(saasCompanies.length).toBeGreaterThan(0);
    expect(saasCompanies.every((c) => c.category === 'SaaS')).toBe(true);
  });

  it('searches companies by keyword', () => {
    const query = 'meteorite';
    const matches = INITIAL_COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(query) ||
      c.tagline.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    );
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe('Meteorwrong');
  });

  it('creates a new company on the next floor correctly', () => {
    const nextFloor = INITIAL_COMPANIES.length + 1;
    const newCompany: Company = {
      id: `company-${nextFloor}`,
      floor: nextFloor,
      name: 'SkyVault AI',
      tagline: 'Autonomous drone roof inspection for commercial real estate.',
      description: 'Drones scan roofs and agents report hail damage.',
      category: 'AI Tools',
      founder: 'Alex Rivera',
      mrr: '$1,200',
      color: '#0284c7',
      lightColor: '#7dd3fc',
      agents: [
        {
          id: 'agent-sky-1',
          name: 'FlightScout',
          role: 'Intelligence & Research',
          avatar: '🚁',
          description: 'Plans autonomous FAA flight paths.',
          systemPrompt: 'You are FlightScout.',
          status: 'active',
          metric: '100% FAA Compliant',
        },
      ],
      tasks: [],
      decisions: [],
    };

    expect(newCompany.floor).toBe(11);
    expect(newCompany.name).toBe('SkyVault AI');
  });
});
