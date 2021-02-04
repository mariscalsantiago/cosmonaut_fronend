import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablapaginadoComponent } from './tablapaginado.component';

describe('TablapaginadoComponent', () => {
  let component: TablapaginadoComponent;
  let fixture: ComponentFixture<TablapaginadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablapaginadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablapaginadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
