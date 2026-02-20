import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should toggle menu', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.menuOpen).toBe(false);
    app.toggleMenu();
    expect(app.menuOpen).toBe(true);
    app.toggleMenu();
    expect(app.menuOpen).toBe(false);
  });

  it('should close menu', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.menuOpen = true;
    app.closeMenu();
    expect(app.menuOpen).toBe(false);
  });
});
