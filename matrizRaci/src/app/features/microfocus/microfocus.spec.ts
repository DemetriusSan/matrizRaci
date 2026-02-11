import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Microfocus } from './microfocus';

describe('Microfocus', () => {
  let component: Microfocus;
  let fixture: ComponentFixture<Microfocus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Microfocus],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Microfocus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
