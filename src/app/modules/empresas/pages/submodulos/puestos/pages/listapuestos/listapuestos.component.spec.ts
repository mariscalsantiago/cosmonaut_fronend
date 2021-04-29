import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ShareModule } from 'src/app/shared/share.module';
import { ListapuestosComponent } from './listapuestos.component';



describe('ListarepresentantelegalComponent', () => {
  let component: ListapuestosComponent;
  let fixture: ComponentFixture<ListapuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule.withRoutes([]),HttpClientTestingModule,FormsModule,ReactiveFormsModule,ShareModule],
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
