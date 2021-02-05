import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirarchivoComponent } from './subirarchivo.component';

describe('SubirarchivoComponent', () => {
  let component: SubirarchivoComponent;
  let fixture: ComponentFixture<SubirarchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubirarchivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirarchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
