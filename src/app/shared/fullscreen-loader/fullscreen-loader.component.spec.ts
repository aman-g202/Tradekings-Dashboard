import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenLoaderComponent } from './fullscreen-loader.component';

describe('FullscreenLoaderComponent', () => {
  let component: FullscreenLoaderComponent;
  let fixture: ComponentFixture<FullscreenLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullscreenLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
