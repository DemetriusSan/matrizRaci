import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { RACIService } from './raci.service';
import { RACIRole, RACIMatrix, RACITask, RACIAssignment } from '../models/raci.model';

describe('RACIService', () => {
  let service: RACIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RACIService]
    });
    service = TestBed.inject(RACIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should load sample data on initialization', async () => {
      const matrices = await firstValueFrom(service.getMatrices());
      expect(matrices).toBeTruthy();
      expect(matrices.length).toBeGreaterThan(0);
    });

    it('should set current matrix on initialization', async () => {
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      expect(matrix).toBeTruthy();
      expect(matrix?.name).toContain('Matriz RACI');
    });
  });

  describe('Matrix Management', () => {
    it('should create a new matrix', () => {
      const newMatrix = service.createMatrix('Test Matrix', 'Test Team', 'Test Department');
      
      expect(newMatrix).toBeTruthy();
      expect(newMatrix.name).toBe('Test Matrix');
      expect(newMatrix.team).toBe('Test Team');
      expect(newMatrix.department).toBe('Test Department');
      expect(newMatrix.stakeholders).toEqual([]);
      expect(newMatrix.tasks).toEqual([]);
    });

    it('should add new matrix to matrices list', async () => {
      // Get initial matrices count
      const initialMatrices = await firstValueFrom(service.getMatrices());
      const initialCount = initialMatrices.length;
      
      // Create a new matrix
      service.createMatrix('New Matrix', 'Team', 'Dept');
      
      // Verify the count increased
      const matrices = await firstValueFrom(service.getMatrices());
      expect(matrices.length).toBe(initialCount + 1);
    });

    it('should set created matrix as current', async () => {
      const newMatrix = service.createMatrix('Current Test', 'Team', 'Dept');
      
      const current = await firstValueFrom(service.getCurrentMatrix());
      expect(current?.id).toBe(newMatrix.id);
    });

    it('should set current matrix by id', async () => {
      const matrices = await firstValueFrom(service.getMatrices());
      if (matrices.length > 0) {
        const matrixId = matrices[0].id;
        service.setCurrentMatrix(matrixId);
        
        const current = await firstValueFrom(service.getCurrentMatrix());
        expect(current?.id).toBe(matrixId);
      }
    });

    it('should not change current matrix if id not found', async () => {
      const currentBefore = await firstValueFrom(service.getCurrentMatrix());
      service.setCurrentMatrix('non-existent-id');
      const currentAfter = await firstValueFrom(service.getCurrentMatrix());
      
      expect(currentAfter).toEqual(currentBefore);
    });
  });

  describe('Stakeholder Management', () => {
    beforeEach(() => {
      service.createMatrix('Test Matrix', 'Team', 'Dept');
    });

    it('should add stakeholder to current matrix', async () => {
      service.addStakeholder('John Doe');
      
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      expect(matrix?.stakeholders).toContain('John Doe');
    });

    it('should not add duplicate stakeholder', async () => {
      service.addStakeholder('Jane Doe');
      service.addStakeholder('Jane Doe');
      
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      const count = matrix?.stakeholders.filter(s => s === 'Jane Doe').length;
      expect(count).toBe(1);
    });

    it('should remove stakeholder from current matrix', async () => {
      service.addStakeholder('Remove Me');
      service.removeStakeholder('Remove Me');
      
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      expect(matrix?.stakeholders).not.toContain('Remove Me');
    });

    it('should update matrix updatedDate when adding stakeholder', async () => {
      // Get the initial state
      const initialMatrix = await firstValueFrom(service.getCurrentMatrix());
      const oldDate = initialMatrix?.updatedDate?.getTime();
      
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Add stakeholder
      service.addStakeholder('New Person');
      
      // Get updated state
      const updatedMatrix = await firstValueFrom(service.getCurrentMatrix());
      const newDate = updatedMatrix?.updatedDate?.getTime();
      
      // Verify the date changed
      expect(newDate).toBeDefined();
      expect(oldDate).toBeDefined();
      if (newDate && oldDate) {
        expect(newDate).toBeGreaterThan(oldDate);
      }
    });
  });

  describe('Task Management', () => {
    let testTask: RACITask;

    beforeEach(() => {
      service.createMatrix('Test Matrix', 'Team', 'Dept');
      testTask = {
        id: 'task-1',
        name: 'Test Task',
        description: 'Test Description',
        assignments: new Map()
      };
    });

    it('should add task to current matrix', async () => {
      service.addTask(testTask);
      
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      expect(matrix?.tasks.length).toBeGreaterThan(0);
      expect(matrix?.tasks.some(t => t.id === testTask.id)).toBe(true);
    });

    it('should update task in current matrix', async () => {
      service.addTask(testTask);
      
      const updatedTask = { ...testTask, name: 'Updated Task' };
      service.updateTask(testTask.id, updatedTask);
      
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      const found = matrix?.tasks.find(t => t.id === testTask.id);
      expect(found?.name).toBe('Updated Task');
    });

    it('should not update if task id not found', async () => {
      service.addTask(testTask);
      
      // Get task count before attempting update
      const matrixBefore = await firstValueFrom(service.getCurrentMatrix());
      const taskCountBefore = matrixBefore?.tasks.length;
      
      // Try to update non-existent task
      service.updateTask('non-existent', testTask);
      
      // Verify task count hasn't changed
      const matrixAfter = await firstValueFrom(service.getCurrentMatrix());
      expect(matrixAfter?.tasks.length).toBe(taskCountBefore);
    });

    it('should remove task from current matrix', async () => {
      service.addTask(testTask);
      service.removeTask(testTask.id);
      
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      expect(matrix?.tasks.some(t => t.id === testTask.id)).toBe(false);
    });

    it('should update matrix updatedDate when modifying tasks', async () => {
      // Get initial state
      const initialMatrix = await firstValueFrom(service.getCurrentMatrix());
      const oldDate = initialMatrix?.updatedDate?.getTime();
      
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Add task
      service.addTask(testTask);
      
      // Get updated state
      const updatedMatrix = await firstValueFrom(service.getCurrentMatrix());
      const newDate = updatedMatrix?.updatedDate?.getTime();
      
      // Verify the date changed
      expect(newDate).toBeDefined();
      expect(oldDate).toBeDefined();
      if (newDate && oldDate) {
        expect(newDate).toBeGreaterThan(oldDate);
      }
    });
  });

  describe('Assignment Management', () => {
    let testTask: RACITask;
    let testAssignment: RACIAssignment;

    beforeEach(() => {
      service.createMatrix('Test Matrix', 'Team', 'Dept');
      service.addStakeholder('Test Stakeholder');
      
      testTask = {
        id: 'task-1',
        name: 'Test Task',
        assignments: new Map()
      };
      
      testAssignment = {
        id: 'assign-1',
        role: RACIRole.RESPONSIBLE,
        notes: 'Test notes'
      };
      
      service.addTask(testTask);
    });

    it('should update assignment for stakeholder', async () => {
      service.updateAssignment(testTask.id, 'Test Stakeholder', testAssignment);
      
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      const task = matrix?.tasks.find(t => t.id === testTask.id);
      const assignment = task?.assignments.get('Test Stakeholder');
      expect(assignment?.role).toBe(RACIRole.RESPONSIBLE);
    });

    it('should not update assignment if task not found', async () => {
      // Get current state
      const matrixBefore = await firstValueFrom(service.getCurrentMatrix());
      
      // Try to update non-existent task
      service.updateAssignment('non-existent', 'Test Stakeholder', testAssignment);
      
      // Verify matrix hasn't changed
      const matrixAfter = await firstValueFrom(service.getCurrentMatrix());
      expect(matrixAfter).toEqual(matrixBefore);
    });
  });

  describe('RACI Definitions', () => {
    it('should return correct definition for RESPONSIBLE role', () => {
      const def = service.getRACIDefinition(RACIRole.RESPONSIBLE);
      expect(def).toBeTruthy();
      expect(def?.role).toBe(RACIRole.RESPONSIBLE);
      expect(def?.name).toBe('Responsável');
    });

    it('should return correct definition for ACCOUNTABLE role', () => {
      const def = service.getRACIDefinition(RACIRole.ACCOUNTABLE);
      expect(def).toBeTruthy();
      expect(def?.role).toBe(RACIRole.ACCOUNTABLE);
      expect(def?.name).toBe('Autoridade');
    });

    it('should return correct definition for CONSULTED role', () => {
      const def = service.getRACIDefinition(RACIRole.CONSULTED);
      expect(def).toBeTruthy();
      expect(def?.role).toBe(RACIRole.CONSULTED);
      expect(def?.name).toBe('Consultado');
    });

    it('should return correct definition for INFORMED role', () => {
      const def = service.getRACIDefinition(RACIRole.INFORMED);
      expect(def).toBeTruthy();
      expect(def?.role).toBe(RACIRole.INFORMED);
      expect(def?.name).toBe('Informado');
    });

    it('should return null for null role', () => {
      const def = service.getRACIDefinition(null);
      expect(def).toBeNull();
    });
  });

  describe('Matrix Validation', () => {
    let testMatrix: RACIMatrix;

    beforeEach(() => {
      testMatrix = {
        id: '1',
        name: 'Test',
        team: 'Team',
        department: 'Dept',
        createdDate: new Date(),
        updatedDate: new Date(),
        stakeholders: ['Person 1', 'Person 2'],
        tasks: []
      };
    });

    it('should validate matrix with no stakeholders', () => {
      testMatrix.stakeholders = [];
      const result = service.validateMatrix(testMatrix);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('stakeholder'))).toBe(true);
    });

    it('should validate matrix with no tasks', () => {
      const result = service.validateMatrix(testMatrix);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('tarefa'))).toBe(true);
    });

    it('should validate task without accountable role', () => {
      testMatrix.tasks = [{
        id: '1',
        name: 'Task 1',
        assignments: new Map([
          ['Person 1', { id: '1', role: RACIRole.RESPONSIBLE }]
        ])
      }];
      
      const result = service.validateMatrix(testMatrix);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('autoridade'))).toBe(true);
    });

    it('should validate task without responsible role', () => {
      testMatrix.tasks = [{
        id: '1',
        name: 'Task 1',
        assignments: new Map([
          ['Person 1', { id: '1', role: RACIRole.ACCOUNTABLE }]
        ])
      }];
      
      const result = service.validateMatrix(testMatrix);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('responsável') && e.includes('execução'))).toBe(true);
    });

    it('should validate task with multiple accountable roles', () => {
      testMatrix.tasks = [{
        id: '1',
        name: 'Task 1',
        assignments: new Map([
          ['Person 1', { id: '1', role: RACIRole.ACCOUNTABLE }],
          ['Person 2', { id: '2', role: RACIRole.ACCOUNTABLE }]
        ])
      }];
      
      const result = service.validateMatrix(testMatrix);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('mais de um'))).toBe(true);
    });

    it('should validate correct matrix', () => {
      testMatrix.tasks = [{
        id: '1',
        name: 'Task 1',
        assignments: new Map([
          ['Person 1', { id: '1', role: RACIRole.RESPONSIBLE }],
          ['Person 2', { id: '2', role: RACIRole.ACCOUNTABLE }]
        ])
      }];
      
      const result = service.validateMatrix(testMatrix);
      
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('Export to JSON', () => {
    it('should export matrix to JSON string', async () => {
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      if (matrix) {
        const json = service.exportToJSON(matrix);
        
        expect(json).toBeTruthy();
        expect(typeof json).toBe('string');
        
        const parsed = JSON.parse(json);
        expect(parsed.name).toBe(matrix.name);
        expect(parsed.team).toBe(matrix.team);
      }
    });

    it('should convert Map assignments to array in JSON', async () => {
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      if (matrix) {
        const json = service.exportToJSON(matrix);
        const parsed = JSON.parse(json);
        
        expect(Array.isArray(parsed.tasks[0].assignments)).toBe(true);
      }
    });
  });

  describe('Export to Excel', () => {
    it('should export matrix to Excel without errors', async () => {
      const matrix = await firstValueFrom(service.getCurrentMatrix());
      if (matrix) {
        // Just test that it doesn't throw an error
        expect(() => {
          // Mock XLSX.writeFile to prevent actual file creation
          const originalWriteFile = (globalThis as any).XLSX?.writeFile;
          if ((globalThis as any).XLSX) {
            (globalThis as any).XLSX.writeFile = () => {};
          }
          
          service.exportToExcel(matrix);
          
          if (originalWriteFile && (globalThis as any).XLSX) {
            (globalThis as any).XLSX.writeFile = originalWriteFile;
          }
        }).not.toThrow();
      }
    });
  });
});
