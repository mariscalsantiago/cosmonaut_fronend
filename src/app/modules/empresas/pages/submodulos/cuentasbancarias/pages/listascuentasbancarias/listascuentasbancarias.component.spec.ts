import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListascuentasbancariasComponent } from './listascuentasbancarias.component';

describe('ListascuentasbancariasComponent', () => {
  let component: ListascuentasbancariasComponent;
  let fixture: ComponentFixture<ListascuentasbancariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListascuentasbancariasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListascuentasbancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
