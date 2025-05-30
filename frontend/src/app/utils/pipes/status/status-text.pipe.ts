import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusText'
})
export class StatusTextPipe implements PipeTransform {

  transform(targetDate: Date, isCompleted: boolean): string {
    if (isCompleted) {
      return 'Completed';
    }

    const parsedTargetDate = new Date(targetDate);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24);

    if (parsedTargetDate < now) {
      return 'Late';
    } else if (parsedTargetDate >= now && parsedTargetDate <= tomorrow) {
      return 'Due';
    } else {
      return 'Pending';
    }
  }

}
