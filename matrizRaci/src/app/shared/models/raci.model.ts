/**
 * Modelo de dados para Matriz RACI
 * RACI = Responsible, Accountable, Consulted, Informed
 */

export enum RACIRole {
  RESPONSIBLE = 'R', // Responsible - Responsável pela execução
  ACCOUNTABLE = 'A',  // Accountable - Autoridade/Responsabilização
  CONSULTED = 'C',    // Consulted - Consultado
  INFORMED = 'I'      // Informed - Informado
}

export interface RACIAssignment {
  id: string;
  role: RACIRole | null;
  notes?: string;
}

export interface RACICell {
  stakeholder: string;
  role: RACIRole | null;
  notes?: string;
}

export interface RACITask {
  id: string;
  name: string;
  description?: string;
  assignments: Map<string, RACIAssignment>;
}

export interface RACIMatrix {
  id: string;
  name: string;
  description?: string;
  team: string;
  department: string;
  createdDate: Date;
  updatedDate: Date;
  stakeholders: string[];
  tasks: RACITask[];
}

export interface RACIDefinition {
  role: RACIRole;
  name: string;
  description: string;
  color: string;
  textColor: string;
}

export const RACI_DEFINITIONS: Record<RACIRole, RACIDefinition> = {
  [RACIRole.RESPONSIBLE]: {
    role: RACIRole.RESPONSIBLE,
    name: 'Responsável',
    description: 'Executa o trabalho. Pode haver múltiplos R\'s',
    color: '#3498db',
    textColor: '#ffffff'
  },
  [RACIRole.ACCOUNTABLE]: {
    role: RACIRole.ACCOUNTABLE,
    name: 'Autoridade',
    description: 'Responsável pelo resultado final. Apenas um A',
    color: '#e74c3c',
    textColor: '#ffffff'
  },
  [RACIRole.CONSULTED]: {
    role: RACIRole.CONSULTED,
    name: 'Consultado',
    description: 'Fornece informações antes da decisão (via consulta)',
    color: '#f39c12',
    textColor: '#ffffff'
  },
  [RACIRole.INFORMED]: {
    role: RACIRole.INFORMED,
    name: 'Informado',
    description: 'Notificado após decisão ou ação',
    color: '#95a5a6',
    textColor: '#ffffff'
  }
};
