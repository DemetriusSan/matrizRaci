export interface Partition {
  id: string;
  label: string;
  value: string;
}

export interface Variable {
  id: string;
  name: string;
  partitions: Partition[];
}

export interface PermutationInput {
  inputVariables: Variable[];
  outputVariables: Variable[];
}

export interface PermutationResult {
  id: string;
  combination: Record<string, string>;
  expectedOutput: Record<string, string>;
  reason: string;
  manualEdits?: Record<string, string>; // Rastreia edições manuais
  isManuallyEdited?: boolean; // Indica se foi editado manualmente
}

export interface PermutationCase {
  inputs: Record<string, string>;
  expectedOutputs: Record<string, string>;
  reason: string;
}

export interface PermutationExport {
  timestamp: string;
  inputVariables: Variable[];
  outputVariables: Variable[];
  totalCombinations: number;
  results: PermutationResult[];
}
