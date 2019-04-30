import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxStateStackComponent } from './ngx-state-stack.component';

describe('NgxStateStackComponent', () => {
  let component: NgxStateStackComponent;
  let fixture: ComponentFixture<NgxStateStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxStateStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxStateStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
