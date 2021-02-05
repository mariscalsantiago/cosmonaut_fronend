import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IDSEComponent } from './idse.component';

describe('IDSEComponent', () => {
  let component: IDSEComponent;
  let fixture: ComponentFixture<IDSEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IDSEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IDSEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
