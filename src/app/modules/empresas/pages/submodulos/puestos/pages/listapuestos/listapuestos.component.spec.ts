import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListapuestosComponent } from './listapuestos.component';

describe('ListarepresentantelegalComponent', () => {
  let component: ListapuestosComponent;
  let fixture: ComponentFixture<ListapuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListapuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListapuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
