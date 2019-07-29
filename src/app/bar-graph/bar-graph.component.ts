import { Component, Input, OnInit } from '@angular/core';

import { Chart } from 'chart.js';


@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss']
})
export class BarGraphComponent implements OnInit {

  @Input() labels: any[];  
  @Input() values: any[];

  barchart: Chart;
  colors: string[];

  constructor() { }

  ngOnInit() {
    
  }

  /**
   * Create new graph when input properties change
   */
  ngOnChanges() {
    this.getColors();
    this.buildGraph();
  }

  /**
   * chart.js needs an array of colors, one for each bar
   * so we go through the bars and create a random css hex color 
   * for each bar.
   */
  getColors() {
    this.colors = [];
    (this.labels || []).forEach(label => this.colors.push('#'+Math.floor(Math.random()*16777215).toString(16)));
  }

  /**
   * Uses input properties, and randomly generated colors to 
   * create a bargraph using the chart.js library 
   */
  buildGraph() {
    if (this.barchart) this.barchart.destroy();
    this.barchart = new Chart('barCanvas', {  
      type: 'bar',  
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
            display: true  
          }],  
          yAxes: [{  
            display: true  
          }],  
        }  
      }  
    });  
  }

}
