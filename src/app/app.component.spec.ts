import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { AppComponent } from 'src/app/app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  configureTestSuite((() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have a descriptive header', () => {
    const headerDe: DebugElement = fixture.debugElement;
    const headerEl: HTMLElement = headerDe.nativeElement;
    const headerText = headerEl.querySelector('h1');
    expect(headerText.textContent.trim()).toBe('Tensorflow.js Real Time Object Detection');
  });
});
