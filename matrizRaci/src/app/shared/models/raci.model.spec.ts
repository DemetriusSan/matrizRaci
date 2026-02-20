import { 
  RACIRole, 
  RACIAssignment, 
  RACICell, 
  RACITask, 
  RACIMatrix, 
  RACIDefinition,
  RACI_DEFINITIONS 
} from './raci.model';

describe('RACI Model', () => {
  describe('RACIRole Enum', () => {
    it('should have RESPONSIBLE role', () => {
      expect(RACIRole.RESPONSIBLE).toBe('R');
    });

    it('should have ACCOUNTABLE role', () => {
      expect(RACIRole.ACCOUNTABLE).toBe('A');
    });

    it('should have CONSULTED role', () => {
      expect(RACIRole.CONSULTED).toBe('C');
    });

    it('should have INFORMED role', () => {
      expect(RACIRole.INFORMED).toBe('I');
    });

    it('should have exactly 4 roles', () => {
      const roles = Object.values(RACIRole);
      expect(roles.length).toBe(4);
    });
  });

  describe('RACIAssignment Interface', () => {
    it('should create a valid assignment', () => {
      const assignment: RACIAssignment = {
        id: '1',
        role: RACIRole.RESPONSIBLE,
        notes: 'Test notes'
      };

      expect(assignment.id).toBe('1');
      expect(assignment.role).toBe(RACIRole.RESPONSIBLE);
      expect(assignment.notes).toBe('Test notes');
    });

    it('should allow null role', () => {
      const assignment: RACIAssignment = {
        id: '1',
        role: null
      };

      expect(assignment.role).toBeNull();
    });

    it('should allow optional notes', () => {
      const assignment: RACIAssignment = {
        id: '1',
        role: RACIRole.ACCOUNTABLE
      };

      expect(assignment.notes).toBeUndefined();
    });
  });

  describe('RACICell Interface', () => {
    it('should create a valid cell', () => {
      const cell: RACICell = {
        stakeholder: 'John Doe',
        role: RACIRole.CONSULTED,
        notes: 'Consulted for expertise'
      };

      expect(cell.stakeholder).toBe('John Doe');
      expect(cell.role).toBe(RACIRole.CONSULTED);
      expect(cell.notes).toBe('Consulted for expertise');
    });

    it('should allow null role', () => {
      const cell: RACICell = {
        stakeholder: 'Jane Doe',
        role: null
      };

      expect(cell.role).toBeNull();
    });
  });

  describe('RACITask Interface', () => {
    it('should create a valid task', () => {
      const task: RACITask = {
        id: 'task-1',
        name: 'Implement Feature',
        description: 'Implement new feature X',
        assignments: new Map([
          ['Developer', { id: '1', role: RACIRole.RESPONSIBLE }],
          ['Manager', { id: '2', role: RACIRole.ACCOUNTABLE }]
        ])
      };

      expect(task.id).toBe('task-1');
      expect(task.name).toBe('Implement Feature');
      expect(task.description).toBe('Implement new feature X');
      expect(task.assignments.size).toBe(2);
    });

    it('should allow optional description', () => {
      const task: RACITask = {
        id: 'task-1',
        name: 'Simple Task',
        assignments: new Map()
      };

      expect(task.description).toBeUndefined();
    });

    it('should allow empty assignments map', () => {
      const task: RACITask = {
        id: 'task-1',
        name: 'No Assignments',
        assignments: new Map()
      };

      expect(task.assignments.size).toBe(0);
    });
  });

  describe('RACIMatrix Interface', () => {
    it('should create a valid matrix', () => {
      const matrix: RACIMatrix = {
        id: 'matrix-1',
        name: 'Project Matrix',
        description: 'RACI matrix for project',
        team: 'Development Team',
        department: 'Engineering',
        createdDate: new Date('2024-01-01'),
        updatedDate: new Date('2024-01-02'),
        stakeholders: ['Dev 1', 'Manager 1', 'QA 1'],
        tasks: []
      };

      expect(matrix.id).toBe('matrix-1');
      expect(matrix.name).toBe('Project Matrix');
      expect(matrix.team).toBe('Development Team');
      expect(matrix.stakeholders.length).toBe(3);
    });

    it('should allow optional description', () => {
      const matrix: RACIMatrix = {
        id: 'matrix-1',
        name: 'Simple Matrix',
        team: 'Team',
        department: 'Dept',
        createdDate: new Date(),
        updatedDate: new Date(),
        stakeholders: [],
        tasks: []
      };

      expect(matrix.description).toBeUndefined();
    });

    it('should allow empty stakeholders and tasks', () => {
      const matrix: RACIMatrix = {
        id: 'matrix-1',
        name: 'Empty Matrix',
        team: 'Team',
        department: 'Dept',
        createdDate: new Date(),
        updatedDate: new Date(),
        stakeholders: [],
        tasks: []
      };

      expect(matrix.stakeholders.length).toBe(0);
      expect(matrix.tasks.length).toBe(0);
    });
  });

  describe('RACIDefinition Interface', () => {
    it('should create a valid definition', () => {
      const definition: RACIDefinition = {
        role: RACIRole.RESPONSIBLE,
        name: 'Responsible',
        description: 'Does the work',
        color: '#3498db',
        textColor: '#ffffff'
      };

      expect(definition.role).toBe(RACIRole.RESPONSIBLE);
      expect(definition.name).toBe('Responsible');
      expect(definition.color).toBe('#3498db');
    });
  });

  describe('RACI_DEFINITIONS Constant', () => {
    it('should have definitions for all roles', () => {
      expect(RACI_DEFINITIONS[RACIRole.RESPONSIBLE]).toBeDefined();
      expect(RACI_DEFINITIONS[RACIRole.ACCOUNTABLE]).toBeDefined();
      expect(RACI_DEFINITIONS[RACIRole.CONSULTED]).toBeDefined();
      expect(RACI_DEFINITIONS[RACIRole.INFORMED]).toBeDefined();
    });

    it('should have correct RESPONSIBLE definition', () => {
      const def = RACI_DEFINITIONS[RACIRole.RESPONSIBLE];
      expect(def.role).toBe(RACIRole.RESPONSIBLE);
      expect(def.name).toBe('Responsável');
      expect(def.description).toContain('Executa');
      expect(def.color).toBe('#3498db');
      expect(def.textColor).toBe('#ffffff');
    });

    it('should have correct ACCOUNTABLE definition', () => {
      const def = RACI_DEFINITIONS[RACIRole.ACCOUNTABLE];
      expect(def.role).toBe(RACIRole.ACCOUNTABLE);
      expect(def.name).toBe('Autoridade');
      expect(def.description).toContain('resultado final');
      expect(def.color).toBe('#e74c3c');
      expect(def.textColor).toBe('#ffffff');
    });

    it('should have correct CONSULTED definition', () => {
      const def = RACI_DEFINITIONS[RACIRole.CONSULTED];
      expect(def.role).toBe(RACIRole.CONSULTED);
      expect(def.name).toBe('Consultado');
      expect(def.description).toContain('informações');
      expect(def.color).toBe('#f39c12');
      expect(def.textColor).toBe('#ffffff');
    });

    it('should have correct INFORMED definition', () => {
      const def = RACI_DEFINITIONS[RACIRole.INFORMED];
      expect(def.role).toBe(RACIRole.INFORMED);
      expect(def.name).toBe('Informado');
      expect(def.description).toContain('Notificado');
      expect(def.color).toBe('#95a5a6');
      expect(def.textColor).toBe('#ffffff');
    });

    it('should have unique colors for each role', () => {
      const colors = Object.values(RACI_DEFINITIONS).map(def => def.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(4);
    });

    it('should have white text color for all roles', () => {
      Object.values(RACI_DEFINITIONS).forEach(def => {
        expect(def.textColor).toBe('#ffffff');
      });
    });

    it('should have descriptions in Portuguese', () => {
      const descriptions = Object.values(RACI_DEFINITIONS).map(def => def.description);
      descriptions.forEach(desc => {
        expect(desc.length).toBeGreaterThan(0);
      });
    });
  });
});
