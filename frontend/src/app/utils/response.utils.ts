import {lastValueFrom, Observable} from 'rxjs';

export class ResponseUtils {
  static async didRequestCompleteSuccessfully<T>(request: Observable<T>): Promise<boolean> {
    try {
      await lastValueFrom(request);
      return true;
    } catch (error) {
      return false;
    }
  }
}
