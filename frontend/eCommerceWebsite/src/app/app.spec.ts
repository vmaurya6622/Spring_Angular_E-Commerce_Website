import { TestBed, waitForAsync } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', waitForAsync(() => {
    const fixture = TestBed.createComponent(App);
    fixture.whenStable().then(() => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Hello, eCommerceWebsite');
    });
  }));
});
