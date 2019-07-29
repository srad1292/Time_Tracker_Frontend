import { Component, Input, OnInit } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() labels: any[];  
  @Input() values: any[];

  piechart: Chart;
  colors: string[];

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.getColors();
    this.buildChart();
  }

  getColors() {
    this.colors = [];
    (this.labels || []).forEach(label => this.colors.push('#'+Math.floor(Math.random()*16777215).toString(16)));
  }

  buildChart() {
    if (this.piechart) this.piechart.destroy();
    this.piechart = new Chart('pieCanvas', {  
      type: 'pie',  
      data: {  
        labels: this.labels,
        datasets: [  
          {  
            data: this.values,  
            borderColor: '#3cba9f',  
            backgroundColor: this.colors,
            fill: true  
          }  
        ]  
      },  
      options: {  
        legend: {  
          display: false  
        },
        scales: {  
          xAxes: [{  
            display: false  
          }],  
          yAxes: [{  
            display: false  
          }],  
        }  
      }  
    });  
  }

}
