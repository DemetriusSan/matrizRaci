import { Routes } from '@angular/router';
import { RACIMatrixComponent } from './features/raci/raci-matrix.component';
import { Tutorial } from './features/tutorial/tutorial';
import { Home } from './features/home/home';
import { Microfocus } from './features/microfocus/microfocus';

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
];
