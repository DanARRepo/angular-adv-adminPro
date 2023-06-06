import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  @Input() title: string = 'Sin titulo';
  @Input('data') chartData: number[] = [];
  @Input('labels') chartLabels: string[]  = [];
  @Input('backgroundColor') chartBackgroundColors: string[] = [];

  constructor() {
    // Valores por defecto en caso no se setee nada desde otros componentes
    this.chartData = [350, 450, 100];
    this.chartLabels = ['Labels1', 'Labels2', 'Labels3'];
    this.chartBackgroundColors = ['#6857E6', '#009FEE', '#F02059'];
  }
  ngOnInit(): void {
    this.doughnutChartData.datasets[0].data = this.chartData;
    this.doughnutChartData.datasets[0].backgroundColor = this.chartBackgroundColors;
    this.doughnutChartData.labels = this.chartLabels;
  }
    
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.chartLabels,
    datasets: [
      { 
        data: this.chartData,
        backgroundColor: this.chartBackgroundColors
      },
    ]
  };
}
