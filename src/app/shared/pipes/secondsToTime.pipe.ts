import { Pipe, PipeTransform } from '@angular/core';
/*
 * Displays a number of seconds in H:M:S Format
 * 
 * Usage:
 *   value | secondsToTime
 * 
*/
@Pipe({name: 'secondsToTime'})
export class SecondsToTimePipe implements PipeTransform {
  transform(value: number): string {
    return new Date(value * 1000).toISOString().substr(11, 8);
    
  }
}