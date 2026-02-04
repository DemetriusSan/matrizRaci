import { Routes } from '@angular/router';
import { RACIMatrixComponent } from './features/raci/raci-matrix.component';
import { Tutorial } from './features/tutorial/tutorial';

export const routes: Routes = [
  { path: '', component: RACIMatrixComponent },
  { path: 'tutorial', component: Tutorial }
];
