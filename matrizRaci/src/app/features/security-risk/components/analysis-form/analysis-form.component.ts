import { Component, OnInit, OnDestroy, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  HttpMethod, AuthType, DataSensitivity, SystemImpacted,
  SecurityAnalysis,
} from '../../models/security-risk.models';
import { SecurityRiskService } from '../../services/security-risk.service';

/**
 * Componente de cadastro de nova análise de segurança.
 *
 * Decisão: Reactive Forms para validação robusta e testabilidade.
 * Standalone Component com lazy loading via router.
 */
@Component({
  selector: 'app-analysis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './analysis-form.component.html',
  styleUrls: ['./analysis-form.component.scss'],
})
export class AnalysisFormComponent implements OnInit, OnDestroy {
  /** ID da análise para edição (undefined = criação) */
  analysisId = input<string | undefined>(undefined);

  readonly saved   = output<SecurityAnalysis>();
  readonly canceled = output<void>();

  form!: FormGroup;
  isEditMode = false;
  isSaving = false;

  private destroy$ = new Subject<void>();

  // Opções para selects
  readonly systemOptions  = Object.values(SystemImpacted);
  readonly methodOptions  = Object.values(HttpMethod);
  readonly authOptions    = Object.values(AuthType);
  readonly sensitOptions  = Object.values(DataSensitivity);

  constructor(
    private fb: FormBuilder,
    private service: SecurityRiskService,
  ) {}

  ngOnInit(): void {
    this._buildForm();
    const id = this.analysisId();
    if (id) {
      this.isEditMode = true;
      this.service.getById(id).subscribe(analysis => {
        if (analysis) this._patchForm(analysis);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── FormArray de sistemas impactados (checkboxes) ──────────────────
  get systemsArray(): FormArray {
    return this.form.get('systemsImpacted') as FormArray;
  }

  onSystemToggle(system: SystemImpacted, checked: boolean): void {
    const current: SystemImpacted[] = this.form.get('systemsImpacted')!.value ?? [];
    const updated = checked
      ? [...current, system]
      : current.filter(s => s !== system);
    this.form.get('systemsImpacted')!.setValue(updated);
  }

  isSystemSelected(system: SystemImpacted): boolean {
    const v: SystemImpacted[] = this.form.get('systemsImpacted')?.value ?? [];
    return v.includes(system);
  }

  // ── Submit ──────────────────────────────────────────────────────────
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const val = this.form.getRawValue();
    const payload: Partial<SecurityAnalysis> = {
      userStoryId: val.userStoryId,
      featureName: val.featureName,
      sprint: val.sprint,
      systemsImpacted: val.systemsImpacted,
      apiSurface: {
        endpoint: val.endpoint,
        method: val.method,
        requiresAuth: val.requiresAuth,
        authType: val.authType,
        requiresRoleAuthorization: val.requiresRoleAuthorization,
        movesFinancialValue: val.movesFinancialValue,
        dataSensitivity: val.dataSensitivity,
      },
      mqIntegration: {
        checksMessageIntegrity: val.checksMessageIntegrity,
        checksSchemaOnMainframeEntry: val.checksSchemaOnMainframeEntry,
        hasIdempotencyKey: val.hasIdempotencyKey,
        hasReplayProtection: val.hasReplayProtection,
        hasDeadLetterQueue: val.hasDeadLetterQueue,
      },
      hasSecurityDebt: val.hasSecurityDebt,
      requiresPentest: val.requiresPentest,
      requiresThreatModeling: val.requiresThreatModeling,
      notes: val.notes,
    };

    try {
      if (this.isEditMode && this.analysisId()) {
        this.service.update(this.analysisId()!, payload);
        // Busca a analise atualizada para emitir
        this.service.getById(this.analysisId()!).subscribe(a => {
          if (a) this.saved.emit(a);
        });
      } else {
        const created = this.service.create(payload);
        this.saved.emit(created);
      }
    } finally {
      this.isSaving = false;
    }
  }

  cancel(): void {
    this.canceled.emit();
  }

  // helpers de template
  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.touched && ctrl.hasError(error));
  }

  // ── Construção do formulário ────────────────────────────────────────
  private _buildForm(): void {
    this.form = this.fb.group({
      // Dados da User Story
      userStoryId:     ['', [Validators.required, Validators.pattern(/^US-\d+$/)]],
      featureName:     ['', Validators.required],
      sprint:          ['', Validators.required],
      systemsImpacted: [[] as SystemImpacted[], Validators.required],
      // API Surface
      endpoint:               ['', [Validators.required, Validators.pattern(/^\//)]],
      method:                 [HttpMethod.GET, Validators.required],
      requiresAuth:           [false],
      authType:               [AuthType.NONE],
      requiresRoleAuthorization: [false],
      movesFinancialValue:    [false],
      dataSensitivity:        [DataSensitivity.LOW, Validators.required],
      // MQ Integration
      checksMessageIntegrity:      [false],
      checksSchemaOnMainframeEntry:[false],
      hasIdempotencyKey:           [false],
      hasReplayProtection:         [false],
      hasDeadLetterQueue:          [false],
      // Extras estratégicos
      hasSecurityDebt:       [false],
      requiresPentest:       [false],
      requiresThreatModeling:[false],
      notes:                 [''],
    });
  }

  private _patchForm(a: SecurityAnalysis): void {
    this.form.patchValue({
      userStoryId: a.userStoryId,
      featureName: a.featureName,
      sprint: a.sprint,
      systemsImpacted: a.systemsImpacted,
      endpoint: a.apiSurface.endpoint,
      method: a.apiSurface.method,
      requiresAuth: a.apiSurface.requiresAuth,
      authType: a.apiSurface.authType,
      requiresRoleAuthorization: a.apiSurface.requiresRoleAuthorization,
      movesFinancialValue: a.apiSurface.movesFinancialValue,
      dataSensitivity: a.apiSurface.dataSensitivity,
      checksMessageIntegrity: a.mqIntegration.checksMessageIntegrity,
      checksSchemaOnMainframeEntry: a.mqIntegration.checksSchemaOnMainframeEntry,
      hasIdempotencyKey: a.mqIntegration.hasIdempotencyKey,
      hasReplayProtection: a.mqIntegration.hasReplayProtection,
      hasDeadLetterQueue: a.mqIntegration.hasDeadLetterQueue,
      hasSecurityDebt: a.hasSecurityDebt,
      requiresPentest: a.requiresPentest,
      requiresThreatModeling: a.requiresThreatModeling,
      notes: a.notes,
    });
  }
}
