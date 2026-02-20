export type MetricCategory = 'produtividade' | 'qualidade' | 'satisfacao' | 'processo';

export interface MetricDefinition {
  key: string;
  label: string;
  category: MetricCategory;
  unit: string;
  higherIsBetter: boolean;
}

export interface MetricEntry {
  id: string;
  category: MetricCategory;
  date: string;
  values: Record<string, number>;
  notes?: string;
}

export interface BaselineGoal {
  baseline: number;
  goal: number;
}

export interface AgileMetricsSettings {
  squadName: string;
  pilotStart: string;
  wave1: string;
  wave2: string;
  wave3: string;
  logoDataUrl?: string;
  radarBaseline: Record<string, number>;
  radarCurrent: Record<string, number>;
  roi: {
    dysfunctionCosts: number;
    projectedGains: number;
    investment: number;
  };
}

export const RADAR_DIMENSIONS = [
  'Transparência',
  'Inspeção',
  'Adaptação',
  'Colaboração',
  'Autonomia',
];

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'velocity',
    label: 'Velocity (story points por sprint)',
    category: 'produtividade',
    unit: 'pts',
    higherIsBetter: true,
  },
  {
    key: 'leadTime',
    label: 'Lead Time (dias)',
    category: 'produtividade',
    unit: 'dias',
    higherIsBetter: false,
  },
  {
    key: 'throughput',
    label: 'Throughput (cards por sprint)',
    category: 'produtividade',
    unit: 'cards',
    higherIsBetter: true,
  },
  {
    key: 'bugsProd',
    label: 'Bugs em produção (quantidade/mês)',
    category: 'qualidade',
    unit: 'qtde',
    higherIsBetter: false,
  },
  {
    key: 'hotfixes',
    label: 'Hotfixes (quantidade/mês)',
    category: 'qualidade',
    unit: 'qtde',
    higherIsBetter: false,
  },
  {
    key: 'codeReviewCoverage',
    label: 'Code Review Coverage (%)',
    category: 'qualidade',
    unit: '%',
    higherIsBetter: true,
  },
  {
    key: 'enps',
    label: 'eNPS do time',
    category: 'satisfacao',
    unit: 'pts',
    higherIsBetter: true,
  },
  {
    key: 'happiness',
    label: 'Happiness Index (1-10)',
    category: 'satisfacao',
    unit: 'pts',
    higherIsBetter: true,
  },
  {
    key: 'stakeholder',
    label: 'Stakeholder Satisfaction (1-5)',
    category: 'satisfacao',
    unit: 'pts',
    higherIsBetter: true,
  },
  {
    key: 'ceremonies',
    label: 'Cerimônias realizadas (%)',
    category: 'processo',
    unit: '%',
    higherIsBetter: true,
  },
  {
    key: 'retroItems',
    label: 'Action items retro concluídos (%)',
    category: 'processo',
    unit: '%',
    higherIsBetter: true,
  },
  {
    key: 'participation',
    label: 'Participação em cerimônias (%)',
    category: 'processo',
    unit: '%',
    higherIsBetter: true,
  },
];
