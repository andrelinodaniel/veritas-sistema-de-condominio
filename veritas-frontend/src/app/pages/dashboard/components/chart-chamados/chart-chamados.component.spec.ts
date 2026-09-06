import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartChamadosComponent } from './chart-chamados.component';

describe('ChartChamadosComponent', () => {
  let component: ChartChamadosComponent;
  let fixture: ComponentFixture<ChartChamadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartChamadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartChamadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
