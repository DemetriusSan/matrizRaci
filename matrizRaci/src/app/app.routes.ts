import { Routes } from '@angular/router';
import { RACIMatrixComponent } from './features/raci/raci-matrix.component';
import { Tutorial } from './features/tutorial/tutorial';
import { Home } from './features/home/home';
import { Microfocus } from './features/microfocus/microfocus';
import { BpmnEditor } from './features/bpmn/bpmn';
import { BpmnLearn } from './features/bpmn/bpmn-learn';
import { AgileMetricsComponent } from './features/agile-metrics/agile-metrics';
import { PermutationTestComponent } from './features/permutation-test/permutation-test';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'microfoco', component: Microfocus },
  { path: 'raci', component: RACIMatrixComponent },
  { path: 'tutorial', component: Tutorial },
  {
    path: 'security-risk',
    loadComponent: () =>
      import('./features/security-risk/security-risk.component').then(
        m => m.SecurityRiskComponent
      ),
    title: 'Security Risk Management',
  },
  { path: 'bpmn', component: BpmnEditor },
  { path: 'bpmn/aprender', component: BpmnLearn },
  { path: 'tutorial', component: Tutorial },
  { path: 'metricas', component: AgileMetricsComponent },
  { path: 'permutacao', component: PermutationTestComponent }
];
