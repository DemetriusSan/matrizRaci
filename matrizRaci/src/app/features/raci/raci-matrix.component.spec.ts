import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RACIMatrixComponent } from './raci-matrix.component';
import { RACIService } from '../../shared/services/raci.service';
import { RACIRole, RACIMatrix, RACITask } from '../../shared/models/raci.model';
import { BehaviorSubject } from 'rxjs';

describe('RACIMatrixComponent', () => {
  let component: RACIMatrixComponent;
  let fixture: ComponentFixture<RACIMatrixComponent>;
  let mockRACIService: any;
  let mockMatrixSubject: BehaviorSubject<RACIMatrix | null>;

  beforeEach(async () => {
    const mockMatrix: RACIMatrix = {
      id: '1',
      name: 'Test Matrix',
      team: 'Test Team',
      department: 'Test Dept',
      createdDate: new Date(),
      updatedDate: new Date(),
      stakeholders: ['Person 1', 'Person 2'],
      tasks: [
        {
          id: 'task-1',
          name: 'Task 1',
          description: 'Test task',
          assignments: new Map([
            ['Person 1', { id: '1', role: RACIRole.RESPONSIBLE }],
            ['Person 2', { id: '2', role: RACIRole.ACCOUNTABLE }]
          ])
        }
      ]
    };

    mockMatrixSubject = new BehaviorSubject<RACIMatrix | null>(mockMatrix);

    mockRACIService = {
      getCurrentMatrix: () => mockMatrixSubject.asObservable(),
      addTask: vi.fn(),
      removeTask: vi.fn(),
      addStakeholder: vi.fn(),
      removeStakeholder: vi.fn(),
      updateAssignment: vi.fn(),
      validateMatrix: vi.fn().mockReturnValue({ valid: true, errors: [] }),
      exportToJSON: vi.fn().mockReturnValue('{}'),
      exportToExcel: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RACIMatrixComponent, FormsModule, MatIconModule],
      providers: [
        { provide: RACIService, useValue: mockRACIService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RACIMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should subscribe to current matrix on init', () => {
      expect(component.matrix).toBeTruthy();
      expect(component.matrix?.name).toBe('Test Matrix');
    });

    it('should validate matrix on init', () => {
      expect(mockRACIService.validateMatrix).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
      // Create a spy on subscription's unsubscribe
      const subscriptionUnsubscribeSpy = vi.fn();
      
      // Replace the subscription with one we can spy on
      component['subscription'].unsubscribe = subscriptionUnsubscribeSpy;
      
      // Call ngOnDestroy
      component.ngOnDestroy();
      
      // Verify unsubscribe was called
      expect(subscriptionUnsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Task Management', () => {
    it('should open add task form', () => {
      component.openAddTaskForm();
      expect(component.showAddTaskForm).toBe(true);
      expect(component.newTaskName).toBe('');
      expect(component.newTaskDescription).toBe('');
    });

    it('should cancel add task form', () => {
      component.showAddTaskForm = true;
      component.newTaskName = 'Test';
      component.cancelAddTask();
      expect(component.showAddTaskForm).toBe(false);
      expect(component.newTaskName).toBe('');
    });

    it('should add task with valid name', () => {
      component.newTaskName = 'New Task';
      component.newTaskDescription = 'Description';
      component.addTask();
      
      expect(mockRACIService.addTask).toHaveBeenCalled();
      expect(component.showAddTaskForm).toBe(false);
    });

    it('should not add task with empty name', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.newTaskName = '  ';
      component.addTask();
      
      expect(mockRACIService.addTask).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Nome da tarefa é obrigatório');
    });

    it('should remove task with confirmation', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      component.removeTask('task-1');
      
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockRACIService.removeTask).toHaveBeenCalledWith('task-1');
    });

    it('should not remove task without confirmation', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      component.removeTask('task-1');
      
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockRACIService.removeTask).not.toHaveBeenCalled();
    });
  });

  describe('Stakeholder Management', () => {
    it('should open add stakeholder form', () => {
      component.openAddStakeholderForm();
      expect(component.showAddStakeholderForm).toBe(true);
      expect(component.newStakeholder).toBe('');
    });

    it('should cancel add stakeholder form', () => {
      component.showAddStakeholderForm = true;
      component.newStakeholder = 'Test';
      component.cancelAddStakeholder();
      expect(component.showAddStakeholderForm).toBe(false);
      expect(component.newStakeholder).toBe('');
    });

    it('should add stakeholder with valid name', () => {
      component.newStakeholder = 'New Person';
      component.addStakeholder();
      
      expect(mockRACIService.addStakeholder).toHaveBeenCalledWith('New Person');
      expect(component.showAddStakeholderForm).toBe(false);
    });

    it('should not add stakeholder with empty name', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.newStakeholder = '  ';
      component.addStakeholder();
      
      expect(mockRACIService.addStakeholder).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Nome do stakeholder é obrigatório');
    });

    it('should remove stakeholder with confirmation', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      component.removeStakeholder('Person 1');
      
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockRACIService.removeStakeholder).toHaveBeenCalledWith('Person 1');
    });

    it('should not remove stakeholder without confirmation', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      component.removeStakeholder('Person 1');
      
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockRACIService.removeStakeholder).not.toHaveBeenCalled();
    });
  });

  describe('Role Management', () => {
    it('should toggle role for a cell', () => {
      component.toggleRole('task-1', 'Person 1');
      expect(mockRACIService.updateAssignment).toHaveBeenCalled();
    });

    it('should not toggle role if matrix is null', () => {
      component.matrix = null;
      component.toggleRole('task-1', 'Person 1');
      expect(mockRACIService.updateAssignment).not.toHaveBeenCalled();
    });

    it('should not toggle role if task not found', () => {
      component.toggleRole('non-existent', 'Person 1');
      expect(mockRACIService.updateAssignment).not.toHaveBeenCalled();
    });

    it('should cycle through roles correctly', () => {
      // Test role cycling by calling toggleRole multiple times
      // Start with null, should cycle through R -> A -> C -> I -> null
      
      // Initial state: Person 1 has RESPONSIBLE role
      // Toggle should cycle: R -> A
      component.toggleRole('task-1', 'Person 1');
      expect(mockRACIService.updateAssignment).toHaveBeenCalled();
      
      // Get the call arguments
      const calls = mockRACIService.updateAssignment.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      
      // Verify the assignment was updated
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toBe('task-1');
      expect(lastCall[1]).toBe('Person 1');
      expect(lastCall[2].role).toBe(RACIRole.ACCOUNTABLE);
    });
  });

  describe('Cell Styling', () => {
    it('should get correct background color for role', () => {
      expect(component.getCellBackgroundColor(RACIRole.RESPONSIBLE)).toBe('#3498db');
      expect(component.getCellBackgroundColor(RACIRole.ACCOUNTABLE)).toBe('#e74c3c');
      expect(component.getCellBackgroundColor(RACIRole.CONSULTED)).toBe('#f39c12');
      expect(component.getCellBackgroundColor(RACIRole.INFORMED)).toBe('#95a5a6');
      expect(component.getCellBackgroundColor(null)).toBe('#f5f5f5');
    });

    it('should get correct text color for role', () => {
      expect(component.getCellTextColor(RACIRole.RESPONSIBLE)).toBe('#ffffff');
      expect(component.getCellTextColor(RACIRole.ACCOUNTABLE)).toBe('#ffffff');
      expect(component.getCellTextColor(RACIRole.CONSULTED)).toBe('#ffffff');
      expect(component.getCellTextColor(RACIRole.INFORMED)).toBe('#ffffff');
      expect(component.getCellTextColor(null)).toBe('#333333');
    });
  });

  describe('Matrix Validation', () => {
    it('should validate matrix', () => {
      component.validateMatrix();
      expect(mockRACIService.validateMatrix).toHaveBeenCalled();
    });

    it('should store validation errors', () => {
      mockRACIService.validateMatrix.mockReturnValue({
        valid: false,
        errors: ['Error 1', 'Error 2']
      });
      
      component.validateMatrix();
      expect(component.validationErrors).toEqual(['Error 1', 'Error 2']);
    });

    it('should not validate if matrix is null', () => {
      component.matrix = null;
      mockRACIService.validateMatrix.mockClear();
      component.validateMatrix();
      expect(mockRACIService.validateMatrix).not.toHaveBeenCalled();
    });
  });

  describe('Export Functions', () => {
    it('should export to JSON', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
      const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL');

      component.exportToJSON();

      expect(mockRACIService.exportToJSON).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });

    it('should not export to JSON if matrix is null', () => {
      component.matrix = null;
      component.exportToJSON();
      expect(mockRACIService.exportToJSON).not.toHaveBeenCalled();
    });

    it('should export to Excel', () => {
      component.exportToExcel();
      expect(mockRACIService.exportToExcel).toHaveBeenCalled();
    });

    it('should not export to Excel if matrix is null', () => {
      component.matrix = null;
      component.exportToExcel();
      expect(mockRACIService.exportToExcel).not.toHaveBeenCalled();
    });
  });

  describe('Helper Functions', () => {
    it('should get assignment for task and stakeholder', () => {
      const assignment = component.getAssignment('task-1', 'Person 1');
      expect(assignment).toBeTruthy();
      expect(assignment?.role).toBe(RACIRole.RESPONSIBLE);
    });

    it('should return null if task not found', () => {
      const assignment = component.getAssignment('non-existent', 'Person 1');
      expect(assignment).toBeNull();
    });

    it('should return null if matrix is null', () => {
      component.matrix = null;
      const assignment = component.getAssignment('task-1', 'Person 1');
      expect(assignment).toBeNull();
    });

    it('should get selected task', () => {
      component.selectedTaskId = 'task-1';
      const task = component.getSelectedTask();
      expect(task).toBeTruthy();
      expect(task?.name).toBe('Task 1');
    });

    it('should return null if no task selected', () => {
      component.selectedTaskId = null;
      const task = component.getSelectedTask();
      expect(task).toBeNull();
    });

    it('should get role count for stakeholder', () => {
      const count = component.getRoleCount('Person 1', RACIRole.RESPONSIBLE);
      expect(count).toBe(1);
    });

    it('should return 0 for role count if matrix is null', () => {
      component.matrix = null;
      const count = component.getRoleCount('Person 1', RACIRole.RESPONSIBLE);
      expect(count).toBe(0);
    });
  });
});
