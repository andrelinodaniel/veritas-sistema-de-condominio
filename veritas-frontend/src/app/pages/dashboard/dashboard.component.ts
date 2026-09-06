import { Component, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { ChartChamadosComponent } from './components/chart-chamados/chart-chamados.component';
import { DashboardService, DashboardData } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatRipple,ChartChamadosComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  estatisticas: DashboardData | null = null;

  constructor(private dashboardService: DashboardService){}

  ngOnInit(): void {
    this.dashboardService.getEstatisticas().subscribe({
      next: (dados) => {
        this.estatisticas = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar estatísticas do painel: ', erro);
      }
    });
  }
}
