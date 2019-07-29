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

  /**
   * Create new chart when input properties change
   */
  ngOnChanges() {
    this.getColors();
    this.buildChart();
  }

  /**
   * chart.js needs an array of colors, one for each slice
   * so we go through the slices and create a random css hex color 
   * for each slice.
   */
  getColors() {
    this.colors = [];
    (this.labels || []).forEach(label => this.colors.push('#'+Math.floor(Math.random()*16777215).toString(16)));
  }

  /**
   * Uses input properties, and randomly generated colors to 
   * create a pie chart using the chart.js library 
   */
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
