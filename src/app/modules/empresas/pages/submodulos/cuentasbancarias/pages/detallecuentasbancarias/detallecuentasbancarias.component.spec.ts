import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallecuentasbancariasComponent } from './detallecuentasbancarias.component';

describe('DetallecuentasbancariasComponent', () => {
  let component: DetallecuentasbancariasComponent;
  let fixture: ComponentFixture<DetallecuentasbancariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallecuentasbancariasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallecuentasbancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
